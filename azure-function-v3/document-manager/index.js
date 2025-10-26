const { uploadDocument, listDocuments, deleteDocument } = require('../shared/blob-manager');

module.exports = async function (context, req) {
    // CORS Headers
    context.res = {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        }
    };

    if (req.method === 'OPTIONS') {
        context.res.status = 200;
        return;
    }

    try {
        const password = req.query.password || req.headers['x-admin-password'];

        // Admin-Check für alle Aktionen außer list
        const action = req.query.action;
        if (action !== 'list' && password !== process.env.ADMIN_PASSWORD) {
            context.res.status = 401;
            context.res.body = { error: 'Unauthorized' };
            return;
        }

        if (req.method === 'POST' && action === 'upload') {
            // Expect JSON body with base64 encoded file
            const { fileName, fileContent, contentType } = req.body || {};
            
            if (!fileName || !fileContent) {
                context.res.status = 400;
                context.res.body = { error: 'fileName and fileContent required' };
                return;
            }

            // Decode base64 to buffer
            const fileBuffer = Buffer.from(fileContent, 'base64');
            const result = await uploadDocument(fileName, fileBuffer, contentType || 'application/octet-stream');
            context.res.status = result.success ? 200 : 500;
            context.res.body = result;

        } else if (req.method === 'GET' && action === 'list') {
            const documents = await listDocuments();
            context.res.status = 200;
            context.res.body = documents;

        } else if (req.method === 'DELETE' && action === 'delete') {
            const fileName = req.query.fileName;
            if (!fileName) {
                context.res.status = 400;
                context.res.body = { error: 'Missing fileName parameter' };
                return;
            }

            const result = await deleteDocument(fileName);
            context.res.status = result.success ? 200 : 500;
            context.res.body = result;

        } else {
            context.res.status = 400;
            context.res.body = { error: 'Invalid action or method' };
        }
    } catch (error) {
        context.log.error('Error in document-manager function:', error);
        context.res.status = 500;
        context.res.body = { error: 'Internal server error', details: error.message };
    }
};

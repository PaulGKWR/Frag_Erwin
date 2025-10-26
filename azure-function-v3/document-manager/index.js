const { uploadDocument, listDocuments, deleteDocument } = require('../shared/blob-manager');
const multipart = require('parse-multipart');

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

        // Admin-Check
        if (password !== process.env.ADMIN_PASSWORD) {
            context.res.status = 401;
            context.res.body = { error: 'Unauthorized' };
            return;
        }

        const action = req.query.action;

        if (req.method === 'POST' && action === 'upload') {
            // Parse multipart form data
            const contentType = req.headers['content-type'];
            if (!contentType || !contentType.includes('multipart/form-data')) {
                context.res.status = 400;
                context.res.body = { error: 'Content-Type must be multipart/form-data' };
                return;
            }

            const boundary = multipart.getBoundary(contentType);
            const parts = multipart.Parse(req.body, boundary);

            if (!parts || parts.length === 0) {
                context.res.status = 400;
                context.res.body = { error: 'No file uploaded' };
                return;
            }

            const file = parts[0];
            const fileName = file.filename;
            const fileBuffer = file.data;
            const fileContentType = file.type || 'application/octet-stream';

            const result = await uploadDocument(fileName, fileBuffer, fileContentType);
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

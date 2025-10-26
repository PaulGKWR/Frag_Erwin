const { trackQuestion, getStatistics, getAnalytics } = require('../shared/question-tracker');

module.exports = async function (context, req) {
    // CORS Headers - set immediately
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    };

    context.res = { headers: corsHeaders };

    if (req.method === 'OPTIONS') {
        context.res.status = 200;
        context.res.body = '';
        return;
    }

    try {
        const action = req.query.action || req.body?.action;
        const password = req.query.password || req.body?.password;

        // Admin-Check
        if (password !== process.env.ADMIN_PASSWORD) {
            context.res.status = 401;
            context.res.body = { error: 'Unauthorized' };
            return;
        }

        if (action === 'statistics') {
            const stats = await getStatistics();
            context.res.status = 200;
            context.res.body = stats;
        } else if (action === 'analytics') {
            const days = parseInt(req.query.days) || 30;
            const analytics = await getAnalytics(days);
            context.res.status = 200;
            context.res.body = analytics;
        } else {
            context.res.status = 400;
            context.res.body = { error: 'Invalid action' };
        }
    } catch (error) {
        context.log.error('Error in statistics function:', error);
        context.res.status = 500;
        context.res.body = { error: 'Internal server error' };
    }
};

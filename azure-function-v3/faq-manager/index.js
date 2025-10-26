const { upsertFAQ, getAllFAQs, getFAQsPaginated, deleteFAQ, incrementViewCount, getCategories } = require('../shared/faq-manager');

module.exports = async function (context, req) {
    // CORS Headers - set immediately
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
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

        // Public endpoints (no password needed)
        if (action === 'list' || action === 'listPaginated' || action === 'categories') {
            if (action === 'list') {
                const faqs = await getAllFAQs(true);
                context.res.status = 200;
                context.res.body = { faqs: faqs };
            } else if (action === 'listPaginated') {
                const page = parseInt(req.query.page) || 1;
                const pageSize = parseInt(req.query.pageSize) || 6;
                const category = req.query.category;
                const sortBy = req.query.sortBy || 'viewCount';
                
                const result = await getFAQsPaginated(page, pageSize, category, sortBy);
                context.res.status = 200;
                context.res.body = result;
            } else if (action === 'categories') {
                const categories = await getCategories();
                context.res.status = 200;
                context.res.body = { categories: categories };
            }
            return;
        }

        // Protected endpoints (need password)
        if (password !== process.env.ADMIN_PASSWORD) {
            context.res.status = 401;
            context.res.body = { error: 'Unauthorized' };
            return;
        }

        if (action === 'create' || action === 'update') {
            const faqData = req.body.faq;
            if (!faqData || !faqData.question || !faqData.answer) {
                context.res.status = 400;
                context.res.body = { error: 'Missing required fields' };
                return;
            }
            const result = await upsertFAQ(faqData);
            context.res.status = 200;
            context.res.body = result;
        } else if (action === 'delete') {
            const id = req.query.id || req.body?.id;
            if (!id) {
                context.res.status = 400;
                context.res.body = { error: 'Missing FAQ ID' };
                return;
            }
            const result = await deleteFAQ(id);
            context.res.status = 200;
            context.res.body = result;
        } else if (action === 'listAll') {
            const faqs = await getAllFAQs(false);
            context.res.status = 200;
            context.res.body = { faqs: faqs };
        } else if (action === 'incrementView') {
            const id = req.query.id || req.body?.id;
            if (!id) {
                context.res.status = 400;
                context.res.body = { error: 'Missing FAQ ID' };
                return;
            }
            const result = await incrementViewCount(id);
            context.res.status = 200;
            context.res.body = result;
        } else {
            context.res.status = 400;
            context.res.body = { error: 'Invalid action' };
        }
    } catch (error) {
        context.log.error('Error in faq-manager function:', error);
        context.res.status = 500;
        context.res.body = { error: 'Internal server error', details: error.message };
    }
};

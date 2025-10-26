const { TableClient } = require("@azure/data-tables");

const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
const tableName = "FAQManagement";

let tableClient = null;

async function initTableClient() {
    if (!tableClient) {
        tableClient = TableClient.fromConnectionString(connectionString, tableName);
        try {
            await tableClient.createTable();
        } catch (error) {
            // Table already exists
        }
    }
    return tableClient;
}

// Erstelle oder update FAQ
async function upsertFAQ(faqData) {
    try {
        const client = await initTableClient();
        const rowKey = faqData.id || `faq_${Date.now()}`;
        
        const entity = {
            partitionKey: "faqs",
            rowKey: rowKey,
            question: faqData.question,
            answer: faqData.answer,
            category: faqData.category || "Allgemein",
            isActive: faqData.isActive !== false,
            viewCount: faqData.viewCount || 0,
            createdAt: faqData.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        await client.upsertEntity(entity, "Replace");
        return { success: true, id: rowKey };
    } catch (error) {
        console.error('Error upserting FAQ:', error);
        return { success: false, error: error.message };
    }
}

// Hole alle FAQs
async function getAllFAQs(activeOnly = false) {
    try {
        const client = await initTableClient();
        const filter = activeOnly 
            ? `PartitionKey eq 'faqs' and isActive eq true`
            : `PartitionKey eq 'faqs'`;
            
        const entities = client.listEntities({
            queryOptions: { filter }
        });

        const faqs = [];
        for await (const entity of entities) {
            faqs.push({
                id: entity.rowKey,
                question: entity.question,
                answer: entity.answer,
                category: entity.category,
                isActive: entity.isActive,
                viewCount: entity.viewCount || 0,
                createdAt: entity.createdAt,
                updatedAt: entity.updatedAt
            });
        }

        return faqs.sort((a, b) => b.viewCount - a.viewCount);
    } catch (error) {
        console.error('Error getting FAQs:', error);
        return [];
    }
}

// Hole FAQs mit Pagination
async function getFAQsPaginated(page = 1, pageSize = 6, category = null, sortBy = 'viewCount') {
    try {
        const allFAQs = await getAllFAQs(true);
        
        // Filter by category
        let filtered = category && category !== 'Alle' 
            ? allFAQs.filter(faq => faq.category === category)
            : allFAQs;

        // Sort
        if (sortBy === 'viewCount') {
            filtered.sort((a, b) => b.viewCount - a.viewCount);
        } else if (sortBy === 'newest') {
            filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }

        // Paginate
        const start = (page - 1) * pageSize;
        const end = start + pageSize;
        const paginated = filtered.slice(start, end);

        return {
            faqs: paginated,
            totalCount: filtered.length,
            page,
            pageSize,
            totalPages: Math.ceil(filtered.length / pageSize)
        };
    } catch (error) {
        console.error('Error getting paginated FAQs:', error);
        return { faqs: [], totalCount: 0, page: 1, pageSize, totalPages: 0 };
    }
}

// Lösche FAQ
async function deleteFAQ(id) {
    try {
        const client = await initTableClient();
        await client.deleteEntity("faqs", id);
        return { success: true };
    } catch (error) {
        console.error('Error deleting FAQ:', error);
        return { success: false, error: error.message };
    }
}

// Inkrementiere View Count
async function incrementViewCount(id) {
    try {
        const client = await initTableClient();
        const entity = await client.getEntity("faqs", id);
        entity.viewCount = (entity.viewCount || 0) + 1;
        await client.updateEntity(entity, "Merge");
        return { success: true };
    } catch (error) {
        console.error('Error incrementing view count:', error);
        return { success: false, error: error.message };
    }
}

// Hole Kategorien
async function getCategories() {
    try {
        const faqs = await getAllFAQs(true);
        const categories = [...new Set(faqs.map(faq => faq.category))];
        return categories.sort();
    } catch (error) {
        console.error('Error getting categories:', error);
        return ['Allgemein'];
    }
}

module.exports = {
    upsertFAQ,
    getAllFAQs,
    getFAQsPaginated,
    deleteFAQ,
    incrementViewCount,
    getCategories
};

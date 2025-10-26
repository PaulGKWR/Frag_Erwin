const { TableClient } = require("@azure/data-tables");

const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
const tableName = "QuestionTracking";

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

// Normalisiere Frage für besseres Tracking
function normalizeQuestion(question) {
    return question
        .toLowerCase()
        .trim()
        .replace(/\?/g, '')
        .replace(/\s+/g, ' ')
        .substring(0, 200); // Max length
}

// Tracke eine Frage
async function trackQuestion(question, response, userId = 'anonymous') {
    try {
        const client = await initTableClient();
        const normalized = normalizeQuestion(question);
        const timestamp = new Date().toISOString();
        const rowKey = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        const entity = {
            partitionKey: "questions",
            rowKey: rowKey,
            question: question,
            normalizedQuestion: normalized,
            response: response.substring(0, 500), // Store first 500 chars
            userId: userId,
            timestamp: timestamp,
            year: new Date().getFullYear(),
            month: new Date().getMonth() + 1,
            day: new Date().getDate()
        };

        await client.createEntity(entity);
        
        // Update question counter
        await updateQuestionCounter(normalized);
        
        return true;
    } catch (error) {
        console.error('Error tracking question:', error);
        return false;
    }
}

// Aktualisiere Question Counter für Ranking
async function updateQuestionCounter(normalizedQuestion) {
    try {
        const client = await initTableClient();
        const counterKey = `counter_${normalizedQuestion.replace(/[^a-z0-9]/g, '_').substring(0, 50)}`;
        
        let counter;
        try {
            counter = await client.getEntity("questionCounters", counterKey);
            counter.count = (counter.count || 0) + 1;
            counter.lastAsked = new Date().toISOString();
            await client.updateEntity(counter, "Merge");
        } catch {
            // Counter doesn't exist, create it
            counter = {
                partitionKey: "questionCounters",
                rowKey: counterKey,
                normalizedQuestion: normalizedQuestion,
                count: 1,
                firstAsked: new Date().toISOString(),
                lastAsked: new Date().toISOString()
            };
            await client.createEntity(counter);
        }
    } catch (error) {
        console.error('Error updating question counter:', error);
    }
}

// Hole Top-Fragen
async function getTopQuestions(limit = 10) {
    try {
        const client = await initTableClient();
        const entities = client.listEntities({
            queryOptions: { filter: `PartitionKey eq 'questionCounters'` }
        });

        const questions = [];
        for await (const entity of entities) {
            questions.push({
                question: entity.normalizedQuestion,
                count: entity.count,
                lastAsked: entity.lastAsked
            });
        }

        return questions
            .sort((a, b) => b.count - a.count)
            .slice(0, limit);
    } catch (error) {
        console.error('Error getting top questions:', error);
        return [];
    }
}

// Hole Statistiken
async function getStatistics() {
    try {
        const client = await initTableClient();
        
        // Zähle alle Fragen
        const questionsIterator = client.listEntities({
            queryOptions: { filter: `PartitionKey eq 'questions'` }
        });

        let totalQuestions = 0;
        const today = new Date();
        const todayStr = today.toISOString().split('T')[0];
        let questionsToday = 0;
        const thisMonth = today.getMonth() + 1;
        const thisYear = today.getFullYear();
        let questionsThisMonth = 0;

        for await (const entity of questionsIterator) {
            totalQuestions++;
            if (entity.timestamp && entity.timestamp.startsWith(todayStr)) {
                questionsToday++;
            }
            if (entity.month === thisMonth && entity.year === thisYear) {
                questionsThisMonth++;
            }
        }

        const topQuestions = await getTopQuestions(10);

        return {
            totalQuestions,
            questionsToday,
            questionsThisMonth,
            topQuestions,
            averagePerDay: (totalQuestions / Math.max(1, (Date.now() - new Date('2025-10-01').getTime()) / (1000 * 60 * 60 * 24))).toFixed(1)
        };
    } catch (error) {
        console.error('Error getting statistics:', error);
        return {
            totalQuestions: 0,
            questionsToday: 0,
            questionsThisMonth: 0,
            topQuestions: [],
            averagePerDay: 0
        };
    }
}

// Hole detaillierte Analytics
async function getAnalytics(days = 30) {
    try {
        const client = await initTableClient();
        const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
        
        const entities = client.listEntities({
            queryOptions: { filter: `PartitionKey eq 'questions'` }
        });

        const dailyData = {};
        const hourlyData = Array(24).fill(0);
        
        for await (const entity of entities) {
            if (entity.timestamp) {
                const date = new Date(entity.timestamp);
                if (date >= cutoffDate) {
                    const dateKey = date.toISOString().split('T')[0];
                    dailyData[dateKey] = (dailyData[dateKey] || 0) + 1;
                    hourlyData[date.getHours()]++;
                }
            }
        }

        return {
            dailyData,
            hourlyData,
            topQuestions: await getTopQuestions(20)
        };
    } catch (error) {
        console.error('Error getting analytics:', error);
        return { dailyData: {}, hourlyData: Array(24).fill(0), topQuestions: [] };
    }
}

module.exports = {
    trackQuestion,
    getTopQuestions,
    getStatistics,
    getAnalytics,
    normalizeQuestion
};

const { BlobServiceClient } = require("@azure/storage-blob");

const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
const containerName = "fragerwinblob";

let blobServiceClient = null;
let containerClient = null;

async function initBlobClient() {
    if (!blobServiceClient) {
        blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
        containerClient = blobServiceClient.getContainerClient(containerName);
        
        try {
            await containerClient.createIfNotExists();
        } catch (error) {
            // Container already exists
        }
    }
    return containerClient;
}

// Upload Dokument
async function uploadDocument(fileName, fileBuffer, contentType) {
    try {
        const client = await initBlobClient();
        const blockBlobClient = client.getBlockBlobClient(fileName);
        
        await blockBlobClient.upload(fileBuffer, fileBuffer.length, {
            blobHTTPHeaders: {
                blobContentType: contentType
            }
        });

        return {
            success: true,
            url: blockBlobClient.url,
            fileName: fileName
        };
    } catch (error) {
        console.error('Error uploading document:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

// Liste alle Dokumente
async function listDocuments() {
    try {
        const client = await initBlobClient();
        const documents = [];

        for await (const blob of client.listBlobsFlat()) {
            documents.push({
                name: blob.name,
                size: blob.properties.contentLength,
                contentType: blob.properties.contentType,
                lastModified: blob.properties.lastModified,
                url: `${client.url}/${blob.name}`
            });
        }

        return documents.sort((a, b) => b.lastModified - a.lastModified);
    } catch (error) {
        console.error('Error listing documents:', error);
        return [];
    }
}

// Lösche Dokument
async function deleteDocument(fileName) {
    try {
        const client = await initBlobClient();
        const blockBlobClient = client.getBlockBlobClient(fileName);
        await blockBlobClient.delete();
        
        return { success: true };
    } catch (error) {
        console.error('Error deleting document:', error);
        return { success: false, error: error.message };
    }
}

// Hole Dokument Info
async function getDocumentInfo(fileName) {
    try {
        const client = await initBlobClient();
        const blockBlobClient = client.getBlockBlobClient(fileName);
        const properties = await blockBlobClient.getProperties();
        
        return {
            name: fileName,
            size: properties.contentLength,
            contentType: properties.contentType,
            lastModified: properties.lastModified,
            url: blockBlobClient.url
        };
    } catch (error) {
        console.error('Error getting document info:', error);
        return null;
    }
}

module.exports = {
    uploadDocument,
    listDocuments,
    deleteDocument,
    getDocumentInfo
};

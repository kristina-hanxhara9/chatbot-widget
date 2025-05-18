import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai';
import { PineconeStore } from '@langchain/pinecone';
import { Pinecone } from '@pinecone-database/pinecone';
import { Document } from 'langchain/document';

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
  environment: process.env.PINECONE_ENVIRONMENT,
});

const embeddingsModel = new GoogleGenerativeAIEmbeddings({
  apiKey: process.env.GEMINI_API_KEY,
  modelName: "embedding-001",
});

export async function processDocument(documentText, metadata = {}) {
  // Split the text into chunks
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });

  const docs = await splitter.createDocuments(
    [documentText],
    [metadata]
  );

  // Get the Pinecone index
  const index = pinecone.Index(process.env.PINECONE_INDEX);

  // Store the documents in Pinecone
  const vectorStore = await PineconeStore.fromDocuments(
    docs,
    embeddingsModel,
    {
      pineconeIndex: index,
      namespace: metadata.businessId,
    }
  );

  return vectorStore;
}

export async function performSimilaritySearch(query, businessId, limit = 5) {
  // Get the Pinecone index
  const index = pinecone.Index(process.env.PINECONE_INDEX);

  // Create vector store with the index
  const vectorStore = await PineconeStore.fromExistingIndex(
    embeddingsModel,
    {
      pineconeIndex: index,
      namespace: businessId,
    }
  );

  // Search for similar documents
  const results = await vectorStore.similaritySearch(query, limit);
  
  return results;
}

export async function buildDocumentContext(query, businessId) {
  try {
    const relevantDocs = await performSimilaritySearch(query, businessId);
    
    if (relevantDocs.length === 0) {
      return "";
    }
    
    // Extract and format content from relevant documents
    const formattedDocs = relevantDocs.map((doc, i) => 
      `Document ${i + 1}:\n${doc.pageContent}`
    ).join('\n\n');
    
    return formattedDocs;
  } catch (error) {
    console.error("Error building document context:", error);
    return "";
  }
}
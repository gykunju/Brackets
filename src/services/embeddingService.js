import { pipeline, env } from '@xenova/transformers';

// Configuration for Vite and browser environment
// This ensures models are downloaded from the Hugging Face hub and cached in the browser
env.allowLocalModels = false;
env.useBrowserCache = true;

// Use a lightweight, high-quality embedding model suitable for semantic search
const MODEL_NAME = 'Xenova/all-MiniLM-L6-v2';

let extractorPipeline = null;
let pipelinePromise = null;

/**
 * Get or initialize the extraction pipeline
 * This uses a singleton pattern to ensure the model is only loaded once
 */
export async function getEmbeddingPipeline() {
  if (extractorPipeline) return extractorPipeline;
  
  if (!pipelinePromise) {
    console.log("Initializing embedding model (this may take a moment on first load)...");
    pipelinePromise = pipeline('feature-extraction', MODEL_NAME);
  }
  
  extractorPipeline = await pipelinePromise;
  return extractorPipeline;
}

/**
 * Generate a 384-dimensional vector embedding for a piece of text
 */
export async function generateEmbedding(text) {
  try {
    const extractor = await getEmbeddingPipeline();
    
    // pooling: 'mean' and normalize: true are best practices for cosine similarity
    const output = await extractor(text, { pooling: 'mean', normalize: true });
    
    // Convert Float32Array to standard JS Array for JSON serialization
    return Array.from(output.data);
  } catch (error) {
    console.error('Error generating embedding:', error);
    throw error;
  }
}

/**
 * Chunk large text into smaller segments suitable for embedding.
 * Overlapping chunks help maintain context across boundaries.
 * 
 * @param {string} text - The raw text
 * @param {number} maxTokens - Approximate max length of each chunk (characters)
 * @param {number} overlap - Number of characters to overlap between chunks
 * @returns {Array<string>} Array of text chunks
 */
export function chunkText(text, maxTokens = 1000, overlap = 200) {
  if (!text || typeof text !== 'string') return [];
  
  const chunks = [];
  let i = 0;
  
  while (i < text.length) {
    // Determine the rough end of the chunk
    let end = i + maxTokens;
    
    // If not at the very end of the text, try to find a natural break (newline or period)
    if (end < text.length) {
      const nextNewline = text.lastIndexOf('\n', end);
      const nextPeriod = text.lastIndexOf('. ', end);
      
      // Use the closest natural break within the last 30% of the chunk, otherwise hard split
      const minAcceptableEnd = i + (maxTokens * 0.7);
      
      if (nextNewline > minAcceptableEnd) {
        end = nextNewline;
      } else if (nextPeriod > minAcceptableEnd) {
        end = nextPeriod + 1; // Include the period
      }
    }
    
    const chunk = text.slice(i, end).trim();
    if (chunk) {
      chunks.push(chunk);
    }
    
    // Move i forward, applying overlap
    const oldI = i;
    i = end - overlap;
    
    // Prevent infinite loops if overlap logic fails
    if (i <= oldI) {
        i = end; 
    }
  }
  
  // Filter out tiny chunks that lack meaningful context
  return chunks.filter(chunk => chunk.length > 50);
}

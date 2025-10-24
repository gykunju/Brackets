import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

// Initialize the model
const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash-lite",
  generationConfig: {
    temperature: 0.7,
    topK: 40,
    topP: 0.95,
    maxOutputTokens: 2048,
  }
});

/**
 * Send a message to Gemini AI with context about user's brackets and units
 * @param {string} message - User's message
 * @param {Array} chatHistory - Previous chat messages
 * @param {Object} userContext - User's brackets, units, and content data
 * @returns {Promise<string>} AI response
 */
export async function sendMessage(message, chatHistory = [], userContext = {}) {
  try {
    // Debug: Log what content the AI is receiving
    console.log('AI Context - Content items:', userContext.content?.length || 0);
    if (userContext.content && userContext.content.length > 0) {
      userContext.content.forEach(item => {
        console.log(`- ${item.title}: has extracted_text = ${!!item.extracted_text}, length = ${item.extracted_text?.length || 0}`);
      });
    }

    // Build context from user's data
    let contextPrompt = "You are a helpful AI study assistant for a student. ";

    if (userContext.brackets && userContext.brackets.length > 0) {
      contextPrompt += "\n\nThe student is currently working on these study brackets (semesters/study periods):\n";
      userContext.brackets.forEach(bracket => {
        contextPrompt += `- ${bracket.title}${bracket.current ? ' (Current)' : ''}\n`;
      });
    }

    if (userContext.units && userContext.units.length > 0) {
      contextPrompt += "\n\nThey have the following units/topics:\n";
      userContext.units.forEach(unit => {
        const bracket = userContext.brackets?.find(b => b.id === unit.bracket_id);
        contextPrompt += `- ${unit.title}`;
        if (bracket) contextPrompt += ` (in ${bracket.title})`;
        contextPrompt += '\n';
      });
    }

    if (userContext.content && userContext.content.length > 0) {
      contextPrompt += "\n\nThey have uploaded the following study materials:\n";
      userContext.content.forEach(content => {
        const unit = userContext.units?.find(u => u.id === content.unit_id);
        contextPrompt += `- ${content.title} (${content.file_type})`;
        if (unit) contextPrompt += ` - in unit: ${unit.title}`;

        // Include extracted text content if available (truncated for context window)
        if (content.extracted_text && content.extracted_text.length > 0) {
          const truncatedText = content.extracted_text.substring(0, 2000); // Limit to 2000 chars per document
          contextPrompt += `\n  Content preview: ${truncatedText}${content.extracted_text.length > 2000 ? '...' : ''}`;
        }

        contextPrompt += '\n';
      });
    }

    if (userContext.events && userContext.events.length > 0) {
      contextPrompt += "\n\nUpcoming events and deadlines:\n";
      userContext.events.forEach(event => {
        contextPrompt += `- ${event.title} (${event.type})`;
        if (event.date) contextPrompt += ` on ${event.date}`;
        contextPrompt += '\n';
      });
    }

    contextPrompt += "\n\nUse this context to provide personalized, relevant assistance. You can reference specific brackets, units, or content when appropriate.";
    contextPrompt += "\n\nUser's question: " + message;

    // Always include context so AI stays aware of user's data throughout the conversation
    const result = await model.generateContent(contextPrompt);
    const response = await result.response;
    const text = response.text();

    return text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to get AI response. Please try again.");
  }
}

/**
 * Analyze an uploaded image
 * @param {File} imageFile - Image file to analyze
 * @param {string} prompt - Optional prompt for image analysis
 * @returns {Promise<string>} AI analysis
 */
export async function analyzeImage(imageFile, prompt = "Describe this image and extract any important information from it.") {
  try {
    const visionModel = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });

    // Convert file to base64
    const base64Image = await fileToBase64(imageFile);

    const imageParts = [
      {
        inlineData: {
          data: base64Image,
          mimeType: imageFile.type
        }
      }
    ];

    const result = await visionModel.generateContent([prompt, ...imageParts]);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error analyzing image:", error);
    throw new Error("Failed to analyze image. Please try again.");
  }
}

/**
 * Analyze a PDF document (by extracting text and analyzing it)
 * Note: Gemini can't directly read PDFs, so this requires text extraction
 * @param {string} pdfText - Extracted text from PDF
 * @param {string} fileName - Name of the PDF file
 * @returns {Promise<string>} AI summary/analysis
 */
export async function analyzePDF(pdfText, fileName) {
  try {
    const prompt = `Please analyze the following document content from "${fileName}" and provide:
1. A brief summary
2. Key topics covered
3. Important concepts or definitions
4. Any study tips or focus areas

Document content:
${pdfText.substring(0, 30000)}`; // Limit to ~30k chars to avoid token limits

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error analyzing PDF:", error);
    throw new Error("Failed to analyze PDF. Please try again.");
  }
}

/**
 * Helper function to convert file to base64
 */
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      // Remove data URL prefix (e.g., "data:image/png;base64,")
      const base64 = reader.result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = error => reject(error);
  });
}

/**
 * Analyze a specific document's content
 * @param {Object} contentItem - Content item from database with extracted_text
 * @param {string} userQuestion - Optional specific question about the document
 * @returns {Promise<string>} AI analysis
 */
export async function analyzeDocumentContent(contentItem, userQuestion = "") {
  try {
    const prompt = `Analyze the following document titled "${contentItem.title}"${userQuestion ? ` and answer this question: ${userQuestion}` : ''}

Document content:
${contentItem.extracted_text}

Please provide:
1. A brief summary of the document
2. Key topics and concepts covered
3. Important points or definitions
${userQuestion ? '4. Answer to the user\'s specific question' : '4. Study tips or focus areas'}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error analyzing document content:", error);
    throw new Error("Failed to analyze document. Please try again.");
  }
}

export default {
  sendMessage,
  analyzeImage,
  analyzePDF,
  analyzeDocumentContent
};

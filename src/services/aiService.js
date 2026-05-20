import Groq from "groq-sdk";

const API_KEY = import.meta.env.VITE_GROQ_API_KEY;
import { convertPdfToImages } from "./pdfUtils";

// Initialize Groq client
// browser: true is required for client-side usage, though server-side is recommended for production apps
const groq = new Groq({
  apiKey: API_KEY,
  dangerouslyAllowBrowser: true 
});

const DEFAULT_MODEL = "llama-3.3-70b-versatile";
const VISION_MODEL = "llama-3.2-90b-vision-preview"; 

/**
 * Send a message to Groq AI with context about user's brackets and units
 * @param {string} message - User's message
 * @param {Array} chatHistory - Previous chat messages
 * @param {Object} userContext - User's brackets, units, and content data
 * @returns {Promise<string>} AI response
 */
export async function sendMessage(message, chatHistory = [], userContext = {}) {
  try {
    if (!API_KEY) throw new Error("Groq API Key is missing");

    // Build context from user's data
    let systemPrompt = `You are a Socratic Study Coach, an advanced AI tutor built into the 'Brackets' study platform. 
Your goal is to actively help students understand their material, track their progress, and prepare for exams.
Follow these guidelines:
1. Use clear Markdown headings and bullet points to structure your answers.
2. If asked a direct question about their material, answer it clearly but also prompt them with a follow-up question to test their understanding.
3. If they ask for a quiz or summary, generate a well-structured response based ONLY on the context provided.
4. Always be encouraging and motivating.`;
    
    // Debug logging
    console.log("AI Context - Content count:", userContext.content?.length);
    if (userContext.content) {
        userContext.content.forEach(c => {
            console.log(`- File: ${c.title}, Extracted Length: ${c.extracted_text?.length}`);
        });
    }

    if (userContext.brackets && userContext.brackets.length > 0) {
      systemPrompt += "\n\nThe student is currently working on these study brackets (semesters/study periods):\n";
      userContext.brackets.forEach(bracket => {
        systemPrompt += `- ${bracket.title}${bracket.current ? ' (Current)' : ''}\n`;
      });
    }

    if (userContext.units && userContext.units.length > 0) {
      systemPrompt += "\n\nThey have the following units/topics:\n";
      userContext.units.forEach(unit => {
        const bracket = userContext.brackets?.find(b => b.id === unit.bracket_id);
        systemPrompt += `- ${unit.title}`;
        if (bracket) systemPrompt += ` (in ${bracket.title})`;
        systemPrompt += '\n';
      });
    }

      systemPrompt += "\n\nThey have uploaded the following study materials:\n";
      userContext.content.forEach(content => {
        const unit = userContext.units?.find(u => u.id === content.unit_id);
        systemPrompt += `- ${content.title} (${content.file_type})`;
        if (unit) systemPrompt += ` - in unit: ${unit.title}`;
        
        // Include extracted text content if available
        if (content.extracted_text && content.extracted_text.length > 50) { // arbitrary small threshold
           const truncatedText = content.extracted_text.substring(0, 50000); 
           systemPrompt += `\n  [START OF DOCUMENT CONTENT]\n  ${truncatedText}...\n  [END OF DOCUMENT CONTENT]`;
           systemPrompt += `\n  (Assistant Note: The text above is the actual content of the file "${content.title}". You CAN read it.)`;
        } else {
            systemPrompt += `\n  (Content not available or empty)`;
        }
        
        systemPrompt += '\n';
      });

    if (userContext.events && userContext.events.length > 0) {
      systemPrompt += "\n\nUpcoming events and deadlines:\n";
      userContext.events.forEach(event => {
        systemPrompt += `- ${event.title} (${event.type})`;
        if (event.date) systemPrompt += ` on ${event.date}`;
        systemPrompt += '\n';
      });
    }

    systemPrompt += "\n\nUse this context to provide highly personalized, proactive coaching. Reference specific brackets, units, or uploaded content to make your advice actionable and immediately relevant.";

    // Convert chat history to Groq format
    // Groq expects: { role: "user" | "assistant" | "system", content: "..." }
    const messages = [
      { role: "system", content: systemPrompt }
    ];

    chatHistory.forEach(chat => {
      if (chat.speaker === 'user') {
        messages.push({ role: "user", content: chat.content });
      } else if (chat.speaker === 'ai' && !chat.error) { // Don't include error messages
        messages.push({ role: "assistant", content: chat.content });
      }
    });

    // Add current message
    messages.push({ role: "user", content: message });

    const completion = await groq.chat.completions.create({
      messages: messages,
      model: DEFAULT_MODEL,
      temperature: 0.7,
      max_tokens: 2048,
    });

    return completion.choices[0]?.message?.content || "Sorry, I couldn't generate a response.";

  } catch (error) {
    console.error("Error calling Groq API:", error);
    throw new Error("Failed to get AI response. Please check your API key or try again.");
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
     if (!API_KEY) throw new Error("Groq API Key is missing");
     
    const base64Image = await fileToBase64(imageFile);
    const dataUrl = `data:${imageFile.type};base64,${base64Image}`;

    const completion = await groq.chat.completions.create({
        messages: [
            {
                role: "user",
                content: [
                    { type: "text", text: prompt },
                    { type: "image_url", image_url: { url: dataUrl } }
                ]
            }
        ],
        model: VISION_MODEL,
    });

    return completion.choices[0]?.message?.content || "No analysis generated.";
  } catch (error) {
    console.error("Error analyzing image:", error);
    throw new Error("Failed to analyze image with Groq.");
  }
}

/**
 * Analyze a PDF document (text-based)
 */
export async function analyzePDF(pdfText, fileName) {
  try {
     if (!API_KEY) throw new Error("Groq API Key is missing");

    const prompt = `Please analyze the following document content from "${fileName}" and provide:
1. A brief summary
2. Key topics covered
3. Important concepts or definitions
4. Any study tips or focus areas

Document content:
${pdfText.substring(0, 15000)}`; // Llama context window handling

    const completion = await groq.chat.completions.create({
      messages: [
        { role: "user", content: prompt }
      ],
      model: DEFAULT_MODEL,
    });

    return completion.choices[0]?.message?.content || "No analysis generated.";
  } catch (error) {
    console.error("Error analyzing PDF:", error);
    throw new Error("Failed to analyze PDF.");
  }
}

/**
 * Analyze a PDF document visually (converting pages to images)
 * This bypasses text extraction issues for image-based PDFs
 */
export async function analyzeVisualPDF(pdfFile, prompt = "Analyze this document.") {
  try {
     if (!API_KEY) throw new Error("Groq API Key is missing");

    const images = await convertPdfToImages(pdfFile, 20); // Limit to 20 pages
    if (images.length === 0) throw new Error("No images generated from PDF");

    const content = [
        { type: "text", text: `I have converted the first ${images.length} pages of this PDF into images. Please analyze them. ${prompt}` }
    ];

    // Add images to content array
    images.forEach(img => {
        content.push({ 
            type: "image_url", 
            image_url: { url: img } 
        });
    });

    const completion = await groq.chat.completions.create({
      messages: [
        { role: "user", content: content }
      ],
      model: VISION_MODEL, 
    });

    return completion.choices[0]?.message?.content || "No analysis generated.";
  } catch (error) {
    console.error("Error analyzing Visual PDF:", error);
    throw new Error("Failed to analyze PDF visually.");
  }
}

/**
 * Extract text from visual PDF using AI (OCR)
 * Used when standard text extraction fails (e.g. checked in UserContext)
 */
export async function extractTextFromVisualPDF(pdfFile) {
  try {
     if (!API_KEY) throw new Error("Groq API Key is missing");

    // Convert up to 10 pages for text extraction to keep it relatively fast
    const images = await convertPdfToImages(pdfFile, 10); 
    if (images.length === 0) return "";

    const content = [
        { type: "text", text: "Transcribe the text from these slides/images. Output ONLY the extracted text, no commentary." }
    ];

    images.forEach(img => {
        content.push({ 
            type: "image_url", 
            image_url: { url: img } 
        });
    });

    const completion = await groq.chat.completions.create({
      messages: [
        { role: "user", content: content }
      ],
      model: VISION_MODEL, 
    });

    return completion.choices[0]?.message?.content || "";
  } catch (error) {
    console.error("Error OCR-ing Visual PDF:", error);
    return ""; // Fail gracefully
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
      // Remove data URL prefix
      const base64 = reader.result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = error => reject(error);
  });
}

export default {
  sendMessage,
  analyzeImage,
  analyzePDF,
  analyzeVisualPDF,
  extractTextFromVisualPDF
};

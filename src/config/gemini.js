import { GoogleGenAI } from "@google/genai";

// Get API key from environment variable (Vite requires VITE_ prefix)
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';

console.log('Gemini API Key loaded:', apiKey ? `YES (${apiKey.length} chars)` : 'NO');

// The client gets the API key
const ai = new GoogleGenAI({ apiKey });

export async function generateText(prompt) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw error;
  }
}


// Get the generative model
// Using gemini-1.5-flash (works with the stable v1 API)
export const getModel = (modelName = 'gemini-1.5-flash') => {
  return genAI.getGenerativeModel({ model: modelName });
};

// Generate adaptive learning recommendations
export const generateRecommendations = async (learnerData) => {
  try {
    const model = getModel();
    const prompt = `
      As an adaptive learning AI tutor, analyze this learner's profile and provide personalized recommendations:
      
      Student Performance:
      - Completed Modules: ${learnerData.completedModules || 0}
      - Quiz Scores: ${JSON.stringify(learnerData.quizScores || [])}
      - Learning Style: ${learnerData.learningStyle || 'Not specified'}
      - Weak Areas: ${learnerData.weakAreas?.join(', ') || 'None identified'}
      - Strong Areas: ${learnerData.strongAreas?.join(', ') || 'None identified'}
      
      Provide:
      1. Three specific learning recommendations
      2. Suggested modules to focus on
      3. Personalized study tips
      
      Format as JSON with keys: recommendations, suggestedModules, studyTips
    `;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Try to parse JSON, fallback to structured text
    try {
      return JSON.parse(text);
    } catch {
      return {
        recommendations: [text],
        suggestedModules: [],
        studyTips: []
      };
    }
  } catch (error) {
    console.error('Error generating recommendations:', error);
    return {
      recommendations: ['Continue practicing regularly', 'Review challenging topics', 'Engage with peer learning circles'],
      suggestedModules: [],
      studyTips: ['Set daily learning goals', 'Take regular breaks', 'Ask questions in Village Circles']
    };
  }
};

// Provide instant quiz feedback
export const getQuizFeedback = async (question, userAnswer, correctAnswer) => {
  try {
    const model = getModel();
    const prompt = `
      Question: ${question}
      User's Answer: ${userAnswer}
      Correct Answer: ${correctAnswer}
      
      Provide encouraging, constructive feedback explaining:
      1. Whether the answer is correct
      2. Why the correct answer is right
      3. If wrong, what the user should review
      
      Keep it brief, supportive, and educational (max 100 words).
    `;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error getting quiz feedback:', error);
    return 'Keep practicing! Review the material and try again.';
  }
};

// Content personalization based on performance
export const personalizeContent = async (module, performanceHistory) => {
  try {
    const model = getModel();
    const prompt = `
      Module: ${module}
      Recent Performance: ${JSON.stringify(performanceHistory)}
      
      Suggest 3 specific learning activities or resources for this module based on the user's performance.
      Format as a simple array of strings.
    `;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error personalizing content:', error);
    return 'Continue with the standard curriculum';
  }
};

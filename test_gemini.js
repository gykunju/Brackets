
import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from 'fs';
import path from 'path';

// Read .env file manually since we are running with node
const envPath = path.resolve(process.cwd(), '.env');
const envFile = fs.readFileSync(envPath, 'utf8');
const apiKeyMatch = envFile.match(/VITE_GEMINI_API_KEY=(.*)/);
const API_KEY = apiKeyMatch ? apiKeyMatch[1].trim() : null;

if (!API_KEY) {
    console.error("Could not find VITE_GEMINI_API_KEY in .env");
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(API_KEY);

async function testModel(modelName) {
    console.log(`Testing model: ${modelName}`);
    try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent("Hello, are you there?");
        const response = await result.response;
        console.log(`Success with ${modelName}:`, response.text());
        return true;
    } catch (error) {
        console.error(`Failed with ${modelName}:`, error.message);
        return false;
    }
}

async function run() {
    console.log("Starting reproduction test...");
    
    // Test the current model
    const currentModelResult = await testModel("gemini-2.0-flash-lite");
    
    // Test potential working models (versioned)
    await testModel("gemini-1.5-flash-001");
    // await testModel("gemini-1.5-flash-002");
    await testModel("gemini-1.5-pro-001");
    // await testModel("gemini-1.5-pro-002");
}

run();


import Groq from "groq-sdk";
import fs from 'fs';
import path from 'path';

// Read .env file manually since we are running with node
const envPath = path.resolve(process.cwd(), '.env');
const envFile = fs.readFileSync(envPath, 'utf8');
const apiKeyMatch = envFile.match(/VITE_GROQ_API_KEY=(.*)/);
const API_KEY = apiKeyMatch ? apiKeyMatch[1].trim() : null;

if (!API_KEY) {
    console.error("\n❌ Could not find VITE_GROQ_API_KEY in .env");
    console.error("Please add your key: VITE_GROQ_API_KEY=gsk_...");
    process.exit(1);
}

const groq = new Groq({ apiKey: API_KEY });

async function run() {
    console.log(`\nTesting Groq API with key: ${API_KEY.substring(0, 10)}...`);
    try {
        const completion = await groq.chat.completions.create({
            messages: [{ role: "user", content: "Say 'Hello from Groq!'" }],
            model: "llama-3.3-70b-versatile",
        });
        console.log("\n✅ Success! Response:");
        console.log(completion.choices[0]?.message?.content);
    } catch (error) {
        console.log("\n❌ Failed:");
        console.error(error.message);
    }
}

run();

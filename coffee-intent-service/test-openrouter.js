import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

console.log("🧪 Testing OpenRouter API Connection...\n");
console.log("Configuration:");
console.log(`  API Key: ${process.env.OPENROUTER_API_KEY?.substring(0, 20)}...`);
console.log(`  Base URL: https://openrouter.ai/api/v1`);
console.log(`  Model: deepseek/deepseek-chat`);
console.log("");

async function testOpenRouter() {
  try {
    console.log("📤 Sending test request to OpenRouter...");
    const response = await openai.chat.completions.create({
      model: "deepseek/deepseek-chat",
      messages: [
        {
          role: "user",
          content: "Say 'Connection successful' only.",
        },
      ],
      temperature: 0.1,
      max_tokens: 10,
    });

    console.log("✅ SUCCESS!");
    console.log("");
    console.log("Response:");
    console.log(`  Status: ${response.object}`);
    console.log(`  Model: ${response.model}`);
    console.log(`  Message: ${response.choices[0].message.content}`);
    console.log("");
    console.log("🎉 OpenRouter is working correctly!");
    console.log("Check your logs at: https://openrouter.ai/logs");
  } catch (error) {
    console.error("❌ ERROR!");
    console.error("");
    console.error("Error Details:");
    console.error(`  Type: ${error.name}`);
    console.error(`  Message: ${error.message}`);
    if (error.status) {
      console.error(`  Status: ${error.status}`);
    }
    if (error.error) {
      console.error(`  API Error: ${JSON.stringify(error.error)}`);
    }
    console.error("");
    console.error("Troubleshooting:");
    console.error("1. Check API key is valid: https://openrouter.ai/keys");
    console.error("2. Check account has credits");
    console.error("3. Try the API at: https://openrouter.ai/playground");
    console.error("4. Check network connectivity to openrouter.ai");
  }
}

testOpenRouter();

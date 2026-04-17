import dotenv from "dotenv";
dotenv.config();

console.log("🔍 Checking available OpenRouter models...\n");

// Test various models
const modelsToTest = [
  { name: "qwen/qwen3.6-plus", desc: "Qwen 3.6 Plus (recommended)" },
  { name: "qwen/qwen3.6-plus:free", desc: "Qwen 3.6 Plus Free (DEPRECATED)" },
  { name: "qwen/qwq-32b", desc: "Qwen QwQ 32B" },
  { name: "qwen/qwen-2.5-72b-instruct", desc: "Qwen 2.5 72B" },
  { name: "meta-llama/llama-3.2-3b-instruct:free", desc: "Llama 3.2 3B (Free)" },
  { name: "mistralai/mistral-7b-instruct:free", desc: "Mistral 7B (Free)" },
  { name: "deepseek/deepseek-chat", desc: "DeepSeek Chat" },
  { name: "gpt-3.5-turbo", desc: "GPT 3.5 Turbo" },
];

async function testModel(modelName) {
  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "CoffeeInsightAI",
      },
      body: JSON.stringify({
        model: modelName,
        messages: [{ role: "user", content: "OK" }],
        max_tokens: 5,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      console.log(`✅ ${modelName}`);
      console.log(`   Status: Working`);
      if (data.usage) {
        console.log(`   Input tokens: ${data.usage.prompt_tokens}`);
      }
      return true;
    } else if (data.error?.message?.includes("deprecated")) {
      console.log(`⚠️  ${modelName}`);
      console.log(`   Status: DEPRECATED - ${data.error.message}`);
      return false;
    } else {
      console.log(`❌ ${modelName}`);
      console.log(`   Error: ${data.error?.message || "Unknown error"}`);
      return false;
    }
  } catch (err) {
    console.log(`❌ ${modelName}`);
    console.log(`   Error: ${err.message}`);
    return false;
  }
}

(async () => {
  console.log(`API Key: ${process.env.OPENROUTER_API_KEY?.substring(0, 15)}...`);
  console.log("");

  let workingModels = [];

  for (const model of modelsToTest) {
    console.log(`Testing: ${model.desc}`);
    const result = await testModel(model.name);
    if (result) {
      workingModels.push(model.name);
    }
    console.log("");
  }

  if (workingModels.length > 0) {
    console.log("🎯 RECOMMENDED:");
    console.log(`Use: ${workingModels[0]}`);
  }
})();

import dotenv from "dotenv";
dotenv.config();

console.log("🔍 Checking FREE/CHEAP Chat Models on OpenRouter...\n");

const modelsToTest = [
  { name: "qwen/qwq-32b", desc: "Qwen QwQ 32B (Reasoning)" },
  { name: "qwen/qwen-2.5-72b-instruct", desc: "Qwen 2.5 72B" },
  { name: "deepseek/deepseek-chat", desc: "DeepSeek Chat" },
  { name: "gpt-4o-mini", desc: "GPT-4o Mini" },
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
        messages: [{ role: "user", content: "test" }],
        max_tokens: 5,
      }),
    });

    const data = await response.json();
    if (response.ok) {
      return "✅ WORKS";
    } else {
      return `❌ ${data.error?.message?.substring(0, 30)}`;
    }
  } catch (err) {
    return `❌ Error`;
  }
}

(async () => {
  for (const model of modelsToTest) {
    const result = await testModel(model.name);
    console.log(`${result} ${model.name.padEnd(40)} - ${model.desc}`);
  }
  console.log("\n⚠️  qwen/qwen3-embedding-8b is EMBEDDING model (not chat)");
  console.log("   For chat: use qwen-2.5-72b, deepseek-chat, or gpt models");
})();

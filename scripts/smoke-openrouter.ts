import "dotenv/config";
import { runAgentViaOpenRouter } from "../src/modules/agent/services/openRouterRunner";

async function main() {
  const result = await runAgentViaOpenRouter({
    userMessage: "Mi AFP me cobra 14.200 hace 3 meses, no entiendo por que",
    onEvent: (e) => {
      if (e.type === "tool_call") console.log(`🔧 ${e.name}:`, JSON.stringify(e.input));
      else if (e.type === "tool_result") console.log(`✓ ${e.name} → result`);
      else if (e.type === "assistant") console.log(`🤖`, e.text.slice(0, 200));
      else if (e.type === "user") console.log(`👤`, e.text);
      else if (e.type === "error") console.log(`❌`, e.message);
    },
  });
  console.log("\n=== FINAL ===\n", result.finalText);
}

main().catch((e) => { console.error("FAIL:", e.message); process.exit(1); });

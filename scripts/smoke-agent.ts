// Smoke test del agente desde CLI.
// Uso: npm run smoke:agent
//
// Valida end-to-end:
// - cliente Anthropic se inicializa con la API key del .env.local
// - el system prompt se carga
// - la tool dummy `echo` se llama via betaZodTool
// - el toolRunner devuelve respuesta final
// - los eventos de consola se emiten en orden

import "dotenv/config";
import {
  runAgent,
  type ConsoleEvent,
} from "../src/modules/agent/services/runner";

// Colores ANSI minimos para que la consola se lea agradable en terminal.
const colors = {
  reset: "\x1b[0m",
  dim: "\x1b[2m",
  cyan: "\x1b[36m",
  yellow: "\x1b[33m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  magenta: "\x1b[35m",
};

function renderEvent(event: ConsoleEvent): void {
  switch (event.type) {
    case "user":
      console.log(`${colors.cyan}👤 USUARIO${colors.reset}: ${event.text}`);
      break;
    case "tool_call":
      console.log(
        `${colors.yellow}🔧 TOOL CALL${colors.reset} → ${event.name}(${JSON.stringify(event.input)})`,
      );
      break;
    case "tool_result":
      console.log(
        `${colors.green}   ✓ RESULT${colors.reset} ← ${JSON.stringify(event.output)}`,
      );
      break;
    case "assistant":
      console.log(`${colors.magenta}🤖 CLARIZA${colors.reset}: ${event.text}`);
      break;
    case "error":
      console.log(`${colors.red}❌ ERROR${colors.reset}: ${event.message}`);
      break;
  }
}

async function main(): Promise<void> {
  // Mensaje de prueba: forza al agente a usar la tool echo para validar el pipeline.
  const testMessage =
    "Para verificar que tus herramientas funcionan, usa la tool `echo` con el texto exacto 'clariza vive' y luego confirmame que la usaste.";

  console.log(`${colors.dim}--- Clariza · smoke test del agente ---${colors.reset}\n`);

  const start = Date.now();
  const result = await runAgent({
    userMessage: testMessage,
    onEvent: renderEvent,
  });
  const elapsedMs = Date.now() - start;

  console.log(`\n${colors.dim}--- Respuesta final ---${colors.reset}`);
  console.log(result.finalText);
  console.log(
    `\n${colors.dim}--- Tomo ${elapsedMs}ms · ${result.events.length} eventos ---${colors.reset}`,
  );
}

main().catch((err) => {
  console.error("Smoke test fallo:", err);
  process.exit(1);
});

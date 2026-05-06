// API route SSE para ejecutar un turno del agente Clariza.
//
// POST /api/agent — acepta:
//   1) JSON: { userMessage: string }
//   2) multipart/form-data: campo userMessage + campo file (foto, PDF)
//      con esto la tool extractEvidence puede usar Claude Vision.
//
// Response: text/event-stream con eventos del agente (ConsoleEvent JSON).
//
// Comportamiento:
//   - Si ANTHROPIC_API_KEY esta configurada → ejecuta el agente real con
//     los 5 tools registrados, incluyendo extractEvidence con el archivo.
//   - Si NO esta → fallback al mock para que la demo no se rompa.

import { runAgentViaOpenRouter } from "@/modules/agent/services/openRouterRunner";
import { runAgent } from "@/modules/agent/services/runner";
import type {
  AgentAttachment,
  ConsoleEvent,
  ConversationMessage,
} from "@/modules/agent/types";
import { getAgentStream } from "@/modules/chat/services/mockAgentStream";

// Forzamos runtime Node porque el SDK de Anthropic usa Node APIs.
// Edge runtime no soporta el SDK completo.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Limite del archivo a procesar — protege la API y costos de Vision.
// 10 MB cubre fotos de cartolas/contratos sin problema.
const MAX_FILE_BYTES = 10 * 1024 * 1024;

interface AgentRequest {
  userMessage: string;
  attachment: AgentAttachment | null;
  conversationHistory: ConversationMessage[];
}

/** Parsea con seguridad un campo conversationHistory (string JSON o array). */
function parseHistory(raw: unknown): ConversationMessage[] {
  if (!raw) return [];
  let arr: unknown = raw;
  if (typeof raw === "string") {
    try {
      arr = JSON.parse(raw);
    } catch {
      return [];
    }
  }
  if (!Array.isArray(arr)) return [];
  const result: ConversationMessage[] = [];
  for (const item of arr) {
    if (
      item &&
      typeof item === "object" &&
      "role" in item &&
      "content" in item &&
      (item.role === "user" || item.role === "assistant") &&
      typeof item.content === "string"
    ) {
      result.push({ role: item.role, content: item.content });
    }
  }
  return result;
}

/** Lee la request y devuelve userMessage + history + attachment opcional. */
async function parseRequest(req: Request): Promise<AgentRequest | { error: string }> {
  const contentType = req.headers.get("content-type") ?? "";

  // Caso 1: JSON simple sin archivo.
  if (contentType.includes("application/json")) {
    const body = (await req.json().catch(() => ({}))) as {
      userMessage?: unknown;
      conversationHistory?: unknown;
    };
    const userMessage =
      typeof body.userMessage === "string" ? body.userMessage.trim() : "";
    if (!userMessage) return { error: "userMessage requerido" };
    return {
      userMessage,
      attachment: null,
      conversationHistory: parseHistory(body.conversationHistory),
    };
  }

  // Caso 2: multipart/form-data con archivo opcional.
  if (contentType.includes("multipart/form-data")) {
    const form = await req.formData();
    const userMessageRaw = form.get("userMessage");
    const userMessage =
      typeof userMessageRaw === "string" ? userMessageRaw.trim() : "";
    if (!userMessage) return { error: "userMessage requerido" };

    const conversationHistory = parseHistory(form.get("conversationHistory"));

    const file = form.get("file");
    if (!(file instanceof File) || file.size === 0) {
      return { userMessage, attachment: null, conversationHistory };
    }

    if (file.size > MAX_FILE_BYTES) {
      return {
        error: `Archivo demasiado grande (${Math.round(file.size / 1024 / 1024)} MB). Máximo 10 MB.`,
      };
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const attachment: AgentAttachment = {
      base64: buffer.toString("base64"),
      mediaType: file.type || "application/octet-stream",
      filename: file.name,
    };
    return { userMessage, attachment, conversationHistory };
  }

  return { error: `Content-Type no soportado: ${contentType}` };
}

export async function POST(req: Request) {
  const parsed = await parseRequest(req);

  if ("error" in parsed) {
    return new Response(JSON.stringify({ error: parsed.error }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { userMessage, attachment, conversationHistory } = parsed;

  // Provider routing:
  // 1. Si hay ANTHROPIC_API_KEY → usar Anthropic SDK (camino preferido).
  // 2. Si no, pero hay OPENROUTER_API_KEY → usar OpenAI SDK contra OpenRouter.
  // 3. Si ninguna, fallback al mock dinamico.
  const provider: "anthropic" | "openrouter" | "mock" = process.env
    .ANTHROPIC_API_KEY
    ? "anthropic"
    : process.env.OPENROUTER_API_KEY
      ? "openrouter"
      : "mock";

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const send = (event: ConsoleEvent) => {
        const payload = `data: ${JSON.stringify(event)}\n\n`;
        controller.enqueue(encoder.encode(payload));
      };

      try {
        if (provider === "anthropic") {
          // Camino real Anthropic: runAgent + toolRunner SDK + 6 tools.
          await runAgent({
            userMessage,
            conversationHistory,
            attachment,
            onEvent: send,
          });
        } else if (provider === "openrouter") {
          // Camino OpenRouter: OpenAI SDK con baseURL OpenRouter, modelos Claude.
          // Loop tool-use manual (sin toolRunner helper).
          await runAgentViaOpenRouter({
            userMessage,
            conversationHistory,
            attachment,
            onEvent: send,
          });
        } else {
          // Camino mock: el mock detecta keywords y elige uno de los 4 casos.
          send({ type: "user", text: userMessage });
          const demoNote = attachment
            ? `Modo demo (sin API key todavía): vi tu archivo "${attachment.filename ?? "adjunto"}" y mapeé tu mensaje a un caso de ejemplo. Cuando llegue la key del Lab te respondo con tus datos reales.`
            : "Modo demo (sin API key todavía): mapeé tu mensaje a un caso de ejemplo similar. Cuando llegue la key del Lab te respondo con tus datos reales.";
          send({ type: "assistant", text: demoNote });
          for await (const event of getAgentStream(userMessage)) {
            // Saltamos el user del mock (ya emitimos uno arriba con el mensaje real).
            if (event.type === "user") continue;
            send(event);
          }
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        send({ type: "error", message });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}

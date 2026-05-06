// Tool dummy para validar el patron de tool-use end-to-end.
// Se elimina cuando las 5 tools reales esten en su lugar (Paso 3+).

import { betaZodTool } from "@anthropic-ai/sdk/helpers/beta/zod";
import { z } from "zod";

export const echoTool = betaZodTool({
  name: "echo",
  description:
    "Devuelve el mensaje recibido en MAYUSCULAS. Sirve solo como prueba de tool-use. No tiene uso real para el ciudadano.",
  inputSchema: z.object({
    message: z.string().describe("El texto que se va a devolver en mayusculas"),
  }),
  run: async ({ message }) => {
    // Simulamos una mini latencia para que se sienta el ciclo agente <-> tool.
    await new Promise((r) => setTimeout(r, 50));
    return message.toUpperCase();
  },
});

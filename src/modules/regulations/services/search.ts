// Servicio de busqueda en el corpus regulatorio.
//
// v0 (Paso 5): busqueda por keywords sobre el corpus mock en memoria.
// Calcula relevancia simple en base a cuantas keywords del chunk
// matchean con la query del usuario, ponderado por longitud de match.
//
// v1 (Paso 6+): se reemplaza por consulta a pgvector con embeddings reales,
// manteniendo la misma interfaz publica searchCorpus().

import { REGULATION_CORPUS } from "@/modules/regulations/data/fallback";
import type {
  Citation,
  RegulationChunk,
  Relevance,
  RegulatorySourceId,
} from "@/modules/regulations/types";

export interface SearchOptions {
  /** Lista de fuentes a consultar. Si esta vacia o no se pasa, busca en todas. */
  sources?: RegulatorySourceId[];
  /** Maximo de resultados a devolver. Default 5. */
  maxResults?: number;
}

/** Normaliza un texto para keyword matching:
 *  - lowercase
 *  - quita acentos
 *  - colapsa espacios
 *  Esto matchea "comisión" con "comision" y "AFP" con "afp". */
function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/** Calcula score de un chunk dado la query del usuario.
 *  - Suma puntos por cada keyword del chunk presente en la query.
 *  - Keywords mas largas pesan mas (mas especificas).
 *  - Devuelve 0 si no hay match. */
function scoreChunk(chunk: RegulationChunk, normalizedQuery: string): number {
  let score = 0;
  for (const keyword of chunk.keywords) {
    if (normalizedQuery.includes(keyword)) {
      // Keywords compuestas (varias palabras) pesan mas que una palabra suelta.
      const wordCount = keyword.split(" ").length;
      score += wordCount * 2;
    }
  }
  return score;
}

function relevanceFromScore(score: number): Relevance {
  if (score >= 6) return "alta";
  if (score >= 3) return "media";
  return "baja";
}

/**
 * Busca en el corpus regulatorio chunks relevantes para la query del usuario.
 * Devuelve citas listas para que el agente las use en su respuesta.
 */
export function searchCorpus(
  query: string,
  options: SearchOptions = {},
): Citation[] {
  const { sources, maxResults = 5 } = options;
  const normalizedQuery = normalize(query);

  // Filtrar por fuentes si se especifican.
  const candidates = sources && sources.length > 0
    ? REGULATION_CORPUS.filter((c) => sources.includes(c.sourceId))
    : REGULATION_CORPUS;

  const scored = candidates
    .map((chunk) => ({ chunk, score: scoreChunk(chunk, normalizedQuery) }))
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxResults);

  // Mapeamos a Citation publico, agregando relevance calculada.
  return scored.map(({ chunk, score }) => {
    const citation: Citation = {
      sourceId: chunk.sourceId,
      source: chunk.source,
      text: chunk.text,
      plainLanguageSummary: chunk.plainLanguageSummary,
      url: chunk.url,
      relevance: relevanceFromScore(score),
    };
    if (chunk.article) citation.article = chunk.article;
    return citation;
  });
}

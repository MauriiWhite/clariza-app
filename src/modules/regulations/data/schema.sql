-- src/modules/regulations/data/schema.sql
-- Tabla para almacenar los chunks regulatorios con embeddings (requerimiento de Mauricio)

-- Habilitar pgvector si no está habilitado
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE public.regulation_chunks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  source_id TEXT NOT NULL,
  source TEXT NOT NULL,
  article TEXT,
  text TEXT NOT NULL,
  plain_language_summary TEXT NOT NULL,
  url TEXT NOT NULL,
  keywords TEXT[] DEFAULT '{}',
  embedding vector(1536), -- text-embedding-3-small dimensions
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Habilitar RLS (Row Level Security)
ALTER TABLE public.regulation_chunks ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad
-- Todos los usuarios (incluso anónimos) pueden leer los chunks regulatorios
CREATE POLICY "Lectura pública de chunks regulatorios" 
ON public.regulation_chunks FOR SELECT 
USING (true);

-- Solo usuarios autenticados (o admins) podrían insertar/actualizar (por defecto cerrado)
-- Para simplificar, la ingesta se puede hacer con el Service Role Key desde el backend,
-- el cual se salta el RLS.

-- Crear un índice HNSW para búsquedas vectoriales rápidas
-- Usamos vector_cosine_ops ya que cosine similarity es estándar para OpenAI embeddings
CREATE INDEX ON public.regulation_chunks 
USING hnsw (embedding vector_cosine_ops)
WITH (m = 16, ef_construction = 64);

-- Función de búsqueda por similitud para usar en RPC desde Supabase
CREATE OR REPLACE FUNCTION match_regulation_chunks(
  query_embedding vector(1536),
  match_threshold float,
  match_count int
)
RETURNS TABLE (
  id UUID,
  source_id TEXT,
  source TEXT,
  article TEXT,
  text TEXT,
  plain_language_summary TEXT,
  url TEXT,
  keywords TEXT[],
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    rc.id,
    rc.source_id,
    rc.source,
    rc.article,
    rc.text,
    rc.plain_language_summary,
    rc.url,
    rc.keywords,
    1 - (rc.embedding <=> query_embedding) AS similarity
  FROM public.regulation_chunks rc
  WHERE 1 - (rc.embedding <=> query_embedding) > match_threshold
  ORDER BY rc.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- src/modules/reminders/schema/cases.sql
-- Tabla para almacenar los casos de los usuarios (requerimiento de Mauricio)

CREATE TABLE public.cases (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  persona TEXT NOT NULL,
  age INTEGER,
  city TEXT,
  problem TEXT NOT NULL,
  diagnosis JSONB, -- Almacena el RegulatoryDiagnosis
  schedule JSONB,  -- Almacena el DeadlineSchedule
  claim JSONB,     -- Almacena el ClaimDocument
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'reminders_active', 'resolved')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Habilitar RLS (Row Level Security)
ALTER TABLE public.cases ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad
CREATE POLICY "Los usuarios pueden ver sus propios casos" 
ON public.cases FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Los usuarios pueden insertar sus propios casos" 
ON public.cases FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Los usuarios pueden actualizar sus propios casos" 
ON public.cases FOR UPDATE 
USING (auth.uid() = user_id);

-- Función para actualizar el timestamp updated_at automáticamente
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_cases_modtime
BEFORE UPDATE ON public.cases
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

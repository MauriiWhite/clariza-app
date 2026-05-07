import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'

export default async function CasosDBPage() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  // Adaptado al dominio del proyecto Clariza (tabla `cases` según WORKFLOW.md)
  const { data: cases, error } = await supabase.from('cases').select()

  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="font-serif text-3xl mb-6">Casos desde Supabase</h1>
      {error && <p className="text-red-500 mb-4">Error al obtener casos: {error.message}</p>}
      {!cases || cases.length === 0 ? (
        <p className="text-ink-3">No hay casos registrados aún.</p>
      ) : (
        <ul className="space-y-4">
          {cases.map((c: any) => (
            <li key={c.id} className="p-4 border border-border rounded-lg bg-paper glass">
              <p className="font-medium">{c.persona}</p>
              <p className="text-sm text-ink-2">{c.problem}</p>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}

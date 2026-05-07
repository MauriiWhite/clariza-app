import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import { sendDeadlineReminder } from '@/modules/reminders/services/email';
import type { DeadlineSchedule } from '@/modules/tools/calculateDeadlines/types';
import type { RegulatoryDiagnosis } from '@/modules/tools/classifyJurisdiction/types';

/**
 * Route Handler para Vercel Cron.
 * Busca casos activos que estén a 7, 3 o 1 días de vencer y envía recordatorios.
 */
export async function GET(request: Request) {
  // Verificación de seguridad básica para Vercel Cron
  // En producción, Vercel envía un header especial
  const authHeader = request.headers.get('authorization');
  if (
    process.env.NODE_ENV === 'production' &&
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createClient(await cookies());

  try {
    // Obtenemos los casos que tienen recordatorios activos
    // Para enviar email necesitamos el email del usuario
    const { data: cases, error } = await supabase
      .from('cases')
      .select(`
        id, 
        persona, 
        schedule, 
        diagnosis,
        user_id,
        auth_users:user_id(email)
      `)
      .eq('status', 'reminders_active')
      .not('schedule', 'is', null);

    if (error) {
      throw error;
    }

    let emailsSent = 0;

    for (const c of cases) {
      const schedule = c.schedule as unknown as DeadlineSchedule;
      const diagnosis = c.diagnosis as unknown as RegulatoryDiagnosis;
      const remainingDays = schedule.remainingBusinessDays;

      // Extraer email de la relación auth.users (el JOIN) 
      // Supabase PostgREST devuelve objetos anidados si se hace JOIN correcto.
      // O podemos sacar el email si estuviera guardado en Claim, pero depende de Auth.
      // Manejaremos esto asumiendo auth_users.email
      let userEmail = null;
      if (c.auth_users && Array.isArray(c.auth_users) && c.auth_users.length > 0) {
        userEmail = c.auth_users[0].email;
      } else if (c.auth_users && !Array.isArray(c.auth_users)) {
        userEmail = (c.auth_users as any).email;
      }

      if (!userEmail) continue;

      // Disparar alertas para 7, 3 y 1 días restantes
      if (remainingDays === 7 || remainingDays === 3 || remainingDays === 1) {
        const regulatorName = diagnosis?.primaryRegulator || 'la institución reguladora';
        
        await sendDeadlineReminder({
          to: userEmail,
          claimId: c.id,
          claimantName: c.persona,
          daysRemaining: remainingDays,
          regulatorName,
        });

        emailsSent++;
      }
    }

    return NextResponse.json({ success: true, emailsSent });
  } catch (error: any) {
    console.error('Error running reminders cron:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

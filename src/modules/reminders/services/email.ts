import { Resend } from 'resend';

// Inicializamos Resend con la API key de entorno.
// Usamos un API key de fallback vacía si no existe para que compile,
// pero debe configurarse en producción.
const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy');

export interface SendReminderParams {
  to: string;
  claimId: string;
  claimantName: string;
  daysRemaining: number;
  regulatorName: string;
}

/**
 * Servicio para enviar correos de recordatorio utilizando Resend.
 */
export async function sendDeadlineReminder({
  to,
  claimId,
  claimantName,
  daysRemaining,
  regulatorName,
}: SendReminderParams) {
  let subject = `Recordatorio: Faltan ${daysRemaining} días para tu plazo con ${regulatorName}`;
  if (daysRemaining === 1) {
    subject = `⚠️ URGENTE: Mañana vence tu plazo con ${regulatorName}`;
  } else if (daysRemaining === 0) {
    subject = `🚨 HOY vence tu plazo con ${regulatorName}`;
  }

  const { data, error } = await resend.emails.send({
    from: 'Clariza <notificaciones@clariza.app>',
    to: [to],
    subject,
    html: `
      <h2>Hola ${claimantName},</h2>
      <p>Te escribimos desde <strong>Clariza</strong> para recordarte sobre tu reclamo pendiente (${claimId}) ante <strong>${regulatorName}</strong>.</p>
      
      <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h3 style="margin-top: 0;">Faltan ${daysRemaining} días hábiles para el vencimiento de tu plazo.</h3>
        <p>Es importante que revises el estado de tu trámite para no perder tus derechos como consumidor/ciudadano.</p>
      </div>

      <p>Si ya resolviste este trámite, puedes ignorar este correo o actualizar el estado en la plataforma.</p>

      <p>Atentamente,<br/>El equipo de Clariza</p>
    `,
  });

  if (error) {
    console.error('Error enviando correo de recordatorio via Resend:', error);
    throw error;
  }

  return data;
}

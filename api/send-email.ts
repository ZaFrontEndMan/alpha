import { sendEmail, SendMailOptions } from './lib/email';

const readBody = (body: unknown): Record<string, any> => {
  if (typeof body === 'string') {
    try {
      return JSON.parse(body);
    } catch {
      return {};
    }
  }
  return (body ?? {}) as Record<string, any>;
};

export default async function handler(
  request: { method?: string; body?: unknown; headers?: Record<string, string | string[] | undefined> },
  response: {
    setHeader: (name: string, value: string) => void;
    status: (code: number) => { json: (data: unknown) => void };
  }
) {
  response.setHeader('Content-Type', 'application/json');

  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  try {
    const body = readBody(request.body) as Partial<SendMailOptions> & { apiKey?: string };
    const { to, subject, html, text, replyTo } = body;

    // Optional API key protection if configured in .env
    const requiredApiKey = process.env.MAIL_API_KEY;
    if (requiredApiKey) {
      const incomingKey = body.apiKey || (request.headers?.['x-api-key'] as string);
      if (incomingKey !== requiredApiKey) {
        return response.status(401).json({ error: 'Unauthorized: Invalid or missing API key.' });
      }
    }

    if (!to || !subject || (!html && !text)) {
      return response.status(400).json({
        error: 'Missing required fields: to, subject, and either html or text are required.',
      });
    }

    const info = await sendEmail({
      to,
      subject,
      html: html || `<p>${text}</p>`,
      text,
      replyTo,
    });

    return response.status(200).json({
      success: true,
      messageId: info.messageId,
      accepted: info.accepted,
    });
  } catch (error) {
    console.error('[api/send-email] Error sending email:', error);
    return response.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to send email',
    });
  }
}

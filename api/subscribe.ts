import { sendSubscriptionEmails, SubscriptionIntakeData } from './lib/email';

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
  request: { method?: string; body?: unknown },
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
    const data = readBody(request.body) as SubscriptionIntakeData;

    if (!data.name?.trim() && !data.email?.trim() && !data.phone?.trim()) {
      return response.status(400).json({ error: 'Please provide at least a name and contact detail (email or phone).' });
    }

    const emailResults = await sendSubscriptionEmails(data);

    return response.status(200).json({
      success: true,
      message: 'Subscription logged and notification emails dispatched.',
      ownerSent: emailResults.ownerSent ?? false,
      customerSent: emailResults.customerSent ?? false,
      errors: emailResults.errors.length > 0 ? emailResults.errors : undefined,
    });
  } catch (error) {
    console.error('[api/subscribe] Error processing subscription:', error);
    return response.status(500).json({
      error: error instanceof Error ? error.message : 'Internal error processing subscription',
    });
  }
}

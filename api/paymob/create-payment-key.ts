type BillingRequest = {
  packageId?: string;
  method?: 'card' | 'cash';
  name?: string;
  email?: string;
  phone?: string;
};

const packages: Record<string, { name: string; amountCents: number }> = {
  starter: { name: 'Transformation System', amountCents: 450000 },
  elite: { name: 'Elite Coaching', amountCents: 700000 },
  'alpha-vip': { name: 'Dr. Ahmed Assem VIP Medical Mastery', amountCents: 1200000 },
  consultation: { name: '1-on-1 Strategy Consultation', amountCents: 200000 },
};

const readBody = (body: unknown): BillingRequest => {
  if (typeof body === 'string') return JSON.parse(body) as BillingRequest;
  return (body ?? {}) as BillingRequest;
};

const getJson = async (url: string, body: Record<string, unknown>) => {
  const response = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  const data = await response.json().catch(() => ({})) as Record<string, unknown>;
  if (!response.ok) throw new Error(typeof data.detail === 'string' ? data.detail : 'Paymob could not process the request.');
  return data;
};

export default async function handler(request: { method?: string; body?: unknown }, response: { setHeader: (name: string, value: string) => void; status: (code: number) => { json: (data: unknown) => void } }) {
  response.setHeader('Content-Type', 'application/json');
  if (request.method !== 'POST') return response.status(405).json({ error: 'Method not allowed.' });

  try {
    const { packageId, method = 'card', name, email, phone } = readBody(request.body);
    const selectedPackage = packageId ? packages[packageId] : undefined;
    if (!selectedPackage || !name?.trim() || !email?.trim() || !phone?.trim() || !['card', 'cash'].includes(method)) {
      return response.status(400).json({ error: 'Please provide a valid package and billing details.' });
    }

    const apiKey = process.env.PAYMOB_API_KEY;
    const cardIntegrationId = process.env.PAYMOB_CARD_INTEGRATION_ID;
    const cashIntegrationId = process.env.PAYMOB_CASH_INTEGRATION_ID;
    const authUrl = process.env.PAYMOB_AUTH_URL;
    const orderUrl = process.env.PAYMOB_ORDER_URL;
    const paymentKeyUrl = process.env.PAYMOB_PAYMENT_KEY_URL;
    const cashUrl = process.env.PAYMOB_CASH_URL;
    const iframeUrl = process.env.PAYMOB_IFRAME_URL;
    const integrationId = method === 'card' ? cardIntegrationId : cashIntegrationId;
    if (!apiKey || !integrationId || !authUrl || !orderUrl || !paymentKeyUrl || (method === 'card' && !iframeUrl) || (method === 'cash' && !cashUrl)) {
      throw new Error('Payment is not configured yet.');
    }

    const [firstName, ...lastNameParts] = name.trim().split(/\s+/);
    const lastName = lastNameParts.join(' ') || firstName;
    const auth = await getJson(authUrl, { api_key: apiKey });
    const authToken = auth.token;
    if (typeof authToken !== 'string') throw new Error('Paymob authentication failed.');

    const merchantOrderId = `AA-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
    const order = await getJson(orderUrl, { auth_token: authToken, delivery_needed: false, amount_cents: selectedPackage.amountCents, currency: 'EGP', merchant_order_id: merchantOrderId, items: [] });
    if (typeof order.id !== 'number') throw new Error('Paymob order creation failed.');

    const paymentKey = await getJson(paymentKeyUrl, {
      auth_token: authToken,
      amount_cents: selectedPackage.amountCents,
      expiration: 3600,
      order_id: order.id,
      billing_data: { apartment: 'NA', email: email.trim(), floor: 'NA', first_name: firstName, street: 'NA', building: 'NA', phone_number: phone.trim(), shipping_method: 'NA', postal_code: 'NA', city: 'NA', country: 'EG', last_name: lastName, state: 'NA' },
      currency: 'EGP',
      integration_id: Number(integrationId),
      lock_order_when_paid: true,
    });
    const token = paymentKey.token;
    if (typeof token !== 'string') throw new Error('Paymob payment initialization failed.');

    if (method === 'cash') {
      if (!cashUrl) throw new Error('Payment is not configured yet.');
      const cashPayment = await getJson(cashUrl, { source: { identifier: 'cash', subtype: 'CASH' }, payment_token: token });
      if (typeof cashPayment.redirect_url !== 'string') throw new Error('Paymob cash payment initialization failed.');
      return response.status(200).json({ paymentUrl: cashPayment.redirect_url });
    }

    return response.status(200).json({ paymentUrl: `${iframeUrl}${encodeURIComponent(token)}` });
  } catch (error) {
    console.error('Paymob checkout initialization failed', error);
    return response.status(502).json({ error: error instanceof Error ? error.message : 'Unable to start payment.' });
  }
}

import { createHmac, timingSafeEqual } from 'node:crypto';

const signedFields = [
  'amount_cents', 'created_at', 'currency', 'error_occured', 'has_parent_transaction',
  'id', 'integration_id', 'is_3d_secure', 'is_auth', 'is_capture', 'is_refunded',
  'is_standalone_payment', 'is_voided', 'order', 'owner', 'pending', 'source_data.pan',
  'source_data.sub_type', 'source_data.type', 'success',
];

export default function handler(request: any, response: any) {
  const requestUrl = new URL(request.url ?? '/', 'https://checkout.local');
  const receivedHmac = requestUrl.searchParams.get('hmac') ?? '';
  const secret = process.env.PAYMOB_HMAC_SECRET;
  const payload = signedFields.map((field) => requestUrl.searchParams.get(field) ?? '').join('');
  const computedHmac = secret ? createHmac('sha512', secret).update(payload).digest('hex') : '';
  const isValid = receivedHmac.length === computedHmac.length && receivedHmac.length > 0
    && timingSafeEqual(Buffer.from(receivedHmac), Buffer.from(computedHmac));

  if (!isValid) return response.status(400).send('Invalid payment callback.');

  const success = requestUrl.searchParams.get('success') === 'true';
  response.writeHead(302, { Location: `/payment-result?success=${success}` });
  response.end();
}

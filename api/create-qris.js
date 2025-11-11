// api/create-qris.js
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const SERVER_KEY = process.env.MIDTRANS_SERVER_KEY;
    const MERCHANT_ID = process.env.MIDTRANS_MERCHANT_ID || 'G441398097'; // fallback jika belum di-setup
    if (!SERVER_KEY) return res.status(500).json({ error: 'MIDTRANS_SERVER_KEY not configured' });

    const { amount = 10000, order_id } = req.body || {};
    const orderId = order_id || `qris-${Math.floor(Math.random()*100000)}-${Date.now()}`;

    const body = {
      payment_type: 'qris',
      transaction_details: {
        order_id: orderId,
        gross_amount: Number(amount)
      },
      // tambahkan merchant_id jika Midtrans butuh
      merchant_id: MERCHANT_ID,
      qris: {},
      customer_details: {
        first_name: 'Pembeli',
        email: 'customer@example.com'
      }
    };

    const basicAuth = 'Basic ' + Buffer.from(SERVER_KEY + ':').toString('base64');

    console.log('-> Request body to Midtrans:', JSON.stringify(body));

    const resp = await fetch('https://api.sandbox.midtrans.com/v2/charge', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': basicAuth
      },
      body: JSON.stringify(body)
    });

    const data = await resp.json();
    console.log('<- Midtrans response status:', resp.status, 'body:', JSON.stringify(data));

    // return raw response ke client (untuk debugging)
    return res.status(resp.status).json(data);
  } catch (err) {
    console.error('create-qris error:', err);
    return res.status(500).json({ error: 'internal server error', details: err.message });
  }
}
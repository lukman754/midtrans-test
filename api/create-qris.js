// api/create-qris.js
// Vercel Serverless Function (Node 18+). Uses global fetch.

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  try {
    const SERVER_KEY = process.env.MIDTRANS_SERVER_KEY;
    if (!SERVER_KEY) {
      return res.status(500).json({ error: 'MIDTRANS_SERVER_KEY not configured' });
    }

    const { amount = 10000, order_id } = req.body || {};
    const orderId = order_id || `qris-${Math.floor(Math.random()*100000)}-${Date.now()}`;

    const body = {
      payment_type: 'qris',
      transaction_details: {
        order_id: orderId,
        gross_amount: Number(amount)
      },
      // acquirer optional — Midtrans will choose default if not specified
      qris: {},
      customer_details: {
        first_name: 'Pembeli',
        email: 'customer@example.com'
      }
    };

    const basicAuth = 'Basic ' + Buffer.from(SERVER_KEY + ':').toString('base64');

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

    // Forward response to client
    return res.status(resp.status).json(data);
  } catch (err) {
    console.error('create-qris error:', err);
    return res.status(500).json({ error: 'internal server error', details: err.message });
  }
}
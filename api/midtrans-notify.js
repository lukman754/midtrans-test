// api/midtrans-notify.js
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const payload = req.body;
  console.log('midtrans notify received:', JSON.stringify(payload));

  // TODO: verifikasi signature / signature_key sesuai dokumentasi Midtrans
  // Jika valid -> update database/order status
  // balas 200 OK
  res.status(200).json({ ok: true });
}
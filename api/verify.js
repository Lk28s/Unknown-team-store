import mysql from 'mysql2/promise';

export default async function handler(req, res) {
  const { id } = req.query;

  const evopay = await fetch(
    `https://pix.evopay.cash/v1/pix?id=${id}`,
    { headers: { 'API-Key': process.env.EVOPAY_API_KEY } }
  );

  const payment = await evopay.json();

  if (payment.status !== 'CONCLUÍDA') {
    return res.json({ paid: false });
  }

  const db = await mysql.createConnection(process.env);

  const [rows] = await db.execute(
    'SELECT * FROM orders WHERE evopay_id = ? AND status = "pending"',
    [id]
  );

  if (!rows.length) return res.json({ paid: false });

  await db.execute(
    'UPDATE orders SET status="paid" WHERE evopay_id=?',
    [id]
  );

  // produto liberado AQUI
  res.json({
    paid: true,
    delivery: "https://link-do-produto-ou-texto"
  });
}

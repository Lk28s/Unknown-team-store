import mysql from 'mysql2/promise';

export default async function handler(req, res) {
  const { total } = req.body;

  const evopay = await fetch('https://pix.evopay.cash/v1/pix', {
    method: 'POST',
    headers: {
      'API-Key': process.env.EVOPAY_API_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      amount: total
    })
  });

  const data = await evopay.json();

  // salva pedido no banco
  const db = await mysql.createConnection(process.env);
  await db.execute(
    'INSERT INTO orders (evopay_id, total, status) VALUES (?, ?, ?)',
    [data.id, total, 'pending']
  );

  res.json(data);
}

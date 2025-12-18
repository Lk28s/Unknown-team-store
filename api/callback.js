import { db } from '../db.js';

export default async function handler(req, res) {
  const { id, status } = req.body;

  if (status !== 'CONCLUÍDA') return res.end();

  const [[order]] = await db.query(
    'SELECT * FROM orders WHERE evopay_id=?',
    [id]
  );

  if (!order || order.paid) return res.end();

  await db.query(
    'UPDATE orders SET paid=1 WHERE id=?',
    [order.id]
  );

  res.end();
}

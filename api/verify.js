import { db } from '../db.js';

export default async function handler(req, res) {
  const { id } = req.query;

  const evo = await fetch(
    `https://pix.evopay.cash/v1/pix?id=${id}`,
    { headers: { 'API-Key': process.env.EVOPAY_API_KEY } }
  );

  const data = await evo.json();

  if (data.status !== 'CONCLUÍDA')
    return res.json({ paid: false });

  const [[order]] = await db.query(
    'SELECT * FROM orders WHERE evopay_id=?',
    [id]
  );

  if (!order || order.paid)
    return res.json({ paid: false });

  const [[product]] = await db.query(
    'SELECT * FROM products WHERE id=?',
    [order.product_id]
  );

  await db.query(
    'UPDATE orders SET paid=1 WHERE id=?',
    [order.id]
  );

  await db.query(
    'UPDATE products SET stock=stock-1 WHERE id=?',
    [product.id]
  );

  res.json({
    paid: true,
    delivery: product.delivery
  });
    }

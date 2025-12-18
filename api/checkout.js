import { db } from '../db.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { productId } = req.body;

  const [products] = await db.query(
    'SELECT * FROM products WHERE id=? AND stock>0',
    [productId]
  );

  if (!products.length)
    return res.status(400).json({ error: 'Produto indisponível' });

  const product = products[0];

  const evo = await fetch('https://pix.evopay.cash/v1/pix', {
    method: 'POST',
    headers: {
      'API-Key': process.env.EVOPAY_API_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      amount: Number(product.price),
      callbackUrl: 'https://ninja-store.vercel.app/api/verify'
    })
  });

  const data = await evo.json();

  await db.query(
    'INSERT INTO orders (evopay_id, product_id) VALUES (?,?)',
    [data.id, product.id]
  );

  res.json(data);
}

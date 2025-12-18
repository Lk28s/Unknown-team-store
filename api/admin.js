import { db } from '../db.js';

export default async function handler(req, res) {
  if (req.headers.authorization !== process.env.ADMIN_TOKEN)
    return res.status(401).end();

  if (req.method === 'POST') {
    const { name, price, stock, delivery } = req.body;
    await db.query(
      'INSERT INTO products (name, price, stock, delivery) VALUES (?,?,?,?)',
      [name, price, stock, delivery]
    );
    res.json({ ok: true });
  }

  if (req.method === 'GET') {
    const [rows] = await db.query('SELECT * FROM products');
    res.json(rows);
  }
}

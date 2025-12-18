import mysql from 'mysql2/promise';

export default async function handler(req, res) {
  if (req.headers.authorization !== process.env.ADMIN_KEY) {
    return res.status(401).end();
  }

  const db = await mysql.createConnection(process.env);

  if (req.method === 'POST') {
    const { name, price, stock, delivery } = req.body;
    await db.execute(
      'INSERT INTO products (name, price, stock, delivery) VALUES (?,?,?,?)',
      [name, price, stock, delivery]
    );
    return res.json({ ok: true });
  }

  const [products] = await db.execute('SELECT * FROM products');
  res.json(products);
}

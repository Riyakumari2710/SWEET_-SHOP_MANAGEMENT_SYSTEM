const pool = require('./db');

exports.getAllSweets = async (req, res) => {
  const result = await pool.query('SELECT * FROM sweets');
  res.json(result.rows);
};

exports.addSweet = async (req, res) => {
  const { name, category, price, quantity } = req.body;
  const result = await pool.query(
    'INSERT INTO sweets (name, category, price, quantity) VALUES ($1,$2,$3,$4) RETURNING *',
    [name, category, price, quantity]
  );
  res.json(result.rows[0]);
};
exports.purchaseSweet = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      'UPDATE sweets SET quantity = quantity - 1 WHERE id=$1 AND quantity > 0 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Out of stock' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.restockSweet = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "UPDATE sweets SET quantity = quantity + 1 WHERE id = $1 RETURNING *",
      [id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.searchSweets = async (req, res) => {
  const { name, category, minPrice, maxPrice } = req.query;

  let query = 'SELECT * FROM sweets WHERE 1=1';
  const values = [];

  if (name) {
    values.push(`%${name}%`);
    query += ` AND name ILIKE $${values.length}`;
  }

  if (category) {
    values.push(category);
    query += ` AND category = $${values.length}`;
  }

  if (minPrice) {
    values.push(minPrice);
    query += ` AND price >= $${values.length}`;
  }

  if (maxPrice) {
    values.push(maxPrice);
    query += ` AND price <= $${values.length}`;
  }

  const result = await pool.query(query, values);
  res.json(result.rows);
};
exports.deleteSweet = async (req, res) => {
  const { id } = req.params;
  await pool.query('DELETE FROM sweets WHERE id=$1', [id]);
  res.json({ message: 'Sweet deleted' });
};



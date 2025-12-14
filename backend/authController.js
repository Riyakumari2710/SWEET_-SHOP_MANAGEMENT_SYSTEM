const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('./db'); // PostgreSQL connection

exports.register = async (req, res) => {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        const result = await pool.query(
            'INSERT INTO users (name, email, password) VALUES ($1,$2,$3) RETURNING id, name, email',
            [name, email, hashedPassword]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error("REGISTER ERROR:", err);
        res.status(500).json({ error: err.message });
    }
};
exports.login = async (req, res) => {
  const { email, password } = req.body;

  const result = await pool.query(
    "SELECT id, name, email, password, role FROM users WHERE email=$1",
    [email]
  );

  if (result.rows.length === 0) {
    return res.status(400).json({ error: "Invalid email" });
  }

  const user = result.rows[0];

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.status(400).json({ error: "Invalid password" });
  }

  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.json({
    token,
    role: user.role,
    name: user.name,
    email: user.email
  });
};


  res.json({
    token: token,
    role: user.role
  });
};


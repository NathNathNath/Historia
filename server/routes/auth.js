import express from 'express';
import User from '../models/User.js';

const router = express.Router();

// POST /api/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }
  if (user.password !== password) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }
  // For demo: return user info (never return password in production)
  res.json({ message: 'Login successful', user: { email: user.email, id: user._id, name: user.name, role: user.role } });
});

export default router;
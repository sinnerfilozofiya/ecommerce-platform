const router = require('express').Router();
const jwt    = require('jsonwebtoken');
const User   = require('../models/User');

// Register
router.post('/register', async (req,res) => {
  const { email, password } = req.body;
  const u = new User({ email, roles: ['user'] });
  await u.setPassword(password);
  await u.save();
  res.status(201).json({ message: 'Registered' });
});

// Login
router.post('/login', async (req,res) => {
  const { email, password } = req.body;
  const u = await User.findOne({ email });
  if(!u || !(await u.validatePassword(password)))
    return res.status(401).json({ error: 'Invalid credentials' });

  const token = jwt.sign(
    { sub: u._id, roles: u.roles },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
  res.json({ token });
});

module.exports = router;

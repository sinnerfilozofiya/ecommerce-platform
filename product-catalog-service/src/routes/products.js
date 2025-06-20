const router = require('express').Router();
const Product = require('../models/Product');

// GET /api/products
router.get('/', async (req, res) => {
  const items = await Product.find();
  res.json(items);
});

// POST /api/products
router.post('/', async (req, res) => {
  const p = new Product(req.body);
  await p.save();
  res.status(201).json(p);
});

module.exports = router;

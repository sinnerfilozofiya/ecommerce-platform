const auth = require('../middleware/auth');
// ...
router.post('/', auth, async (req, res) => {
  // now only authenticated users can add products
  const p = new Product(req.body);
  await p.save();
  res.status(201).json(p);
});

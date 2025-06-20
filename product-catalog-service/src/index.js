require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const productsRouter = require('./routes/products');

const app = express();
app.use(express.json());

// connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser:true, useUnifiedTopology:true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

// routes
app.use('/api/products', productsRouter);

// health‐check
app.get('/', (req,res) => res.send('Product Catalog Service is up'));

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Listening on ${port}`));

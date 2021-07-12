const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const dotEnv = require('dotenv');

const postRoutes = require('./routes/posts');
const authRoutes = require('./routes/auth');

dotEnv.config();
mongoose.connect( process.env.MONGO_URI, { useNewUrlParser: true })
  .then(() => {
    console.log("Connected to database!");
  })
  .catch(err => console.log(err));

const app = express();

app.use(bodyParser.json());
app.use('/images', express.static(path.join('images')));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-type, Accept, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  next();
});

app.use('/feeds', postRoutes);
app.use('/auth', authRoutes);



module.exports = app;

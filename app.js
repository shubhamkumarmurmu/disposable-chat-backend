const express = require('express');
const app = express();
const cors = require('cors');
const authRoutes = require('./routes/auth.route');
const chatRoutes = require('./routes/chat.route');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(require('cookie-parser')());

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.use('/', authRoutes);
app.use('/', chatRoutes);

module.exports = app;
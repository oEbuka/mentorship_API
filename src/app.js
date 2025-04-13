const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const routes = require('./routes');
const { serve, setup } = require('./config/swagger');

const app = express();

// middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// swagger API documentation
app.use('/api-docs', serve, setup);

// home route
app.get('/', (req, res) => {
  res.json({
    status: 200,
    message: 'Mentor Connect API',
    data: {
      apiDocs: '/api-docs',
    },
  });
});

// API routes
app.use('/api', routes);

// Not found middleware
app.use((req, res) => {
  res.status(404).json({
    status: 404,
    error: 'Not found',
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    status: 500,
    error: 'Something went wrong!',
  });
});

module.exports = app;
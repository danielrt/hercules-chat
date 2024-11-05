const express = require('express');
const cors = require('cors');


const bonjour = require('bonjour')();

bonjour.publish({ name: 'hercules', type: 'hercules-http', port: 3000 });

// Rotas
const indexRouter = require('./routes/index');
const herculesRouter = require('./routes/hercules');

const app = express();

app.use(express.json({ limit: '100mb', type: 'application/vnd.api+json' }));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));
app.use(cors());

app.use(indexRouter);
app.use(herculesRouter);

module.exports = app;
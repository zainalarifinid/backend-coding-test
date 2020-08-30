'use strict';

const express = require('express');
const app = express();
const port = 8010;

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

const buildSchemas = require('./src/schemas');

db.serialize(() => {
    buildSchemas(db);

    const app = require('./src/app')(db);
    app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    app.listen(port, () => console.log(`App started and listening on port ${port}`));
});
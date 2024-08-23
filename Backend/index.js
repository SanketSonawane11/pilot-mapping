const express = require('express');
const app = express();
const pilotRouter = require('./routes/pilot');
const connectDb = require('./Db');
require('dotenv').config();

const port = process.env.PORT;

app.use(express.json());

app.use('/api/v1', pilotRouter);

app.listen(port, () => {
    connectDb();
    console.log(`Server live on http://localhost:${port}`);
});
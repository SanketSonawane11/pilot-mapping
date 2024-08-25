const express = require('express');
const app = express();
const pilotRouter = require('./routes/pilot');
const connectDb = require('./Db');
require('dotenv').config();
const cors = require('cors');

const corsOptions = {
    origin: 'https://pilot-mapping.vercel.app',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));


const port = process.env.PORT || 4000;

app.use(express.json());

app.use('/api/v1', pilotRouter);

app.listen(port, () => {
    connectDb();
    console.log(`Server live on http://localhost:${port}`);
});
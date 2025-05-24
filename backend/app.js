require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const taskRoutes = require('./routes/tasks');
const { SNSClient } = require('@aws-sdk/client-sns');

const sns = new SNSClient({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

const TOPIC_ARN = process.env.SNS_TOPIC_ARN;


app.use(cors()); // 👈 This allows all origins by default

app.use(express.json());
app.use('/tasks', taskRoutes);

app.listen(5000, () => console.log('Server running on port 5000'));










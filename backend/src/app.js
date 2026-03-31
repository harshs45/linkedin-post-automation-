require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const postRoutes = require('./routes/postRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/posts', postRoutes);

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'test') {
    connectDB().then(() => {
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    });
}

module.exports = app;

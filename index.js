const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const connectDB = require('./config/db');
require('dotenv').config();

const PORT = process.env.PORT || 3000;

// if (process.env.NODE_ENV !== 'production') {
// }

const app = express();

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.json({
        status: 'ok',
        message: 'Server is running',
        timestamp: new Date().toISOString(),
    });
});
app.use("/api/v1", routes)
app.use((req, res) => {
    res.status(404).json({
        error: 'Not Found',
        path: req.path
    });
});


app.listen(PORT, async () => {
    try {
        await connectDB();
        console.log('Database connected');
        console.log(`Server running on http://localhost:${PORT}`);
    } catch (error) {
        console.error('Database connection failed:', error.message);
    }

});

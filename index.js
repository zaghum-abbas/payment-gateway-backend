const express = require('express');
const cors = require('cors');

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const app = express();

app.use(express.json());
app.use(cors());

app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        message: 'Server is running',
        timestamp: new Date().toISOString(),
        environment: {
            nodeEnv: process.env.NODE_ENV || 'development',
            hasMongoUri: !!process.env.MONGO_URI,
            hasStripeKey: !!process.env.STRIPE_SECRET_KEY,
            hasStripePublishableKey: !!process.env.STRIPE_PUBLISHABLE_KEY
        }
    });
});

app.get('/', (req, res) => {
    res.json({
        message: 'Payment Gateway API',
        status: 'success',
        version: '1.0.0',
        timestamp: new Date().toISOString()
    });
});

let routes, connectDB;

try {
    connectDB = require('./config/db');
    routes = require('./routes');
} catch (error) {
    console.error('Error loading modules:', error);
}

if (connectDB) {
    app.use('/api', async (req, res, next) => {
        try {
            await connectDB();
            next();
        } catch (err) {
            console.error('DB connection error:', err);
            res.status(500).json({
                error: 'Database connection failed',
                message: err.message
            });
        }
    });
}

if (routes) {
    app.use('/api/v1', routes);
} else {
    app.use('/api/v1', (req, res) => {
        res.status(500).json({
            error: 'Routes not loaded',
            message: 'Server configuration error'
        });
    });
}

app.use((req, res) => {
    res.status(404).json({
        error: 'Not Found',
        path: req.path
    });
});

app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({
        error: 'Internal Server Error',
        message: err.message
    });
});

module.exports = app;

if (require.main === module) {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, async () => {
        if (connectDB) {
            try {
                await connectDB();
                console.log('Database connected');
            } catch (error) {
                console.error('Database connection failed:', error.message);
            }
        }
        console.log(`Server running on http://localhost:${PORT}`);
    });
}

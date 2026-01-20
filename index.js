// const express = require('express');
// const app = express();
// require('dotenv').config();
// const connectDB = require('./config/db');
// const routes = require('./routes');
// const cors = require('cors');

// app.use(express.json());
// app.use(cors());

// // Middleware to ensure DB connection for each request in serverless
// app.use(async (req, res, next) => {
//     try {
//         await connectDB();
//         next();
//     } catch (error) {
//         console.error('Database connection failed:', error);
//         res.status(500).json({
//             error: 'Database connection failed',
//             message: error.message
//         });
//     }
// });

// app.get('/', (req, res) => {
//     res.json({
//         message: 'Payment Gateway API',
//         status: 'success',
//         timestamp: new Date().toISOString()
//     });
// });

// app.get('/health', (req, res) => {
//     res.json({
//         message: 'Server is running',
//         status: 'success',
//         timestamp: new Date().toISOString(),
//         environment: {
//             nodeEnv: process.env.NODE_ENV || 'development',
//             hasMongoUri: !!process.env.MONGO_URI,
//             hasStripeKey: !!process.env.STRIPE_SECRET_KEY,
//             mongoConnectionState: require('mongoose').connection.readyState
//         }
//     });
// });

// app.use('/api/v1', routes);

// // Export the Express app for Vercel
// module.exports = app;

// // Local development server
// if (process.env.NODE_ENV !== 'production') {
//     const PORT = process.env.PORT || 3000;
//     app.listen(PORT, async () => {
//         await connectDB();
//         console.log(`Local Server running on http://localhost:${PORT}`);
//     });
// }




const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const connectDB = require('./config/db');

const app = express();

app.use(express.json());
app.use(cors());

// 🔥 Connect DB ONCE (serverless-safe)
let isConnected = false;
async function ensureDB() {
    if (!isConnected) {
        await connectDB();
        isConnected = true;
        console.log('MongoDB connected');
    }
}

app.use(async (req, res, next) => {
    try {
        await ensureDB();
        next();
    } catch (err) {
        console.error('DB error:', err);
        res.status(500).json({ error: 'Database connection failed' });
    }
});

app.get('/', (req, res) => {
    res.json({
        message: 'Payment Gateway API',
        status: 'success'
    });
});

app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        env: {
            hasMongoUri: !!process.env.MONGO_URI,
            hasStripeKey: !!process.env.STRIPE_SECRET_KEY,
            mongoState: require('mongoose').connection.readyState
        }
    });
});

app.use('/api/v1', routes);

// ✅ Export app for Vercel
module.exports = app;

// ✅ Local only
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Local server running on http://localhost:${PORT}`);
    });
}

// const express = require('express');
// const app = express();
// require('dotenv').config();
// const connectDB = require('./config/db');
// const routes = require('./routes');
// const PORT = process.env.PORT || 3000;
// const cors = require('cors');


// app.use(express.json());

// app.use(cors());

// app.get('/health', (req, res) => {
//     res.json({ message: 'Server is running',
//         status: 'success',
//         timestamp: new Date().toISOString()
//      });
// });

// app.use('/api/v1', routes);

// app.listen(PORT, async() => {
//     await connectDB();
//     console.log(`Server is running on port ${PORT}`);
// });



const express = require('express');
const app = express();
require('dotenv').config();
const connectDB = require('./config/db');
const routes = require('./routes');
const cors = require('cors');

// 1. Move DB connection outside the listen block
// This ensures the connection is ready for serverless requests
connectDB();

app.use(express.json());
app.use(cors());

app.get('/health', (req, res) => {
    res.json({
        message: 'Server is running',
        status: 'success',
        timestamp: new Date().toISOString()
    });
});

app.use('/api/v1', routes);

// 2. IMPORTANT: Remove app.listen and export the app
// Vercel will handle the "listening" part automatically
module.exports = app;

// This handles the local server
if (process.env.NODE_ENV !== 'production') {
    app.listen(process.env.PORT, async () => {
        await connectDB();
        console.log(`Local Server running on http://localhost:${process.env.PORT}`);
    });
}
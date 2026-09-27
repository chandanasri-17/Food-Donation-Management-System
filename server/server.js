const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Load environment variables
dotenv.config();

// Connect to MongoDB Atlas / Database
connectDB();

const app = express();

// Middlewares
app.use(
  cors({
    origin: '*',
    credentials: true,
  })
);
app.use(express.json());

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// API Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    timestamp: new Date().toISOString(),
    message: 'Food Donation Management System API is running smoothly',
  });
});

// Mount Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/donations', require('./routes/donationRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));

const path = require('path');
const fs = require('fs');

// Production / Static File Handling
const clientDistPath = path.join(__dirname, '../client/dist');
const clientIndexHtml = path.join(clientDistPath, 'index.html');

if (fs.existsSync(clientIndexHtml)) {
  // Serve built frontend if dist directory exists
  app.use(express.static(clientDistPath));
  app.get('*', (req, res) => {
    res.sendFile(clientIndexHtml);
  });
} else {
  // Standalone API Mode (e.g. Render backend with frontend on Vercel)
  app.get('/', (req, res) => {
    res.status(200).json({
      status: 'online',
      message: 'Food Donation Management System API',
    });
  });

  // 404 handler for undefined routes
  app.use('*', (req, res) => {
    res.status(404).json({
      success: false,
      message: `API Route ${req.originalUrl} not found.`,
    });
  });
}

// Centralized Error Handling Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`🚀 Food Donation Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`Unhandled Rejection: ${err.message}`);
});

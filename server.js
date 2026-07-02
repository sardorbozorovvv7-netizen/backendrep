const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

// Parse .env file without external library
try {
  const envPath = path.join(__dirname, '.env');
  if (fs.existsSync(envPath)) {
    const env = fs.readFileSync(envPath, 'utf8');
    env.split('\n').forEach(line => {
      const parts = line.split('=');
      if (parts.length >= 2) {
        const key = parts[0].trim();
        const value = parts.slice(1).join('=').trim();
        if (key && !key.startsWith('#') && process.env[key] === undefined) {
          process.env[key] = value;
        }
      }
    });
  }
} catch (e) {
  console.error('Error reading .env file:', e);
}

const { sequelize } = require('./models');
const seedDatabase = require('./seed');
const apiRouter = require('./routes/api');

const app = express();
const DEFAULT_PORT = 10000;
const ENV_PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : undefined;
const PORT = Number.isNaN(ENV_PORT) ? DEFAULT_PORT : ENV_PORT || DEFAULT_PORT;

// Allow all origins - needed for mobile browsers and various frontend deployments
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());

// Simple logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Mount modular API router
app.use('/api', apiRouter);

// Initialize database, seed it, and start listening
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully.');

    // Seed database automatically for the demo
    await seedDatabase();

    const server = app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });

    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use. On Render, remove any hardcoded PORT value from .env or use process.env.PORT.`);
        process.exit(1);
      }
      console.error('Server error:', err);
      process.exit(1);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
};

startServer();

// Keep Render.com free tier alive by pinging every 14 minutes
if (process.env.NODE_ENV !== 'test') {
  const BACKEND_URL = process.env.BACKEND_URL || 'https://backendrep-9gdr.onrender.com/api/products';
  setInterval(async () => {
    try {
      const res = await fetch(BACKEND_URL);
      console.log(`[Keep-alive] Ping ${res.status} - ${new Date().toISOString()}`);
    } catch (e) {
      console.warn('[Keep-alive] Ping failed:', e.message || e);
    }
  }, 14 * 60 * 1000); // every 14 minutes
}

// Backend keeps-alive ping utility
// Render free tier shuts down after 15 min inactivity
// This pings the backend every 14 minutes to keep it alive

const BACKEND_URL = 'https://backendrep-9gdr.onrender.com/api/products';
const PING_INTERVAL = 14 * 60 * 1000; // 14 minutes in milliseconds

const pingBackend = async () => {
  try {
    const start = Date.now();
    const response = await fetch(BACKEND_URL);
    const elapsed = Date.now() - start;
    if (response.ok) {
      console.log(`[Keep-alive] Backend pinged successfully in ${elapsed}ms - ${new Date().toISOString()}`);
    } else {
      console.warn(`[Keep-alive] Backend ping returned ${response.status} - ${new Date().toISOString()}`);
    }
  } catch (err) {
    console.error(`[Keep-alive] Backend ping failed: ${err.message} - ${new Date().toISOString()}`);
  }
};

// Ping immediately on start, then every 14 minutes
pingBackend();
setInterval(pingBackend, PING_INTERVAL);

module.exports = { pingBackend };

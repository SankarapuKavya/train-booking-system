require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./config/db');

const app = express();
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

app.get('/api/health', async (_req, res) => {
  try {
    await db.query('SELECT 1');
    res.json({ status: 'ok', database: 'connected' });
  } catch {
    res.status(500).json({ status: 'error', database: 'disconnected' });
  }
});

app.use('/api/trains', require('./routes/trainRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));

const port = process.env.PORT || 5000;
async function start() {
  try {
    await db.query('SELECT 1');
    app.listen(port, () => console.log(`Train Booking API running at http://localhost:${port}`));
  } catch (error) {
    console.error('MySQL connection failed:', error.message);
    process.exit(1);
  }
}
start();

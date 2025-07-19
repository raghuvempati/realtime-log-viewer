const express = require('express');
const cors = require('cors');
const path = require('path');
const logController = require('./controllers/logController');
const logGenerator = require('./services/logGenerator');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/logs', logController);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Start log generator daemon
logGenerator.startLogGeneration();

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Log stream available at http://localhost:${PORT}/api/logs/stream`);
});

process.on('SIGINT', () => {
  console.log('\n🛑 Stopping log generation...');
  logGenerator.stopLogGeneration();
  process.exit(0);
});

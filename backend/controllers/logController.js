const express = require('express');
const logReader = require('../services/logReader');

const router = express.Router();

// Server-Sent Events endpoint
router.get('/stream', (req, res) => {
  // Set headers for SSE
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Cache-Control');

  console.log('📡 New client connected to log stream');

  // Send initial connection message
  res.write(`data: ${JSON.stringify({
    type: 'connection',
    message: 'Connected to log stream',
    timestamp: new Date().toISOString()
  })}\n\n`);

  // Start watching logs and send updates
  const cleanup = logReader.watchLogs((logEntry) => {
    try {
      res.write(`data: ${JSON.stringify(logEntry)}\n\n`);
    } catch (error) {
      console.error('Error sending log entry:', error);
    }
  });

  // Handle client disconnect
  req.on('close', () => {
    console.log('📴 Client disconnected from log stream');
    cleanup();
  });

  req.on('error', (err) => {
    console.error('SSE connection error:', err);
    cleanup();
  });
});

// Get recent logs
router.get('/recent', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 100;
    const logs = await logReader.getRecentLogs(limit);
    res.json(logs);
  } catch (error) {
    console.error('Error fetching recent logs:', error);
    res.status(500).json({ error: 'Failed to fetch logs' });
  }
});

module.exports = router;

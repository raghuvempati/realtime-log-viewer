const fs = require('fs');
const path = require('path');
const winston = require('winston');

const LOG_FILE = path.join(__dirname, '../logs/application.log');
let logInterval;

// Ensure logs directory exists
const logsDir = path.dirname(LOG_FILE);
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Configure Winston logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: LOG_FILE })
  ],
});

// Sample log messages for different log levels
const LOG_MESSAGES = {
  info: [
    'User authentication successful',
    'Database connection established',
    'API request processed successfully',
    'Cache invalidated for user session',
    'Background job completed',
    'Configuration reloaded',
    'Health check passed',
    'Email notification sent'
  ],
  warn: [
    'High memory usage detected',
    'Slow database query detected',
    'Rate limit approaching for API key',
    'Deprecated API endpoint accessed',
    'Cache miss ratio above threshold',
    'Connection pool near capacity'
  ],
  error: [
    'Database connection timeout',
    'Failed to process payment',
    'Authentication token expired',
    'External API service unavailable',
    'File upload failed',
    'Invalid request parameters'
  ],
  debug: [
    'Processing user request with ID',
    'SQL query executed',
    'Cache lookup performed',
    'Validation rules applied',
    'Session data retrieved',
    'Middleware executed'
  ]
};

const LOG_LEVELS = ['info', 'warn', 'error', 'debug'];

function generateRandomLog() {
  const level = LOG_LEVELS[Math.floor(Math.random() * LOG_LEVELS.length)];
  const messages = LOG_MESSAGES[level];
  const message = messages[Math.floor(Math.random() * messages.length)];
  
  const logEntry = {
    level,
    message,
    timestamp: new Date().toISOString(),
    service: 'sample-app',
    userId: Math.floor(Math.random() * 1000),
    requestId: `req-${Math.random().toString(36).substr(2, 9)}`,
    metadata: {
      host: 'server-01',
      version: '1.0.0',
      environment: 'production'
    }
  };

  logger.log(level, message, logEntry);
}

function startLogGeneration() {
  console.log('🔄 Starting log generation daemon...');
  
  // Generate initial log
  generateRandomLog();
  
  // Generate logs at random intervals (1-5 seconds)
  function scheduleNextLog() {
    const delay = Math.random() * 4000 + 1000; // 1-5 seconds
    logInterval = setTimeout(() => {
      generateRandomLog();
      scheduleNextLog();
    }, delay);
  }
  
  scheduleNextLog();
}

function stopLogGeneration() {
  if (logInterval) {
    clearTimeout(logInterval);
    console.log('⏹️ Log generation stopped');
  }
}

module.exports = {
  startLogGeneration,
  stopLogGeneration
};

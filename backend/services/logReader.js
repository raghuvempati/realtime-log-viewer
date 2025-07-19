const fs = require('fs');
const path = require('path');

const LOG_FILE = path.join(__dirname, '../logs/application.log');

class LogReader {
  constructor() {
    this.watchers = new Set();
    this.lastPosition = 0;
    this.watchFileChanges();
  }

  watchFileChanges() {
    if (!fs.existsSync(LOG_FILE)) {
      // Create empty log file if it doesn't exist
      fs.writeFileSync(LOG_FILE, '');
    }

    // Get initial file size
    this.lastPosition = fs.statSync(LOG_FILE).size;

    // Watch for file changes
    fs.watchFile(LOG_FILE, { interval: 100 }, (curr, prev) => {
      if (curr.size > this.lastPosition) {
        this.readNewLogs();
      }
    });
  }

  readNewLogs() {
    try {
      const stream = fs.createReadStream(LOG_FILE, {
        start: this.lastPosition,
        encoding: 'utf8'
      });

      let buffer = '';

      stream.on('data', (chunk) => {
        buffer += chunk;
        const lines = buffer.split('\n');
        buffer = lines.pop(); // Keep incomplete line in buffer

        lines.forEach(line => {
          if (line.trim()) {
            try {
              const logEntry = JSON.parse(line);
              this.notifyWatchers(logEntry);
            } catch (error) {
              console.error('Error parsing log line:', error);
            }
          }
        });
      });

      stream.on('end', () => {
        this.lastPosition = fs.statSync(LOG_FILE).size;
      });

    } catch (error) {
      console.error('Error reading log file:', error);
    }
  }

  watchLogs(callback) {
    this.watchers.add(callback);
    
    // Return cleanup function
    return () => {
      this.watchers.delete(callback);
    };
  }

  notifyWatchers(logEntry) {
    this.watchers.forEach(callback => {
      try {
        callback(logEntry);
      } catch (error) {
        console.error('Error in log watcher callback:', error);
      }
    });
  }

  async getRecentLogs(limit = 100) {
    try {
      if (!fs.existsSync(LOG_FILE)) {
        return [];
      }

      const content = fs.readFileSync(LOG_FILE, 'utf8');
      const lines = content.trim().split('\n').filter(line => line.trim());
      
      const logs = lines
        .slice(-limit)
        .map(line => {
          try {
            return JSON.parse(line);
          } catch (error) {
            return null;
          }
        })
        .filter(log => log !== null);

      return logs;
    } catch (error) {
      console.error('Error reading recent logs:', error);
      return [];
    }
  }
}

// Export an instance of the LogReader class
module.exports = new LogReader();

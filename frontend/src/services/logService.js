class LogService {
  constructor() {
    this.eventSource = null;
    this.baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001';
  }

  connect(onMessage, onConnect, onDisconnect, onError) {
    if (this.eventSource) {
      this.disconnect();
    }

    try {
      this.eventSource = new EventSource(`${this.baseUrl}/api/logs/stream`);

      this.eventSource.onopen = (event) => {
        console.log('Connected to log stream');
        onConnect && onConnect();
      };

      this.eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type !== 'connection') {
            onMessage && onMessage(data);
          }
        } catch (error) {
          console.error('Error parsing SSE message:', error);
          onError && onError(error);
        }
      };

      this.eventSource.onerror = (event) => {
        console.error('SSE connection error:', event);
        onDisconnect && onDisconnect();
        onError && onError(event);
        
        // Attempt to reconnect after 5 seconds
        setTimeout(() => {
          if (this.eventSource?.readyState === EventSource.CLOSED) {
            console.log('Attempting to reconnect...');
            this.connect(onMessage, onConnect, onDisconnect, onError);
          }
        }, 5000);
      };

    } catch (error) {
      console.error('Failed to create EventSource:', error);
      onError && onError(error);
    }
  }

  disconnect() {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
      console.log('Disconnected from log stream');
    }
  }

  async getRecentLogs(limit = 100) {
    try {
      const response = await fetch(`${this.baseUrl}/api/logs/recent?limit=${limit}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch recent logs:', error);
      throw error;
    }
  }
}

export default new LogService();

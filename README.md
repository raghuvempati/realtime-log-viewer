# Real-time Log Viewer

A modern, real-time log viewing application built with React, PatternFly components, and Node.js. Features Server-Sent Events for live log streaming, beautiful UI with filtering capabilities, and a log generation daemon for demonstration.

![Real-time Log Viewer](https://img.shields.io/badge/React-18.2.0-blue) ![Node.js](https://img.shields.io/badge/Node.js-18+-green) ![PatternFly](https://img.shields.io/badge/PatternFly-5.0-red)

## 🌟 Features

- **Real-time Log Streaming**: Live log updates using Server-Sent Events (SSE)
- **Beautiful UI**: Built with PatternFly design system components
- **Advanced Filtering**: Filter logs by level (Info, Warning, Error, Debug)
- **Live Statistics**: Real-time counters for different log levels
- **Pause/Resume**: Control log streaming without losing connection
- **Responsive Design**: Works perfectly on desktop and mobile devices
- **Log Generation Daemon**: Built-in log generator for testing and demonstration
- **Connection Status**: Visual indicators for connection state
- **Performance Optimized**: Handles thousands of log entries efficiently

## 🏗️ Architecture

To be updated


### Components:

1. **Frontend (React + PatternFly)**:
   - Real-time log display with PatternFly LogViewer
   - Dashboard with statistics and controls
   - Connection status monitoring
   - Log level filtering

2. **Backend (Node.js + Express)**:
   - RESTful API for log management
   - Server-Sent Events for real-time streaming
   - File watching for new log entries
   - CORS enabled for cross-origin requests

3. **Log Generation Daemon**:
   - Simulates real application logs
   - Generates logs at random intervals
   - Multiple log levels (Info, Warning, Error, Debug)
   - Realistic log messages and metadata

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Git

### Installation

1. **Clone the repository**:
git clone https://github.com/raghuvempati/realtime-log-viewer.git
cd realtime-log-viewer

2. **Install all dependencies**:
npm run install:all


3. **Start the application**:

**Option 1: Development mode (recommended)**
npm run dev

This starts both backend and frontend concurrently.

**Option 2: Start services separately**
Terminal 1: Start backend
npm run start:backend

Terminal 2: Start frontend
npm run start:frontend


4. **Access the application**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001
   - Log Stream: http://localhost:3001/api/logs/stream

## 📖 Usage Guide

### Dashboard Overview

The main dashboard provides:

- **Connection Status**: Green indicator when connected to log stream
- **Statistics Cards**: Real-time counters for total logs and each log level
- **Control Toolbar**: 
  - Pause/Resume streaming
  - Clear logs
  - Filter by log level
- **Log Viewer**: PatternFly LogViewer component with syntax highlighting

### API Endpoints

- `GET /api/logs/stream` - Server-Sent Events endpoint for real-time logs
- `GET /api/logs/recent?limit=100` - Fetch recent log entries
- `GET /health` - Health check endpoint

### Log Format

<pre>
{
    “level”: “info”,
    “message”: “User authentication successful”,
    “timestamp”: “2025-07-18T17:48:00.000Z”,
    “service”: “sample-app”,
    “userId”: 123,
    “requestId”: “req-abc123def”,
    “metadata”: {
        “host”: “server-01”,
        “version”: “1.0.0”,
        “environment”: “production”
    }
}
</pre>

## 🛠️ Development

### Project Structure

<pre>
realtime-log-viewer/
├── backend/                 # Node.js backend application
│   ├── controllers/        # Route controllers
│   ├── services/          # Business logic services
│   ├── logs/              # Generated log files
│   └── server.js          # Express server setup
├── frontend/              # React frontend application
│   ├── src/│   
│   ├── components/    # React components│   
│   ├── services/      # API services│   
│   └── App.js         # Main application component
│   └── public/            # Static assets
├── package.json           # Root package configuration
└── README.md             # This file
</pre>

### Available Scripts

Install dependencies for all packages
npm run install:all

Start backend in development mode (with nodemon)
npm run dev:backend

Start frontend development server
npm run start:frontend

Start both frontend and backend concurrently
npm run dev

Build frontend for production
npm run build


### Environment Variables

Create `.env` files in respective directories:

**backend/.env**:
PORT=3001
NODE_ENV=development
LOG_LEVEL=debug

**frontend/.env**:
REACT_APP_API_URL=http://localhost:3001


## 🧪 Testing the Application

1. **Start the application** using `npm run dev`
2. **Open your browser** to http://localhost:3000
3. **Observe real-time logs** being generated and displayed
4. **Test filtering** by selecting different log levels
5. **Try pausing/resuming** the stream
6. **Clear logs** and watch them repopulate

### Log Generation

The application includes a built-in log generator that:
- Generates logs every 1-5 seconds
- Creates realistic log messages for different scenarios
- Includes proper metadata and request IDs
- Simulates different log levels appropriately

## 📦 Deployment

### Building for Production

Build frontend - npm run build

The build files will be in frontend/build/

Serve these files with your preferred web server


### Docker Deployment (Optional)

Create `Dockerfile` in the root directory:

Backend Dockerfile


FROM node:18-alpine
WORKDIR /app
COPY backend/package*.json ./
RUN npm install –production
COPY backend/ .
EXPOSE 3001
CMD “npm”, “start”


### Environment Configuration

For production deployment:

1. Set appropriate environment variables
2. Configure CORS origins for your domain
3. Set up proper logging levels
4. Consider using a process manager like PM2

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and commit: `git commit -am 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔧 Troubleshooting

### Common Issues

1. **Port already in use**:

Find and kill process using port 3001
lsof -ti:3001 | xargs kill -9

2. **CORS errors**:
- Ensure backend is running on port 3001
- Check REACT_APP_API_URL environment variable

3. **SSE connection issues**:
- Check browser network tab for 500 errors
- Verify log file permissions
- Ensure backend logs directory exists

4. **No logs appearing**:
- Check if log generation daemon is running
- Verify log file is being written to
- Check browser console for JavaScript errors

### Debug Mode

Enable debug logging by setting:

NODE_ENV=development
LOG_LEVEL=debug


## 🙏 Acknowledgments

- [PatternFly](https://www.patternfly.org/) for the amazing design system
- [React](https://reactjs.org/) for the frontend framework
- [Express.js](https://expressjs.com/) for the backend framework
- [Winston](https://github.com/winstonjs/winston) for logging utilities

---

**Happy Logging! 📊✨**

import React, { useState, useEffect } from 'react';
import {
  PageSection,
  Title,
  Card,
  CardBody,
  Grid,
  GridItem,
  Badge,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
  Button,
  Select,
  SelectOption,
  SelectList,
  MenuToggle,
  TextContent,
  Text,
  Alert
} from '@patternfly/react-core';
import { PlayIcon, PauseIcon, TrashIcon } from '@patternfly/react-icons';
import LogViewer from './LogViewer';
import logService from '../services/logService';

const Dashboard = () => {
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    info: 0,
    warn: 0,
    error: 0,
    debug: 0
  });
  const [levelFilter, setLevelFilter] = useState('all');
  const [isLevelSelectOpen, setIsLevelSelectOpen] = useState(false);

  useEffect(() => {
    // Connect to log stream
    logService.connect(
      (logEntry) => {
        if (!isPaused) {
          setLogs(prevLogs => {
            const newLogs = [...prevLogs, logEntry];
            // Keep only last 1000 logs for performance
            return newLogs.slice(-1000);
          });
        }
      },
      () => setIsConnected(true),
      () => setIsConnected(false),
      (error) => console.error('Log service error:', error)
    );

    // Load initial logs
    loadRecentLogs();

    // Cleanup on unmount
    return () => {
      logService.disconnect();
    };
  }, [isPaused]);

  useEffect(() => {
    // Update stats when logs change
    const newStats = logs.reduce((acc, log) => {
      acc.total++;
      acc[log.level] = (acc[log.level] || 0) + 1;
      return acc;
    }, { total: 0, info: 0, warn: 0, error: 0, debug: 0 });
    setStats(newStats);

    // Apply level filter
    const filtered = levelFilter === 'all' 
      ? logs 
      : logs.filter(log => log.level === levelFilter);
    setFilteredLogs(filtered);
  }, [logs, levelFilter]);

  const loadRecentLogs = async () => {
    try {
      const recentLogs = await logService.getRecentLogs(100);
      setLogs(recentLogs);
    } catch (error) {
      console.error('Failed to load recent logs:', error);
    }
  };

  const handlePause = () => {
    setIsPaused(!isPaused);
  };

  const handleClear = () => {
    setLogs([]);
  };

  const handleLevelFilterSelect = (event, value) => {
    setLevelFilter(value);
    setIsLevelSelectOpen(false);
  };

  const levelOptions = [
    { value: 'all', label: 'All Levels' },
    { value: 'info', label: 'Info' },
    { value: 'warn', label: 'Warning' },
    { value: 'error', label: 'Error' },
    { value: 'debug', label: 'Debug' }
  ];

  return (
    <>
      <PageSection variant="light">
        <Title headingLevel="h1" size="2xl">
          Real-time Log Viewer
        </Title>
        <TextContent>
          <Text component="p">
            Monitor application logs in real-time with advanced filtering and search capabilities.
          </Text>
        </TextContent>
      </PageSection>

      <PageSection>
        {/* Connection Status */}
        <div className="connection-status">
          <Alert
            variant={isConnected ? 'success' : 'danger'}
            isInline
            title={
              <div className="connection-indicator">
                <span className={`connection-dot ${!isConnected ? 'disconnected' : ''}`}></span>
                {isConnected ? 'Connected to log stream' : 'Disconnected from log stream'}
              </div>
            }
          />
        </div>

        {/* Stats Cards */}
        <Grid hasGutter className="stats-cards">
          <GridItem span={2}>
            <Card>
              <CardBody>
                <Title headingLevel="h3" size="lg">{stats.total}</Title>
                <Text>Total Logs</Text>
              </CardBody>
            </Card>
          </GridItem>
          <GridItem span={2}>
            <Card>
              <CardBody>
                <Title headingLevel="h3" size="lg" className="log-level-info">
                  {stats.info}
                </Title>
                <Text>Info</Text>
              </CardBody>
            </Card>
          </GridItem>
          <GridItem span={2}>
            <Card>
              <CardBody>
                <Title headingLevel="h3" size="lg" className="log-level-warn">
                  {stats.warn}
                </Title>
                <Text>Warnings</Text>
              </CardBody>
            </Card>
          </GridItem>
          <GridItem span={2}>
            <Card>
              <CardBody>
                <Title headingLevel="h3" size="lg" className="log-level-error">
                  {stats.error}
                </Title>
                <Text>Errors</Text>
              </CardBody>
            </Card>
          </GridItem>
          <GridItem span={2}>
            <Card>
              <CardBody>
                <Title headingLevel="h3" size="lg" className="log-level-debug">
                  {stats.debug}
                </Title>
                <Text>Debug</Text>
              </CardBody>
            </Card>
          </GridItem>
          <GridItem span={2}>
            <Card>
              <CardBody>
                <Title headingLevel="h3" size="lg">
                  <Badge variant="outline">{isPaused ? 'Paused' : 'Live'}</Badge>
                </Title>
                <Text>Status</Text>
              </CardBody>
            </Card>
          </GridItem>
        </Grid>

        {/* Toolbar */}
        <Toolbar className="toolbar-section">
          <ToolbarContent>
            <ToolbarItem>
              <Button
                variant={isPaused ? 'primary' : 'secondary'}
                icon={isPaused ? <PlayIcon /> : <PauseIcon />}
                onClick={handlePause}
              >
                {isPaused ? 'Resume' : 'Pause'}
              </Button>
            </ToolbarItem>
            <ToolbarItem>
              <Button
                variant="danger"
                icon={<TrashIcon />}
                onClick={handleClear}
              >
                Clear Logs
              </Button>
            </ToolbarItem>
            <ToolbarItem>
              <Select
                isOpen={isLevelSelectOpen}
                selected={levelFilter}
                onSelect={handleLevelFilterSelect}
                onOpenChange={(isOpen) => setIsLevelSelectOpen(isOpen)}
                toggle={(toggleRef) => (
                  <MenuToggle
                    ref={toggleRef}
                    onClick={() => setIsLevelSelectOpen(!isLevelSelectOpen)}
                    isExpanded={isLevelSelectOpen}
                    style={{ width: '200px' }}
                  >
                    {levelOptions.find(option => option.value === levelFilter)?.label}
                  </MenuToggle>
                )}
              >
                <SelectList>
                  {levelOptions.map((option) => (
                    <SelectOption key={option.value} value={option.value}>
                      {option.label}
                    </SelectOption>
                  ))}
                </SelectList>
              </Select>
            </ToolbarItem>
            <ToolbarItem alignment={{ default: 'alignRight' }}>
              <Text>
                Showing {filteredLogs.length} of {logs.length} logs
              </Text>
            </ToolbarItem>
          </ToolbarContent>
        </Toolbar>

        {/* Log Viewer */}
        <Card>
          <CardBody className="log-viewer-container">
            <LogViewer logs={filteredLogs} />
          </CardBody>
        </Card>
      </PageSection>
    </>
  );
};

export default Dashboard;

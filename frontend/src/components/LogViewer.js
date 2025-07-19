import React, { useMemo } from 'react';
import { LogViewer as PFLogViewer } from '@patternfly/react-log-viewer';

const LogViewer = ({ logs }) => {
  const logData = useMemo(() => {
    return logs.map(log => {
      const timestamp = new Date(log.timestamp).toLocaleTimeString();
      const level = log.level.toUpperCase().padEnd(5);
      const service = log.service || 'unknown';
      const requestId = log.requestId || '';
      
      return `[${timestamp}] ${level} [${service}] ${requestId} - ${log.message}`;
    }).join('\n');
  }, [logs]);

  return (
    <PFLogViewer
      data={logData}
      isTextWrapped={true}
      height={500}
      theme="dark"
      hasLineNumbers={true}
      scrollToRow={logs.length}
    />
  );
};

export default LogViewer;

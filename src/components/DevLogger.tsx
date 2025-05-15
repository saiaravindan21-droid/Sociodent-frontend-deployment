import React from 'react';

interface DevLoggerProps {
  info?: any;
  error?: Error | null;
}

const DevLogger: React.FC<DevLoggerProps> = ({ info, error }) => {
  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 p-4 bg-gray-800 text-white rounded-lg opacity-90 max-w-md overflow-auto max-h-[300px]">
      <h3 className="text-lg font-bold mb-2">Dev Info</h3>
      {error && (
        <div className="mb-2">
          <h4 className="text-red-400">Error:</h4>
          <pre className="text-sm">{error.message}</pre>
          <pre className="text-xs text-gray-400">{error.stack}</pre>
        </div>
      )}
      {info && (
        <div>
          <h4 className="text-blue-400">Info:</h4>
          <pre className="text-sm">{JSON.stringify(info, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default DevLogger;

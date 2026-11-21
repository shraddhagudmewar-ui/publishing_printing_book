import React from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';
import Button from './Button';

const ErrorDisplay = ({
  title = 'Something went wrong',
  message = 'An unexpected error occurred while communicating with the publications archive.',
  onRetry,
}) => {
  return (
    <div className="bg-white border border-rose-300 rounded-md p-6 max-w-xl mx-auto my-6 text-center shadow-sm">
      <div className="inline-flex p-3 rounded-full bg-rose-50 text-rose-600 mb-3">
        <AlertCircle className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-semibold text-[#202020]">{title}</h3>
      <p className="text-sm text-[#202020]/75 mt-1 mb-4">{message}</p>
      {onRetry && (
        <Button variant="primary" size="sm" onClick={onRetry} icon={RotateCcw}>
          Try Again
        </Button>
      )}
    </div>
  );
};

export default ErrorDisplay;

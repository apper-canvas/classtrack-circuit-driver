import React from "react";
import ApperIcon from "@/components/ApperIcon";

const ErrorView = ({ error = "Something went wrong", onRetry, className = "" }) => {
  return (
    <div className={`min-h-96 flex items-center justify-center p-8 ${className}`}>
      <div className="text-center max-w-md mx-auto">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <ApperIcon name="AlertTriangle" size={32} className="text-red-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Oops! Something went wrong</h3>
        <p className="text-gray-600 mb-6">{error}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-medium rounded-lg hover:from-primary-700 hover:to-primary-800 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all duration-200"
          >
            <ApperIcon name="RefreshCw" size={16} className="mr-2" />
            Try Again
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorView;
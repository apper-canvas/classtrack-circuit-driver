import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="text-center max-w-md mx-auto">
        <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <ApperIcon name="AlertTriangle" size={48} className="text-white" />
        </div>
        
        <h1 className="text-6xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent mb-4">
          404
        </h1>
        
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Page Not Found
        </h2>
        
        <p className="text-gray-600 mb-8">
          The page you're looking for doesn't exist or has been moved. 
          Let's get you back to your classroom management.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            variant="accent"
            onClick={() => navigate("/")}
            icon="Home"
          >
            Back to Dashboard
          </Button>
          
          <Button
            variant="outline"
            onClick={() => navigate("/students")}
            icon="Users"
          >
            View Students
          </Button>
        </div>
        
        <div className="mt-12 text-sm text-gray-500">
          <p>Need help? Here are some quick links:</p>
          <div className="flex justify-center space-x-6 mt-4">
            <button
              onClick={() => navigate("/grades")}
              className="text-primary-600 hover:text-primary-700 hover:underline"
            >
              Grades
            </button>
            <button
              onClick={() => navigate("/attendance")}
              className="text-primary-600 hover:text-primary-700 hover:underline"
            >
              Attendance
            </button>
            <button
              onClick={() => navigate("/reports")}
              className="text-primary-600 hover:text-primary-700 hover:underline"
            >
              Reports
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
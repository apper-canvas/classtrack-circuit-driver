import React from "react";
import ApperIcon from "@/components/ApperIcon";
import SearchBar from "@/components/molecules/SearchBar";
import Button from "@/components/atoms/Button";

const Header = ({ 
  onMenuClick, 
  searchValue, 
  onSearchChange, 
  title = "Dashboard",
  actions = []
}) => {
  return (
    <header className="bg-white border-b border-gray-200 px-4 lg:px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {/* Mobile menu button */}
          <button
            onClick={onMenuClick}
            className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-accent-500 lg:hidden"
          >
            <ApperIcon name="Menu" size={20} />
          </button>
          
          {/* Title */}
          <h1 className="ml-4 lg:ml-0 text-2xl font-bold text-gray-900">
            {title}
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="hidden sm:block w-80">
            <SearchBar
              placeholder="Search students..."
              value={searchValue}
              onChange={onSearchChange}
            />
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            {actions.map((action, index) => (
              <Button
                key={index}
                variant={action.variant || "primary"}
                size="sm"
                onClick={action.onClick}
                icon={action.icon}
              >
                {action.label}
              </Button>
            ))}
          </div>

          {/* Notifications */}
          <button className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-accent-500">
            <ApperIcon name="Bell" size={20} />
          </button>

          {/* Profile */}
          <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center">
            <ApperIcon name="User" size={16} className="text-white" />
          </div>
        </div>
      </div>
      
      {/* Mobile search */}
      <div className="mt-4 sm:hidden">
        <SearchBar
          placeholder="Search students..."
          value={searchValue}
          onChange={onSearchChange}
        />
      </div>
    </header>
  );
};

export default Header;
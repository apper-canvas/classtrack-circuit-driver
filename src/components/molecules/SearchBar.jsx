import React, { useState } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const SearchBar = ({ 
  placeholder = "Search...", 
  value, 
  onChange, 
  onClear,
  className 
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleClear = () => {
    if (onClear) {
      onClear();
    } else if (onChange) {
      onChange("");
    }
  };

  return (
    <div className={cn("relative", className)}>
      <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
        <ApperIcon 
          name="Search" 
          size={16} 
          className={cn(
            "transition-colors duration-200",
            isFocused ? "text-accent-500" : "text-gray-400"
          )} 
        />
      </div>
      <input
        type="text"
        placeholder={placeholder}
        value={value || ""}
        onChange={(e) => onChange?.(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="w-full pl-10 pr-10 py-2.5 text-sm border border-gray-300 rounded-lg bg-white focus:border-accent-500 focus:ring-2 focus:ring-accent-500 focus:ring-offset-2 focus:outline-none transition-all duration-200 placeholder:text-gray-500"
      />
      {value && (
        <button
          onClick={handleClear}
          className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
        >
          <ApperIcon name="X" size={16} />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
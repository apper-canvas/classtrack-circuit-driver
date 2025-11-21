import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Input = forwardRef(({ 
  className, 
  type = "text", 
  label,
  placeholder,
  error,
  icon,
  iconPosition = "left",
  required = false,
  ...props 
}, ref) => {
  const baseStyles = "flex w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200";

  const errorStyles = error ? "border-red-300 focus:border-red-500 focus:ring-red-500" : "";
  const iconStyles = icon ? (iconPosition === "left" ? "pl-10" : "pr-10") : "";

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className={cn(
            "absolute inset-y-0 flex items-center pointer-events-none z-10",
            iconPosition === "left" ? "left-3" : "right-3"
          )}>
            <ApperIcon name={icon} size={16} className="text-gray-400" />
          </div>
        )}
        <input
          type={type}
          className={cn(baseStyles, iconStyles, errorStyles, className)}
          placeholder={placeholder}
          ref={ref}
          {...props}
        />
      </div>
      {error && (
        <p className="text-sm text-red-600 flex items-center">
          <ApperIcon name="AlertCircle" size={14} className="mr-1" />
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = "Input";

export default Input;
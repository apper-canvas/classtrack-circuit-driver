import React from "react";
import { cn } from "@/utils/cn";
import { Card, CardContent } from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";

const StatCard = ({ 
  title, 
  value, 
  icon, 
  trend, 
  trendDirection = "up", 
  className,
  gradientFrom = "from-primary-500",
  gradientTo = "to-secondary-500"
}) => {
  const trendColor = trendDirection === "up" ? "text-green-600" : "text-red-600";
  const trendIcon = trendDirection === "up" ? "TrendingUp" : "TrendingDown";

  return (
    <Card className={cn("hover-lift", className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
            <p className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              {value}
            </p>
            {trend && (
              <div className={cn("flex items-center mt-2 text-sm", trendColor)}>
                <ApperIcon name={trendIcon} size={14} className="mr-1" />
                {trend}
              </div>
            )}
          </div>
          <div className={cn(
            "w-12 h-12 rounded-lg bg-gradient-to-br flex items-center justify-center",
            gradientFrom,
            gradientTo
          )}>
            <ApperIcon name={icon} size={20} className="text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;
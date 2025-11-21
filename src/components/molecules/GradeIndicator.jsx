import React from "react";
import { cn } from "@/utils/cn";
import Badge from "@/components/atoms/Badge";

const GradeIndicator = ({ score, maxScore = 100, showBadge = true, size = "default" }) => {
  const percentage = Math.round((score / maxScore) * 100);
  
  const getGradeInfo = (percent) => {
    if (percent >= 90) return { grade: "A", variant: "success", color: "text-green-600", bg: "bg-green-100" };
    if (percent >= 80) return { grade: "B", variant: "primary", color: "text-blue-600", bg: "bg-blue-100" };
    if (percent >= 70) return { grade: "C", variant: "warning", color: "text-yellow-600", bg: "bg-yellow-100" };
    if (percent >= 60) return { grade: "D", variant: "secondary", color: "text-orange-600", bg: "bg-orange-100" };
    return { grade: "F", variant: "danger", color: "text-red-600", bg: "bg-red-100" };
  };

  const gradeInfo = getGradeInfo(percentage);
  
  const sizes = {
    sm: { circle: "w-8 h-8 text-xs", text: "text-xs" },
    default: { circle: "w-10 h-10 text-sm", text: "text-sm" },
    lg: { circle: "w-12 h-12 text-base", text: "text-base" }
  };

  if (showBadge) {
    return (
      <div className="flex items-center space-x-2">
        <div className={cn(
          "rounded-full flex items-center justify-center font-bold",
          gradeInfo.bg,
          gradeInfo.color,
          sizes[size].circle
        )}>
          {percentage}%
        </div>
        <Badge variant={gradeInfo.variant} size={size}>
          {gradeInfo.grade}
        </Badge>
      </div>
    );
  }

  return (
    <div className={cn(
      "rounded-full flex items-center justify-center font-bold",
      gradeInfo.bg,
      gradeInfo.color,
      sizes[size].circle
    )}>
      {percentage}%
    </div>
  );
};

export default GradeIndicator;
import React from "react";
import { cn } from "@/utils/cn";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";

const AttendanceStatus = ({ status, showIcon = true, size = "default" }) => {
  const statusConfig = {
    present: {
      label: "Present",
      variant: "success",
      icon: "CheckCircle",
      color: "text-green-600"
    },
    absent: {
      label: "Absent",
      variant: "danger",
      icon: "XCircle",
      color: "text-red-600"
    },
    late: {
      label: "Late",
      variant: "warning",
      icon: "Clock",
      color: "text-yellow-600"
    },
    excused: {
      label: "Excused",
      variant: "secondary",
      icon: "Shield",
      color: "text-blue-600"
    }
  };

  const config = statusConfig[status] || statusConfig.absent;

  return (
    <Badge variant={config.variant} size={size}>
      {showIcon && <ApperIcon name={config.icon} size={14} className="mr-1" />}
      {config.label}
    </Badge>
  );
};

export default AttendanceStatus;
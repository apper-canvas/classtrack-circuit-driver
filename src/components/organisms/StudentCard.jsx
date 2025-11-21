import React from "react";
import { cn } from "@/utils/cn";
import { Card, CardContent } from "@/components/atoms/Card";
import Avatar from "@/components/atoms/Avatar";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import GradeIndicator from "@/components/molecules/GradeIndicator";
import AttendanceStatus from "@/components/molecules/AttendanceStatus";

const StudentCard = ({ student, onClick, className }) => {
  // Calculate average grade
  const averageGrade = student.grades?.length > 0 
    ? Math.round(student.grades.reduce((acc, grade) => acc + (grade.score / grade.maxScore * 100), 0) / student.grades.length)
    : 0;

  // Get recent attendance status
  const recentAttendance = student.attendance?.slice(-5) || [];
  const attendanceRate = recentAttendance.length > 0 
    ? Math.round((recentAttendance.filter(a => a.status === "present").length / recentAttendance.length) * 100)
    : 100;

  const statusVariant = student.status === "active" ? "success" : "secondary";

  return (
    <Card
      className={cn("hover-lift cursor-pointer", className)}
      onClick={() => onClick?.(student)}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Avatar
              src={student.photo}
              alt={`${student.firstName} ${student.lastName}`}
              size="lg"
              fallback={`${student.firstName[0]}${student.lastName[0]}`}
            />
            <div>
              <h3 className="font-semibold text-gray-900">
                {student.firstName} {student.lastName}
              </h3>
              <p className="text-sm text-gray-500">{student.email}</p>
            </div>
          </div>
          <Badge variant={statusVariant} size="sm">
            {student.status}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="flex justify-center mb-1">
              <GradeIndicator score={averageGrade} showBadge={false} size="sm" />
            </div>
            <p className="text-xs text-gray-500">Avg. Grade</p>
          </div>
          
          <div className="text-center">
            <div className="flex justify-center mb-1">
              <span className={cn(
                "text-sm font-semibold",
                attendanceRate >= 90 ? "text-green-600" :
                attendanceRate >= 80 ? "text-yellow-600" : "text-red-600"
              )}>
                {attendanceRate}%
              </span>
            </div>
            <p className="text-xs text-gray-500">Attendance</p>
          </div>
        </div>

        {student.tags && student.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1">
            {student.tags.slice(0, 2).map((tag, index) => (
              <Badge key={index} variant="outline" size="sm">
                {tag}
              </Badge>
            ))}
            {student.tags.length > 2 && (
              <Badge variant="outline" size="sm">
                +{student.tags.length - 2}
              </Badge>
            )}
          </div>
        )}

        <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
          <span>ID: {student.id}</span>
          <div className="flex items-center">
            <ApperIcon name="Calendar" size={12} className="mr-1" />
            {new Date(student.enrollmentDate).toLocaleDateString()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StudentCard;
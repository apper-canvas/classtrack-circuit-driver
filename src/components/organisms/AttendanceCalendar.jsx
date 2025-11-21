import React, { useState } from "react";
import { cn } from "@/utils/cn";
import { Card, CardContent, CardHeader } from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import AttendanceStatus from "@/components/molecules/AttendanceStatus";
import Avatar from "@/components/atoms/Avatar";
import Button from "@/components/atoms/Button";

const AttendanceCalendar = ({ students, attendance, onAttendanceUpdate }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedStudent, setSelectedStudent] = useState(students[0]?.id || null);

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const formatDate = (year, month, day) => {
    return new Date(year, month, day).toISOString().split("T")[0];
  };

  const getAttendanceForDate = (studentId, dateStr) => {
    return attendance.find(a => a.studentId === studentId && a.date === dateStr);
  };

  const updateAttendance = (studentId, date, status) => {
    const existingRecord = getAttendanceForDate(studentId, date);
    const attendanceData = {
      id: existingRecord ? existingRecord.id : Date.now(),
      studentId,
      date,
      status,
      notes: ""
    };
    onAttendanceUpdate?.(attendanceData);
  };

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const renderCalendarHeader = () => {
    const monthYear = currentDate.toLocaleDateString("en-US", { 
      month: "long", 
      year: "numeric" 
    });

    return (
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">{monthYear}</h3>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateMonth(-1)}
            icon="ChevronLeft"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentDate(new Date())}
          >
            Today
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateMonth(1)}
            icon="ChevronRight"
          />
        </div>
      </div>
    );
  };

  const renderStudentSelector = () => {
    const student = students.find(s => s.id === selectedStudent);
    
    return (
      <div className="flex items-center space-x-4">
        {student && (
          <>
            <Avatar
              src={student.photo}
              alt={`${student.firstName} ${student.lastName}`}
              size="sm"
              fallback={`${student.firstName[0]}${student.lastName[0]}`}
            />
            <select
              value={selectedStudent}
              onChange={(e) => setSelectedStudent(e.target.value)}
              className="flex-1 max-w-xs px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
            >
              {students.map(student => (
                <option key={student.id} value={student.id}>
                  {student.firstName} {student.lastName}
                </option>
              ))}
            </select>
          </>
        )}
      </div>
    );
  };

  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const weeks = [];
    
    let currentWeek = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      currentWeek.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
      currentWeek.push(day);
    }
    
    // Add remaining empty cells to complete the last week
    while (currentWeek.length < 7) {
      currentWeek.push(null);
    }
    weeks.push(currentWeek);

    const today = new Date();
    const isCurrentMonth = year === today.getFullYear() && month === today.getMonth();

    return (
      <div className="grid grid-cols-7 gap-1">
        {/* Day headers */}
        {days.map(day => (
          <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
            {day}
          </div>
        ))}
        
        {/* Calendar days */}
        {weeks.map((week, weekIndex) => (
          week.map((day, dayIndex) => {
            if (!day) {
              return <div key={`empty-${weekIndex}-${dayIndex}`} className="p-2" />;
            }
            
            const dateStr = formatDate(year, month, day);
            const attendanceRecord = getAttendanceForDate(selectedStudent, dateStr);
            const isToday = isCurrentMonth && day === today.getDate();
            const isPast = new Date(year, month, day) < new Date(today.getFullYear(), today.getMonth(), today.getDate());
            
            return (
              <div
                key={`${weekIndex}-${dayIndex}`}
                className={cn(
                  "p-2 text-center relative cursor-pointer rounded-lg transition-colors duration-200",
                  isToday && "bg-accent-100 ring-2 ring-accent-500",
                  !isToday && "hover:bg-gray-100",
                  isPast && !attendanceRecord && "bg-red-50"
                )}
              >
                <div className="text-sm font-medium text-gray-900 mb-1">
                  {day}
                </div>
                
                <div className="flex justify-center space-x-1">
                  {["present", "absent", "late"].map(status => {
                    const isSelected = attendanceRecord?.status === status;
                    const statusColors = {
                      present: "bg-green-500 hover:bg-green-600",
                      absent: "bg-red-500 hover:bg-red-600",
                      late: "bg-yellow-500 hover:bg-yellow-600"
                    };
                    
                    return (
                      <button
                        key={status}
                        onClick={() => updateAttendance(selectedStudent, dateStr, status)}
                        className={cn(
                          "w-2 h-2 rounded-full transition-all duration-200",
                          isSelected 
                            ? statusColors[status]
                            : "bg-gray-300 hover:bg-gray-400"
                        )}
                        title={status}
                      />
                    );
                  })}
                </div>
                
                {attendanceRecord && (
                  <div className="absolute top-1 right-1">
                    <div className={cn(
                      "w-2 h-2 rounded-full",
                      attendanceRecord.status === "present" && "bg-green-500",
                      attendanceRecord.status === "absent" && "bg-red-500",
                      attendanceRecord.status === "late" && "bg-yellow-500"
                    )} />
                  </div>
                )}
              </div>
            );
          })
        ))}
      </div>
    );
  };

  if (!selectedStudent) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <ApperIcon name="Users" size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500">No students available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        {renderCalendarHeader()}
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {renderStudentSelector()}
          {renderCalendar()}
          
          {/* Legend */}
          <div className="flex items-center justify-center space-x-6 pt-4 border-t border-gray-200">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full" />
              <span className="text-sm text-gray-600">Present</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full" />
              <span className="text-sm text-gray-600">Absent</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full" />
              <span className="text-sm text-gray-600">Late</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AttendanceCalendar;
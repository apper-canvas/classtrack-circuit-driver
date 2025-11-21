import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import AttendanceCalendar from "@/components/organisms/AttendanceCalendar";
import Button from "@/components/atoms/Button";
import { Card, CardContent, CardHeader } from "@/components/atoms/Card";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { studentService } from "@/services/api/studentService";
import { attendanceService } from "@/services/api/attendanceService";

const Attendance = () => {
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadAttendanceData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [studentsData, attendanceData] = await Promise.all([
        studentService.getAll(),
        attendanceService.getAll()
      ]);
      
      setStudents(studentsData);
      setAttendance(attendanceData);
    } catch (err) {
      setError("Failed to load attendance data");
      toast.error("Failed to load attendance data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAttendanceData();
  }, []);

  const handleAttendanceUpdate = async (attendanceData) => {
    try {
      const updatedRecord = await attendanceService.upsert(attendanceData);
      
      // Update local attendance state
      setAttendance(prevAttendance => {
const existingIndex = prevAttendance.findIndex(a => 
          a.studentId_c === attendanceData.studentId_c && 
          a.date_c === attendanceData.date_c
        );
        
        if (existingIndex >= 0) {
          const newAttendance = [...prevAttendance];
          newAttendance[existingIndex] = updatedRecord;
          return newAttendance;
        } else {
          return [...prevAttendance, updatedRecord];
        }
      });
      
      toast.success("Attendance updated successfully");
    } catch (err) {
      toast.error("Failed to update attendance");
    }
  };

  const exportAttendance = () => {
    try {
      const csvData = [
        ["Student ID", "Student Name", "Date", "Status", "Notes"].join(","),
...attendance.map(record => {
          const student = students.find(s => s.Id.toString() === record.studentId_c);
          return [
            record.studentId_c,
            student ? `${student.firstName_c} ${student.lastName_c}` : "Unknown",
            record.date_c,
            record.status,
            record.notes || ""
          ].join(",");
        })
      ].join("\n");
      
      const blob = new Blob([csvData], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `attendance-export-${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success("Attendance exported successfully");
    } catch (err) {
      toast.error("Failed to export attendance");
    }
  };

  const markAllPresent = async () => {
    try {
const today = new Date().toISOString().split("T")[0];
      const todayRecords = attendance.filter(a => a.date_c === today);
      
      for (const student of students) {
        const existingRecord = todayRecords.find(a => a.studentId_c === student.Id);
        if (!existingRecord) {
          await handleAttendanceUpdate({
            studentId: student.Id.toString(),
            date: today,
            status: "present",
            notes: ""
          });
        }
      }
      
      toast.success("All students marked present for today");
    } catch (err) {
      toast.error("Failed to mark all present");
    }
  };

  if (loading) return <Loading />;
  
  if (error) {
    return (
      <ErrorView 
        error={error} 
        onRetry={loadAttendanceData}
        className="m-6" 
      />
    );
  }

  if (students.length === 0) {
    return (
      <div className="p-6">
        <Empty
          title="No students found"
          description="You need to add students before you can track attendance."
          icon="Users"
          actionLabel="Go to Students"
          onAction={() => window.history.back()}
        />
      </div>
    );
  }

  // Calculate attendance statistics
const today = new Date().toISOString().split("T")[0];
  const thisMonth = new Date().toISOString().substring(0, 7);
  
  const todayAttendance = attendance.filter(a => a.date_c === today);
  const monthAttendance = attendance.filter(a => a.date.startsWith(thisMonth));
  
  const todayPresent = todayAttendance.filter(a => a.status === "present").length;
  const todayRate = todayAttendance.length > 0 ? Math.round((todayPresent / todayAttendance.length) * 100) : 0;
  
  const monthPresent = monthAttendance.filter(a => a.status === "present").length;
  const monthRate = monthAttendance.length > 0 ? Math.round((monthPresent / monthAttendance.length) * 100) : 0;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
            Attendance
          </h1>
          <p className="text-gray-600 mt-1">
            Track daily attendance and view attendance patterns
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            icon="Download"
            onClick={exportAttendance}
          >
            Export Data
          </Button>
          <Button
            variant="secondary"
            icon="CheckCircle"
            onClick={markAllPresent}
          >
            Mark All Present
          </Button>
        </div>
      </div>

      {/* Attendance Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Today's Rate</p>
                <p className="text-2xl font-bold text-gray-900">{todayRate}%</p>
                <p className="text-xs text-gray-500">{todayPresent}/{todayAttendance.length} present</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                <ApperIcon name="Calendar" size={20} className="text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Monthly Rate</p>
                <p className="text-2xl font-bold text-gray-900">{monthRate}%</p>
                <p className="text-xs text-gray-500">{monthPresent}/{monthAttendance.length} present</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <ApperIcon name="TrendingUp" size={20} className="text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Students</p>
                <p className="text-2xl font-bold text-gray-900">{students.length}</p>
                <p className="text-xs text-gray-500">Active students</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                <ApperIcon name="Users" size={20} className="text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Absent Today</p>
                <p className="text-2xl font-bold text-gray-900">
{todayAttendance.filter(a => a.status_c === "absent").length}
                </p>
                <p className="text-xs text-gray-500">Students absent</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center">
                <ApperIcon name="UserX" size={20} className="text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Instructions */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <div className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <ApperIcon name="Info" size={14} className="text-white" />
          </div>
          <div>
            <h3 className="font-medium text-amber-900 mb-1">How to mark attendance</h3>
            <p className="text-sm text-amber-800">
              Select a student from the dropdown, then click on the colored dots below each date to mark attendance. 
              Green = Present, Red = Absent, Yellow = Late. Past dates without attendance will show in light red.
            </p>
          </div>
        </div>
      </div>

      {/* Attendance Calendar */}
      <AttendanceCalendar
        students={students}
        attendance={attendance}
        onAttendanceUpdate={handleAttendanceUpdate}
      />
    </div>
  );
};

export default Attendance;
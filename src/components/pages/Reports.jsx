import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Card, CardContent, CardHeader } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import ApperIcon from "@/components/ApperIcon";
import Avatar from "@/components/atoms/Avatar";
import GradeIndicator from "@/components/molecules/GradeIndicator";
import AttendanceStatus from "@/components/molecules/AttendanceStatus";
import { studentService } from "@/services/api/studentService";
import { gradeService } from "@/services/api/gradeService";
import { attendanceService } from "@/services/api/attendanceService";

const Reports = () => {
  const [students, setStudents] = useState([]);
  const [grades, setGrades] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedReport, setSelectedReport] = useState("overview");

  const loadReportsData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [studentsData, gradesData, attendanceData] = await Promise.all([
        studentService.getAll(),
        gradeService.getAll(),
        attendanceService.getAll()
      ]);
      
      setStudents(studentsData);
      setGrades(gradesData);
      setAttendance(attendanceData);
    } catch (err) {
      setError("Failed to load reports data");
      toast.error("Failed to load reports data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReportsData();
  }, []);

  if (loading) return <Loading />;
  
  if (error) {
    return (
      <ErrorView 
        error={error} 
        onRetry={loadReportsData}
        className="m-6" 
      />
    );
  }

  // Calculate statistics
  const calculateStudentStats = (student) => {
    const studentGrades = grades.filter(g => g.studentId === student.Id.toString());
    const studentAttendance = attendance.filter(a => a.studentId === student.Id.toString());
    
    const averageGrade = studentGrades.length > 0 
      ? Math.round(studentGrades.reduce((acc, grade) => acc + (grade.score / grade.maxScore * 100), 0) / studentGrades.length)
      : 0;
    
    const attendanceRate = studentAttendance.length > 0 
      ? Math.round((studentAttendance.filter(a => a.status === "present").length / studentAttendance.length) * 100)
      : 100;
    
    return {
      ...student,
      averageGrade,
      attendanceRate,
      totalGrades: studentGrades.length,
      totalAttendance: studentAttendance.length
    };
  };

  const studentStats = students.map(calculateStudentStats);

  const exportStudentReport = (format = "csv") => {
    try {
      const data = [
        ["Student ID", "Student Name", "Email", "Average Grade", "Attendance Rate", "Total Grades", "Total Attendance Records", "Status"].join(","),
        ...studentStats.map(student => [
          student.Id,
          `${student.firstName} ${student.lastName}`,
          student.email,
          student.averageGrade,
          student.attendanceRate,
          student.totalGrades,
          student.totalAttendance,
          student.status
        ].join(","))
      ].join("\n");
      
      const blob = new Blob([data], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `student-report-${new Date().toISOString().split("T")[0]}.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success(`Student report exported as ${format.toUpperCase()}`);
    } catch (err) {
      toast.error("Failed to export report");
    }
  };

  const exportGradeReport = () => {
    try {
      const subjectStats = {};
      grades.forEach(grade => {
        if (!subjectStats[grade.subject]) {
          subjectStats[grade.subject] = { total: 0, count: 0, scores: [] };
        }
        const percentage = (grade.score / grade.maxScore) * 100;
        subjectStats[grade.subject].total += percentage;
        subjectStats[grade.subject].count += 1;
        subjectStats[grade.subject].scores.push(percentage);
      });

      const reportData = [
        ["Subject", "Average Grade", "Total Students", "A Grades", "B Grades", "C Grades", "Below C"].join(","),
        ...Object.entries(subjectStats).map(([subject, stats]) => {
          const avg = Math.round(stats.total / stats.count);
          const aGrades = stats.scores.filter(s => s >= 90).length;
          const bGrades = stats.scores.filter(s => s >= 80 && s < 90).length;
          const cGrades = stats.scores.filter(s => s >= 70 && s < 80).length;
          const belowC = stats.scores.filter(s => s < 70).length;
          
          return [subject, avg, stats.count, aGrades, bGrades, cGrades, belowC].join(",");
        })
      ].join("\n");
      
      const blob = new Blob([reportData], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `grade-report-${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success("Grade report exported successfully");
    } catch (err) {
      toast.error("Failed to export grade report");
    }
  };

  const reportTabs = [
    { id: "overview", label: "Class Overview", icon: "BarChart3" },
    { id: "students", label: "Student Performance", icon: "Users" },
    { id: "subjects", label: "Subject Analysis", icon: "BookOpen" },
    { id: "attendance", label: "Attendance Report", icon: "Calendar" }
  ];

  const renderOverview = () => {
    const totalStudents = students.length;
    const activeStudents = students.filter(s => s.status === "active").length;
    const averageClassGrade = studentStats.length > 0 
      ? Math.round(studentStats.reduce((acc, s) => acc + s.averageGrade, 0) / studentStats.length)
      : 0;
    const averageAttendance = studentStats.length > 0 
      ? Math.round(studentStats.reduce((acc, s) => acc + s.attendanceRate, 0) / studentStats.length)
      : 0;

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Students</p>
                  <p className="text-2xl font-bold text-gray-900">{totalStudents}</p>
                  <p className="text-xs text-gray-500">{activeStudents} active</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <ApperIcon name="Users" size={20} className="text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Class Average</p>
                  <p className="text-2xl font-bold text-gray-900">{averageClassGrade}%</p>
                  <p className="text-xs text-gray-500">All subjects</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                  <ApperIcon name="TrendingUp" size={20} className="text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Attendance Rate</p>
                  <p className="text-2xl font-bold text-gray-900">{averageAttendance}%</p>
                  <p className="text-xs text-gray-500">Class average</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <ApperIcon name="Calendar" size={20} className="text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Grades</p>
                  <p className="text-2xl font-bold text-gray-900">{grades.length}</p>
                  <p className="text-xs text-gray-500">Entered this year</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-accent-500 to-accent-600 rounded-lg flex items-center justify-center">
                  <ApperIcon name="BookOpen" size={20} className="text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900">Grade Distribution</h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">A Grades (90%+)</span>
                  <span className="font-semibold text-green-600">
                    {grades.filter(g => (g.score / g.maxScore * 100) >= 90).length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">B Grades (80-89%)</span>
                  <span className="font-semibold text-blue-600">
                    {grades.filter(g => {
                      const percent = g.score / g.maxScore * 100;
                      return percent >= 80 && percent < 90;
                    }).length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">C Grades (70-79%)</span>
                  <span className="font-semibold text-yellow-600">
                    {grades.filter(g => {
                      const percent = g.score / g.maxScore * 100;
                      return percent >= 70 && percent < 80;
                    }).length}
                  </span>
                </div>
<div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Below C (&lt;70%)</span>
                  <span className="font-semibold text-red-600">
                    {grades.filter(g => (g.score / g.maxScore * 100) < 70).length}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900">Top Performers</h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {studentStats
                  .filter(s => s.averageGrade > 0)
                  .sort((a, b) => b.averageGrade - a.averageGrade)
                  .slice(0, 5)
                  .map(student => (
                    <div key={student.Id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar
                          src={student.photo}
                          alt={`${student.firstName} ${student.lastName}`}
                          size="sm"
                          fallback={`${student.firstName[0]}${student.lastName[0]}`}
                        />
                        <span className="text-sm font-medium text-gray-900">
                          {student.firstName} {student.lastName}
                        </span>
                      </div>
                      <GradeIndicator score={student.averageGrade} showBadge={false} size="sm" />
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  const renderStudentPerformance = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Individual Student Performance</h3>
        <Button
          variant="outline"
          icon="Download"
          onClick={() => exportStudentReport()}
        >
          Export Student Report
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Average Grade
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Attendance Rate
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Grades
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {studentStats.map((student, index) => (
                  <tr key={student.Id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Avatar
                          src={student.photo}
                          alt={`${student.firstName} ${student.lastName}`}
                          size="sm"
                          fallback={`${student.firstName[0]}${student.lastName[0]}`}
                        />
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">
                            {student.firstName} {student.lastName}
                          </div>
                          <div className="text-sm text-gray-500">{student.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {student.averageGrade > 0 ? (
                        <GradeIndicator score={student.averageGrade} showBadge={false} size="sm" />
                      ) : (
                        <span className="text-gray-400">No grades</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className={`font-medium ${
                        student.attendanceRate >= 90 ? "text-green-600" :
                        student.attendanceRate >= 80 ? "text-yellow-600" : "text-red-600"
                      }`}>
                        {student.attendanceRate}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                      {student.totalGrades}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        student.status === "active" 
                          ? "bg-green-100 text-green-800" 
                          : "bg-gray-100 text-gray-800"
                      }`}>
                        {student.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderSubjectAnalysis = () => {
    const subjectStats = {};
    grades.forEach(grade => {
      if (!subjectStats[grade.subject]) {
        subjectStats[grade.subject] = { total: 0, count: 0, scores: [] };
      }
      const percentage = (grade.score / grade.maxScore) * 100;
      subjectStats[grade.subject].total += percentage;
      subjectStats[grade.subject].count += 1;
      subjectStats[grade.subject].scores.push(percentage);
    });

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Subject Performance Analysis</h3>
          <Button
            variant="outline"
            icon="Download"
            onClick={exportGradeReport}
          >
            Export Grade Report
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Object.entries(subjectStats).map(([subject, stats]) => {
            const average = Math.round(stats.total / stats.count);
            const aGrades = stats.scores.filter(s => s >= 90).length;
            const bGrades = stats.scores.filter(s => s >= 80 && s < 90).length;
            const cGrades = stats.scores.filter(s => s >= 70 && s < 80).length;
            const belowC = stats.scores.filter(s => s < 70).length;

            return (
              <Card key={subject}>
                <CardHeader>
                  <h4 className="text-lg font-semibold text-gray-900">{subject}</h4>
                  <p className="text-sm text-gray-500">{stats.count} students graded</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <GradeIndicator score={average} showBadge={true} size="lg" />
                      <p className="text-sm text-gray-600 mt-2">Class Average</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <div className="text-xl font-bold text-green-600">{aGrades}</div>
                        <p className="text-xs text-gray-600">A Grades</p>
                      </div>
                      <div>
                        <div className="text-xl font-bold text-blue-600">{bGrades}</div>
                        <p className="text-xs text-gray-600">B Grades</p>
                      </div>
                      <div>
                        <div className="text-xl font-bold text-yellow-600">{cGrades}</div>
                        <p className="text-xs text-gray-600">C Grades</p>
                      </div>
                      <div>
                        <div className="text-xl font-bold text-red-600">{belowC}</div>
                        <p className="text-xs text-gray-600">Below C</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    );
  };

  const renderAttendanceReport = () => {
    const attendanceStats = {};
    attendance.forEach(record => {
      const month = record.date.substring(0, 7);
      if (!attendanceStats[month]) {
        attendanceStats[month] = { total: 0, present: 0, absent: 0, late: 0 };
      }
      attendanceStats[month].total += 1;
      attendanceStats[month][record.status] += 1;
    });

    return (
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-900">Attendance Analysis</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(attendanceStats).map(([month, stats]) => {
            const rate = Math.round((stats.present / stats.total) * 100);
            
            return (
              <Card key={month}>
                <CardHeader>
                  <h4 className="text-lg font-semibold text-gray-900">
                    {new Date(month + "-01").toLocaleDateString("en-US", { 
                      month: "long", 
                      year: "numeric" 
                    })}
                  </h4>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">{rate}%</div>
                      <p className="text-sm text-gray-600">Attendance Rate</p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Present</span>
                        <span className="font-medium text-green-600">{stats.present}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Absent</span>
                        <span className="font-medium text-red-600">{stats.absent}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Late</span>
                        <span className="font-medium text-yellow-600">{stats.late}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    );
  };

  const renderTabContent = () => {
    switch (selectedReport) {
      case "overview":
        return renderOverview();
      case "students":
        return renderStudentPerformance();
      case "subjects":
        return renderSubjectAnalysis();
      case "attendance":
        return renderAttendanceReport();
      default:
        return renderOverview();
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
            Reports & Analytics
          </h1>
          <p className="text-gray-600 mt-1">
            Comprehensive insights into class performance and attendance
          </p>
        </div>
      </div>

      {/* Report Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {reportTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedReport(tab.id)}
              className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                selectedReport === tab.id
                  ? "border-accent-500 text-accent-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <ApperIcon name={tab.icon} size={16} className="mr-2" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Report Content */}
      {renderTabContent()}
    </div>
  );
};

export default Reports;
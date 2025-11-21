import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Card, CardContent, CardHeader } from "@/components/atoms/Card";
import StatCard from "@/components/molecules/StatCard";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import ApperIcon from "@/components/ApperIcon";
import { studentService } from "@/services/api/studentService";
import { gradeService } from "@/services/api/gradeService";
import { attendanceService } from "@/services/api/attendanceService";

const Dashboard = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [grades, setGrades] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboardData = async () => {
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
      setError("Failed to load dashboard data");
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  if (loading) return <Loading />;
  
  if (error) {
    return (
      <ErrorView 
        error={error} 
        onRetry={loadDashboardData}
        className="m-6" 
      />
    );
  }

  // Calculate statistics
  const totalStudents = students.length;
const activeStudents = students.filter(s => s.status_c === "active").length;
  
const averageGPA = grades.length > 0 
    ? (grades.reduce((acc, grade) => acc + (grade.score_c / grade.maxScore_c * 4), 0) / grades.length).toFixed(2)
    : "0.00";

  const today = new Date().toISOString().split("T")[0];
const todayAttendance = attendance.filter(a => a.date_c === today);
  const presentToday = todayAttendance.filter(a => a.status_c === "present").length;
  const attendanceRate = todayAttendance.length > 0 
    ? Math.round((presentToday / todayAttendance.length) * 100)
    : 100;

  // Recent activity
const recentGrades = grades
    .slice()
    .sort((a, b) => new Date(b.enteredDate_c) - new Date(a.enteredDate_c))
    .slice(0, 5);

const recentActivity = recentGrades.map(grade => {
    const student = students.find(s => s.Id.toString() === grade.studentId);
    return {
id: grade.Id,
      type: "grade",
      message: `${student?.firstName_c} ${student?.lastName_c} received ${grade.score_c}% in ${grade.subject_c}`,
      time: new Date(grade.enteredDate_c).toLocaleDateString(),
      score: grade.score
    };
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
            Welcome to ClassTrack
          </h1>
          <p className="text-gray-600 mt-1">
            Here's what's happening in your classroom today
          </p>
        </div>
        <div className="flex space-x-3">
          <Button
            variant="accent"
            onClick={() => navigate("/students")}
            icon="Users"
          >
            Manage Students
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate("/grades")}
            icon="BookOpen"
          >
            Enter Grades
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Students"
          value={totalStudents}
          icon="Users"
          trend={`${activeStudents} active`}
          trendDirection="up"
          gradientFrom="from-blue-500"
          gradientTo="to-blue-600"
        />
        <StatCard
          title="Average GPA"
          value={averageGPA}
          icon="TrendingUp"
          trend="This semester"
          trendDirection="up"
          gradientFrom="from-green-500"
          gradientTo="to-green-600"
        />
        <StatCard
          title="Attendance Today"
          value={`${attendanceRate}%`}
          icon="Calendar"
          trend={`${presentToday}/${todayAttendance.length} present`}
          trendDirection={attendanceRate >= 90 ? "up" : "down"}
          gradientFrom="from-purple-500"
          gradientTo="to-purple-600"
        />
        <StatCard
          title="Total Grades"
          value={grades.length}
          icon="BookOpen"
          trend="Recorded this year"
          trendDirection="up"
          gradientFrom="from-accent-500"
          gradientTo="to-accent-600"
        />
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <ApperIcon name="Zap" size={20} className="mr-2 text-accent-500" />
              Quick Actions
            </h3>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => navigate("/students")}
              icon="UserPlus"
            >
              Add New Student
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => navigate("/grades")}
              icon="PlusCircle"
            >
              Enter Grades
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => navigate("/attendance")}
              icon="CheckSquare"
            >
              Take Attendance
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => navigate("/reports")}
              icon="FileText"
            >
              Generate Reports
            </Button>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <ApperIcon name="Activity" size={20} className="mr-2 text-primary-500" />
              Recent Activity
            </h3>
          </CardHeader>
          <CardContent>
            {recentActivity.length > 0 ? (
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center">
                        <ApperIcon name="BookOpen" size={14} className="text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-900">{activity.message}</p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                    <div className={`px-2 py-1 rounded text-xs font-medium ${
                      activity.score >= 90 ? "bg-green-100 text-green-800" :
                      activity.score >= 80 ? "bg-blue-100 text-blue-800" :
                      activity.score >= 70 ? "bg-yellow-100 text-yellow-800" :
                      "bg-red-100 text-red-800"
                    }`}>
                      {activity.score}%
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <ApperIcon name="Activity" size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">No recent activity</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Class Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <ApperIcon name="BarChart3" size={20} className="mr-2 text-secondary-500" />
              Class Performance Overview
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/reports")}
              icon="ArrowRight"
            >
              View Details
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
<div className="text-2xl font-bold text-green-600">
                {grades.filter(g => (g.score_c / g.maxScore_c * 100) >= 90).length}
              </div>
              <p className="text-sm text-gray-600">A Grades (90%+)</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {grades.filter(g => {
                  const percent = g.score_c / g.maxScore_c * 100;
                  return percent >= 80 && percent < 90;
                }).length}
              </div>
              <p className="text-sm text-gray-600">B Grades (80-89%)</p>
            </div>
<div className="text-center">
<div className="text-2xl font-bold text-yellow-600">
                {grades.filter(g => (g.score_c / g.maxScore_c * 100) < 80).length}
              </div>
              <p className="text-sm text-gray-600">Below B (&lt;80%)</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
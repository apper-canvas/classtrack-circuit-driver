import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import GradeTable from "@/components/organisms/GradeTable";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import Empty from "@/components/ui/Empty";
import { studentService } from "@/services/api/studentService";
import { gradeService } from "@/services/api/gradeService";

const Grades = () => {
  const [students, setStudents] = useState([]);
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadGradesData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [studentsData, gradesData] = await Promise.all([
        studentService.getAll(),
        gradeService.getAll()
      ]);
      
      setStudents(studentsData);
      setGrades(gradesData);
    } catch (err) {
      setError("Failed to load grades data");
      toast.error("Failed to load grades data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGradesData();
  }, []);

  const handleGradeUpdate = async (gradeData) => {
    try {
      const updatedGrade = await gradeService.upsert(gradeData);
      
      // Update local grades state
      setGrades(prevGrades => {
        const existingIndex = prevGrades.findIndex(g => 
          g.studentId === gradeData.studentId && 
          g.subject === gradeData.subject && 
          g.semester === gradeData.semester
        );
        
        if (existingIndex >= 0) {
          const newGrades = [...prevGrades];
          newGrades[existingIndex] = updatedGrade;
          return newGrades;
        } else {
          return [...prevGrades, updatedGrade];
        }
      });
      
      toast.success("Grade updated successfully");
    } catch (err) {
      toast.error("Failed to update grade");
    }
  };

  const exportGrades = () => {
    try {
      const csvData = [
        ["Student ID", "Student Name", "Subject", "Semester", "Score", "Max Score", "Percentage", "Letter Grade"].join(","),
        ...grades.map(grade => {
          const student = students.find(s => s.Id.toString() === grade.studentId);
          const percentage = Math.round((grade.score / grade.maxScore) * 100);
          const letterGrade = percentage >= 90 ? "A" : percentage >= 80 ? "B" : percentage >= 70 ? "C" : percentage >= 60 ? "D" : "F";
          
          return [
            grade.studentId,
            student ? `${student.firstName} ${student.lastName}` : "Unknown",
            grade.subject,
            grade.semester,
            grade.score,
            grade.maxScore,
            percentage,
            letterGrade
          ].join(",");
        })
      ].join("\n");
      
      const blob = new Blob([csvData], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `grades-export-${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success("Grades exported successfully");
    } catch (err) {
      toast.error("Failed to export grades");
    }
  };

  if (loading) return <Loading />;
  
  if (error) {
    return (
      <ErrorView 
        error={error} 
        onRetry={loadGradesData}
        className="m-6" 
      />
    );
  }

  if (students.length === 0) {
    return (
      <div className="p-6">
        <Empty
          title="No students found"
          description="You need to add students before you can enter grades."
          icon="Users"
          actionLabel="Go to Students"
          onAction={() => window.history.back()}
        />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
            Grades
          </h1>
          <p className="text-gray-600 mt-1">
            Enter and manage student grades across subjects and semesters
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            icon="Download"
            onClick={exportGrades}
          >
            Export Grades
          </Button>
          <Button
            variant="accent"
            icon="Calculator"
            onClick={() => toast.info("GPA calculator coming soon!")}
          >
            Calculate GPA
          </Button>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-white text-xs font-bold">i</span>
          </div>
          <div>
            <h3 className="font-medium text-blue-900 mb-1">How to enter grades</h3>
            <p className="text-sm text-blue-800">
              Click on any empty cell or existing grade to edit. Press Enter to save or Escape to cancel. 
              Grades are automatically saved and will update the student's GPA in real-time.
            </p>
          </div>
        </div>
      </div>

      {/* Grade Table */}
      <GradeTable
        students={students}
        grades={grades}
        onGradeUpdate={handleGradeUpdate}
      />

      {/* Statistics */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Grade Statistics</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {grades.filter(g => (g.score / g.maxScore * 100) >= 90).length}
            </div>
            <p className="text-sm text-gray-600">A Grades (90%+)</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {grades.filter(g => {
                const percent = g.score / g.maxScore * 100;
                return percent >= 80 && percent < 90;
              }).length}
            </div>
            <p className="text-sm text-gray-600">B Grades (80-89%)</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {grades.filter(g => {
                const percent = g.score / g.maxScore * 100;
                return percent >= 70 && percent < 80;
              }).length}
            </div>
            <p className="text-sm text-gray-600">C Grades (70-79%)</p>
          </div>
<div className="text-center">
            <div className="text-2xl font-bold text-red-600">
              {grades.filter(g => (g.score / g.maxScore * 100) < 70).length}
            </div>
            <p className="text-sm text-gray-600">Below C (&lt;70%)</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Grades;
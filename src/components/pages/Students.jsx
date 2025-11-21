import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import SearchBar from "@/components/molecules/SearchBar";
import StudentCard from "@/components/organisms/StudentCard";
import StudentModal from "@/components/organisms/StudentModal";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { studentService } from "@/services/api/studentService";
import { gradeService } from "@/services/api/gradeService";
import { attendanceService } from "@/services/api/attendanceService";
import { noteService } from "@/services/api/noteService";

const Students = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState("grid");

  const loadStudents = async () => {
    try {
      setLoading(true);
      setError("");
      
      const studentsData = await studentService.getAll();
      
      // Enhance students with grades, attendance, and notes
      const enhancedStudents = await Promise.all(
        studentsData.map(async (student) => {
          try {
            const [grades, attendance, notes] = await Promise.all([
              gradeService.getByStudentId(student.Id.toString()),
              attendanceService.getByStudentId(student.Id.toString()),
              noteService.getByStudentId(student.Id.toString())
            ]);
            
            return {
              ...student,
              id: student.Id.toString(),
              grades,
              attendance,
              notes
            };
          } catch (err) {
            console.warn(`Failed to load data for student ${student.Id}:`, err);
            return {
              ...student,
              id: student.Id.toString(),
              grades: [],
              attendance: [],
              notes: []
            };
          }
        })
      );
      
      setStudents(enhancedStudents);
      setFilteredStudents(enhancedStudents);
    } catch (err) {
      setError("Failed to load students");
      toast.error("Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredStudents(students);
    } else {
      const filtered = students.filter(student =>
        `${student.firstName} ${student.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.id.includes(searchQuery)
      );
      setFilteredStudents(filtered);
    }
  }, [searchQuery, students]);

  const handleStudentClick = (student) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedStudent(null);
  };

  const handleSaveStudent = async (studentData) => {
    try {
      await studentService.update(studentData.Id, studentData);
      
      // Update local state
      const updatedStudents = students.map(s => 
        s.Id === studentData.Id ? { ...s, ...studentData } : s
      );
      setStudents(updatedStudents);
      
      toast.success("Student updated successfully");
    } catch (err) {
      toast.error("Failed to update student");
    }
  };

  if (loading) return <Loading />;
  
  if (error) {
    return (
      <ErrorView 
        error={error} 
        onRetry={loadStudents}
        className="m-6" 
      />
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
            Students
          </h1>
          <p className="text-gray-600 mt-1">
            Manage your student roster and view their progress
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
            icon={viewMode === "grid" ? "List" : "Grid3X3"}
          >
            {viewMode === "grid" ? "List" : "Grid"}
          </Button>
          <Button
            variant="accent"
            icon="UserPlus"
            onClick={() => toast.info("Add student feature coming soon!")}
          >
            Add Student
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex-1 max-w-md">
          <SearchBar
            placeholder="Search students by name, email, or ID..."
            value={searchQuery}
            onChange={setSearchQuery}
          />
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">
            Showing {filteredStudents.length} of {students.length} students
          </span>
        </div>
      </div>

      {/* Students Grid/List */}
      {filteredStudents.length === 0 ? (
        searchQuery ? (
          <Empty
            title="No students found"
            description={`No students match "${searchQuery}". Try a different search term.`}
            icon="Search"
            actionLabel="Clear Search"
            onAction={() => setSearchQuery("")}
          />
        ) : (
          <Empty
            title="No students yet"
            description="Get started by adding your first student to the class roster."
            icon="Users"
            actionLabel="Add Student"
            onAction={() => toast.info("Add student feature coming soon!")}
          />
        )
      ) : (
        <div className={
          viewMode === "grid" 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            : "space-y-4"
        }>
          {filteredStudents.map((student) => (
            <StudentCard
              key={student.id}
              student={student}
              onClick={handleStudentClick}
              className={viewMode === "list" ? "hover:shadow-md" : ""}
            />
          ))}
        </div>
      )}

      {/* Student Detail Modal */}
      <StudentModal
        student={selectedStudent}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveStudent}
      />
    </div>
  );
};

export default Students;
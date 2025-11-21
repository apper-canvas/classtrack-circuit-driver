import React, { useState, useEffect } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import { Card, CardContent } from "@/components/atoms/Card";
import Avatar from "@/components/atoms/Avatar";
import Badge from "@/components/atoms/Badge";
import GradeIndicator from "@/components/molecules/GradeIndicator";
import AttendanceStatus from "@/components/molecules/AttendanceStatus";

const StudentModal = ({ student, isOpen, onClose, onSave, createMode = false }) => {
  const [activeTab, setActiveTab] = useState("info");
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    status: "active",
    tags: []
  });

useEffect(() => {
    if (student) {
      setFormData({
        firstName: student.firstName || "",
        lastName: student.lastName || "",
        email: student.email || "",
        phone: student.phone || "",
        status: student.status || "active",
        tags: student.tags || []
      });
    } else if (createMode) {
      // Initialize empty form for new student
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        status: "active",
        tags: []
      });
      setEditMode(true);
    }
  }, [student, createMode]);

if (!isOpen || (!student && !createMode)) return null;

  const tabs = [
    { id: "info", label: "Information", icon: "User" },
    { id: "grades", label: "Grades", icon: "BookOpen" },
    { id: "attendance", label: "Attendance", icon: "Calendar" },
    { id: "notes", label: "Notes", icon: "FileText" }
  ];

const handleSave = () => {
    const studentData = createMode ? formData : { ...student, ...formData };
    onSave?.(studentData);
    setEditMode(false);
  };

  const handleCancel = () => {
    setFormData({
      firstName: student.firstName || "",
      lastName: student.lastName || "",
      email: student.email || "",
      phone: student.phone || "",
      status: student.status || "active",
      tags: student.tags || []
    });
    setEditMode(false);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "info":
        return (
          <div className="space-y-6">
<div className="flex items-center space-x-4">
              <Avatar
                src={student?.photo}
                alt={createMode ? "New Student" : `${student?.firstName} ${student?.lastName}`}
                size="xl"
                fallback={createMode ? "NS" : `${student?.firstName?.[0] || ""}${student?.lastName?.[0] || ""}`}
              />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {createMode ? "New Student" : `${student?.firstName} ${student?.lastName}`}
                </h3>
                {!createMode && <p className="text-gray-500">Student ID: {student?.id}</p>}
                {!createMode && (
                  <Badge variant={student?.status === "active" ? "success" : "secondary"}>
                    {student?.status}
                  </Badge>
                )}
              </div>
            </div>

{editMode || createMode ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="First Name"
                  value={formData.firstName}
                  onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                  required
                />
                <Input
                  label="Last Name"
                  value={formData.lastName}
                  onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                  required
                />
                <Input
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  required
                />
                <Input
                  label="Phone"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                />
              </div>
            ) : (
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <p className="text-sm text-gray-900">{student?.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <p className="text-sm text-gray-900">{student?.phone || "Not provided"}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Enrollment Date</label>
                  <p className="text-sm text-gray-900">
                    {student?.enrollmentDate ? new Date(student.enrollmentDate).toLocaleDateString() : "N/A"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <Badge variant={student?.status === "active" ? "success" : "secondary"}>
                    {student?.status || "active"}
                  </Badge>
                </div>
              </div>
            )}

{student?.tags && student.tags.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                <div className="flex flex-wrap gap-2">
                  {student.tags.map((tag, index) => (
                    <Badge key={index} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case "grades":
        return (
<div className="space-y-4">
            {student?.grades && student.grades.length > 0 ? (
              student.grades.map((grade, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">{grade.subject}</h4>
                        <p className="text-sm text-gray-500">{grade.semester}</p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-sm text-gray-600">
                          {grade.score}/{grade.maxScore}
                        </span>
                        <GradeIndicator score={grade.score} maxScore={grade.maxScore} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-8">
                <ApperIcon name="BookOpen" size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">No grades recorded yet</p>
              </div>
            )}
          </div>
        );

      case "attendance":
        return (
<div className="space-y-4">
            {student?.attendance && student.attendance.length > 0 ? (
              student.attendance.slice(-10).reverse().map((record, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">
                          {new Date(record.date).toLocaleDateString("en-US", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric"
                          })}
                        </p>
                        {record.notes && (
                          <p className="text-sm text-gray-500 mt-1">{record.notes}</p>
                        )}
                      </div>
                      <AttendanceStatus status={record.status} />
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-8">
                <ApperIcon name="Calendar" size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">No attendance records yet</p>
              </div>
            )}
          </div>
        );

      case "notes":
        return (
<div className="space-y-4">
            {student?.notes && student.notes.length > 0 ? (
              student.notes.map((note, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <Badge variant="outline" size="sm">
                        {note.category}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {new Date(note.createdDate).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-900">{note.content}</p>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-8">
                <ApperIcon name="FileText" size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">No notes added yet</p>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
<div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            {createMode ? "Add New Student" : `${student?.firstName} ${student?.lastName}`}
          </h2>
          <div className="flex items-center space-x-2">
{activeTab === "info" && (
              <>
{editMode || createMode ? (
                  <>
                    <Button variant="outline" size="sm" onClick={handleCancel}>
                      Cancel
                    </Button>
<Button size="sm" onClick={handleSave}>
                      {createMode ? "Create Student" : "Save Changes"}
                    </Button>
                  </>
) : !createMode ? (
                  <Button size="sm" onClick={() => setEditMode(true)} icon="Edit">
                    Edit
                  </Button>
                ) : null}
              </>
            )}
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
            >
              <ApperIcon name="X" size={20} />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200",
                  activeTab === tab.id
                    ? "border-accent-500 text-accent-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                )}
              >
                <ApperIcon name={tab.icon} size={16} className="mr-2" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default StudentModal;
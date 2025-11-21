import React, { useState, useEffect } from "react";
import { cn } from "@/utils/cn";
import { Card, CardContent } from "@/components/atoms/Card";
import Avatar from "@/components/atoms/Avatar";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import ApperIcon from "@/components/ApperIcon";
import GradeIndicator from "@/components/molecules/GradeIndicator";
import AttendanceStatus from "@/components/molecules/AttendanceStatus";
import ApperFileFieldComponent from "@/components/atoms/FileUploader/ApperFileFieldComponent";

const StudentModal = ({ student, isOpen, onClose, onSave, createMode = false }) => {
  const [activeTab, setActiveTab] = useState("info");
  const [editMode, setEditMode] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [formData, setFormData] = useState({
    firstName_c: "",
    lastName_c: "",
    email_c: "",
    phone_c: "",
    status_c: "active",
    Tags: "",
    photo_c: []
  });

  useEffect(() => {
    if (student) {
setFormData({
        firstName_c: student.firstName_c || "",
        lastName_c: student.lastName_c || "",
        email_c: student.email_c || "",
        phone_c: student.phone_c || "",
        status_c: student.status_c || "active",
        Tags: student.Tags || "",
        photo_c: student.photo_c || []
      });
    } else if (createMode) {
      // Initialize empty form for new student
      setFormData({
        firstName_c: "",
        lastName_c: "",
        email_c: "",
        phone_c: "",
        status_c: "active",
        Tags: "",
        photo_c: []
      });
      setEditMode(true);
    }
  }, [student, createMode]);

  if (!isOpen || (!student && !createMode)) return null;

  const handleEditClick = () => {
    setEditMode(true);
  };

  const handleSave = async () => {
    try {
      // Get uploaded files from the file uploader
      const { ApperFileUploader } = window.ApperSDK;
      const files = ApperFileUploader?.FileField?.getFiles('photo_c') || uploadedFiles;
      
      const studentData = createMode 
        ? { ...formData, photo_c: files }
        : { ...student, ...formData, photo_c: files };
      
      onSave?.(studentData);
      setEditMode(false);
    } catch (error) {
      console.error('Error saving student:', error);
      const studentData = createMode ? formData : { ...student, ...formData };
      onSave?.(studentData);
      setEditMode(false);
    }
  };

  const handleCancel = () => {
setFormData({
      firstName_c: student?.firstName_c || "",
      lastName_c: student?.lastName_c || "",
      email_c: student?.email_c || "",
      phone_c: student?.phone_c || "",
      status_c: student?.status_c || "active",
      Tags: student?.Tags || "",
      photo_c: student?.photo_c || []
    });
    setEditMode(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-4">
              <Avatar
src={student?.photo_c?.[0]?.url}
                alt={createMode ? "New Student" : `${student?.firstName_c} ${student?.lastName_c}`}
                size="xl"
                fallback={createMode ? "NS" : `${student?.firstName_c?.[0] || ""}${student?.lastName_c?.[0] || ""}`}
              />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
{createMode ? "New Student" : `${student?.firstName_c} ${student?.lastName_c}`}
                </h3>
{!createMode && <p className="text-gray-500">Student ID: {student?.Id}</p>}
                {!createMode && (
<Badge variant={student?.status_c === "active" ? "success" : "secondary"}>
                    {student?.status_c}
                  </Badge>
                )}
              </div>
            </div>
            {editMode || createMode ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="First Name"
                    value={formData.firstName_c}
                    onChange={(e) => setFormData(prev => ({ ...prev, firstName_c: e.target.value }))}
                    required
                  />
                  <Input
                    label="Last Name"
                    value={formData.lastName_c}
                    onChange={(e) => setFormData(prev => ({ ...prev, lastName_c: e.target.value }))}
                    required
                  />
                  <Input
                    label="Email"
                    type="email"
                    value={formData.email_c}
                    onChange={(e) => setFormData(prev => ({ ...prev, email_c: e.target.value }))}
                    required
                  />
                  <Input
                    label="Phone"
                    value={formData.phone_c}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone_c: e.target.value }))}
                  />
                  <div className="md:col-span-2">
                    <Input
                      label="Tags (comma separated)"
                      value={formData.Tags}
                      onChange={(e) => setFormData(prev => ({ ...prev, Tags: e.target.value }))}
                      placeholder="e.g. honor-roll, athlete, needs-help"
                    />
                  </div>
                </div>
                
                {/* Photo Upload Section */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Student Photo
                  </label>
                  <ApperFileFieldComponent
                    elementId="student-photo"
                    config={{
                      fieldName: 'photo_c',
                      fieldKey: 'photo_c',
                      tableName: 'students_c',
                      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
                      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY,
                      existingFiles: formData.photo_c || [],
                      fileCount: (formData.photo_c || []).length
                    }}
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
<p className="text-sm text-gray-900">{student?.email_c}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <p className="text-sm text-gray-900">{student?.phone_c || "Not provided"}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Enrollment Date</label>
                  <p className="text-sm text-gray-900">
                    {student?.enrollmentDate_c ? new Date(student.enrollmentDate_c).toLocaleDateString() : "N/A"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <Badge variant={student?.status_c === "active" ? "success" : "secondary"}>
                    {student?.status_c || "active"}
                  </Badge>
                </div>
              </div>
            )}

            {student?.Tags && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                <div className="flex flex-wrap gap-2">
                  {student.Tags.split(',').map((tag, index) => (
                    <Badge key={index} variant="outline">
                      {tag.trim()}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="flex space-x-2">
              {editMode || createMode ? (
                <>
                  <Button onClick={handleSave} variant="primary">
                    {createMode ? "Add Student" : "Save Changes"}
                  </Button>
                  <Button onClick={handleCancel} variant="secondary">
                    Cancel
                  </Button>
                </>
              ) : (
                <Button onClick={handleEditClick} variant="primary">
                  Edit
                </Button>
              )}
              <Button onClick={onClose} variant="secondary">
                <ApperIcon name="X" size={16} />
              </Button>
            </div>
          </div>

          {/* Tab Navigation */}
          {!createMode && (
            <div className="flex border-b border-gray-200">
              {["info", "grades", "attendance", "notes"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "px-6 py-3 text-sm font-medium capitalize border-b-2 transition-colors",
                    activeTab === tab
                      ? "border-primary-500 text-primary-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>
          )}

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {activeTab === "grades" && (
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">Grades</h4>
                {student?.grades && student.grades.length > 0 ? (
                  student.grades.map((grade, index) => (
                    <Card key={index}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-gray-900">{grade.subject_c}</h4>
                            <p className="text-sm text-gray-500">{grade.semester_c}</p>
                          </div>
                          <div className="flex items-center space-x-3">
                            <span className="text-sm text-gray-600">
                              {grade.score_c}/{grade.maxScore_c}
                            </span>
                            <GradeIndicator score={grade.score_c} maxScore={grade.maxScore_c} />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <p className="text-gray-500">No grades recorded.</p>
                )}
              </div>
            )}

            {activeTab === "attendance" && (
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">Recent Attendance</h4>
                {student?.attendance && student.attendance.length > 0 ? (
                  student.attendance.slice(-10).reverse().map((record, index) => (
                    <Card key={index}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900">
                              {new Date(record.date_c).toLocaleDateString("en-US", {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric"
                              })}
                            </p>
                            {record.notes_c && (
                              <p className="text-sm text-gray-500 mt-1">{record.notes_c}</p>
                            )}
                          </div>
                          <AttendanceStatus status={record.status_c} />
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <p className="text-gray-500">No attendance records.</p>
                )}
              </div>
            )}

            {activeTab === "notes" && (
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">Notes</h4>
                {student?.notes && student.notes.length > 0 ? (
                  student.notes.map((note, index) => (
                    <Card key={index}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <Badge variant="outline" size="sm">
                            {note.category_c}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {new Date(note.createdDate_c).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-gray-900">{note.content_c}</p>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <p className="text-gray-500">No notes recorded.</p>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-gray-200">
<h2 className="text-xl font-semibold text-gray-900">
              {createMode ? "Add New Student" : `${student?.firstName_c} ${student?.lastName_c}`}
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentModal;
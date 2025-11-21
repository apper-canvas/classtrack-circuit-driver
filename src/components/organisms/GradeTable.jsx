import React, { useState } from "react";
import { cn } from "@/utils/cn";
import { Card, CardContent } from "@/components/atoms/Card";
import Input from "@/components/atoms/Input";
import ApperIcon from "@/components/ApperIcon";
import GradeIndicator from "@/components/molecules/GradeIndicator";
import Avatar from "@/components/atoms/Avatar";

const GradeTable = ({ students, grades, onGradeUpdate }) => {
  const [editingCell, setEditingCell] = useState(null);
  const [editValue, setEditValue] = useState("");
  
  const subjects = ["Mathematics", "Science", "English", "History", "Art"];
  const semesters = ["Fall 2024", "Spring 2024"];

  const getGrade = (studentId, subject, semester) => {
return grades.find(g => 
      g.studentId_c === parseInt(studentId) && 
      g.subject_c === subject && 
      g.semester_c === semester
    );
  };

  const handleCellClick = (studentId, subject, semester) => {
    const grade = getGrade(studentId, subject, semester);
    setEditingCell(`${studentId}-${subject}-${semester}`);
    setEditValue(grade ? grade.score.toString() : "");
  };

  const handleCellSave = (studentId, subject, semester) => {
    const score = parseFloat(editValue);
    if (!isNaN(score) && score >= 0 && score <= 100) {
      const existingGrade = getGrade(studentId, subject, semester);
      const gradeData = {
id: existingGrade ? existingGrade.Id : Date.now(),
        studentId_c: parseInt(studentId),
        subject_c: subject,
        semester_c: semester,
        score_c: score,
        maxScore_c: 100,
        weight_c: 1,
        enteredDate_c: new Date().toISOString()
      };
      onGradeUpdate?.(gradeData);
    }
    setEditingCell(null);
    setEditValue("");
  };

  const handleCellCancel = () => {
    setEditingCell(null);
    setEditValue("");
  };

  const calculateStudentAverage = (studentId) => {
const studentGrades = grades.filter(g => g.studentId_c === parseInt(studentId));
    if (studentGrades.length === 0) return 0;
    return Math.round(
      studentGrades.reduce((acc, grade) => acc + (grade.score_c / grade.maxScore_c * 100), 0) / studentGrades.length
    );
  };

const calculateSubjectAverage = (subject, semester) => {
    const subjectGrades = grades.filter(g => g.subject_c === subject && g.semester_c === semester);
    if (subjectGrades.length === 0) return 0;
    return Math.round(
      subjectGrades.reduce((acc, grade) => acc + (grade.score_c / grade.maxScore_c * 100), 0) / subjectGrades.length
    );
  };

  return (
    <div className="space-y-6">
      {semesters.map((semester) => (
        <Card key={semester}>
          <CardContent className="p-0">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">{semester}</h3>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-0 bg-gray-50 z-10">
                      Student
                    </th>
                    {subjects.map((subject) => (
                      <th key={subject} className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <div>{subject}</div>
                        <div className="text-xs font-normal mt-1">
                          Avg: {calculateSubjectAverage(subject, semester)}%
                        </div>
                      </th>
                    ))}
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Average
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {students.map((student, studentIndex) => (
                    <tr key={student.id} className={studentIndex % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      <td className="px-6 py-4 whitespace-nowrap sticky left-0 bg-inherit z-10 border-r border-gray-200">
                        <div className="flex items-center">
                          <Avatar
src={student.photo_c?.[0]?.url}
                            alt={`${student.firstName_c} ${student.lastName_c}`}
                            size="sm"
                            fallback={`${student.firstName_c?.[0] || 'N'}${student.lastName_c?.[0] || 'A'}`}
                          />
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">
                              {student.firstName_c} {student.lastName_c}
                            </div>
                            <div className="text-sm text-gray-500">ID: {student.Id}</div>
                          </div>
                        </div>
                      </td>
                      {subjects.map((subject) => {
const grade = getGrade(student.Id, subject, semester);
                        const cellKey = `${student.id}-${subject}-${semester}`;
                        const isEditing = editingCell === cellKey;
                        
                        return (
                          <td key={subject} className="px-6 py-4 whitespace-nowrap text-center">
                            {isEditing ? (
                              <div className="flex items-center justify-center space-x-2">
                                <Input
                                  type="number"
                                  value={editValue}
                                  onChange={(e) => setEditValue(e.target.value)}
                                  className="w-16 text-center"
                                  min="0"
                                  max="100"
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") {
handleCellSave(student.Id, subject, semester);
                                    } else if (e.key === "Escape") {
                                      handleCellCancel();
                                    }
                                  }}
                                  autoFocus
                                />
                                <div className="flex space-x-1">
                                  <button
onClick={() => handleCellSave(student.Id, subject, semester)}
                                    className="p-1 text-green-600 hover:bg-green-100 rounded"
                                  >
                                    <ApperIcon name="Check" size={14} />
                                  </button>
                                  <button
                                    onClick={handleCellCancel}
                                    className="p-1 text-red-600 hover:bg-red-100 rounded"
                                  >
                                    <ApperIcon name="X" size={14} />
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div
onClick={() => handleCellClick(student.Id, subject, semester)}
                                className="cursor-pointer hover:bg-gray-100 p-2 rounded transition-colors duration-200 flex justify-center"
                              >
{grade ? (
                                  <GradeIndicator score={grade.score_c} maxScore={grade.maxScore_c} showBadge={false} size="sm" />
                                ) : (
                                  <span className="text-gray-400 text-sm">-</span>
                                )}
                              </div>
                            )}
                          </td>
                        );
                      })}
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <GradeIndicator 
score={calculateStudentAverage(student.Id)}
                          showBadge={false} 
                          size="sm" 
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default GradeTable;
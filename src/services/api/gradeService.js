import gradesData from "@/services/mockData/grades.json";

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let grades = [...gradesData];

export const gradeService = {
  async getAll() {
    await delay(300);
    return grades.map(grade => ({ ...grade }));
  },

  async getById(id) {
    await delay(200);
    const grade = grades.find(grade => grade.Id === parseInt(id));
    if (!grade) {
      throw new Error("Grade not found");
    }
    return { ...grade };
  },

  async getByStudentId(studentId) {
    await delay(250);
    return grades
      .filter(grade => grade.studentId === studentId)
      .map(grade => ({ ...grade }));
  },

  async create(gradeData) {
    await delay(400);
    const maxId = grades.reduce((max, grade) => Math.max(max, grade.Id), 0);
    const newGrade = {
      ...gradeData,
      Id: maxId + 1,
      enteredDate: new Date().toISOString()
    };
    grades.push(newGrade);
    return { ...newGrade };
  },

  async update(id, gradeData) {
    await delay(300);
    const index = grades.findIndex(grade => grade.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Grade not found");
    }
    grades[index] = { ...grades[index], ...gradeData };
    return { ...grades[index] };
  },

  async upsert(gradeData) {
    await delay(350);
    const existing = grades.find(g => 
      g.studentId === gradeData.studentId && 
      g.subject === gradeData.subject && 
      g.semester === gradeData.semester
    );
    
    if (existing) {
      const index = grades.findIndex(grade => grade.Id === existing.Id);
      grades[index] = { ...grades[index], ...gradeData };
      return { ...grades[index] };
    } else {
      const maxId = grades.reduce((max, grade) => Math.max(max, grade.Id), 0);
      const newGrade = {
        ...gradeData,
        Id: maxId + 1,
        enteredDate: new Date().toISOString()
      };
      grades.push(newGrade);
      return { ...newGrade };
    }
  },

  async delete(id) {
    await delay(200);
    const index = grades.findIndex(grade => grade.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Grade not found");
    }
    const deletedGrade = grades[index];
    grades.splice(index, 1);
    return { ...deletedGrade };
  }
};
import studentsData from "@/services/mockData/students.json";

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let students = [...studentsData];

export const studentService = {
  async getAll() {
    await delay(300);
    return students.map(student => ({ ...student }));
  },

  async getById(id) {
    await delay(200);
    const student = students.find(student => student.Id === parseInt(id));
    if (!student) {
      throw new Error("Student not found");
    }
    return { ...student };
  },

  async create(studentData) {
    await delay(400);
    const maxId = students.reduce((max, student) => Math.max(max, student.Id), 0);
    const newStudent = {
      ...studentData,
      Id: maxId + 1,
      enrollmentDate: new Date().toISOString().split("T")[0],
      status: "active"
    };
    students.push(newStudent);
    return { ...newStudent };
  },

  async update(id, studentData) {
    await delay(300);
    const index = students.findIndex(student => student.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Student not found");
    }
    students[index] = { ...students[index], ...studentData };
    return { ...students[index] };
  },

  async delete(id) {
    await delay(200);
    const index = students.findIndex(student => student.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Student not found");
    }
    const deletedStudent = students[index];
    students.splice(index, 1);
    return { ...deletedStudent };
  },

  async search(query) {
    await delay(250);
    const lowerQuery = query.toLowerCase();
    return students
      .filter(student => 
        student.firstName.toLowerCase().includes(lowerQuery) ||
        student.lastName.toLowerCase().includes(lowerQuery) ||
        student.email.toLowerCase().includes(lowerQuery)
      )
      .map(student => ({ ...student }));
  }
};
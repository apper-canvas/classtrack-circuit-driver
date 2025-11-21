import attendanceData from "@/services/mockData/attendance.json";

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let attendance = [...attendanceData];

export const attendanceService = {
  async getAll() {
    await delay(300);
    return attendance.map(record => ({ ...record }));
  },

  async getById(id) {
    await delay(200);
    const record = attendance.find(record => record.Id === parseInt(id));
    if (!record) {
      throw new Error("Attendance record not found");
    }
    return { ...record };
  },

  async getByStudentId(studentId) {
    await delay(250);
    return attendance
      .filter(record => record.studentId === studentId)
      .map(record => ({ ...record }));
  },

  async getByDate(date) {
    await delay(250);
    return attendance
      .filter(record => record.date === date)
      .map(record => ({ ...record }));
  },

  async create(attendanceData) {
    await delay(400);
    const maxId = attendance.reduce((max, record) => Math.max(max, record.Id), 0);
    const newRecord = {
      ...attendanceData,
      Id: maxId + 1
    };
    attendance.push(newRecord);
    return { ...newRecord };
  },

  async update(id, attendanceData) {
    await delay(300);
    const index = attendance.findIndex(record => record.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Attendance record not found");
    }
    attendance[index] = { ...attendance[index], ...attendanceData };
    return { ...attendance[index] };
  },

  async upsert(attendanceData) {
    await delay(350);
    const existing = attendance.find(a => 
      a.studentId === attendanceData.studentId && 
      a.date === attendanceData.date
    );
    
    if (existing) {
      const index = attendance.findIndex(record => record.Id === existing.Id);
      attendance[index] = { ...attendance[index], ...attendanceData };
      return { ...attendance[index] };
    } else {
      const maxId = attendance.reduce((max, record) => Math.max(max, record.Id), 0);
      const newRecord = {
        ...attendanceData,
        Id: maxId + 1
      };
      attendance.push(newRecord);
      return { ...newRecord };
    }
  },

  async delete(id) {
    await delay(200);
    const index = attendance.findIndex(record => record.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Attendance record not found");
    }
    const deletedRecord = attendance[index];
    attendance.splice(index, 1);
    return { ...deletedRecord };
  }
};
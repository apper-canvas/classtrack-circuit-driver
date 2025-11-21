import notesData from "@/services/mockData/notes.json";

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let notes = [...notesData];

export const noteService = {
  async getAll() {
    await delay(300);
    return notes.map(note => ({ ...note }));
  },

  async getById(id) {
    await delay(200);
    const note = notes.find(note => note.Id === parseInt(id));
    if (!note) {
      throw new Error("Note not found");
    }
    return { ...note };
  },

  async getByStudentId(studentId) {
    await delay(250);
    return notes
      .filter(note => note.studentId === studentId)
      .map(note => ({ ...note }))
      .sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));
  },

  async create(noteData) {
    await delay(400);
    const maxId = notes.reduce((max, note) => Math.max(max, note.Id), 0);
    const newNote = {
      ...noteData,
      Id: maxId + 1,
      createdDate: new Date().toISOString()
    };
    notes.push(newNote);
    return { ...newNote };
  },

  async update(id, noteData) {
    await delay(300);
    const index = notes.findIndex(note => note.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Note not found");
    }
    notes[index] = { ...notes[index], ...noteData };
    return { ...notes[index] };
  },

  async delete(id) {
    await delay(200);
    const index = notes.findIndex(note => note.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Note not found");
    }
    const deletedNote = notes[index];
    notes.splice(index, 1);
    return { ...deletedNote };
  }
};
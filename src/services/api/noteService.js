import { getApperClient } from "@/services/apperClient";

export const noteService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const response = await apperClient.fetchRecords('notes_c', {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "studentId_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "content_c"}},
          {"field": {"Name": "createdDate_c"}},
          {"field": {"Name": "Tags"}}
        ],
        orderBy: [{
          fieldName: "createdDate_c",
          sorttype: "DESC"
        }]
      });

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching notes:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const response = await apperClient.getRecordById('notes_c', id, {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "studentId_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "content_c"}},
          {"field": {"Name": "createdDate_c"}},
          {"field": {"Name": "Tags"}}
        ]
      });

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching note ${id}:`, error?.response?.data?.message || error);
      throw error;
    }
  },

  async getByStudentId(studentId) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const response = await apperClient.fetchRecords('notes_c', {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "studentId_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "content_c"}},
          {"field": {"Name": "createdDate_c"}},
          {"field": {"Name": "Tags"}}
        ],
        where: [{
          FieldName: "studentId_c",
          Operator: "EqualTo",
          Values: [parseInt(studentId)]
        }],
        orderBy: [{
          fieldName: "createdDate_c",
          sorttype: "DESC"
        }]
      });

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching notes by student ID:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async create(noteData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const payload = {
        records: [{
          Name: `Note - ${noteData.category_c || noteData.category || 'General'}`,
          studentId_c: parseInt(noteData.studentId_c || noteData.studentId),
          category_c: noteData.category_c || noteData.category,
          content_c: noteData.content_c || noteData.content,
          createdDate_c: noteData.createdDate_c || new Date().toISOString(),
          ...(noteData.Tags && { Tags: noteData.Tags })
        }]
      };

      const response = await apperClient.createRecord('notes_c', payload);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} notes:`, failed);
          throw new Error(failed[0].message || "Failed to create note");
        }

        return successful[0]?.data;
      }
      
      return response.data;
    } catch (error) {
      console.error("Error creating note:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async update(id, noteData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const payload = {
        records: [{
          Id: parseInt(id),
          ...(noteData.Name && { Name: noteData.Name }),
          ...(noteData.studentId_c && { studentId_c: parseInt(noteData.studentId_c) }),
          ...(noteData.category_c && { category_c: noteData.category_c }),
          ...(noteData.content_c && { content_c: noteData.content_c }),
          ...(noteData.createdDate_c && { createdDate_c: noteData.createdDate_c }),
          ...(noteData.Tags && { Tags: noteData.Tags })
        }]
      };

      const response = await apperClient.updateRecord('notes_c', payload);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} notes:`, failed);
          throw new Error(failed[0].message || "Failed to update note");
        }

        return successful[0]?.data;
      }
      
      return response.data;
    } catch (error) {
      console.error("Error updating note:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const response = await apperClient.deleteRecord('notes_c', {
        RecordIds: [parseInt(id)]
      });

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} notes:`, failed);
          throw new Error(failed[0].message || "Failed to delete note");
        }

        return successful.length > 0;
      }

      return true;
    } catch (error) {
      console.error("Error deleting note:", error?.response?.data?.message || error);
      throw error;
    }
  }
};
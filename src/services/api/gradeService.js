import { getApperClient } from "@/services/apperClient";

export const gradeService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const response = await apperClient.fetchRecords('grades_c', {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "studentId_c"}},
          {"field": {"Name": "subject_c"}},
          {"field": {"Name": "semester_c"}},
          {"field": {"Name": "score_c"}},
          {"field": {"Name": "maxScore_c"}},
          {"field": {"Name": "enteredDate_c"}},
          {"field": {"Name": "weight_c"}},
          {"field": {"Name": "Tags"}}
        ]
      });

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching grades:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const response = await apperClient.getRecordById('grades_c', id, {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "studentId_c"}},
          {"field": {"Name": "subject_c"}},
          {"field": {"Name": "semester_c"}},
          {"field": {"Name": "score_c"}},
          {"field": {"Name": "maxScore_c"}},
          {"field": {"Name": "enteredDate_c"}},
          {"field": {"Name": "weight_c"}},
          {"field": {"Name": "Tags"}}
        ]
      });

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching grade ${id}:`, error?.response?.data?.message || error);
      throw error;
    }
  },

  async getByStudentId(studentId) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const response = await apperClient.fetchRecords('grades_c', {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "studentId_c"}},
          {"field": {"Name": "subject_c"}},
          {"field": {"Name": "semester_c"}},
          {"field": {"Name": "score_c"}},
          {"field": {"Name": "maxScore_c"}},
          {"field": {"Name": "enteredDate_c"}},
          {"field": {"Name": "weight_c"}},
          {"field": {"Name": "Tags"}}
        ],
        where: [{
          FieldName: "studentId_c",
          Operator: "EqualTo",
          Values: [parseInt(studentId)]
        }]
      });

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching grades by student ID:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async create(gradeData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const payload = {
        records: [{
          Name: `${gradeData.subject_c || 'Grade'} - ${gradeData.semester_c || ''}`,
          studentId_c: parseInt(gradeData.studentId_c || gradeData.studentId),
          subject_c: gradeData.subject_c || gradeData.subject,
          semester_c: gradeData.semester_c || gradeData.semester,
          score_c: parseFloat(gradeData.score_c || gradeData.score),
          maxScore_c: parseFloat(gradeData.maxScore_c || gradeData.maxScore || 100),
          enteredDate_c: gradeData.enteredDate_c || new Date().toISOString(),
          weight_c: parseFloat(gradeData.weight_c || gradeData.weight || 1),
          ...(gradeData.Tags && { Tags: gradeData.Tags })
        }]
      };

      const response = await apperClient.createRecord('grades_c', payload);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} grades:`, failed);
          throw new Error(failed[0].message || "Failed to create grade");
        }

        return successful[0]?.data;
      }
      
      return response.data;
    } catch (error) {
      console.error("Error creating grade:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async update(id, gradeData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const payload = {
        records: [{
          Id: parseInt(id),
          ...(gradeData.Name && { Name: gradeData.Name }),
          ...(gradeData.studentId_c && { studentId_c: parseInt(gradeData.studentId_c) }),
          ...(gradeData.subject_c && { subject_c: gradeData.subject_c }),
          ...(gradeData.semester_c && { semester_c: gradeData.semester_c }),
          ...(gradeData.score_c !== undefined && { score_c: parseFloat(gradeData.score_c) }),
          ...(gradeData.maxScore_c && { maxScore_c: parseFloat(gradeData.maxScore_c) }),
          ...(gradeData.enteredDate_c && { enteredDate_c: gradeData.enteredDate_c }),
          ...(gradeData.weight_c && { weight_c: parseFloat(gradeData.weight_c) }),
          ...(gradeData.Tags && { Tags: gradeData.Tags })
        }]
      };

      const response = await apperClient.updateRecord('grades_c', payload);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} grades:`, failed);
          throw new Error(failed[0].message || "Failed to update grade");
        }

        return successful[0]?.data;
      }
      
      return response.data;
    } catch (error) {
      console.error("Error updating grade:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async upsert(gradeData) {
    try {
      // First check if grade exists
      const existingGrades = await this.getByStudentId(gradeData.studentId);
      const existing = existingGrades.find(g => 
        g.subject_c === (gradeData.subject_c || gradeData.subject) && 
        g.semester_c === (gradeData.semester_c || gradeData.semester)
      );
      
      if (existing) {
        return await this.update(existing.Id, {
          score_c: gradeData.score || gradeData.score_c,
          maxScore_c: gradeData.maxScore || gradeData.maxScore_c || 100,
          enteredDate_c: new Date().toISOString(),
          weight_c: gradeData.weight || gradeData.weight_c || 1
        });
      } else {
        return await this.create(gradeData);
      }
    } catch (error) {
      console.error("Error upserting grade:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const response = await apperClient.deleteRecord('grades_c', {
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
          console.error(`Failed to delete ${failed.length} grades:`, failed);
          throw new Error(failed[0].message || "Failed to delete grade");
        }

        return successful.length > 0;
      }

      return true;
    } catch (error) {
      console.error("Error deleting grade:", error?.response?.data?.message || error);
      throw error;
    }
  }
};
import { getApperClient } from "@/services/apperClient";

export const attendanceService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const response = await apperClient.fetchRecords('attendance_c', {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "studentId_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "Tags"}}
        ]
      });

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching attendance:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const response = await apperClient.getRecordById('attendance_c', id, {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "studentId_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "Tags"}}
        ]
      });

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching attendance ${id}:`, error?.response?.data?.message || error);
      throw error;
    }
  },

  async getByStudentId(studentId) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const response = await apperClient.fetchRecords('attendance_c', {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "studentId_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "notes_c"}},
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
      console.error("Error fetching attendance by student ID:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async getByDate(date) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const response = await apperClient.fetchRecords('attendance_c', {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "studentId_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "Tags"}}
        ],
        where: [{
          FieldName: "date_c",
          Operator: "EqualTo",
          Values: [date]
        }]
      });

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching attendance by date:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async create(attendanceData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const payload = {
        records: [{
          Name: `Attendance - ${attendanceData.date_c || attendanceData.date}`,
          studentId_c: parseInt(attendanceData.studentId_c || attendanceData.studentId),
          date_c: attendanceData.date_c || attendanceData.date,
          status_c: attendanceData.status_c || attendanceData.status,
          ...(attendanceData.notes_c && { notes_c: attendanceData.notes_c }),
          ...(attendanceData.notes && { notes_c: attendanceData.notes }),
          ...(attendanceData.Tags && { Tags: attendanceData.Tags })
        }]
      };

      const response = await apperClient.createRecord('attendance_c', payload);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} attendance records:`, failed);
          throw new Error(failed[0].message || "Failed to create attendance record");
        }

        return successful[0]?.data;
      }
      
      return response.data;
    } catch (error) {
      console.error("Error creating attendance:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async update(id, attendanceData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const payload = {
        records: [{
          Id: parseInt(id),
          ...(attendanceData.Name && { Name: attendanceData.Name }),
          ...(attendanceData.studentId_c && { studentId_c: parseInt(attendanceData.studentId_c) }),
          ...(attendanceData.date_c && { date_c: attendanceData.date_c }),
          ...(attendanceData.status_c && { status_c: attendanceData.status_c }),
          ...(attendanceData.notes_c !== undefined && { notes_c: attendanceData.notes_c }),
          ...(attendanceData.Tags && { Tags: attendanceData.Tags })
        }]
      };

      const response = await apperClient.updateRecord('attendance_c', payload);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} attendance records:`, failed);
          throw new Error(failed[0].message || "Failed to update attendance record");
        }

        return successful[0]?.data;
      }
      
      return response.data;
    } catch (error) {
      console.error("Error updating attendance:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async upsert(attendanceData) {
    try {
      // First check if attendance record exists for this student and date
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const response = await apperClient.fetchRecords('attendance_c', {
        fields: [{"field": {"Name": "Name"}}],
        whereGroups: [{
          operator: "AND",
          subGroups: [
            {
              conditions: [
                {
                  fieldName: "studentId_c",
                  operator: "EqualTo",
                  values: [parseInt(attendanceData.studentId || attendanceData.studentId_c)]
                }
              ]
            },
            {
              conditions: [
                {
                  fieldName: "date_c",
                  operator: "EqualTo", 
                  values: [attendanceData.date || attendanceData.date_c]
                }
              ]
            }
          ]
        }]
      });

      if (response.success && response.data && response.data.length > 0) {
        // Update existing record
        return await this.update(response.data[0].Id, {
          status_c: attendanceData.status || attendanceData.status_c,
          notes_c: attendanceData.notes || attendanceData.notes_c || ""
        });
      } else {
        // Create new record
        return await this.create(attendanceData);
      }
    } catch (error) {
      console.error("Error upserting attendance:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const response = await apperClient.deleteRecord('attendance_c', {
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
          console.error(`Failed to delete ${failed.length} attendance records:`, failed);
          throw new Error(failed[0].message || "Failed to delete attendance record");
        }

        return successful.length > 0;
      }

      return true;
    } catch (error) {
      console.error("Error deleting attendance:", error?.response?.data?.message || error);
      throw error;
    }
  }
};
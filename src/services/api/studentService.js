import { getApperClient } from "@/services/apperClient";

export const studentService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const response = await apperClient.fetchRecords('students_c', {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "firstName_c"}},
          {"field": {"Name": "lastName_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "enrollmentDate_c"}},
          {"field": {"Name": "photo_c"}},
          {"field": {"Name": "Tags"}}
        ]
      });

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching students:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const response = await apperClient.getRecordById('students_c', id, {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "firstName_c"}},
          {"field": {"Name": "lastName_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "enrollmentDate_c"}},
          {"field": {"Name": "photo_c"}},
          {"field": {"Name": "Tags"}}
        ]
      });

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching student ${id}:`, error?.response?.data?.message || error);
      throw error;
    }
  },

  async create(studentData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      // Only include updateable fields
      const payload = {
        records: [{
          Name: `${studentData.firstName_c || ''} ${studentData.lastName_c || ''}`.trim(),
          firstName_c: studentData.firstName_c,
          lastName_c: studentData.lastName_c,
          email_c: studentData.email_c,
          phone_c: studentData.phone_c,
          status_c: studentData.status_c || "active",
          enrollmentDate_c: studentData.enrollmentDate_c || new Date().toISOString().split("T")[0],
          ...(studentData.Tags && { Tags: studentData.Tags }),
          ...(studentData.photo_c && { photo_c: studentData.photo_c })
        }]
      };

      const response = await apperClient.createRecord('students_c', payload);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} students:`, failed);
          throw new Error(failed[0].message || "Failed to create student");
        }

        return successful[0]?.data;
      }
      
      return response.data;
    } catch (error) {
      console.error("Error creating student:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async update(id, studentData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      // Only include updateable fields that have values
      const payload = {
        records: [{
          Id: parseInt(id),
          ...(studentData.Name && { Name: studentData.Name }),
          ...(studentData.firstName_c && { firstName_c: studentData.firstName_c }),
          ...(studentData.lastName_c && { lastName_c: studentData.lastName_c }),
          ...(studentData.email_c && { email_c: studentData.email_c }),
          ...(studentData.phone_c && { phone_c: studentData.phone_c }),
          ...(studentData.status_c && { status_c: studentData.status_c }),
          ...(studentData.enrollmentDate_c && { enrollmentDate_c: studentData.enrollmentDate_c }),
          ...(studentData.Tags && { Tags: studentData.Tags }),
          ...(studentData.photo_c !== undefined && { photo_c: studentData.photo_c })
        }]
      };

      const response = await apperClient.updateRecord('students_c', payload);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} students:`, failed);
          throw new Error(failed[0].message || "Failed to update student");
        }

        return successful[0]?.data;
      }
      
      return response.data;
    } catch (error) {
      console.error("Error updating student:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const response = await apperClient.deleteRecord('students_c', {
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
          console.error(`Failed to delete ${failed.length} students:`, failed);
          throw new Error(failed[0].message || "Failed to delete student");
        }

        return successful.length > 0;
      }

      return true;
    } catch (error) {
      console.error("Error deleting student:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async search(query) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const response = await apperClient.fetchRecords('students_c', {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "firstName_c"}},
          {"field": {"Name": "lastName_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "enrollmentDate_c"}},
          {"field": {"Name": "photo_c"}},
          {"field": {"Name": "Tags"}}
        ],
        whereGroups: [{
          operator: "OR",
          subGroups: [
            {
              conditions: [
                {
                  fieldName: "firstName_c",
                  operator: "Contains",
                  values: [query]
                }
              ],
              operator: "OR"
            },
            {
              conditions: [
                {
                  fieldName: "lastName_c", 
                  operator: "Contains",
                  values: [query]
                }
              ],
              operator: "OR"
            },
            {
              conditions: [
                {
                  fieldName: "email_c",
                  operator: "Contains", 
                  values: [query]
                }
              ],
              operator: "OR"
            }
          ]
        }]
      });

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      console.error("Error searching students:", error?.response?.data?.message || error);
      throw error;
    }
  }
};
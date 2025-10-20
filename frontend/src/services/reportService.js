import api from '../api/api';

const reportService = {
  generateSalarySheet: async (data) => {
    try {
      const response = await api.post('/api/v1/reports/generate-sheet', data);
      return response.data.data; // return only the data
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getSalarySheet: async (sheetId) => {
    if (!sheetId) throw new Error('sheetId is required');
    try {
      const response = await api.get(`/api/v1/reports/sheet/${sheetId}`);
      return response.data.data; // return sheet data
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getAllSalarySheets: async () => {
    try {
      const response = await api.get('/api/v1/reports/all-sheets');
      return response.data.data || []; // return array
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getCompanySummary: async (accountNumber) => {
    if (!accountNumber) throw new Error('accountNumber is required');
    try {
      const response = await api.get(`/api/v1/reports/company-summary/${accountNumber}`);
      return response.data.data; // return summary object
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default reportService;

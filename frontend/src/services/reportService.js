import api from '../api/api';

const reportService = {
    /**
     * Generate a salary sheet
     */
    generateSalarySheet: async (data) => {
        try {
            const response = await api.post('/api/v1/reports/generate-sheet', data);
            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : error.message;
        }
    },

    /**
     * Get salary sheet by ID
     */
    getSalarySheet: async (sheetId) => {
        try {
            const response = await api.get(`/api/v1/reports/sheet/${sheetId}`);
            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : error.message;
        }
    },

    /**
     * Get all salary sheets
     */
    getAllSalarySheets: async () => {
        try {
            const response = await api.get('/api/v1/reports/all-sheets');
            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : error.message;
        }
    },

    /**
     * Get company summary by account number
     */
    getCompanySummary: async (accountNumber) => {
        try {
            const response = await api.get(`/api/v1/reports/company-summary/${accountNumber}`);
            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : error.message;
        }
    }
};

export default reportService;

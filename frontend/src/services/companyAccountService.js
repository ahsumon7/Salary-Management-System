import api from '../api/api';

const companyAccountService = {
  /**
   * Get company account balance
   */
  getBalance: async (accountNumber) => {
    const response = await api.get(`/api/v1/company-bank/${accountNumber}/balance`);
    return response.data;
  },

  /**
   * Add funds to company account
   */
  addFunds: async (accountNumber, amount) => {
    const response = await api.post(`/api/v1/company-bank/${accountNumber}/add-funds`, { amount });
    return response.data;
  },

  /**
   * Process salary transfer
   */
  processSalary: async (companyAccountId) => {
    const response = await api.post(`/api/v1/salary-transfer/${companyAccountId}/process`);
    return response.data;
  },

  /**
   * Get salary sheet for a company account
   */
  getSalarySheet: async (companyAccountId) => {
    const response = await api.get(`/api/v1/salary-transfer/${companyAccountId}/salary-sheet`);
    return response.data;
  },
};

export default companyAccountService;

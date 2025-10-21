// src/services/companyAccountService.js
import api from '../api/api';

const companyAccountService = {
  /**
   * ✅ Get all company accounts
   */
  getAllAccounts: async () => {
    try {
      const response = await api.get('/api/v1/company-bank');
      return response.data; // { success, message, data: [...] }
    } catch (error) {
      console.error('Error fetching accounts:', error);
      throw error.response?.data || { success: false, message: 'Failed to fetch accounts' };
    }
  },

  /**
   * ✅ Create a new company account
   */
  createAccount: async (accountData) => {
    try {
      const response = await api.post('/api/v1/company-bank', accountData);
      return response.data;
    } catch (error) {
      console.error('Error creating account:', error);
      throw error.response?.data || { success: false, message: 'Failed to create account' };
    }
  },

  /**
   * ✅ Get single company account by account number
   */
  getCompanyAccount: async (accountNumber) => {
    try {
      const response = await api.get(`/api/v1/company-bank/${accountNumber}`);
      return response.data?.data || {}; // extract data object directly
    } catch (error) {
      console.error('Error fetching account:', error);
      throw error.response?.data || { success: false, message: 'Failed to fetch account' };
    }
  },

  /**
   * ✅ Add funds to company account
   */
  addFunds: async (accountNumber, amount) => {
    try {
      const response = await api.post(
        `/api/v1/company-bank/${accountNumber}/add-funds`,
        null, // no body, only query params
        { params: { amount } }
      );
      return response.data;
    } catch (error) {
      console.error('Error adding funds:', error);
      throw error.response?.data || { success: false, message: 'Failed to add funds' };
    }
  },

  /**
   * ✅ Get company account balance only
   */
  getBalance: async (accountNumber) => {
    try {
      const response = await api.get(`/api/v1/company-bank/${accountNumber}/balance`);
      // Expected backend: { success: true, data: { balance: 9332000 } }
      return response.data?.data?.balance || 0;
    } catch (error) {
      console.error('Error fetching balance:', error);
      throw error.response?.data || { success: false, message: 'Failed to fetch balance' };
    }
  },
};

export default companyAccountService;

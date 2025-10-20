import api from '../api/api';

const companyAccountService = {
  // 1. Get all accounts
  getAllAccounts: async () => {
    const response = await api.get('/api/v1/company-bank');
    return response.data; // { success, message, data: [...] }
  },

  // 2. Create new account
  createAccount: async (accountData) => {
    const response = await api.post('/api/v1/company-bank', accountData);
    return response.data;
  },

  // 3. Get single account by account number
  getCompanyAccount: async (accountNumber) => {
    const response = await api.get(`/api/v1/company-bank/${accountNumber}`);
    return response.data;
  },

  // 4. Add funds
  addFunds: async (accountNumber, amount) => {
    const response = await api.post(
      `/api/v1/company-bank/${accountNumber}/add-funds?amount=${amount}`
    );
    return response.data;
  },

  // 5. Get balance only
  getBalance: async (accountNumber) => {
    const response = await api.get(`/api/v1/company-bank/${accountNumber}/balance`);
    return response.data;
  },
};

export default companyAccountService;

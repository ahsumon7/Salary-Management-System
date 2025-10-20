import api from '/src/api/api.js';

const BASE_URL = '/api/v1/bank-accounts';

const getBankAccountById = async (accountNumber) => {
  const response = await api.get(`${BASE_URL}/${accountNumber}`);
  return response.data;
};

const getBankAccounts = async () => {
  const response = await api.get(BASE_URL);
  return response.data;
};

const createBankAccount = async (accountData) => {
  const response = await api.post(BASE_URL, accountData);
  return response.data;
};

const updateBankAccount = async (accountNumber, accountData) => {
  const response = await api.put(`${BASE_URL}/${accountNumber}`, accountData);
  return response.data;
};

const deleteBankAccount = async (accountNumber) => {
  const response = await api.delete(`${BASE_URL}/${accountNumber}`);
  return response.data;
};

export default {
  getBankAccountById,
  getBankAccounts,
  createBankAccount,
  updateBankAccount,
  deleteBankAccount,
};

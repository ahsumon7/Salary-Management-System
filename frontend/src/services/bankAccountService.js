import api from '../api/api';

const BASE_URL = '/api/v1/bank-accounts';

/**
 * Get a bank account by ID
 */
const getBankAccountById = async (accountId) => {
  const response = await api.get(`${BASE_URL}/${accountId}`);
  return response.data;
};

/**
 * Get all bank accounts
 */
const getBankAccounts = async () => {
  const response = await api.get(BASE_URL);
  return response.data;
};

/**
 * Create a new bank account
 */
const createBankAccount = async (accountData) => {
  const response = await api.post(BASE_URL, accountData);
  return response.data;
};

/**
 * Update an existing bank account
 */
const updateBankAccount = async (accountId, accountData) => {
  const response = await api.put(`${BASE_URL}/${accountId}`, accountData);
  return response.data;
};

/**
 * Delete a bank account
 */
const deleteBankAccount = async (accountId) => {
  const response = await api.delete(`${BASE_URL}/${accountId}`);
  return response.data;
};

// Default export for easy import
const bankAccountService = {
  getBankAccountById,
  getBankAccounts,
  createBankAccount,
  updateBankAccount,
  deleteBankAccount,
};

export default bankAccountService;

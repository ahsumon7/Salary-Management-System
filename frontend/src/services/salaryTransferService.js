// src/services/salaryTransferService.js
import api from '../api/api';

export const getSalarySheet = async (accountNumber) => {
  try {
    const response = await api.get(`/api/v1/salary-transfer/${accountNumber}/salary-sheet`);
    return response.data; // { success, data: { salaryDetails, companyBalanceAfter } }
  } catch (error) {
    console.error('Error fetching salary sheet:', error);
    throw error.response?.data || { success: false, message: 'Failed to fetch salary sheet' };
  }
};

export const processSalaryTransfer = async (accountNumber) => {
  try {
    const response = await api.post(`/api/v1/salary-transfer/${accountNumber}/process`);
    return response.data; // { success, data: { salaryDetails, companyBalanceAfter } }
  } catch (error) {
    console.error('Error processing salary transfer:', error);
    throw error.response?.data || { success: false, message: 'Salary process failed' };
  }
};

export const addFundsToCompanyAccount = async (accountNumber, amount) => {
  try {
    const response = await api.post(
      `/api/v1/company-bank/${accountNumber}/add-funds`,
      null,
      { params: { amount } }
    );
    return response.data; // { success, message, data }
  } catch (error) {
    console.error('Error adding funds:', error);
    throw error.response?.data || { success: false, message: 'Failed to add funds' };
  }
};

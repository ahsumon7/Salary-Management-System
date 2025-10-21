// src/services/salaryService.js
import api from '../api/api';

/**
 * ✅ Get total salary paid for a specific company account
 */
export const getTotalSalaryPaid = async (accountNumber) => {
  try {
    const response = await api.get(`/api/v1/salary-transfer/${accountNumber}/salary-sheet`);
    
    // Make sure we log the response to debug
    console.log('Salary sheet response:', response.data);

    // Correctly extract totalPaidSalary
    return response.data?.data?.totalPaidSalary ?? 0;
  } catch (error) {
    console.error('Error fetching total salary paid:', error);
    return 0;
  }
};

/**
 * ✅ Get detailed salary sheet
 */
export const getSalarySheet = async (accountNumber) => {
  try {
    const response = await api.get(`/api/v1/salary-transfer/${accountNumber}/salary-sheet`);
    return response.data?.data || {};
  } catch (error) {
    console.error('Error fetching salary sheet:', error);
    throw error;
  }
};

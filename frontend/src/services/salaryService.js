import api from '../api/api';

/**
 * Get all salaries
 */
export const getAllSalaries = async () => {
  const response = await api.get('/api/v1/salary/all');
  return response.data;
};

/**
 * Calculate total salary paid
 */
export const getTotalSalaryPaid = async () => {
  const salaries = await getAllSalaries();
  return salaries.reduce((total, s) => total + (s.amount || 0), 0);
};

/**
 * Get salary details for an employee
 */
export const getSalaryDetails = async (employeeId) => {
  const response = await api.get(`/api/v1/salary/${employeeId}/details`);
  return response.data;
};

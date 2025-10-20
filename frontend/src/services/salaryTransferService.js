import api from '../api/api';

/**
 * Process salary transfer for a company account
 */
export const processSalaryTransfer = async (companyAccountId) => {
    try {
        const response = await api.post(`/api/v1/salary-transfer/${companyAccountId}/process`);
        return response.data;
    } catch (error) {
        throw new Error('Error processing salary transfer: ' + (error.response?.data || error.message));
    }
};

/**
 * Add funds to a company account
 */
export const addFundsToCompanyAccount = async (accountNumber, amount) => {
    try {
        const response = await api.post(`/api/v1/salary-transfer/${accountNumber}/add-funds`, { amount });
        return response.data;
    } catch (error) {
        throw new Error('Error adding funds to company account: ' + (error.response?.data || error.message));
    }
};

/**
 * Get salary sheet for a company account
 */
export const getSalarySheet = async (companyAccountId) => {
    try {
        const response = await api.get(`/api/v1/salary-transfer/${companyAccountId}/salary-sheet`);
        return response.data;
    } catch (error) {
        throw new Error('Error fetching salary sheet: ' + (error.response?.data || error.message));
    }
};

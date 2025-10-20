import api from '../api/api';

const authService = {
    /**
     * Login a user
     */
    login: async (username, password) => {
        try {
            // Correct endpoint: /api/auth/login
            const response = await api.post('/api/auth/login', { username, password });

            // Save token to localStorage
            const token = response.data?.data?.token;
            if (token) {
                localStorage.setItem('token', token);
            }

            return response;
        } catch (error) {
            // Better error handling
            throw error.response?.data || error.message;
        }
    },

    /**
     * Logout a user
     */
    logout: () => {
        localStorage.removeItem('token');
    },

    /**
     * Get current user info
     */
    getCurrentUser: async () => {
        try {
            // Implement /me endpoint if needed, or fetch from token
            const response = await api.get('/api/auth/me'); 
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }
};

export default authService;

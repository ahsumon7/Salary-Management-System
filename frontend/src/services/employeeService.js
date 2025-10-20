import api from '../api/api';

const employeeService = {
  getAllEmployees: async () => {
    const response = await api.get('/api/v1/employees');
    return response.data;
  },

  getEmployeeById: async (id) => {
    const response = await api.get(`/api/v1/employees/${id}`);
    return response.data;
  },

  createEmployee: async (employeeData) => {
    const response = await api.post('/api/v1/employees', employeeData);
    return response.data;
  },

  updateEmployee: async (id, employeeData) => {
    const response = await api.put(`/api/v1/employees/${id}`, employeeData);
    return response.data;
  },

  deleteEmployee: async (id) => {
    const response = await api.delete(`/api/v1/employees/${id}`);
    return response.data;
  },
};

export default employeeService;

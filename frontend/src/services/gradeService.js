import api from '../api/api';

const BASE_URL = '/api/v1/grades';

const getAllGrades = async () => {
  const response = await api.get(BASE_URL);
  return response.data.data; // return the actual grades array
};

const getGradeById = async (gradeId) => {
  const response = await api.get(`${BASE_URL}/${gradeId}`);
  return response.data.data;
};

const createGrade = async (gradeData) => {
  const response = await api.post(BASE_URL, gradeData);
  return response.data.data;
};

const updateGrade = async (gradeId, gradeData) => {
  const response = await api.put(`${BASE_URL}/${gradeId}`, gradeData);
  return response.data.data;
};

const deleteGrade = async (gradeId) => {
  const response = await api.delete(`${BASE_URL}/${gradeId}`);
  return response.data.data;
};

const gradeService = {
  getAllGrades,
  getGradeById,
  createGrade,
  updateGrade,
  deleteGrade,
};

export default gradeService;

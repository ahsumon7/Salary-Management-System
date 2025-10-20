import React, { useEffect, useState } from 'react';
import gradeService from '../services/gradeService'; // <-- default import
import Table from '../components/common/Table';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Modal from '../components/common/Modal';

const GradePage = () => {
  const [grades, setGrades] = useState([]);
  const [grade, setGrade] = useState({ id: '', name: '', rank: '' });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchGrades();
  }, []);

  const fetchGrades = async () => {
    const data = await gradeService.getAllGrades();
    setGrades(data);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setGrade({ ...grade, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isEditing) {
      await gradeService.updateGrade(grade.id, grade);
    } else {
      await gradeService.createGrade(grade);
    }
    setIsModalOpen(false);
    fetchGrades();
  };

  const handleEdit = (grade) => {
    setGrade(grade);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this grade?')) return;
    await gradeService.deleteGrade(id);
    fetchGrades();
  };

  const handleAddGrade = () => {
    setIsEditing(false);
    setGrade({ id: '', name: '', rank: '' });
    setIsModalOpen(true);
  };

  return (
    <div className='container'>
      <h1>Manage Grades</h1>
      <Button onClick={handleAddGrade}>Add Grade</Button>
      <Table data={grades} onEdit={handleEdit} onDelete={handleDelete} />
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={isEditing ? 'Edit Grade' : 'Add Grade'}
      >
        <form onSubmit={handleSubmit}>
          <Input
            name='name'
            value={grade.name}
            onChange={handleInputChange}
            placeholder='Grade Name'
            required
          />
          <Input
            name='rank'
            value={grade.rank}
            onChange={handleInputChange}
            placeholder='Rank'
            required
          />
          <Button type='submit'>{isEditing ? 'Update' : 'Create'} Grade</Button>
        </form>
      </Modal>
    </div>
  );
};

export default GradePage;

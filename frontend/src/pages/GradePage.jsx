import React, { useEffect, useState } from 'react';
import gradeService from '../services/gradeService';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Modal from '../components/common/Modal';
import Spinner from '../components/common/Spinner';

const GradePage = () => {
  const [grades, setGrades] = useState([]);
  const [grade, setGrade] = useState({ gradeId: '', gradeLevel: '', baseSalary: '', description: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredGrade, setFilteredGrade] = useState(null);

  useEffect(() => {
    fetchGrades();
  }, []);

  const fetchGrades = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await gradeService.getAllGrades(); // returns array directly
      setGrades(data);
    } catch (err) {
      setError('Failed to fetch grades');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setGrade({ ...grade, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (isEditing) {
        await gradeService.updateGrade(grade.gradeId, grade);
      } else {
        await gradeService.createGrade(grade);
      }
      setIsModalOpen(false);
      fetchGrades();
    } catch (err) {
      setError('Failed to save grade');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (g) => {
    setGrade(g);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleDelete = async (gradeId) => {
    if (!window.confirm('Are you sure you want to delete this grade?')) return;
    setLoading(true);
    setError(null);
    try {
      await gradeService.deleteGrade(gradeId);
      fetchGrades();
    } catch (err) {
      setError('Failed to delete grade');
    } finally {
      setLoading(false);
    }
  };

  const handleAddGrade = () => {
    setIsEditing(false);
    setGrade({ gradeId: '', gradeLevel: '', baseSalary: '', description: '' });
    setIsModalOpen(true);
  };

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setFilteredGrade(null);
      setError(null);
      return;
    }
    const result = grades.find(
      (g) =>
        g.gradeId.toString() === searchTerm.trim() ||
        g.gradeLevel.toLowerCase() === searchTerm.toLowerCase().trim()
    );
    if (!result) {
      setError('No grade found');
      setFilteredGrade(null);
    } else {
      setFilteredGrade(result);
      setError(null);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="container">
      <h1>Manage Grades</h1>

      {/* Search */}
      <div style={{ marginBottom: '20px' }}>
        <Input
          placeholder="Search by ID or Name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button onClick={handleSearch} style={{ marginLeft: '10px' }}>
          Search
        </Button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {/* Display searched grade */}
      {filteredGrade && (
        <div style={{ marginBottom: '20px', border: '1px solid #ccc', padding: '10px' }}>
          <p>ID: {filteredGrade.gradeId}</p>
          <p>Level: {filteredGrade.gradeLevel}</p>
          <p>Base Salary: {filteredGrade.baseSalary}</p>
          <p>Description: {filteredGrade.description}</p>
          <Button onClick={() => handleEdit(filteredGrade)}>Edit</Button>
          <Button
            onClick={() => handleDelete(filteredGrade.gradeId)}
            style={{ marginLeft: '10px' }}
          >
            Delete
          </Button>
        </div>
      )}

      {/* Add Grade */}
      <Button onClick={handleAddGrade}>Add Grade</Button>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={isEditing ? 'Edit Grade' : 'Add Grade'}>
        <form onSubmit={handleSubmit}>
          <Input
            name="gradeLevel"
            value={grade.gradeLevel}
            onChange={handleInputChange}
            placeholder="Grade Level"
            required
          />
          <Input
            name="baseSalary"
            type="number"
            value={grade.baseSalary}
            onChange={handleInputChange}
            placeholder="Base Salary"
            required
          />
          <Input
            name="description"
            value={grade.description}
            onChange={handleInputChange}
            placeholder="Description"
          />
          <Button type="submit">{isEditing ? 'Update' : 'Create'} Grade</Button>
        </form>
      </Modal>

      {/* Grades Table */}
      <h2>All Grades</h2>
      {grades.length === 0 ? (
        <p>No data available</p>
      ) : (
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>ID</th>
              <th>Level</th>
              <th>Base Salary</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {grades.map((g) => (
              <tr key={g.gradeId}>
                <td>{g.gradeId}</td>
                <td>{g.gradeLevel}</td>
                <td>{g.baseSalary}</td>
                <td>{g.description}</td>
                <td>
                  <Button onClick={() => handleEdit(g)}>Edit</Button>
                  <Button onClick={() => handleDelete(g.gradeId)} style={{ marginLeft: '10px' }}>
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default GradePage;

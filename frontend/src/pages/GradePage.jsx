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
      const data = await gradeService.getAllGrades();
      setGrades(data || []); // Ensure it's an array
    } catch (err) {
      setError('Failed to fetch grades');
      setGrades([]);
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
        await gradeService.updateGrade(grade.gradeId, {
          gradeLevel: grade.gradeLevel,
          baseSalary: Number(grade.baseSalary),
          description: grade.description,
        });
      } else {
        await gradeService.createGrade({
          gradeLevel: grade.gradeLevel,
          baseSalary: Number(grade.baseSalary),
          description: grade.description,
        });
      }
      setIsModalOpen(false);
      fetchGrades();
    } catch (err) {
      setError(`Failed to ${isEditing ? 'update' : 'create'} grade.`);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (g) => {
    // Set baseSalary as string for input[type=number] consistency
    setGrade({ ...g, baseSalary: String(g.baseSalary) });
    setIsEditing(true);
    setIsModalOpen(true);
    setFilteredGrade(null); // Clear search result when editing from it
  };

  const handleDelete = async (gradeId) => {
    if (!window.confirm('Are you sure you want to delete this grade?')) return;
    setLoading(true);
    setError(null);
    try {
      await gradeService.deleteGrade(gradeId);
      fetchGrades();
      setFilteredGrade(null); // Clear search result after deletion
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
    const term = searchTerm.trim();
    if (!term) {
      setFilteredGrade(null);
      setError(null);
      return;
    }

    const result = grades.find(
      (g) =>
        g.gradeId?.toString() === term ||
        g.gradeLevel?.toLowerCase() === term.toLowerCase()
    );

    if (!result) {
      setError(`No grade found matching "${term}"`);
      setFilteredGrade(null);
    } else {
      // Set baseSalary to string for display consistency
      setFilteredGrade({ ...result, baseSalary: String(result.baseSalary) }); 
      setError(null);
    }
  };

  if (loading) return (
    <div className="container mx-auto p-8 max-w-7xl text-center">
      <Spinner />
    </div>
  );

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <h1 className="text-3xl font-bold mb-6 text-gray-800"> Manage Grades</h1>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">{error}</div>}

      {/* Search and Add Card */}
      <div className="bg-white p-6 rounded-xl shadow-lg mb-6">
        <div className="flex justify-between items-center mb-4 border-b pb-4">
            <h2 className="text-xl font-semibold text-indigo-600">Grade Operations</h2>
            <Button 
                onClick={handleAddGrade}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-150"
            >
                + Add New Grade
            </Button>
        </div>
        
        {/* Search Input */}
        <div className="flex space-x-3 items-center mb-4">
            <Input
                placeholder="Search by ID or Grade Level (e.g., 101 or 'Manager')"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-grow p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            />
            <Button 
                onClick={handleSearch} 
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg shadow-md transition duration-150"
            >
                Search
            </Button>
        </div>

        {/* Display searched grade result */}
        {filteredGrade && (
            <div className="border border-indigo-300 p-4 rounded-lg bg-indigo-50 mt-4">
                <p className="font-semibold text-lg mb-2 text-indigo-800">Search Result Found</p>
                <div className="grid grid-cols-2 gap-2 text-gray-700 text-sm">
                    <p><strong>ID:</strong> {filteredGrade.gradeId}</p>
                    <p><strong>Level:</strong> {filteredGrade.gradeLevel}</p>
                    <p><strong>Base Salary:</strong> {Number(filteredGrade.baseSalary).toLocaleString()} Taka</p>
                    <p className="col-span-2"><strong>Description:</strong> {filteredGrade.description}</p>
                </div>
                <div className="mt-4 pt-4 border-t border-indigo-200">
                    <Button 
                        onClick={() => handleEdit(filteredGrade)}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-1 px-3 rounded-lg mr-2"
                    >
                        Edit
                    </Button>
                    <Button
                        onClick={() => handleDelete(filteredGrade.gradeId)}
                        className="bg-red-500 hover:bg-red-600 text-white font-medium py-1 px-3 rounded-lg"
                    >
                        Delete
                    </Button>
                </div>
            </div>
        )}
      </div>
      
      {/* Grades Table Card */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-xl font-semibold mb-4 text-indigo-600 border-b pb-2">All Grades</h2>
        
        {grades.length === 0 ? (
            <p className="text-center py-4 text-gray-500">No grades available. Use the button above to add one.</p>
        ) : (
            <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">ID</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Level</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Base Salary</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Description</th>
                            <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-500 w-32">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {grades.map((g, index) => (
                            <tr 
                                key={g.gradeId}
                                className={index % 2 !== 0 ? 'bg-gray-50 hover:bg-gray-100' : 'bg-white hover:bg-gray-50'}
                            >
                                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{g.gradeId}</td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{g.gradeLevel}</td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm font-bold text-green-600">
                                    {Number(g.baseSalary).toLocaleString()}
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-500">{g.description}</td>
                                <td className="px-4 py-3 whitespace-nowrap text-center text-sm font-medium">
                                    <button 
                                        onClick={() => handleEdit(g)}
                                        className="text-blue-600 hover:text-blue-900 font-medium text-sm mr-2"
                                    >
                                        Edit
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(g.gradeId)}
                                        className="text-red-600 hover:text-red-900 font-medium text-sm"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )}
      </div>

      {/* Modal for Add/Edit Grade */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={isEditing ? 'Edit Grade' : 'Add New Grade'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            name="gradeLevel"
            value={grade.gradeLevel}
            onChange={handleInputChange}
            placeholder="Grade Level (e.g., Junior, Senior Manager)"
            required
          />
          <Input
            name="baseSalary"
            type="number"
            value={grade.baseSalary}
            onChange={handleInputChange}
            placeholder="Base Salary (e.g., 50000)"
            required
          />
          <Input
            name="description"
            value={grade.description}
            onChange={handleInputChange}
            placeholder="Description (Optional)"
          />
          <Button 
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg transition duration-150"
          >
            {isEditing ? 'Update Grade' : 'Create Grade'}
          </Button>
        </form>
      </Modal>
    </div>
  );
};

export default GradePage;
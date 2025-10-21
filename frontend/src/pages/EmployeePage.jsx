// src/EmployeePage.jsx

import React, { useEffect, useState } from 'react';
import employeeService from '../services/employeeService';
import Table from '../components/common/Table';
import Button from '../components/common/Button'; // Assuming your Button component accepts className
import EmployeeForm from './EmployeeForm';

const EmployeePage = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const data = await employeeService.getAllEmployees();
      setEmployees(
        (data || []).map((emp) => ({
          ...emp,
          bankAccount: emp.bankAccount || {},
        }))
      );
    } catch (err) {
      console.error('Error fetching employees:', err);
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (employeeId) => {
    if (!window.confirm('Are you sure you want to delete this employee?')) return;
    try {
      await employeeService.deleteEmployee(employeeId);
      fetchEmployees();
    } catch (err) {
      console.error('Error deleting employee:', err);
    }
  };

  const handleEdit = (employee) => {
    setSelectedEmployee(employee);
    setIsFormVisible(true);
  };

  const handleAdd = () => {
    setSelectedEmployee(null);
    setIsFormVisible(true);
  };

  const handleFormClose = () => {
    setSelectedEmployee(null);
    setIsFormVisible(false);
    fetchEmployees();
  };

  return (
    <div className="container mx-auto p-4 max-w-7xl"> {/* Wider container */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Employee Management</h1>
        <Button 
          onClick={handleAdd}
          // Primary button styling: Blue/Indigo color
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-150"
        >
          + Add Employee
        </Button>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-2xl"> {/* Main content card */}
        {loading ? (
          // Better loading indicator placeholder
          <p className="mt-4 text-center py-12 text-gray-500">Loading employee data...</p>
        ) : employees.length === 0 ? (
          <p className="mt-4 text-center py-12 text-gray-500">No employees found.</p>
        ) : (
          <Table data={employees} onEdit={handleEdit} onDelete={handleDelete} />
        )}
      </div>

      {isFormVisible && (
        <EmployeeForm employee={selectedEmployee} onClose={handleFormClose} />
      )}
    </div>
  );
};

export default EmployeePage;
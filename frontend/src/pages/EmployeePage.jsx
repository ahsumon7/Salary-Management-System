import React, { useEffect, useState } from 'react';
import employeeService from '../services/employeeService';
import Table from '../components/common/Table';
import Button from '../components/common/Button';
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
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Employee Management</h1>
      <Button onClick={handleAdd}>Add Employee</Button>

      {loading ? (
        <p className="mt-4">Loading...</p>
      ) : employees.length === 0 ? (
        <p className="mt-4">No employees found.</p>
      ) : (
        <Table data={employees} onEdit={handleEdit} onDelete={handleDelete} />
      )}

      {isFormVisible && (
        <EmployeeForm employee={selectedEmployee} onClose={handleFormClose} />
      )}
    </div>
  );
};

export default EmployeePage;

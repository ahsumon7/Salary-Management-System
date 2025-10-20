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

      // Flatten the bankAccount object into main employee object
      const flattened = (data || []).map((emp) => ({
        employeeId: emp.employeeId, // used for Table delete/edit
        name: emp.name,
        gradeId: emp.gradeId,
        address: emp.address,
        mobile: emp.mobile,
        accountNumber: emp.bankAccount?.accountNumber,
        accountName: emp.bankAccount?.accountName,
        accountType: emp.bankAccount?.accountType,
        bankName: emp.bankAccount?.bankName,
        branchName: emp.bankAccount?.branchName,
        currentBalance: emp.bankAccount?.currentBalance,
      }));

      setEmployees(flattened);
    } catch (error) {
      console.error('Error fetching employees:', error);
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (employeeId) => {
    // UPDATED: use employeeId instead of id
    if (!window.confirm('Are you sure you want to delete this employee?'))
      return;
    try {
      await employeeService.deleteEmployee(employeeId);
      fetchEmployees();
    } catch (error) {
      console.error('Error deleting employee:', error);
    }
  };

  const handleEdit = (employee) => {
    setSelectedEmployee(employee);
    setIsFormVisible(true);
  };

  const handleAdd = () => {
    // ADDED: clear selectedEmployee for Add
    setSelectedEmployee(null);
    setIsFormVisible(true);
  };

  const handleFormClose = () => {
    setSelectedEmployee(null);
    setIsFormVisible(false);
    fetchEmployees();
  };

  return (
    <div className='container mx-auto p-4'>
      <h1 className='text-2xl font-bold mb-4'>Employee Management</h1>
      {/* UPDATED: call handleAdd to open form in Add mode */}
      <Button onClick={handleAdd}>Add Employee</Button>

      {loading ? (
        <p className='mt-4'>Loading...</p>
      ) : employees.length === 0 ? (
        <p className='mt-4'>No employees found.</p>
      ) : (
        <Table data={employees} onEdit={handleEdit} onDelete={handleDelete} />
      )}

      {/* UPDATED: pass selectedEmployee or null to EmployeeForm */}
      {isFormVisible && (
        <EmployeeForm employee={selectedEmployee} onClose={handleFormClose} />
      )}
    </div>
  );
};

export default EmployeePage;

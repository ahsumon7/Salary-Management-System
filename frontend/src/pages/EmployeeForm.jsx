import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import employeeService from '../services/employeeService';
import gradeService from '../services/gradeService';

const EmployeeForm = () => {
  const { employeeId } = useParams();
  const navigate = useNavigate();

  const [employee, setEmployee] = useState({
    id: '',
    name: '',
    gradeId: '', // use gradeId instead of grade string
    address: '',
    mobile: '',
    bankAccount: {
      accountType: '',
      accountName: '',
      accountNumber: '',
      currentBalance: 0,
      bankName: '',
      branchName: '',
    },
  });

  const [grades, setGrades] = useState([]); // array of objects
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // Fetch grades
    const fetchGrades = async () => {
      try {
        const gradeList = await gradeService.getAllGrades();
        setGrades(Array.isArray(gradeList) ? gradeList : []);
      } catch (err) {
        console.error('Failed to fetch grades:', err);
      }
    };

    // Fetch employee if editing
    const fetchEmployee = async () => {
      if (employeeId) {
        try {
          const emp = await employeeService.getEmployeeById(employeeId);
          setEmployee({
            ...emp,
            gradeId: emp.gradeId || '',
          });
          setIsEditing(true);
        } catch (err) {
          console.error('Failed to fetch employee:', err);
        }
      }
    };

    fetchGrades();
    fetchEmployee();
  }, [employeeId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployee((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleBankChange = (e) => {
    const { name, value } = e.target;
    setEmployee((prev) => ({
      ...prev,
      bankAccount: {
        ...prev.bankAccount,
        [name]: value,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Transform employee state to match backend API
    const payload = {
      employeeId: employee.id || undefined, // undefined for new employee
      name: employee.name,
      gradeId: employee.gradeId,
      address: employee.address,
      mobile: employee.mobile,
      bankAccount: { ...employee.bankAccount },
    };

    try {
      if (isEditing) {
        await employeeService.updateEmployee(employee.id, payload);
      } else {
        await employeeService.createEmployee(payload);
      }
      navigate('/employees');
    } catch (err) {
      console.error('Error saving employee:', err);
    }
  };

  return (
    <div className='container mx-auto p-4'>
      <h2 className='text-xl font-bold mb-4'>{isEditing ? 'Edit Employee' : 'Add Employee'}</h2>
      <form onSubmit={handleSubmit} className='space-y-3'>
        <input
          type='text'
          name='name'
          value={employee.name}
          onChange={handleChange}
          placeholder='Name'
          required
          className='border p-2 w-full'
        />

        <select
          name='gradeId'
          value={employee.gradeId}
          onChange={handleChange}
          required
          className='border p-2 w-full'
        >
          <option value=''>Select Grade</option>
          {grades.map((grade) => (
            <option key={grade.id} value={grade.id}>
              {grade.name}
            </option>
          ))}
        </select>

        <input
          type='text'
          name='address'
          value={employee.address}
          onChange={handleChange}
          placeholder='Address'
          required
          className='border p-2 w-full'
        />
        <input
          type='text'
          name='mobile'
          value={employee.mobile}
          onChange={handleChange}
          placeholder='Mobile'
          required
          className='border p-2 w-full'
        />

        <h3 className='font-semibold mt-4'>Bank Account Details</h3>
        <input
          type='text'
          name='accountType'
          value={employee.bankAccount.accountType}
          onChange={handleBankChange}
          placeholder='Account Type'
          required
          className='border p-2 w-full'
        />
        <input
          type='text'
          name='accountName'
          value={employee.bankAccount.accountName}
          onChange={handleBankChange}
          placeholder='Account Name'
          required
          className='border p-2 w-full'
        />
        <input
          type='text'
          name='accountNumber'
          value={employee.bankAccount.accountNumber}
          onChange={handleBankChange}
          placeholder='Account Number'
          required
          className='border p-2 w-full'
        />
        <input
          type='number'
          name='currentBalance'
          value={employee.bankAccount.currentBalance}
          onChange={handleBankChange}
          placeholder='Current Balance'
          required
          className='border p-2 w-full'
        />
        <input
          type='text'
          name='bankName'
          value={employee.bankAccount.bankName}
          onChange={handleBankChange}
          placeholder='Bank Name'
          required
          className='border p-2 w-full'
        />
        <input
          type='text'
          name='branchName'
          value={employee.bankAccount.branchName}
          onChange={handleBankChange}
          placeholder='Branch Name'
          required
          className='border p-2 w-full'
        />

        <button
          type='submit'
          className='bg-blue-500 text-white px-4 py-2 rounded'
        >
          {isEditing ? 'Update' : 'Add'} Employee
        </button>
      </form>
    </div>
  );
};

export default EmployeeForm;

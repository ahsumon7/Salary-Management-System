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
    grade: '',
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

  const [grades, setGrades] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchGrades = async () => {
      const gradeList = await gradeService.getAllGrades();
      setGrades(gradeList);
    };

    fetchGrades();

    if (employeeId) {
      const fetchEmployee = async () => {
        const emp = await employeeService.getEmployeeById(employeeId);
        setEmployee(emp);
        setIsEditing(true);
      };

      fetchEmployee();
    }
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
    if (isEditing) {
      await employeeService.updateEmployee(employee.id, employee);
    } else {
      await employeeService.createEmployee(employee);
    }
    navigate('/employees');
  };

  return (
    <div className='container'>
      <h2>{isEditing ? 'Edit Employee' : 'Add Employee'}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type='text'
          name='name'
          value={employee.name}
          onChange={handleChange}
          placeholder='Name'
          required
        />
        <select
          name='grade'
          value={employee.grade}
          onChange={handleChange}
          required
        >
          <option value=''>Select Grade</option>
          {grades.map((grade) => (
            <option key={grade} value={grade}>
              {grade}
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
        />
        <input
          type='text'
          name='mobile'
          value={employee.mobile}
          onChange={handleChange}
          placeholder='Mobile'
          required
        />

        <h3>Bank Account Details</h3>
        <input
          type='text'
          name='accountType'
          value={employee.bankAccount.accountType}
          onChange={handleBankChange}
          placeholder='Account Type'
          required
        />
        <input
          type='text'
          name='accountName'
          value={employee.bankAccount.accountName}
          onChange={handleBankChange}
          placeholder='Account Name'
          required
        />
        <input
          type='text'
          name='accountNumber'
          value={employee.bankAccount.accountNumber}
          onChange={handleBankChange}
          placeholder='Account Number'
          required
        />
        <input
          type='number'
          name='currentBalance'
          value={employee.bankAccount.currentBalance}
          onChange={handleBankChange}
          placeholder='Current Balance'
          required
        />
        <input
          type='text'
          name='bankName'
          value={employee.bankAccount.bankName}
          onChange={handleBankChange}
          placeholder='Bank Name'
          required
        />
        <input
          type='text'
          name='branchName'
          value={employee.bankAccount.branchName}
          onChange={handleBankChange}
          placeholder='Branch Name'
          required
        />

        <button type='submit'>{isEditing ? 'Update' : 'Add'} Employee</button>
      </form>
    </div>
  );
};

export default EmployeeForm;

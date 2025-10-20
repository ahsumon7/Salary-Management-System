import React, { useState, useEffect } from 'react';
import employeeService from '../services/employeeService';
import gradeService from '../services/gradeService';

const EmployeeForm = ({ employee, onClose }) => {
  const [formData, setFormData] = useState({
    employeeId: '',
    name: '',
    gradeId: '',
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
      try {
        const gradeList = await gradeService.getAllGrades();
        setGrades(Array.isArray(gradeList) ? gradeList : []);
      } catch (err) {
        console.error('Failed to fetch grades:', err);
      }
    };

    fetchGrades();

    if (employee) {
      setFormData(employee);
      setIsEditing(true);
    }
  }, [employee]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBankChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      bankAccount: { ...prev.bankAccount, [name]: value },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isEditing) {
        await employeeService.updateEmployee(formData.employeeId, formData);
      } else {
        await employeeService.createEmployee(formData);
      }
      onClose();
    } catch (err) {
      console.error('Error saving employee:', err);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">
        {isEditing ? 'Edit Employee' : 'Add Employee'}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Name"
          required
          className="border p-2 w-full"
        />

        <select
          name="gradeId"
          value={formData.gradeId}
          onChange={handleChange}
          required
          className="border p-2 w-full"
        >
          <option value="">Select Grade</option>
          {grades.map((g) => (
            <option key={g.gradeId} value={g.gradeId}>
              {g.gradeLevel}
            </option>
          ))}
        </select>

        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Address"
          required
          className="border p-2 w-full"
        />
        <input
          type="text"
          name="mobile"
          value={formData.mobile}
          onChange={handleChange}
          placeholder="Mobile"
          required
          className="border p-2 w-full"
        />

        <h3 className="font-semibold mt-4">Bank Account Details</h3>
        <input
          type="text"
          name="accountType"
          value={formData.bankAccount.accountType}
          onChange={handleBankChange}
          placeholder="Account Type"
          required
          className="border p-2 w-full"
        />
        <input
          type="text"
          name="accountName"
          value={formData.bankAccount.accountName}
          onChange={handleBankChange}
          placeholder="Account Name"
          required
          className="border p-2 w-full"
        />
        <input
          type="text"
          name="accountNumber"
          value={formData.bankAccount.accountNumber}
          onChange={handleBankChange}
          placeholder="Account Number"
          required
          className="border p-2 w-full"
        />
        <input
          type="number"
          name="currentBalance"
          value={formData.bankAccount.currentBalance}
          onChange={handleBankChange}
          placeholder="Current Balance"
          required
          className="border p-2 w-full"
        />
        <input
          type="text"
          name="bankName"
          value={formData.bankAccount.bankName}
          onChange={handleBankChange}
          placeholder="Bank Name"
          required
          className="border p-2 w-full"
        />
        <input
          type="text"
          name="branchName"
          value={formData.bankAccount.branchName}
          onChange={handleBankChange}
          placeholder="Branch Name"
          required
          className="border p-2 w-full"
        />

        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          {isEditing ? 'Update' : 'Add'} Employee
        </button>
        <button
          type="button"
          onClick={onClose}
          className="ml-2 bg-gray-500 text-white px-4 py-2 rounded"
        >
          Cancel
        </button>
      </form>
    </div>
  );
};

export default EmployeeForm;

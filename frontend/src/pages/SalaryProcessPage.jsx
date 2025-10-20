import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import companyAccountService from '../services/companyAccountService';
import employeeService from '../services/employeeService';
import { Button, Input, Modal } from '../components/common';

const SalaryProcessPage = () => {
  const { user } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [companyBalance, setCompanyBalance] = useState(0);
  const [salaryProcessed, setSalaryProcessed] = useState(false);
  const [fundsToAdd, setFundsToAdd] = useState(0);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const employeesData = await employeeService.getAllEmployees();
        setEmployees(employeesData);

        const balance = await companyAccountService.getBalance(
          user.companyAccountId
        );
        setCompanyBalance(balance);
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };
    fetchData();
  }, [user.companyAccountId]);

  const handleSalaryProcess = async () => {
    try {
      const result = await companyAccountService.processSalary(
        user.companyAccountId,
        employees
      );
      if (result.success) {
        setSalaryProcessed(true);
        setCompanyBalance(result.newBalance);
      } else {
        setShowModal(true);
      }
    } catch (err) {
      console.error('Error processing salary:', err);
    }
  };

  const handleAddFunds = async () => {
    try {
      await companyAccountService.addFunds(
        user.companyAccountId,
        Number(fundsToAdd)
      );
      const balance = await companyAccountService.getBalance(
        user.companyAccountId
      );
      setCompanyBalance(balance);
      setShowModal(false);
      setFundsToAdd(0);
    } catch (err) {
      console.error('Error adding funds:', err);
    }
  };

  return (
    <div className='container'>
      <h1>Salary Processing</h1>
      <h2>Company Balance: {companyBalance} Taka</h2>
      <Button onClick={handleSalaryProcess}>Process Salaries</Button>
      {salaryProcessed && <p>Salaries processed successfully!</p>}

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title='Insufficient Funds'
      >
        <Input
          type='number'
          value={fundsToAdd}
          onChange={(e) => setFundsToAdd(e.target.value)}
          placeholder='Enter amount to add'
        />
        <Button onClick={handleAddFunds}>Add Funds</Button>
      </Modal>
    </div>
  );
};

export default SalaryProcessPage;

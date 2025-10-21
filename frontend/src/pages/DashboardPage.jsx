import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StatCard from '../components/common/StatCard';
import companyAccountService from '../services/companyAccountService';
import { getTotalSalaryPaid } from '../services/salaryService';

const DashboardPage = () => {
  const navigate = useNavigate();
  const [companyBalance, setCompanyBalance] = useState(0);
  const [totalSalaryPaid, setTotalSalaryPaid] = useState(0);
  const accountNumber = "1001001001"; // ✅ set your company account number here

  useEffect(() => {
    const fetchData = async () => {
      try {
        const balance = await companyAccountService.getBalance(accountNumber);
        const totalSalary = await getTotalSalaryPaid(accountNumber);
        setCompanyBalance(balance);
        setTotalSalaryPaid(totalSalary);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className='dashboard container mx-auto p-4'>
      <h1 className='text-2xl font-bold mb-4'>Dashboard</h1>

      <div className='stats grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6'>
        <StatCard
          title='Company Balance'
          value={`${companyBalance.toLocaleString()} Taka`}
          color='bg-blue-500'
          icon={<i className='fas fa-wallet'></i>}
        />
        <StatCard
          title='Total Salary Paid'
          value={`${totalSalaryPaid.toLocaleString()} Taka`}
          color='bg-green-500'
          icon={<i className='fas fa-money-bill-wave'></i>}
        />
      </div>

      <div className='navigation flex flex-wrap gap-4'>
        <button className='btn btn-blue' onClick={() => navigate('/employees')}>
          Go to Employees
        </button>
        <button className='btn btn-green' onClick={() => navigate('/bank-accounts')}>
          Go to Bank Accounts
        </button>
        <button className='btn btn-yellow' onClick={() => navigate('/company-account')}>
          Go to Company Account
        </button>
        <button className='btn btn-purple' onClick={() => navigate('/grades')}>
          Go to Grades
        </button>
        <button className='btn btn-red' onClick={() => navigate('/reports')}>
          Go to Reports
        </button>
        <button className='btn btn-indigo' onClick={() => navigate('/salary-process')}>
          Go to Salary Process
        </button>
      </div>
    </div>
  );
};

export default DashboardPage;

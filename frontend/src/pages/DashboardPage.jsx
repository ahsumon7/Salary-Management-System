import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StatCard from '../components/common/StatCard';
import companyAccountService from '../services/companyAccountService';

const DashboardPage = () => {
  const navigate = useNavigate();
  const [companyBalance, setCompanyBalance] = useState(0);
  const accountNumber = '1001001001'; // Your company account number

  useEffect(() => {
    const fetchData = async () => {
      try {
        const balance = await companyAccountService.getBalance(accountNumber);
        setCompanyBalance(balance);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className='dashboard container mx-auto p-6'>
      <h1 className='text-3xl font-bold mb-6 text-gray-800'>Dashboard</h1>

      {/* Stats cards */}
      <div className='stats grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 mb-8'>
        <StatCard
          title='Company Balance'
          value={`${companyBalance.toLocaleString()} Taka`}
          color='bg-blue-500'
          icon={<i className='fas fa-wallet text-white text-2xl'></i>}
        />
        <StatCard
          title='Employees Count'
          value='11' // You can fetch dynamically if needed
          color='bg-purple-500'
          icon={<i className='fas fa-users text-white text-2xl'></i>}
        />
      </div>

      {/* Navigation buttons */}
      <div className='navigation grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
        <button
          className='btn bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded shadow'
          onClick={() => navigate('/employees')}
        >
          Go to Employees
        </button>
        <button
          className='btn bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded shadow'
          onClick={() => navigate('/bank-accounts')}
        >
          Go to Bank Accounts
        </button>
        <button
          className='btn bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 px-4 rounded shadow'
          onClick={() => navigate('/company-account')}
        >
          Go to Company Account
        </button>
        <button
          className='btn bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-4 rounded shadow'
          onClick={() => navigate('/grades')}
        >
          Go to Grades
        </button>
        <button
          className='btn bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded shadow'
          onClick={() => navigate('/reports')}
        >
          Go to Reports
        </button>
        <button
          className='btn bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded shadow'
          onClick={() => navigate('/salary-process')}
        >
          Go to Salary Process
        </button>
        <button
          className='btn bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded shadow'
          onClick={() => navigate('/salary-report')}
        >
          Salary Report
        </button>
      </div>
    </div>
  );
};

export default DashboardPage;

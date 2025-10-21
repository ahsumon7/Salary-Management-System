import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import companyAccountService from '../services/companyAccountService';
import authService from '../services/authService';

const DashboardPage = () => {
  const navigate = useNavigate();
  const [companyBalance, setCompanyBalance] = useState(0);
  const [employeeCount] = useState(11);
  const accountNumber = '1001001001';

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

  const handleLogout = () => {
    authService.logout();
    navigate('/');
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50'>
      {/* Header */}
      <header className='bg-white border-b border-gray-200 shadow-sm'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4'>
          <div className='flex justify-between items-center'>
            <div className='flex items-center space-x-3'>
              <div className='bg-gradient-to-br from-blue-600 to-indigo-600 p-3 rounded-lg'>
                <span className='text-white text-xl font-bold'>📊</span>
              </div>
              <div>
                <h1 className='text-2xl font-bold text-gray-900'>Dashboard</h1>
                <p className='text-sm text-gray-500'>
                  Welcome back! Here's your overview
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className='flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white font-medium py-2.5 px-5 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105'
            >
              <span>🚪</span>
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {/* Stats Cards */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-8'>
          {/* Company Balance Card */}
          <div className='bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-xl p-6 text-white transform hover:scale-105 transition-transform duration-200'>
            <div className='flex items-center justify-between mb-4'>
              <div className='bg-white bg-opacity-20 p-3 rounded-xl'>
                <span className='text-3xl'>💰</span>
              </div>
              <span className='text-2xl'>📈</span>
            </div>
            <div>
              <p className='text-blue-100 text-sm font-medium mb-1'>
                Company Balance
              </p>
              <h2 className='text-4xl font-bold mb-1'>
                ৳{companyBalance.toLocaleString()}
              </h2>
              <p className='text-blue-100 text-xs'>Updated just now</p>
            </div>
          </div>

          {/* Employees Count Card */}
          <div className='bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-xl p-6 text-white transform hover:scale-105 transition-transform duration-200'>
            <div className='flex items-center justify-between mb-4'>
              <div className='bg-white bg-opacity-20 p-3 rounded-xl'>
                <span className='text-3xl'>👥</span>
              </div>
              <span className='text-2xl'>✨</span>
            </div>
            <div>
              <p className='text-purple-100 text-sm font-medium mb-1'>
                Total Employees
              </p>
              <h2 className='text-4xl font-bold mb-1'>{employeeCount}</h2>
              <p className='text-purple-100 text-xs'>Active workforce</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className='mb-6'>
          <h2 className='text-xl font-bold text-gray-800 mb-4 flex items-center'>
            <span className='bg-gradient-to-r from-blue-600 to-indigo-600 w-1 h-6 rounded-full mr-3'></span>
            Quick Actions
          </h2>
        </div>

        {/* Navigation Grid */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
          {/* Employees */}
          <button
            onClick={() => navigate('/employees')}
            className='group bg-white hover:bg-blue-50 border-2 border-gray-200 hover:border-blue-400 rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-200 text-left'
          >
            <div className='bg-blue-100 group-hover:bg-blue-500 w-12 h-12 rounded-lg flex items-center justify-center mb-4 transition-colors duration-200'>
              <span className='text-2xl group-hover:scale-110 transition-transform duration-200'>
                👤
              </span>
            </div>
            <h3 className='text-lg font-semibold text-gray-800 mb-1'>
              Employees
            </h3>
            <p className='text-sm text-gray-500'>Manage your team</p>
          </button>

          {/* Bank Accounts */}
          <button
            onClick={() => navigate('/bank-accounts')}
            className='group bg-white hover:bg-green-50 border-2 border-gray-200 hover:border-green-400 rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-200 text-left'
          >
            <div className='bg-green-100 group-hover:bg-green-500 w-12 h-12 rounded-lg flex items-center justify-center mb-4 transition-colors duration-200'>
              <span className='text-2xl group-hover:scale-110 transition-transform duration-200'>
                💳
              </span>
            </div>
            <h3 className='text-lg font-semibold text-gray-800 mb-1'>
              Bank Accounts
            </h3>
            <p className='text-sm text-gray-500'>View all accounts</p>
          </button>

          {/* Company Account */}
          <button
            onClick={() => navigate('/company-account')}
            className='group bg-white hover:bg-yellow-50 border-2 border-gray-200 hover:border-yellow-400 rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-200 text-left'
          >
            <div className='bg-yellow-100 group-hover:bg-yellow-500 w-12 h-12 rounded-lg flex items-center justify-center mb-4 transition-colors duration-200'>
              <span className='text-2xl group-hover:scale-110 transition-transform duration-200'>
                🏢
              </span>
            </div>
            <h3 className='text-lg font-semibold text-gray-800 mb-1'>
              Company Account
            </h3>
            <p className='text-sm text-gray-500'>Financial overview</p>
          </button>

          {/* Grades */}
          <button
            onClick={() => navigate('/grades')}
            className='group bg-white hover:bg-purple-50 border-2 border-gray-200 hover:border-purple-400 rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-200 text-left'
          >
            <div className='bg-purple-100 group-hover:bg-purple-500 w-12 h-12 rounded-lg flex items-center justify-center mb-4 transition-colors duration-200'>
              <span className='text-2xl group-hover:scale-110 transition-transform duration-200'>
                🏆
              </span>
            </div>
            <h3 className='text-lg font-semibold text-gray-800 mb-1'>Grades</h3>
            <p className='text-sm text-gray-500'>Employee levels</p>
          </button>

          {/* Reports */}
          <button
            onClick={() => navigate('/reports')}
            className='group bg-white hover:bg-red-50 border-2 border-gray-200 hover:border-red-400 rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-200 text-left'
          >
            <div className='bg-red-100 group-hover:bg-red-500 w-12 h-12 rounded-lg flex items-center justify-center mb-4 transition-colors duration-200'>
              <span className='text-2xl group-hover:scale-110 transition-transform duration-200'>
                📄
              </span>
            </div>
            <h3 className='text-lg font-semibold text-gray-800 mb-1'>
              Reports
            </h3>
            <p className='text-sm text-gray-500'>Analytics & insights</p>
          </button>

          {/* Salary Process */}
          <button
            onClick={() => navigate('/salary-process')}
            className='group bg-white hover:bg-indigo-50 border-2 border-gray-200 hover:border-indigo-400 rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-200 text-left'
          >
            <div className='bg-indigo-100 group-hover:bg-indigo-500 w-12 h-12 rounded-lg flex items-center justify-center mb-4 transition-colors duration-200'>
              <span className='text-2xl group-hover:scale-110 transition-transform duration-200'>
                💵
              </span>
            </div>
            <h3 className='text-lg font-semibold text-gray-800 mb-1'>
              Salary Process
            </h3>
            <p className='text-sm text-gray-500'>Process payroll</p>
          </button>

          {/* Salary Report */}
          <button
            onClick={() => navigate('/salary-report')}
            className='group bg-white hover:bg-teal-50 border-2 border-gray-200 hover:border-teal-400 rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-200 text-left'
          >
            <div className='bg-teal-100 group-hover:bg-teal-500 w-12 h-12 rounded-lg flex items-center justify-center mb-4 transition-colors duration-200'>
              <span className='text-2xl group-hover:scale-110 transition-transform duration-200'>
                🧾
              </span>
            </div>
            <h3 className='text-lg font-semibold text-gray-800 mb-1'>
              Salary Report
            </h3>
            <p className='text-sm text-gray-500'>Payroll details</p>
          </button>
        </div>

        {/* Footer Info */}
        <div className='mt-8 bg-white rounded-xl p-6 shadow-md border border-gray-200'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm text-gray-500'>Last login</p>
              <p className='text-gray-800 font-medium'>
                Today at {new Date().toLocaleTimeString()}
              </p>
            </div>
            <div className='text-right'>
              <p className='text-sm text-gray-500'>System Status</p>
              <div className='flex items-center space-x-2'>
                <div className='w-2 h-2 bg-green-500 rounded-full animate-pulse'></div>
                <p className='text-gray-800 font-medium'>
                  All Systems Operational
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;

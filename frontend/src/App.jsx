import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import EmployeePage from './pages/EmployeePage';
import BankAccountPage from './pages/BankAccountPage';
import CompanyAccountPage from './pages/CompanyAccountPage';
import GradePage from './pages/GradePage';
import ReportsPage from './pages/ReportsPage';
import SalaryProcessPage from './pages/SalaryProcessPage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<LoginPage />} />
        <Route path='/dashboard' element={<DashboardPage />} />
        <Route path='/employees' element={<EmployeePage />} />
        <Route path='/bank-accounts' element={<BankAccountPage />} />
        <Route path='/company-account' element={<CompanyAccountPage />} />
        <Route path='/grades' element={<GradePage />} />
        <Route path='/reports' element={<ReportsPage />} />
        <Route path='/salary-process' element={<SalaryProcessPage />} />
      </Routes>
    </Router>
  );
};

export default App;

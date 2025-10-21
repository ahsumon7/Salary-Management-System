import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import authService from '../services/authService';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { setAuth } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await authService.login(username, password);
      setAuth(response.data);
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid username or password');
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-100 to-gray-200'>
      <div className='bg-white shadow-xl rounded-2xl p-10 w-full max-w-md'>
        <h2 className='text-3xl font-bold text-center text-gray-800 mb-6'>
          Login
        </h2>

        {error && (
          <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4 text-center'>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className='space-y-5'>
          <div>
            <label className='block text-gray-700 font-semibold mb-1'>
              Username
            </label>
            <input
              type='text'
              placeholder='Enter username'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
          </div>

          <div>
            <label className='block text-gray-700 font-semibold mb-1'>
              Password
            </label>
            <input
              type='password'
              placeholder='Enter password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
          </div>

          <button
            type='submit'
            className='w-full bg-blue-600 text-white font-semibold py-2 rounded-lg shadow hover:bg-blue-700 transition duration-200'
          >
            Login
          </button>
        </form>

        <p className='text-center text-gray-500 text-sm mt-6'>
          &copy; {new Date().getFullYear()} Your Company. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;

import React, { useEffect, useState } from 'react';
import bankAccountService from '../services/bankAccountService';
import Table from '../components/common/Table';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import Input from '../components/common/Input';
import Spinner from '../components/common/Spinner';

const BankAccountPage = () => {
  const [bankAccounts, setBankAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    accountName: '',
    accountNumber: '',
    accountType: '',
    currentBalance: '',
    bankName: '',
    branchName: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBankAccounts();
  }, []);

  const fetchBankAccounts = async () => {
    setLoading(true);
    const accounts = await bankAccountService.getBankAccounts();
    setBankAccounts(accounts);
    setLoading(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedAccount) {
        await bankAccountService.updateBankAccount(
          selectedAccount.id,
          formData
        );
      } else {
        await bankAccountService.createBankAccount(formData);
      }
      setModalVisible(false);
      fetchBankAccounts();
    } catch (err) {
      setError('Operation failed. Please try again.');
    }
  };

  const handleEdit = (account) => {
    setSelectedAccount(account);
    setFormData(account);
    setModalVisible(true);
    setError('');
  };

  const handleDelete = async (accountId) => {
    if (!window.confirm('Are you sure you want to delete this account?'))
      return;
    try {
      await bankAccountService.deleteBankAccount(accountId);
      fetchBankAccounts();
    } catch {
      alert('Failed to delete account.');
    }
  };

  const openModal = () => {
    setSelectedAccount(null);
    setFormData({
      accountName: '',
      accountNumber: '',
      accountType: '',
      currentBalance: '',
      bankName: '',
      branchName: '',
    });
    setModalVisible(true);
    setError('');
  };

  return (
    <div className='container'>
      <h1>Bank Accounts</h1>
      <Button onClick={openModal}>Add Bank Account</Button>
      {loading ? (
        <Spinner />
      ) : (
        <Table
          data={bankAccounts}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
      <Modal
        isOpen={modalVisible}
        onClose={() => setModalVisible(false)}
        title={selectedAccount ? 'Edit Bank Account' : 'Add Bank Account'}
      >
        {error && <p className='error-message'>{error}</p>}
        <form onSubmit={handleSubmit}>
          <Input
            name='accountName'
            value={formData.accountName}
            onChange={handleInputChange}
            placeholder='Account Name'
            required
          />
          <Input
            name='accountNumber'
            value={formData.accountNumber}
            onChange={handleInputChange}
            placeholder='Account Number'
            required
          />
          <Input
            name='accountType'
            value={formData.accountType}
            onChange={handleInputChange}
            placeholder='Account Type'
            required
          />
          <Input
            name='currentBalance'
            value={formData.currentBalance}
            onChange={handleInputChange}
            placeholder='Current Balance'
            required
          />
          <Input
            name='bankName'
            value={formData.bankName}
            onChange={handleInputChange}
            placeholder='Bank Name'
            required
          />
          <Input
            name='branchName'
            value={formData.branchName}
            onChange={handleInputChange}
            placeholder='Branch Name'
            required
          />
          <Button type='submit'>{selectedAccount ? 'Update' : 'Create'}</Button>
        </form>
      </Modal>
    </div>
  );
};

export default BankAccountPage;

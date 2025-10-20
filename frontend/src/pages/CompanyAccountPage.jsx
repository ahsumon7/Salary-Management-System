import React, { useEffect, useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import companyAccountService from '../services/companyAccountService';
import Button from '../components/common/Button';
import Spinner from '../components/common/Spinner';
import { AuthContext } from "../context/AuthContext"; 

const CompanyAccountPage = () => {
    const { companyBalance, setCompanyBalance } = useContext(AppContext);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [accountDetails, setAccountDetails] = useState(null);

    useEffect(() => {
        const fetchAccountDetails = async () => {
            try {
                const response = await companyAccountService.getCompanyAccount();
                setAccountDetails(response);
                setCompanyBalance(response.balance);
            } catch (err) {
                setError('Failed to fetch account details');
            } finally {
                setLoading(false);
            }
        };

        fetchAccountDetails();
    }, [setCompanyBalance]);

    const handleAddFunds = async (amount) => {
        setLoading(true);
        try {
            await companyAccountService.addFunds(amount);
            const updatedAccount = await companyAccountService.getCompanyAccount();
            setAccountDetails(updatedAccount);
            setCompanyBalance(updatedAccount.balance);
        } catch (err) {
            setError('Failed to add funds');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <Spinner />;

    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="container">
            <h1>Company Account Details</h1>
            <p>Account Number: {accountDetails.accountNumber}</p>
            <p>Balance: {accountDetails.balance.toLocaleString()} Taka</p>
            <Button onClick={() => handleAddFunds(10000)}>Add 10,000 Taka</Button>
        </div>
    );
};

export default CompanyAccountPage;

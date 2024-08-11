import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

function CreateTransaction() {
    const { authState } = useContext(AuthContext);
    const { userId, token } = authState;
    const [formData, setFormData] = useState({
        bankAccountId: '',
        toBankAccountId: '',
        customerId: '',
        paymentMethod: '',
        amount: '',
        currency: '',
        description: '',
    });
    const [transactionType, setTransactionType] = useState('transfer');
    const [bankAccounts, setBankAccounts] = useState([]);

    useEffect(() => {
        const fetchBankAccounts = async () => {
            try {
                const response = await axios.get(`http://localhost:9506/api/bank-accounts/user/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setBankAccounts(response.data);

                if (response.data.length > 0) {
                    setFormData((prevData) => ({
                        ...prevData,
                        bankAccountId: response.data[0].bankAccountId,
                        customerId: response.data[0].customerId,
                        paymentMethod: 'pm_card_visa',
                    }));
                }
            } catch (error) {
                console.error('Error fetching bank accounts:', error);
            }
        };

        if (userId && token) {
            fetchBankAccounts();
        }
    }, [userId, token]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => {
            const updatedData = { ...prevData, [name]: value };
            if (name === 'bankAccountId') {
                const selectedAccount = bankAccounts.find(account => account.bankAccountId === value);
                if (selectedAccount) {
                    updatedData.customerId = selectedAccount.customerId;
                }
            }
            return updatedData;
        });
    };

    //const handleChange = (e) => {
    //  setFormData({
    //    ...formData,
    //    [e.target.name]: e.target.value,
    //  });
    //};

    const handleSubmit = async (e) => {
        e.preventDefault();

        const headers = {
            Authorization: `Bearer ${token}`
        };

        let data;
        if (transactionType === 'transfer') {
            data = {
                fromBankAccountId: formData.bankAccountId,
                fromCustomerId: formData.customerId,
                toBankAccountId: formData.toBankAccountId,
                transactionType: "PEER_TO_PEER",
                amount: formData.amount,
                currency: formData.currency,
                description: formData.description,
                paymentMethod: formData.paymentMethod,
            };
        } else {
            data = {
                bankAccountId: formData.bankAccountId,
                amount: formData.amount,
                currency: formData.currency,
                paymentMethod: formData.paymentMethod,
                customerId: formData.customerId,
            };
        }

        let url = "http://localhost:9501/api/transaction/user"

        if (transactionType == 'deposit') {
            url += "/deposit";
        }
        else if (transactionType == 'withdraw') {
            url += "/withdraw";
        }
        else if (transactionType == 'transfer') {
            url = url.replace("user", "create");
        }

        console.log(data)

        try {
            await axios.post(url, data, { headers });
            alert('Transaction successful');
        } catch (error) {
            console.error('Error creating transaction', error);
            alert('Transaction failed');
        }
    };

    return (
        <div className="space-y-6">
            <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6 space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Transaction Type</label>
                    <select
                        name="transactionType"
                        value={transactionType}
                        onChange={(e) => setTransactionType(e.target.value)}
                        className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                        <option value="deposit">Deposit</option>
                        <option value="withdraw">Withdraw</option>
                        <option value="transfer">Transfer</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">From Bank Account ID</label>
                    <select
                        id="bankAccountId"
                        name="bankAccountId"
                        value={formData.bankAccountId}
                        onChange={handleChange}
                        className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                        {bankAccounts.map((account) => (
                            <option key={account.bankAccountId} value={account.bankAccountId}>
                                {account.bankAccountId}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Customer ID</label>
                    <input
                        type="text"
                        name="customerId"
                        value={formData.customerId}
                        readOnly
                        className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-gray-100 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </div>
                {transactionType === 'transfer' && (
                    <>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">To Bank Account ID</label>
                            <input
                                type="text"
                                name="toBankAccountId"
                                value={formData.toBankAccountId}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Description</label>
                            <input
                                type="text"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                        </div>
                    </>
                )}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Amount</label>
                    <input
                        type="number"
                        name="amount"
                        value={formData.amount}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Payment Method</label>
                    <select
                        id="paymentMethod"
                        name="paymentMethod"
                        value={formData.paymentMethod}
                        onChange={handleChange}
                        className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                        <option value="pm_card_visa">Visa</option>
                        <option value="pm_card_visa_debit">Visa (debit)</option>
                        <option value="pm_card_mastercard">Mastercard</option>
                        <option value="pm_card_mastercard_debit">Mastercard (debit)</option>
                        <option value="pm_card_mastercard_prepaid">Mastercard (prepaid)</option>
                        <option value="pm_card_amex">American Express</option>
                        <option value="pm_card_discover">Discover</option>
                        <option value="pm_card_diners">Diners Club</option>
                        <option value="pm_card_jcb">JCB</option>
                        <option value="pm_card_unionpay">UnionPay</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Currency</label>
                    <input
                        type="text"
                        name="currency"
                        value={formData.currency}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </div>
                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Submit
                    </button>
                </div>
            </form>
        </div>
    );
}

export default CreateTransaction;
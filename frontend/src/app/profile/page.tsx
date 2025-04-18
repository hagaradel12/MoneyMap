'use client';
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Bell, Search, UserCircle, Wallet, TrendingDown, TrendingUp, BarChart2, Settings, HelpCircle, LogOut, Currency } from 'lucide-react';
import axiosInstance from '../utils/axiosInstance';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Sidebar from '../sidebar/page';
import { set } from 'mongoose';

interface WalletDocument {
    _id: string;
    balance: number;
    currency: string;
}

interface UserDocument {
    name: string;
    email: string;
    phoneNumber: string;
    wallet?: string;
}

export default function Dashboard() {
    const backend_url = 'http://localhost:3000';

    const [user, setUser] = useState<UserDocument | null>(null);
    const [wallet, setWallet] = useState<WalletDocument | null>(null);
    const [walletError, setWalletError] = useState(false);
    const [showCreateWalletForm, setShowCreateWalletForm] = useState(false);
    const [balance, setBalance] = useState<number>(0);
    const [currency, setCurrency] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    
    const [formCurrency, setFormCurrency] = useState<string>('USD');
    const [formBalance, setFormBalance] = useState<number>(0);

    const fetchWallet = async () => {
        try {
            const user_data = await axiosInstance.get(`${backend_url}/auth/get-cookie-data`);
            const dataString = user_data.data.userData;
            const data = JSON.parse(dataString);
            const email = data.email;
            setEmail(email);

            const userResponse = await axiosInstance.get<UserDocument>(`${backend_url}/user/${email}`);
            setUser(userResponse.data);

            if (userResponse.data.wallet !== undefined) {
                const walletResponse = await axiosInstance.get<WalletDocument>(`${backend_url}/wallets/${userResponse.data.wallet}`);
                setWallet(walletResponse.data);
                setBalance(walletResponse.data.balance);
                setCurrency(walletResponse.data.currency);
                setWalletError(false); // in case it was true before
            } else {
                setWalletError(true);
                setWallet(null); // optional: reset wallet state if it was previously set
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchWallet();
    }, []);

    const handleCreateWallet = async () => {
        try {
            const createResponse = await axiosInstance.post(`${backend_url}/wallets/${email}`, {
                balance: formBalance,
                currency: formCurrency,
            });
            const newWallet = createResponse.data;
            setWallet(newWallet);
            setBalance(newWallet.balance);
            setCurrency(newWallet.currency);
            setShowCreateWalletForm(false);
            
            fetchWallet(); // Refresh the wallet data after creation
            
       
        } catch (error) {
            console.error("Error creating wallet:", error);
        }
    };

    const handleCurrencyChange = async (newCurrency: string) => {
        // Dummy API call for changing currency (replace with your actual API call)
        const newWallet = await axiosInstance.put(`${backend_url}/wallets/${wallet?._id}/${newCurrency}`)
        setCurrency(newCurrency); // Update the state with the new currency
        setBalance(newWallet.data.balance); // Update the balance if needed
        
    };

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <Sidebar />

            {/* Main content */}
            <main className="flex-1 p-8">
                <div className="flex justify-between items-center mb-6">
                    {/* Notifications and Username */}
                    <div className="flex items-center gap-4">
                        <Bell className="text-gray-500" />
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-gray-400" />
                            <span>{user?.name}</span>
                        </div>
                    </div>
                </div>

                <h2 className="text-2xl font-semibold mb-6">Dashboard</h2>

                {/* Profile Details */}
                <div className="bg-white rounded-xl shadow p-6 mb-6">
                    <h3 className="text-lg font-semibold mb-4">Profile Details</h3>
                    <div>Name: {user?.name}</div>
                    <div>Email: {user?.email}</div>
                    <div>Phone Number: {user?.phoneNumber}</div>
                </div>

                {/* Wallet Information */}
                <div className="bg-white rounded-xl shadow p-6">
                    <h3 className="text-lg font-semibold mb-4">Wallet</h3>

                    {walletError ? (
                        <>
                            <p>You don't have a wallet yet.</p>
                            <button
                                onClick={() => setShowCreateWalletForm(true)}
                                className="mt-4 p-2 bg-blue-500 text-white rounded"
                            >
                                Create Wallet
                            </button>
                        </>
                    ) : (
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <div>
                                    <div>Balance: {currency} {balance.toFixed(2)}</div>
                                    <div>Currency: {currency}</div>
                                </div>
                            </div>

                            {/* Currency Change Form */}
                            <div className="mt-6">
                                <label>Choose Currency:</label>
                                <select
                                    value={currency}
                                    onChange={(e) => handleCurrencyChange(e.target.value)}
                                    className="mt-2 p-2 border border-gray-300 rounded"
                                >
                                    <option value="Choose currency">Choose</option>
                                    <option value="USD">USD</option>
                                    <option value="AUD">AUD</option>
                                    <option value="CAD">CAD</option>
                                    <option value="EGP">EGP</option>
                                    <option value="EUR">EUR</option>
                                    <option value="GBP">GBP</option>
                                    <option value="JPY">JPY</option>
                                </select>
                            </div>
                        </div>
                    )}

                    {/* Create Wallet Form */}
                    {showCreateWalletForm && !wallet && (
                        <div className="mt-6">
                            <h4>Create Wallet</h4>
                            <div>
                                <label>Currency:</label>
                                <select
                                    value={formCurrency}
                                    onChange={(e) => setFormCurrency(e.target.value)}
                                    className="mt-2 p-2 border border-gray-300 rounded"
                                >
                                    <option value="Choose currency">Choose</option>
                                    <option value="USD">USD</option>
                                    <option value="AUD">AUD</option>
                                    <option value="CAD">CAD</option>
                                    <option value="EGP">EGP</option>
                                    <option value="EUR">EUR</option>
                                    <option value="GBP">GBP</option>
                                    <option value="JPY">JPY</option>
                                </select>
                            </div>

                            <div className="mt-4">
                                <label>Initial Balance:</label>
                                <input
                                    type="number"
                                    value={formBalance}
                                    onChange={(e) => setFormBalance(Number(e.target.value))}
                                    className="mt-2 p-2 border border-gray-300 rounded"
                                />
                            </div>

                            <button
                                onClick={handleCreateWallet}
                                className="mt-6 p-2 bg-green-500 text-white rounded"
                            >
                                Create Wallet
                            </button>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

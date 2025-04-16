'use client';
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Bell, Search, UserCircle, Wallet, TrendingDown, TrendingUp, BarChart2, Settings, HelpCircle, LogOut } from 'lucide-react';
import axiosInstance from '../utils/axiosInstance';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Sidebar from '../sidebar/page';
import NotificationsWindow from './NotificationWindow';
interface WalletResponse {
    _id: string; 
  }

interface WalletDocument{
    balance: number,
    expenses: ExpenseDocument [];
    currency: string,
}

interface ExpenseDocument {
    _id: string,
    name: string;
    category: number;
    price: number;
    paymentMethod: String;
    date: Date;
    flagForIncome: boolean;
}
interface UserDocument{
    name: string;
    email: string;
    phoneNumber: string;
    wallet: string;
}


export default function Dashboard() {
    const router = useRouter();

    const backend_url = 'http://localhost:3000';

    const [balance, setBalance] = useState<number>(0);
    const [currency, setCurrency] = useState<string>('');
    const [walletError, setWalletError] = useState<boolean>(false);
    const [sumExpenses, setSumExpenses] = useState<number>(0);
    const [sumIncome, setSumIncome] = useState<number>(0);
    const [user_name, setName] = useState<string>('');
    const [showNotifications, setShowNotifications] = useState(false);
    const [userEmail, setUserEmail] = useState<string>('');
    
    
    useEffect(() => {
        const fetchWallet = async () => {
          try {
            const user_data = await axiosInstance.get(`${backend_url}/auth/get-cookie-data`);
            const dataString = user_data.data.userData; // Extract the data string from the response
            const data = JSON.parse(dataString); // Parse the string into an object
            console.log((user_data.data.userData));
            const email = data.email;
            setUserEmail(email)
            console.log(email);
            const user = await axiosInstance.get<UserDocument>(`${backend_url}/user/${email}`);
            setName(user.data.name);
    
            const wallet = await axiosInstance.get<WalletResponse>(`${backend_url}/user/wallet/${email}`);
            if(wallet.data){
            const walletId = wallet.data._id; 
            const walletDetails = await axiosInstance.get<WalletDocument>(`${backend_url}/wallets/${walletId}`); //get wallet by its id
            setBalance(walletDetails.data.balance);
            setCurrency(walletDetails.data.currency);
            

            //calculate total expenses and income
            const expenses: ExpenseDocument[] = walletDetails.data.expenses; //populated expenses
            //this is an array of expenses id
            

            var expenseTotal = 0;
            var incomeTotal = 0;

            for (const expense of expenses) {
                const pop_expense = await axiosInstance.get<ExpenseDocument>(`${backend_url}/expenses/${expense._id}`);
                const expenseData = pop_expense.data;
                if (expense.flagForIncome === true) 
                    incomeTotal += expenseData.price;
                else
                    expenseTotal += expenseData.price;
            }

            setSumExpenses(expenseTotal);
            setSumIncome(incomeTotal);
        }
        else{
            setWalletError(true);
            setSumExpenses(0);
            setSumIncome(0);
        }
            
          } catch (error) {
            setWalletError(true);
          }


        };
    
        fetchWallet();
      }, []);



    return (
    <div className="flex h-screen bg-gray-100 text-gray-800">
        {/* Sidebar */}
        <Sidebar />

        
      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center bg-white rounded-md px-4 py-2 shadow">
            <Search className="w-4 h-4 text-gray-500 mr-2" />
            <input type="text" placeholder="Search here..." className="outline-none w-64" />
          </div>
          <div className="flex items-center space-x-4">
          <div className="relative">
  <Bell
    className="w-5 h-5 cursor-pointer"
    onClick={() => setShowNotifications(prev => !prev)}
  />
  {showNotifications && <NotificationsWindow email={userEmail} />}
</div>
            <div className="flex items-center space-x-2">
              <UserCircle className="w-6 h-6" />
              <span>{user_name}</span>
            </div>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Balance Card */}
        <Card className="bg-indigo-600 text-white shadow-lg hover:shadow-xl transition duration-300">
        <CardContent className="p-4">
        <div className="flex items-center justify-between">
        <div>
            <div className="text-sm uppercase tracking-wide mb-1">Balance</div>
            <div className="text-2xl font-bold">
            {walletError ? 'No Active Wallet!' : `${currency} ${balance.toFixed(2)}`}
            </div>
        </div>
        <Wallet className="w-8 h-8 text-white" />
        </div>
        <hr className="my-2 border-white/30" />
        </CardContent>
        </Card>

    {/* Expenses Card */}
    <Card className="bg-rose-400 text-white shadow-lg hover:shadow-xl transition duration-300">
    <CardContent className="p-4">
        <div className="flex items-center justify-between">
        <div>
            <div className="text-sm uppercase tracking-wide mb-1">Expenses</div>
            <div className="text-2xl font-bold">{`${currency} ${sumExpenses.toFixed(2)}`}</div>
        </div>
        <TrendingDown className="w-8 h-8 text-white" />
        </div>
        <hr className="my-2 border-white/30" />
        <div className="text-xs mb-2">All your monthly expenses</div>
        <button
        onClick={() => router.push('/expenses')}
        className="mt-2 text-sm bg-white text-rose-500 px-3 py-1 rounded hover:bg-gray-100"
        >
        Go to Expenses
        </button>
    </CardContent>
    </Card>

    {/* Income Card */}
    <Card className="bg-emerald-400 text-white shadow-lg hover:shadow-xl transition duration-300">
    <CardContent className="p-4">
        <div className="flex items-center justify-between">
        <div>
            <div className="text-sm uppercase tracking-wide mb-1">Incomes</div>
            <div className="text-2xl font-bold">{`${currency} ${sumIncome.toFixed(2)}`}</div>
        </div>
        <TrendingUp className="w-8 h-8 text-white" />
        </div>
        <hr className="my-2 border-white/30" />
        <div className="text-xs mb-2">Income you’ve received</div>
        <button
        onClick={() => router.push('/income')}
        className="mt-2 text-sm bg-white text-emerald-600 px-3 py-1 rounded hover:bg-gray-100"
        >
        Go to Income
        </button>
    </CardContent>
    </Card>
        </div>

        {/* Reminders & Recent Expenses */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card className="col-span-1">
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Reminders</h3>
                <a href="#" className="text-sm text-blue-500">See All</a>
              </div>
              <ul className="space-y-2">
                <li><input type="checkbox" className="mr-2" />Bali Vacation <span className="text-xs text-gray-500 ml-2">Target: Aug 25 2022</span></li>
                <li><input type="checkbox" className="mr-2" />New Gadget <span className="text-xs text-gray-500 ml-2">Target: Aug 25 2022</span></li>
                <li><input type="checkbox" className="mr-2" />Charity <span className="text-xs text-gray-500 ml-2">Target: Aug 25 2022</span></li>
              </ul>
            </CardContent>
          </Card>

          <Card className="col-span-2">
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Recent Expenses</h3>
                <a href="#" className="text-sm text-blue-500">See All</a>
              </div>
              <ul className="divide-y divide-gray-200">
                <li className="py-2 flex justify-between items-center">
                  <span>Figma</span>
                  <span className="text-green-600 font-medium">$100</span>
                </li>
                <li className="py-2 flex justify-between items-center">
                  <span>Youtube</span>
                  <span className="text-green-600 font-medium">$120</span>
                </li>
                <li className="py-2 flex justify-between items-center">
                  <span>Spotify</span>
                  <span className="text-green-600 font-medium">$15</span>
                </li>
                <li className="py-2 flex justify-between items-center">
                  <span>Freepik</span>
                  <span className="text-green-600 font-medium">$300</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}


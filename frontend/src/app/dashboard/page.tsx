'use client';
import React, { use, useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Bell, Search, UserCircle, Wallet, TrendingDown, TrendingUp, BarChart2, Settings, HelpCircle, LogOut, Plus } from 'lucide-react';
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
interface Reminders{
 _id: string;
  title: string;
  dueDate: string;
  read: boolean;
};


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
     const [reminders, setReminders] = useState<Reminders[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState('');
    const [recentExpenses, setRecentExpenses] = useState<ExpenseDocument[]>([]);

    
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

     const fetchReminders = () => {
    axios.get(`${backend_url}/user/${userEmail}/reminders`)

      .then(res => setReminders(res.data))
      .catch(err => console.error('Fetch error:', err));
  };

  useEffect(() => {
    fetchReminders();
  }, []);

 const createReminder = () => {
  if (!newTitle || !newDate || !userEmail) return;

  axios
    .post(`${backend_url}/reminders/user/${userEmail}`, {
      title: newTitle,
      dueDate: new Date(newDate).toISOString(),
    })
    .then(() => {
      setNewTitle('')
      setNewDate('');
      fetchReminders(); // refresh the list
    })
    .catch((err) => console.error('Error creating reminder:', err));
};
useEffect(() => {
  if (userEmail) {
    fetchReminders();
  }
}, [userEmail]);


  useEffect(() => {
  const fetchRecentExpenses = async () => {
    try {
      const user_data = await axiosInstance.get(`${backend_url}/auth/get-cookie-data`);
      const dataString = user_data.data.userData;
      const data = JSON.parse(dataString);
      const email = data.email;

      const walletRes = await axiosInstance.get(`${backend_url}/user/wallet/${email}`);
      const walletId = walletRes.data._id;

      const walletDetails = await axiosInstance.get(`${backend_url}/wallets/${walletId}`);
      const fullExpenses = walletDetails.data.expenses;

      // Only consider actual expenses (not incomes)
      const filtered = fullExpenses.filter((e: ExpenseDocument) => !e.flagForIncome);

      // Sort by date descending and take the latest 5
      const recent = filtered
        .sort((a: ExpenseDocument, b: ExpenseDocument) =>
          new Date(b.date).getTime() - new Date(a.date).getTime()
        )
        .slice(0, 5);

      setRecentExpenses(recent);
    } catch (error) {
      console.error('Error fetching recent expenses:', error);
    }
  };

  fetchRecentExpenses();
}, []);

  const markAsRead = (id: string) => {
    axios.patch(`${backend_url}/reminders/read/${id}`).then(fetchReminders);
  };

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
    <Card className="col-span-2">
      <CardContent className="p-4 max-h-[400px] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Reminders</h3>
          <div className="flex gap-2 items-center">
            <input
              type="text"
              placeholder="New reminder"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="border px-2 py-1 rounded text-sm"
            />
            <input
              type="date"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              className="border px-2 py-1 rounded text-sm"
            />
            <button
              onClick={createReminder}
              disabled={!newTitle || !newDate}
              className={`px-3 py-1 rounded flex items-center text-white ${
                !newTitle || !newDate
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-blue-500 hover:bg-blue-600'
              }`}
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {reminders.length > 0 ? (
          <ul className="space-y-2">
            {reminders.map((reminder) => (
              <li key={reminder._id} className="flex justify-between items-center">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={reminder.read}
                    onChange={() => markAsRead(reminder._id)}
                  />
                  {reminder.title}
                </div>
                <span className="text-xs text-gray-500">
                  Target: {
  reminder.dueDate
    ? new Date(reminder.dueDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
      })
    : 'No date'
}

                  
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-400 italic">Create a reminder</p>
        )}
      </CardContent>
    </Card>
  


          <Card className="col-span-1">
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Recent Expenses</h3>
                <a href="#" className="text-sm text-blue-500">See All</a>
              </div>
           <ul className="divide-y divide-gray-200">
  {recentExpenses.length > 0 ? (
    recentExpenses.map((expense) => (
      <li key={expense._id} className="py-2 flex justify-between items-center">
        <span>{expense.name}</span>
        <span className="text-rose-600 font-medium">
          {currency} {expense.price}
        </span>
      </li>
    ))
  ) : (
    <li className="py-2 text-sm text-gray-400 italic">
      No recent expenses found.
    </li>
  )}
</ul>

            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}


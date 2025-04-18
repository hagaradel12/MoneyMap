"use client";
import { JSX, useEffect, useState } from "react";
import Sidebar from "../sidebar/page";
import { Bell, Search } from "lucide-react";
import axiosInstance from "../utils/axiosInstance";

// Interfaces
interface WalletResponse {
  _id: string;
}

interface WalletDocument {
  balance: number;
  expenses: ExpenseDocument[];
  currency: string;
}

interface ExpenseDocument {
  _id: string;
  name: string;
  category: string;
  price: number;
  paymentMethod: string;
  date: Date;
  flagForIncome: boolean;
  iconColor?: string;
}

interface UserDocument {
  name: string;
  email: string;
  phoneNumber: string;
  wallet: string;
}

export default function Dashboard() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [expenses, setExpense] = useState<ExpenseDocument[]>([]);
  const [user_name, setName] = useState<string>("");
  const [expenseError, setExpenseError] = useState<boolean>(false);
  const [walletError, setWalletError] = useState<boolean>(false);
  const [currency, setCurrency] = useState<string>("");
  const backend_url = "http://localhost:3000";

  const [selectedMonth, setSelectedMonth] = useState<number>(-1);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [filteredExpenses, setFilteredExpenses] = useState<ExpenseDocument[]>([]);
  const [allExpenses, setAllExpenses] = useState<ExpenseDocument[]>([]); //full unfiltered list

  const [searchTerm, setSearchTerm] = useState("");
  type SearchBy = "name" | "category";
  const [searchBy, setSearchBy] = useState<SearchBy>("name"); // or "category"
  


  const categoryKeywords: { keywords: string[]; name: string; icon: JSX.Element }[] = [
    {
      keywords: ["work", "internship", "salary", "income", "bonus", "paycheck"],
      name: "Income - Work & Earnings",
      icon: (
        <span role="img" aria-label="work" className="w-8 h-8 flex items-center justify-center rounded-full bg-green-100">
          💼
        </span>
      ),
    },
    {
      keywords: ["freelance", "revenue", "wage", "commission", "profit", "dividend"],
      name: "Income - Freelance & Profit",
      icon: (
        <span role="img" aria-label="freelance" className="w-8 h-8 flex items-center justify-center rounded-full bg-green-100">
          🖥️
        </span>
      ),
    },
    {
      keywords: ["overtime", "earnings", "interest"],
      name: "Income - Overtime & Earnings",
      icon: (
        <span role="img" aria-label="overtime" className="w-8 h-8 flex items-center justify-center rounded-full bg-green-100">
          ⏰
        </span>
      ),
    },
    {
      keywords: ["profit", "dividend", "investment", "stocks", "shares"],
      name: "Income - Profit & Investment",
      icon: (
        <span role="img" aria-label="profit" className="w-8 h-8 flex items-center justify-center rounded-full bg-green-100">
          📈
        </span>
      ),
    },
  ];
  
  

  
  const getCategoryDetails = (category: string) => {
    const normalizedCategory = category.toLowerCase();
  
    const match = categoryKeywords.find((entry) =>
      entry.keywords.some((kw) => normalizedCategory.includes(kw))
    );
  
    if (match) {
      return {
        name: match.name,
        icon: match.icon,
      };
    }
  
    return {
      name: "Other",
      icon: (
        <span role="img" aria-label="other" className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200">
          ❓
        </span>
      ),
    };
  };
  
  
  
  useEffect(() => {
    const fetchWallet = async () => {
      try {
        const user_data = await axiosInstance.get(`${backend_url}/auth/get-cookie-data`);
        const dataString = user_data.data.userData;
        const data = JSON.parse(dataString);
        const email = data.email;

        const user = await axiosInstance.get<UserDocument>(`${backend_url}/user/${email}`);
        setName(user.data.name);

        const wallet = await axiosInstance.get<WalletResponse>(`${backend_url}/user/wallet/${email}`);
        if (wallet.data) {
          const walletId = wallet.data._id;
          const walletDetails = await axiosInstance.get<WalletDocument>(`${backend_url}/wallets/${walletId}`);
          setCurrency(walletDetails.data.currency);
          const expenses: ExpenseDocument[] = walletDetails.data.expenses;
          setExpense(expenses);
          setAllExpenses(expenses); // Store the full list of expenses          
          console.log(expenses[0])
        } else {
          setWalletError(true);
        }
      } catch (error) {
        setExpenseError(true);
      }
    };

    fetchWallet();
  }, []);



  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />
  
      {/* Main content */}
      <main className="flex-1 p-8">
        <div className="flex justify-between items-center mb-6">
          {/* Search bar and toggle */}
          <div className="relative flex gap-4 w-1/2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={`Search by ${searchBy}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300"
            />
  
            {/* Toggle between 'name' and 'category' */}
            <select
              value={searchBy}
              onChange={(e) => setSearchBy(e.target.value as SearchBy)}
              className="px-4 py-2 border border-gray-300 rounded-full"
            >
              <option value="name">Search by Name</option>
              <option value="category">Search by Category</option>
            </select>
          </div>
  
          {/* Notifications and Username */}
          <div className="flex items-center gap-4">
            <Bell className="text-gray-500" />
            <div className="flex items-center gap-2">
            </div>
          </div>
        </div>
  
        <h2 className="text-2xl font-semibold mb-6">Income Breakdown</h2>
  

  
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-lg font-semibold mb-4">My Incomes</h3>
  
          {/* Filters for Month and Category */}
          <div className="flex gap-4 mb-4">
            <select
              className="px-4 py-2 border border-gray-300 rounded-full"
              value={selectedMonth}
              onChange={(e) => {
                const month = parseInt(e.target.value);
                setSelectedMonth(month);
                const filtered =
                  month === -1
                    ? allExpenses
                    : allExpenses.filter(
                        (expense) => new Date(expense.date).getMonth() === month
                      );
                setExpense(filtered);
              }}
            >
              <option value="-1">All Months</option>
              <option value="0">January</option>
              <option value="1">February</option>
              <option value="2">March</option>
              <option value="3">April</option>
              <option value="4">May</option>
              <option value="5">June</option>
              <option value="6">July</option>
              <option value="7">August</option>
              <option value="8">September</option>
              <option value="9">October</option>
              <option value="10">November</option>
              <option value="11">December</option>
            </select>
          </div>
  
          <ul>
            {expenses
              .filter((expense) =>
                expense[searchBy]
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase())
              )
              .map((expense, index) =>
                expense.flagForIncome ? (
                  <li
                    key={index}
                    className="flex justify-between items-center py-4 border-b last:border-b-0"
                  >
                    <div className="flex items-center gap-4">
                      {/* Displaying category icon */}
                      <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-200">
                        {getCategoryDetails(expense.category).icon}
                      </div>
                      <div>
                        <div className="font-medium">{expense.name}</div>
                        <div className="text-sm text-gray-500">
                          {new Date(expense.date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500">{expense.category}</div>
                      <div className="font-bold text-green-500">
                        + {currency} {expense.price.toFixed(2)}
                      </div>
                      <div className="text-sm text-gray-600">{expense.paymentMethod}</div>
                    </div>
                  </li>
                ) : null
              )}
          </ul>
        </div>
      </main>
    </div>
  );
}  
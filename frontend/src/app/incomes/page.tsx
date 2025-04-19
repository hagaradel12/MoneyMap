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
  const [walletBalance, setWalletBalance] = useState<number>(0);
  
    const [error, setError] = useState<string | null>(null);
    const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
    const [isUpdateFormOpen, setIsUpdateFormOpen] = useState(false);
    const [formData, setFormData] = useState<ExpenseDocument | null>(null);
  

  


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
  
  const handleCreateExpense = async () => {
    try {
      const user_data = await axiosInstance.get(`${backend_url}/auth/get-cookie-data`);
      const dataString = user_data.data.userData;
      const data = JSON.parse(dataString);
      const email = data.email;
  
      const response = await axiosInstance.post(`${backend_url}/expenses/${email}`, {
        ...formData,
        flagForIncome: true, // force it to true
      });
  
      const createdExpense = response.data;
  
      setExpense((prev) => [...prev, createdExpense]);
      setAllExpenses((prev) => [...prev, createdExpense]);
  
      setFormData(null); // reset form state
      setIsCreateFormOpen(false);
      fetchWallet(); // optional if list needs to be refreshed
    } catch (err) {
      console.error("Error creating income:", err);
      setError("Failed to create income. Please try again.");
    }
  };
  
    
    const handleUpdateExpense = async () => {
      try {
        if (!formData?._id) return;
    
        const response = await axiosInstance.put(`${backend_url}/expenses/${formData._id}`, formData);
        const updatedExpense = response.data;
    
        setExpense((prev) =>
          prev.map((exp) => (exp._id === updatedExpense._id ? updatedExpense : exp))
        );
        setAllExpenses((prev) =>
          prev.map((exp) => (exp._id === updatedExpense._id ? updatedExpense : exp))
        );
    
        setFormData(null);
        setIsUpdateFormOpen(false);
        fetchWallet();
      } catch (err) {
        console.error("Error updating expense:", err);
        setError("Failed to update expense. Please try again.");
      }
    };
    
  
    async function handleDelete(id: string) {
      const user_data = await axiosInstance.get(`${backend_url}/auth/get-cookie-data`);
      const dataString = user_data.data.userData;
      const data = JSON.parse(dataString);
      const email = data.email;
      await axiosInstance.delete(`${backend_url}/expenses/${email}/${id}`);
      fetchWallet();
    }
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
          setWalletBalance(walletDetails.data.balance);
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
    
    useEffect(() => {
      fetchWallet();
    }, []); 
  
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
            setWalletBalance(walletDetails.data.balance);
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
           </div>
         </div>
   
         <h2 className="text-2xl font-semibold mb-6">Income Breakdown</h2>
   
         {/* Expenses Summary */}
         <div className="bg-white rounded-xl shadow p-6">
   <div className="flex justify-between items-center mb-6">
     {/* Left: Balance */}
     <div className="flex flex-col items-start">
       <div className="text-2xl font-semibold text-gray-600">
         Balance:{" "}
         <span className="text-2xl font-semibold text-blue-600">
         {currency} {walletBalance.toFixed(2)}
         </span>
       </div>
       <h3 className="text-lg font-semibold text-gray-800 mt-2">My Income</h3>
     </div>
 
     {/* Right: Month Filter Dropdown + Create income Button */}
     <div className="flex items-center gap-4">
       {/* Month Filter Dropdown */}
       <select
         className="px-4 py-2 border border-gray-300 rounded-full text-blue-600"
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
         {Array.from({ length: 12 }).map((_, i) => (
           <option key={i} value={i}>
             {new Date(0, i).toLocaleString("default", { month: "long" })}
           </option>
         ))}
       </select>
 
       {/* Create income Button */}
       <button
         onClick={() => {
           setFormData(null);
           setIsCreateFormOpen(true);
         }}
         className="px-4 py-2 bg-blue-600 text-white rounded-full"
       >
         + Create Income
       </button>
     </div>
   </div>
   
           {/* Expenses List */}
 <ul>
   {expenses
     .filter((expense) =>
       expense[searchBy]
         .toLowerCase()
         .includes(searchTerm.toLowerCase())
     )
     .map(
       (expense, index) =>
         expense.flagForIncome && (
           <li
             key={index}
             className="flex justify-between items-center py-4 border-b last:border-b-0"
           >
             {/* Left Side: Category and Expense Name */}
             <div className="flex items-center gap-4">
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
 
             {/* Right Side: Expense Details, Update and Delete Buttons */}
             <div className="flex flex-col items-end gap-2">
               <div className="text-right">
                 <div className="text-sm text-gray-500">{expense.category}</div>
                 <div className="font-bold text-green-500">
                   + {currency} {expense.price.toFixed(2)}
                 </div>
                 <div className="text-sm text-gray-600">{expense.paymentMethod}</div>
               </div>
 
               {/* Action Buttons (Update and Delete) */}
               <div className="flex gap-4 mt-2">
                 <button
                   onClick={() => {
                     setFormData(expense); // fill with data
                     setIsUpdateFormOpen(true);
                   }}
                   className="px-4 py-2 bg-blue-600 text-white rounded-full"
                 >
                   Update
                 </button>
                 <button
                   onClick={() => handleDelete(expense._id)}
                   className="px-4 py-2 bg-red-600 text-white rounded-full"
                 >
                   Delete
                 </button>
               </div>
             </div>
           </li>
         )
     )}
 </ul>
 
         </div>
       </main>
 
 
 
   
       {/* Expense Form Modal */}
       {isCreateFormOpen && (
   <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
     <div className="bg-white p-6 rounded-lg w-96">
       <h2 className="text-xl font-semibold mb-4">Create Income</h2>
 
       <form onSubmit={async (e) => {
         e.preventDefault();
         await handleCreateExpense();
       }}>
           {/* Name */}
   <input
     type="text"
     placeholder="Name"
     value={formData?.name || ""}
     onChange={(e) => setFormData({ ...formData!, name: e.target.value })}
     className="w-full mb-3 p-2 border border-gray-300 rounded"
     required
   />
 
   {/* Category (string) */}
   <select
     value={formData?.category || ""}
     onChange={(e) =>
       setFormData({ ...formData!, category: e.target.value })
     }
     className="w-full mb-3 p-2 border border-gray-300 rounded"
     required
   >
     <option value="" disabled>Select Category</option>
     <option value="work">work</option>
     <option value="internship">internship</option>
     <option value="salary">salary</option>
     <option value="bonus">bonus</option>
     <option value="income">income</option>
     <option value="Other">Other</option>
   </select>
 
   {/* Price */}
   <input
     type="number"
     placeholder="Price"
     value={formData?.price ?? ""}
     onChange={(e) =>
       setFormData({ ...formData!, price: parseFloat(e.target.value) })
     }
     className="w-full mb-3 p-2 border border-gray-300 rounded"
     required
   />
 
   {/* Payment Method (string) */}
   <select
     value={formData?.paymentMethod || ""}
     onChange={(e) =>
       setFormData({ ...formData!, paymentMethod: e.target.value })
     }
     className="w-full mb-3 p-2 border border-gray-300 rounded"
     required
   >
     <option value="" disabled>Select Payment Method</option>
     <option value="Cash">Cash</option>
     <option value="Credit Card">Credit Card</option>
     <option value="Debit Card">Debit Card</option>
     <option value="Bank Transfer">Bank Transfer</option>
     <option value="Other">Other</option>
   </select>
 
   {/* Date */}
   <input
     type="date"
     value={
       formData?.date
         ? new Date(formData.date).toISOString().split("T")[0]
         : ""
     }
     onChange={(e) =>
       setFormData({
         ...formData!,
         date: new Date(e.target.value),
       })
     }
     className="w-full mb-3 p-2 border border-gray-300 rounded"
     required
   />
 
         <div className="flex justify-between mt-4">
           <button
             type="button"
             onClick={() => {
               setFormData(null);
               setIsCreateFormOpen(false);
             }}
             className="px-4 py-2 bg-gray-300 rounded"
           >
             Cancel
           </button>
           <button
             type="submit"
             className="px-4 py-2 bg-blue-600 text-white rounded"
           >
             Create
           </button>
         </div>
       </form>
     </div>
   </div>
 )}
 {isUpdateFormOpen && formData && (
   <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
     <div className="bg-white p-6 rounded-lg w-96">
       <h2 className="text-xl font-semibold mb-4">Update Expense</h2>
 
       <form onSubmit={async (e) => {
         e.preventDefault();
         await handleUpdateExpense();
       }}>
         {/* Name */}
   <input
     type="text"
     placeholder="Name"
     value={formData.name}
     onChange={(e) => setFormData({ ...formData, name: e.target.value })}
     className="w-full mb-3 p-2 border border-gray-300 rounded"
     required
   />
 
   {/* Category */}
   <select
     value={formData.category}
     onChange={(e) => setFormData({ ...formData, category: e.target.value })}
     className="w-full mb-3 p-2 border border-gray-300 rounded"
     required
   >
     <option value="" disabled>Select Category</option>
     <option value="Food">Food</option>
     <option value="Transport">Transport</option>
     <option value="Shopping">Shopping</option>
     <option value="Utilities">Utilities</option>
     <option value="Other">Other</option>
   </select>
 
   {/* Price */}
   <input
     type="number"
     placeholder="Price"
     value={formData.price}
     onChange={(e) =>
       setFormData({ ...formData, price: parseFloat(e.target.value) })
     }
     className="w-full mb-3 p-2 border border-gray-300 rounded"
     required
   />
 
   {/* Payment Method */}
   <select
     value={formData.paymentMethod}
     onChange={(e) =>
       setFormData({ ...formData, paymentMethod: e.target.value })
     }
     className="w-full mb-3 p-2 border border-gray-300 rounded"
     required
   >
     <option value="" disabled>Select Payment Method</option>
     <option value="Cash">Cash</option>
     <option value="Credit Card">Credit Card</option>
     <option value="Debit Card">Debit Card</option>
     <option value="Bank Transfer">Bank Transfer</option>
     <option value="Other">Other</option>
   </select>
 
   {/* Date */}
   <input
     type="date"
     value={
       formData.date
         ? new Date(formData.date).toISOString().split("T")[0]
         : ""
     }
     onChange={(e) =>
       setFormData({ ...formData, date: new Date(e.target.value) })
     }
     className="w-full mb-3 p-2 border border-gray-300 rounded"
     required
   />
 
 
         <div className="flex justify-between mt-4">
           <button
             type="button"
             onClick={() => {
               setFormData(null);
               setIsUpdateFormOpen(false);
             }}
             className="px-4 py-2 bg-gray-300 rounded"
           >
             Cancel
           </button>
           <button
             type="submit"
             className="px-4 py-2 bg-green-600 text-white rounded"
           >
             Update
           </button>
         </div>
       </form>
     </div>
   </div>
 )}
 
 
     </div>
   );
 }    
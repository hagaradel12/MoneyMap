"use client";
import { useEffect, useState } from "react";
import Sidebar from "../sidebar/page";
import axiosInstance from "../utils/axiosInstance";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";


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

const CATEGORY_COLORS: Record<string, string> = {
  Food: "#3b82f6",
  Transport: "#10b981",
  Shopping: "#f59e0b",
  Utilities: "#8b5cf6",
  Other: "#6b7280",
};

export default function AnalyticsPage() {
  const [chartData, setChartData] = useState<any>([]);
  const [timeRange, setTimeRange] = useState<string>("month");
  const [avgMonthlySpending, setAvgMonthlySpending] = useState<number>(0);
  const [topCategory, setTopCategory] = useState<{ name: string; total: number } | null>(null);
  const [pieData, setPieData] = useState<any[]>([]);
  const [currency, setCurrency] = useState<string>("");

  const backend_url = "http://localhost:3000";

  const fetchUserExpenses = async (): Promise<ExpenseDocument[]> => {
    const user_data = await axiosInstance.get(`${backend_url}/auth/get-cookie-data`);
    const dataString = user_data.data.userData;
    const data = JSON.parse(dataString);
    const email = data.email;

    const walletRes = await axiosInstance.get(`${backend_url}/user/wallet/${email}`);
    const walletId = walletRes.data._id;
    const walletDetails = await axiosInstance.get(`${backend_url}/wallets/${walletId}`);
    setCurrency(walletDetails.data.currency);

    return walletDetails.data.expenses.filter((e: ExpenseDocument) => !e.flagForIncome);
  };

  const calculateWidgets = (expenses: ExpenseDocument[]) => {
    const totalsByMonth = new Map<string, number>();
    const totalsByCategory = new Map<string, number>();

    expenses.forEach((exp) => {
      const date = new Date(exp.date);
      const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
      totalsByMonth.set(monthKey, (totalsByMonth.get(monthKey) || 0) + exp.price);

      const cat = exp.category;
      totalsByCategory.set(cat, (totalsByCategory.get(cat) || 0) + exp.price);
    });

    const avg = Array.from(totalsByMonth.values()).reduce((a, b) => a + b, 0) / totalsByMonth.size;
    setAvgMonthlySpending(avg);

    let topCatName = '';
    let topCatTotal = 0;
    totalsByCategory.forEach((total, cat) => {
      if (total > topCatTotal) {
        topCatTotal = total;
        topCatName = cat;
      }
    });
    setTopCategory({ name: topCatName, total: topCatTotal });

    const pieFormatted = Array.from(totalsByCategory.entries()).map(([category, value]) => ({
      name: category,
      value,
    }));
    setPieData(pieFormatted);
  };

  const fetchMonthlyExpenses = async () => {
    try {
      const expenses = await fetchUserExpenses();
      const grouped = expenses.reduce((acc: Record<string, number>, exp) => {
        const date = new Date(exp.date);
        const week = Math.ceil(date.getDate() / 7);
        const label = ` ${week === 1 ? '1st' : week === 2 ? '2nd' : week === 3 ? '3rd' : '4th'} Week`;
        acc[label] = (acc[label] || 0) + exp.price;
        return acc;
      }, {});

      const formatted = Object.entries(grouped).map(([week, total]) => ({
        name: week,
        Expense: total,
      }));

      setChartData(formatted);
      calculateWidgets(expenses);
    } catch (error) {
      console.error("Error fetching monthly expenses:", error);
    }
  };

  const fetchYearlyExpenses = async () => {
    try {
      const expenses = await fetchUserExpenses();
      const grouped = expenses.reduce((acc: Record<string, number>, exp) => {
        const month = new Date(exp.date).toLocaleString("default", { month: "short" });
        acc[month] = (acc[month] || 0) + exp.price;
        return acc;
      }, {});

      const formatted = Object.entries(grouped).map(([month, total]) => ({
        name: month,
        Expense: total,
      }));

      setChartData(formatted);
      calculateWidgets(expenses);
    } catch (error) {
      console.error("Error fetching yearly expenses:", error);
    }
  };

  const fetchWeeklyExpenses = async () => {
    try {
      const expenses = await fetchUserExpenses();
      const grouped = expenses.reduce((acc: Record<string, number>, exp) => {
        const day = new Date(exp.date).toLocaleString("default", { weekday: "short" });
        acc[day] = (acc[day] || 0) + exp.price;
        return acc;
      }, {});

      const formatted = Object.entries(grouped).map(([day, total]) => ({
        name: day,
        Expense: total,
      }));

      setChartData(formatted);
      calculateWidgets(expenses);
    } catch (error) {
      console.error("Error fetching weekly expenses:", error);
    }
  };

  useEffect(() => {
    if (timeRange === "month") fetchMonthlyExpenses();
    else if (timeRange === "year") fetchYearlyExpenses();
    else if (timeRange === "week") fetchWeeklyExpenses();
  }, [timeRange]);

  //avgMonthlySpending.toFixed(2)

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
          <div className="flex gap-4 items-center">
           
            
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Expenses Overview</h2>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="border px-3 py-2 rounded-md text-sm bg-gray-100 focus:outline-none"
            >
              <option value="week">Weekly</option>
              <option value="month">Monthly</option>
              <option value="year">Yearly</option>
            </select>
          </div>

          <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-4 bg-blue-100 rounded-xl shadow">
              <div className="text-sm text-blue-800">Average Monthly Spending </div>
              <div className="text-xl font-bold text-blue-900">
                {avgMonthlySpending.toFixed(2)} {currency}
              </div>
            </div>
            <div className="p-4 bg-yellow-100 rounded-xl shadow">
              <div className="text-sm text-yellow-800">Top Spending Category</div>
              <div className="text-xl font-bold text-yellow-900">
                {topCategory ?`${topCategory.name} (${topCategory.total.toFixed(2)} )${currency}` : "N/A"}
              </div>
            </div>
          </div>

          <div className="w-full flex flex-col lg:flex-row gap-8 h-96">
            <div className="flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip  formatter={(value: number) => value.toFixed(2)}/>
                  <Bar dataKey="Expense" fill="#3b82f6" radius={[10, 10, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={100}
                    innerRadius={60}
                    label={(entry) => `${entry.name}: ${entry.value.toFixed(2)}`}
                  >
         

                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[entry.name] || "#9ca3af"} />
                    ))}
                  </Pie>
                  <Legend layout="horizontal" verticalAlign="bottom" align="center" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
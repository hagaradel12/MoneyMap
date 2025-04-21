'use client'; // if you're using Next.js 13+ App Router

import {
  Wallet,
  BarChart2,
  TrendingUp,
  TrendingDown,
  UserCircle,
  HelpCircle,
  LogOut,
} from "lucide-react";
import React, { useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [active, setActive] = useState(pathname);

  const navItems = [
    { name: "Dashboard", icon: Wallet, path: "/dashboard" },
    { name: "Analytics", icon: BarChart2, path: "/analytics" },
    { name: "Incomes", icon: TrendingUp, path: "/incomes" },
    { name: "Expenses", icon: TrendingDown, path: "/expenses" },
    { name: "Profile", icon: UserCircle, path: "/profile" },
  ];

  const handleNav = (path: any) => {
    setActive(path);
    router.push(path);
  };

  return (
    <aside className="w-64 bg-white shadow-md p-4 flex flex-col justify-between min-h-screen">
      <div>
        <h2 className="text-2xl font-bold mb-6">Finance Dashboard</h2>
        <nav className="flex flex-col space-y-4">
          {navItems.map(({ name, icon: Icon, path }) => (
            <button
              key={name}
              onClick={() => handleNav(path)}
              className={`flex items-center space-x-2 px-2 py-1 rounded-md transition-all
                ${
                  active === path
                    ? "bg-indigo-100 text-indigo-600 font-semibold"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
            >
              <Icon className="w-5 h-5" />
              <span>{name}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="space-y-4">
        <button className="flex items-center space-x-2 text-sm text-gray-700 hover:text-indigo-600">
          <HelpCircle className="w-4 h-4" />
          <span>Help</span>
        </button>
        <button className="flex items-center space-x-2 text-sm text-red-500 hover:text-red-600">
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

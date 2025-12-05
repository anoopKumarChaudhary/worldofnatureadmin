// src/app/page.tsx
"use client";

import { useState, useEffect } from "react";
// import { useAppSelector } from "./redux/hooks"; // Not needed for stats anymore if fetching directly
import AdminLayout from "./components/AdminLayout";
import {
  Users,
  Package,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

export default function Dashboard() {
  const [statsData, setStatsData] = useState({
    totalOrders: 0,
    totalProducts: 0,
    totalUsers: 0,
    totalRevenue: 0,
    recentOrders: [],
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
        const response = await fetch(`${apiUrl}/dashboard/stats`);
        const data = await response.json();
        setStatsData(data);
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
      }
    };
    fetchStats();
  }, []);

  const stats = [
    {
      name: "Total Products",
      value: statsData.totalProducts,
      icon: Package,
      change: "+12%",
      changeType: "positive",
    },
    {
      name: "Total Orders",
      value: statsData.totalOrders,
      icon: ShoppingCart,
      change: "+8%",
      changeType: "positive",
    },
    {
      name: "Total Users",
      value: statsData.totalUsers,
      icon: Users,
      change: "+23%",
      changeType: "positive",
    },
    {
      name: "Revenue",
      value: `₹${statsData.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      change: "-4%",
      changeType: "negative",
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">
            Welcome back! Here&apos;s what&apos;s happening with your store.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.name} className="rounded-lg bg-white p-6 shadow">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <stat.icon className="h-8 w-8 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {stat.name}
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stat.value}
                    </dd>
                  </dl>
                </div>
              </div>
              <div className="mt-4">
                <div
                  className={`flex items-center text-sm ${
                    stat.changeType === "positive"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {stat.changeType === "positive" ? (
                    <TrendingUp className="mr-1 h-4 w-4" />
                  ) : (
                    <TrendingDown className="mr-1 h-4 w-4" />
                  )}
                  {stat.change}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-lg bg-white p-6 shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Recent Orders
            </h3>
            <div className="space-y-4">
              {statsData.recentOrders.length > 0 ? (
                statsData.recentOrders.map((order: any) => (
                  <div
                    key={order._id}
                    className="flex items-center justify-between"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Order #{order._id.slice(-6)}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        ₹{order.total}
                      </p>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          order.status === "delivered"
                            ? "bg-green-100 text-green-800"
                            : order.status === "shipped"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No recent orders</p>
              )}
            </div>
          </div>

          {/* Top Products - Placeholder/Future Implementation */}
          <div className="rounded-lg bg-white p-6 shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Top Products
            </h3>
            <div className="space-y-4">
              <p className="text-gray-500">Coming soon...</p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

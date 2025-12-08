// src/app/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminLayout from "./components/AdminLayout";
import {
  Users,
  Package,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  TrendingDown,
  ArrowRight,
} from "lucide-react";
import { dashboardApi } from "./api/dashboard";
import { Order } from "./types";
import RevenueChart from "./components/dashboard/RevenueChart";
import OrdersChart from "./components/dashboard/OrdersChart";

export default function Dashboard() {
  const router = useRouter();
  const [statsData, setStatsData] = useState({
    totalOrders: 0,
    totalProducts: 0,
    totalUsers: 0,
    totalRevenue: 0,
    recentOrders: [] as Order[],
  });

  const handleDownloadReport = () => {
    if (!statsData.recentOrders || statsData.recentOrders.length === 0) {
      alert("No data to download");
      return;
    }

    const headers = ["Order ID", "Date", "Status", "Total"];
    const rows = statsData.recentOrders.map((order: Order) => [
      order._id,
      new Date(order.createdAt).toLocaleDateString(),
      order.status,
      order.total,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "recent_orders_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleAddProduct = () => {
    router.push("/products?action=add");
  };

  const handleViewOrders = () => {
    router.push("/orders");
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await dashboardApi.getStats();
        setStatsData(response.data);
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
      color: "bg-blue-500",
    },
    {
      name: "Total Orders",
      value: statsData.totalOrders,
      icon: ShoppingCart,
      change: "+8%",
      changeType: "positive",
      color: "bg-[#BC5633]",
    },
    {
      name: "Total Users",
      value: statsData.totalUsers,
      icon: Users,
      change: "+23%",
      changeType: "positive",
      color: "bg-emerald-500",
    },
    {
      name: "Revenue",
      value: `₹${statsData.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      change: "-4%",
      changeType: "negative",
      color: "bg-amber-500",
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8 animate-fade-in">
        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <RevenueChart />
          </div>
          <div>
            <OrdersChart />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-serif font-medium text-[#1A2118]">
              Dashboard
            </h1>
            <p className="text-[#596157] mt-1">
              Overview of your store&apos;s performance.
            </p>
          </div>
          <div className="flex gap-3">
             <button 
               onClick={handleDownloadReport}
               className="px-4 py-2 bg-white/60 backdrop-blur-sm border border-white/50 rounded-lg text-sm font-bold text-[#1A2118] hover:bg-white transition-all shadow-sm"
             >
               Download Report
             </button>
             <button 
               onClick={handleAddProduct}
               className="px-4 py-2 bg-[#1A2118] text-white rounded-lg text-sm font-bold hover:bg-[#BC5633] transition-all shadow-lg shadow-[#1A2118]/20"
             >
               Add Product
             </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, idx) => (
            <div
              key={stat.name}
              className="group relative overflow-hidden rounded-[1.5rem] bg-white/60 backdrop-blur-md border border-white/50 p-6 shadow-sm hover:shadow-lg transition-all duration-300"
              style={{ animationDelay: `${idx * 100}ms` }}
            >

              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div className={`p-3.5 rounded-full ${stat.color}/10 text-[#1A2118] group-hover:scale-110 transition-transform duration-300`}>
                    <stat.icon className="h-6 w-6" strokeWidth={1.5} />
                  </div>
                  <div
                    className={`flex items-center text-xs font-bold px-2 py-1 rounded-full ${
                      stat.changeType === "positive"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {stat.changeType === "positive" ? (
                      <TrendingUp className="mr-1 h-3 w-3" />
                    ) : (
                      <TrendingDown className="mr-1 h-3 w-3" />
                    )}
                    {stat.change}
                  </div>
                </div>
                
                <div>
                  <p className="text-[11px] font-bold text-[#1A2118]/50 uppercase tracking-[0.15em] mb-2">
                    {stat.name}
                  </p>
                  <h3 className="text-3xl font-serif font-medium text-[#1A2118] tracking-tight">
                    {stat.value}
                  </h3>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 rounded-[2rem] bg-white/60 backdrop-blur-md border border-white/50 p-6 sm:p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-serif font-bold text-[#1A2118]">
                Recent Orders
              </h3>
              <button 
                onClick={handleViewOrders}
                className="text-sm font-bold text-[#BC5633] hover:text-[#1A2118] flex items-center gap-1 transition-colors"
              >
                View All <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b border-[#1A2118]/5">
                    <th className="pb-4 text-xs font-bold text-[#1A2118]/40 uppercase tracking-widest">Order ID</th>
                    <th className="pb-4 text-xs font-bold text-[#1A2118]/40 uppercase tracking-widest">Date</th>
                    <th className="pb-4 text-xs font-bold text-[#1A2118]/40 uppercase tracking-widest">Customer</th>
                    <th className="pb-4 text-xs font-bold text-[#1A2118]/40 uppercase tracking-widest">Status</th>
                    <th className="pb-4 text-xs font-bold text-[#1A2118]/40 uppercase tracking-widest text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1A2118]/5">
                  {statsData.recentOrders.length > 0 ? (
                    statsData.recentOrders.map((order: Order) => (
                      <tr key={order._id} className="group hover:bg-white/50 transition-colors">
                        <td className="py-4 text-sm font-bold text-[#1A2118]">
                          #{order._id.slice(-6)}
                        </td>
                        <td className="py-4 text-sm text-[#596157]">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                         <td className="py-4 text-sm text-[#1A2118]">
                          {/* Placeholder for customer name if not available in stats */}
                          Customer
                        </td>
                        <td className="py-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide ${
                              order.status === "delivered"
                                ? "bg-green-100 text-green-800"
                                : order.status === "shipped"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="py-4 text-sm font-bold text-[#1A2118] text-right">
                          ₹{order.total}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-[#596157]">
                        No recent orders found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Top Products / Quick Actions */}
          <div className="space-y-6">
             <div className="rounded-[2rem] bg-[#14281D] text-[#F2F0EA] p-8 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                   <Package className="w-32 h-32" />
                </div>
                <div className="relative z-10">
                   <h3 className="text-xl font-serif font-bold mb-2">Quick Actions</h3>
                   <p className="text-[#F2F0EA]/60 text-sm mb-6">Manage your store efficiently.</p>
                   
                   <div className="space-y-3">
                      <button 
                         onClick={handleAddProduct}
                         className="w-full py-3 bg-[#BC5633] hover:bg-[#A04628] rounded-xl text-sm font-bold transition-colors shadow-lg shadow-[#BC5633]/20"
                      >
                         Add New Product
                      </button>
                      <button 
                         onClick={handleViewOrders}
                         className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-bold transition-colors"
                      >
                         View All Orders
                      </button>
                   </div>
                </div>
             </div>
             
             <div className="rounded-[2rem] bg-white/60 backdrop-blur-md border border-white/50 p-6 shadow-sm">
                <h3 className="text-lg font-serif font-bold text-[#1A2118] mb-4">Top Products</h3>
                <div className="space-y-4">
                   {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/50 transition-colors cursor-pointer">
                         <div className="w-12 h-12 bg-[#F2F0EA] rounded-lg"></div>
                         <div>
                            <p className="text-sm font-bold text-[#1A2118]">Product Name {i}</p>
                            <p className="text-xs text-[#596157]">24 sales this week</p>
                         </div>
                         <div className="ml-auto text-sm font-bold text-[#1A2118]">₹1,200</div>
                      </div>
                   ))}
                </div>
             </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

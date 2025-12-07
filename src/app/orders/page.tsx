"use client";

import { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { fetchOrders } from "../redux/features/orders/ordersSlice";
import AdminLayout from "../components/AdminLayout";
import { Search, Eye, Edit, ShoppingBag, Loader2 } from "lucide-react";

export default function OrdersPage() {
  const { orders, loading } = useAppSelector((state) => state.orders);
  const dispatch = useAppDispatch();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  const filteredOrders = orders.filter(
    (order) =>
      order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.userName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-8 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-serif font-medium text-[#1A2118]">Orders</h1>
            <p className="text-[#596157] mt-1">Manage and track customer orders</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative max-w-md group">
          <div className="absolute inset-0 bg-white/40 backdrop-blur-xl rounded-xl shadow-sm border border-white/50 transition-all group-focus-within:border-[#BC5633]/30 group-focus-within:shadow-md" />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#1A2118]/40 w-4 h-4 group-focus-within:text-[#BC5633] transition-colors z-10" />
          <input
            type="text"
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="relative z-10 w-full bg-transparent border-none rounded-xl py-3 pl-10 pr-4 text-sm font-medium text-[#1A2118] placeholder-[#1A2118]/40 focus:ring-0 transition-all outline-none"
          />
        </div>

        {/* Orders Table */}
        <div className="rounded-[2rem] bg-white/60 backdrop-blur-md border border-white/50 shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-[#596157] flex flex-col items-center gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-[#BC5633]" />
              <p>Loading orders...</p>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-[#1A2118]/5 bg-white/30">
                      <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-widest text-[#1A2118]/40">
                        Order ID
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-widest text-[#1A2118]/40">
                        Customer
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-widest text-[#1A2118]/40">
                        Total
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-widest text-[#1A2118]/40">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-widest text-[#1A2118]/40">
                        Date
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-widest text-[#1A2118]/40">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1A2118]/5">
                    {filteredOrders.map((order) => (
                      <tr key={order._id} className="group hover:bg-white/50 transition-colors">
                        <td className="px-6 py-4 text-sm font-bold text-[#1A2118]">
                          #{order._id.slice(-6)}
                        </td>
                        <td className="px-6 py-4 text-sm text-[#596157]">
                          <div className="flex items-center gap-2">
                             <div className="w-6 h-6 rounded-full bg-[#1A2118]/5 flex items-center justify-center text-xs font-bold text-[#1A2118]">
                                {(order.userName || "U").charAt(0)}
                             </div>
                             {order.userName || "Unknown User"}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm font-bold text-[#1A2118]">
                          ₹{order.total}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                              order.status === "delivered"
                                ? "bg-green-100 text-green-800"
                                : order.status === "shipped"
                                ? "bg-blue-100 text-blue-800"
                                : order.status === "processing"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td
                          className="px-6 py-4 text-sm text-[#596157]"
                          suppressHydrationWarning
                        >
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-right text-sm font-medium">
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="p-2 text-[#1A2118]/60 hover:text-[#BC5633] hover:bg-[#BC5633]/10 rounded-full transition-colors">
                              <Eye className="h-4 w-4" />
                            </button>
                            <button className="p-2 text-[#1A2118]/60 hover:text-[#1A2118] hover:bg-[#1A2118]/5 rounded-full transition-colors">
                              <Edit className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden space-y-4 p-4">
                {filteredOrders.map((order) => (
                  <div
                    key={order._id}
                    className="rounded-xl bg-white/50 border border-[#1A2118]/5 p-4 shadow-sm"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-bold text-[#1A2118]">
                        #{order._id.slice(-6)}
                      </h3>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                          order.status === "delivered"
                            ? "bg-green-100 text-green-800"
                            : order.status === "shipped"
                            ? "bg-blue-100 text-blue-800"
                            : order.status === "processing"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                    <div className="space-y-2 text-sm text-[#596157]">
                      <div className="flex justify-between">
                         <span>Customer</span>
                         <span className="font-medium text-[#1A2118]">{order.userName || "Unknown User"}</span>
                      </div>
                      <div className="flex justify-between">
                         <span>Date</span>
                         <span suppressHydrationWarning>{new Date(order.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between pt-2 border-t border-[#1A2118]/5">
                         <span className="font-bold text-[#1A2118]">Total</span>
                         <span className="font-bold text-[#1A2118]">₹{order.total}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
        
        {filteredOrders.length === 0 && !loading && (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#F2F0EA] mb-4">
               <ShoppingBag className="w-8 h-8 text-[#1A2118]/20" />
            </div>
            <p className="text-[#596157] font-medium">No orders found.</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

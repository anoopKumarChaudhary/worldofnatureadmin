"use client";

import { useAppSelector } from "./redux/hooks";
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
  const { products } = useAppSelector((state) => state.products);
  const { orders } = useAppSelector((state) => state.orders);
  const { users } = useAppSelector((state) => state.users);

  const stats = [
    {
      name: "Total Products",
      value: products.length,
      icon: Package,
      change: "+12%",
      changeType: "positive",
    },
    {
      name: "Total Orders",
      value: orders.length,
      icon: ShoppingCart,
      change: "+8%",
      changeType: "positive",
    },
    {
      name: "Total Users",
      value: users.length,
      icon: Users,
      change: "+23%",
      changeType: "positive",
    },
    {
      name: "Revenue",
      value: "₹45,231",
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
            Welcome back! Here's what's happening with your store.
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
              {orders.slice(0, 5).map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Order #{order.id}
                    </p>
                    <p className="text-sm text-gray-500">{order.userName}</p>
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
              ))}
            </div>
          </div>

          <div className="rounded-lg bg-white p-6 shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Top Products
            </h3>
            <div className="space-y-4">
              {products.slice(0, 5).map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center">
                    <img
                      src={product.imageUrl}
                      alt={product.title}
                      className="h-10 w-10 rounded-lg object-cover"
                    />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">
                        {product.title}
                      </p>
                      <p className="text-sm text-gray-500">
                        {product.category}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm font-medium text-gray-900">
                    {product.price}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

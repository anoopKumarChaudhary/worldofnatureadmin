"use client";

import { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { fetchUsers } from "../redux/features/users/usersSlice";
import AdminLayout from "../components/AdminLayout";
import { Search, Eye, Edit, Users as UsersIcon, Loader2 } from "lucide-react";

export default function UsersPage() {
  const { users, loading } = useAppSelector((state) => state.users);
  const dispatch = useAppDispatch();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const filteredUsers = users.filter(
    (user) =>
      user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-8 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-serif font-medium text-[#1A2118]">Users</h1>
            <p className="text-[#596157] mt-1">Manage registered users and roles</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative max-w-md group">
          <div className="absolute inset-0 bg-white/40 backdrop-blur-xl rounded-xl shadow-sm border border-white/50 transition-all group-focus-within:border-[#BC5633]/30 group-focus-within:shadow-md" />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#1A2118]/40 w-4 h-4 group-focus-within:text-[#BC5633] transition-colors z-10" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="relative z-10 w-full bg-transparent border-none rounded-xl py-3 pl-10 pr-4 text-sm font-medium text-[#1A2118] placeholder-[#1A2118]/40 focus:ring-0 transition-all outline-none"
          />
        </div>

        {/* Users Table */}
        <div className="rounded-[2rem] bg-white/60 backdrop-blur-md border border-white/50 shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-[#596157] flex flex-col items-center gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-[#BC5633]" />
              <p>Loading users...</p>
            </div>
          ) : (
            <>
              <div className="hidden md:block overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-[#1A2118]/5 bg-white/30">
                      <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-widest text-[#1A2118]/40">
                        Name
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-widest text-[#1A2118]/40">
                        Email
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-widest text-[#1A2118]/40">
                        Role
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-widest text-[#1A2118]/40">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-widest text-[#1A2118]/40">
                        Joined
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-widest text-[#1A2118]/40">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1A2118]/5">
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="group hover:bg-white/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                             <div className="w-8 h-8 rounded-full bg-[#BC5633]/10 flex items-center justify-center text-xs font-bold text-[#BC5633]">
                                {user.firstName?.charAt(0) || user.email.charAt(0)}
                             </div>
                             <span className="text-sm font-bold text-[#1A2118]">
                               {user.firstName} {user.lastName}
                             </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-[#596157]">
                          {user.email}
                        </td>
                        <td className="px-6 py-4 text-sm text-[#1A2118]">
                          <span className="px-2 py-1 bg-[#F2F0EA] rounded-md text-xs font-medium">
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                              user.isActive
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {user.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td
                          className="px-6 py-4 text-sm text-[#596157]"
                          suppressHydrationWarning
                        >
                          {new Date(user.createdAt).toLocaleDateString()}
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
                {filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    className="rounded-xl bg-white/50 border border-[#1A2118]/5 p-4 shadow-sm"
                  >
                    <div className="flex items-center justify-between mb-3">
                       <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#BC5633]/10 flex items-center justify-center text-xs font-bold text-[#BC5633]">
                             {user.firstName?.charAt(0) || user.email.charAt(0)}
                          </div>
                          <div>
                             <h3 className="text-sm font-bold text-[#1A2118]">{user.firstName} {user.lastName}</h3>
                             <p className="text-xs text-[#596157]">{user.email}</p>
                          </div>
                       </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-3 border-t border-[#1A2118]/5">
                       <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                          user.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {user.isActive ? "Active" : "Inactive"}
                      </span>
                      <span className="text-xs text-[#596157]">{user.role}</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
        
        {filteredUsers.length === 0 && !loading && (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#F2F0EA] mb-4">
               <UsersIcon className="w-8 h-8 text-[#1A2118]/20" />
            </div>
            <p className="text-[#596157] font-medium">No users found.</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

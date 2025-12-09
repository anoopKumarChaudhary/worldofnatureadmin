"use client";

import { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { fetchUsers, updateUser } from "../redux/features/users/usersSlice";
import AdminLayout from "../components/AdminLayout";
import Modal from "../components/Modal";
import { Search, Eye, Edit, Users as UsersIcon, Loader2, Save, X } from "lucide-react";
import { formatDate, getSmartDate } from "../../utils/date";

export default function UsersPage() {
  const { users, loading } = useAppSelector((state) => state.users);
  const dispatch = useAppDispatch();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({ role: "", isActive: false });
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const filteredUsers = users.filter(
    (user) =>
      user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewUser = (user: any) => {
    setSelectedUser(user);
    setIsViewModalOpen(true);
  };

  const handleEditUser = (user: any) => {
    setSelectedUser(user);
    setEditFormData({ role: user.role || "user", isActive: !!user.isActive });
    setIsEditModalOpen(true);
  };

  const handleSaveUser = async () => {
    if (!selectedUser) return;
    setIsUpdating(true);
    try {
      await dispatch(
        updateUser({
          id: selectedUser._id,
          data: { role: editFormData.role as "user" | "admin", isActive: editFormData.isActive },
        })
      ).unwrap();
      setIsEditModalOpen(false);
      // Optionally show success toast here
    } catch (error) {
      console.error("Failed to update user:", error);
      alert("Failed to update user");
    } finally {
      setIsUpdating(false);
    }
  };

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
                      <tr key={user._id} className="group hover:bg-white/50 transition-colors">
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
                          {formatDate(getSmartDate(user))}
                        </td>
                        <td className="px-6 py-4 text-right text-sm font-medium">
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={() => handleViewUser(user)}
                              className="p-2 text-[#1A2118]/60 hover:text-[#BC5633] hover:bg-[#BC5633]/10 rounded-full transition-colors"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={() => handleEditUser(user)}
                              className="p-2 text-[#1A2118]/60 hover:text-[#1A2118] hover:bg-[#1A2118]/5 rounded-full transition-colors"
                            >
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
                    key={user._id}
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

      {/* View User Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="User Details"
      >
        {selectedUser && (
          <div className="space-y-6">
            <div className="flex items-center gap-4 pb-6 border-b border-[#1A2118]/10">
              <div className="w-16 h-16 rounded-full bg-[#BC5633]/10 flex items-center justify-center text-xl font-bold text-[#BC5633]">
                {selectedUser.firstName?.charAt(0) || selectedUser.email.charAt(0)}
              </div>
              <div>
                <h3 className="text-xl font-serif font-bold text-[#1A2118]">
                  {selectedUser.firstName} {selectedUser.lastName}
                </h3>
                <p className="text-[#596157]">{selectedUser.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#1A2118]/60 mb-1">Role</p>
                <span className="px-2 py-1 bg-[#F2F0EA] rounded-md text-sm font-medium text-[#1A2118]">
                  {selectedUser.role}
                </span>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#1A2118]/60 mb-1">Status</p>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide ${
                    selectedUser.isActive
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {selectedUser.isActive ? "Active" : "Inactive"}
                </span>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#1A2118]/60 mb-1">Joined Date</p>
                <p className="text-sm text-[#1A2118]" suppressHydrationWarning>
                  {formatDate(getSmartDate(selectedUser))}
                </p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#1A2118]/60 mb-1">User ID</p>
                <p className="text-sm text-[#1A2118] font-mono">{selectedUser._id}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Edit User Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit User"
      >
        {selectedUser && (
          <div className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#1A2118]/60 mb-2">
                  Role
                </label>
                <select
                  value={editFormData.role}
                  onChange={(e) => setEditFormData({ ...editFormData, role: e.target.value })}
                  className="w-full px-4 py-3 bg-[#F2F0EA] border-none rounded-xl text-[#1A2118] focus:ring-2 focus:ring-[#BC5633] transition-all"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#1A2118]/60 mb-2">
                  Status
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      checked={editFormData.isActive}
                      onChange={() => setEditFormData({ ...editFormData, isActive: true })}
                      className="text-[#BC5633] focus:ring-[#BC5633]"
                    />
                    <span className="text-sm font-medium text-[#1A2118]">Active</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      checked={!editFormData.isActive}
                      onChange={() => setEditFormData({ ...editFormData, isActive: false })}
                      className="text-[#BC5633] focus:ring-[#BC5633]"
                    />
                    <span className="text-sm font-medium text-[#1A2118]">Inactive</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-[#1A2118]/10">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 text-sm font-bold text-[#596157] hover:text-[#1A2118] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveUser}
                disabled={isUpdating}
                className="px-6 py-2 bg-[#1A2118] text-white rounded-xl text-sm font-bold hover:bg-[#BC5633] transition-colors shadow-lg shadow-[#1A2118]/20 flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isUpdating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </AdminLayout>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import AdminLayout from "../components/AdminLayout";
import { Save, User, Bell, Shield, Palette } from "lucide-react";

export default function SettingsPage() {
  const { data: session, update } = useSession();
  const [settings, setSettings] = useState({
    storeName: "World of Nature",
    email: "",
    notifications: {
      email: true,
      push: false,
      sms: false,
    },
    theme: "light",
    language: "en",
  });

  useEffect(() => {
    if (session?.user?.email) {
      const userEmail = session.user.email;
      setSettings(prev => ({ ...prev, email: userEmail }));
    }
  }, [session]);

  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess(false);

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return;
    }

    setIsChangingPassword(true);

    try {
      // Get the token from NextAuth session (you might need to use useSession hook)
      const res = await fetch("/api/auth/session");
      const session = await res.json();
      
      if (!session?.user?.accessToken) {
        throw new Error("Not authenticated");
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session.user.accessToken}`,
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to change password");
      }

      setPasswordSuccess(true);
      setTimeout(() => {
        setIsPasswordModalOpen(false);
        setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
        setPasswordSuccess(false);
      }, 2000);
    } catch (err: any) {
      setPasswordError(err.message || "An error occurred");
    } finally {
      setIsChangingPassword(false);
    }
  };

  const [isConfirmPasswordModalOpen, setIsConfirmPasswordModalOpen] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState({ type: "", text: "" });

  const handleSave = async () => {
    // Check if email has changed
    if (session?.user?.email && settings.email !== session.user.email) {
      setIsConfirmPasswordModalOpen(true);
      return;
    }
    
    await executeSave();
  };

  const executeSave = async (password?: string) => {
    setIsSaving(true);
    setSaveMessage({ type: "", text: "" });
    setConfirmPasswordError("");

    try {
      const res = await fetch("/api/auth/session");
      const sessionData = await res.json();
      
      if (!sessionData?.user?.accessToken) {
        throw new Error("Not authenticated");
      }

      const body: any = {
        email: settings.email,
        // Add other fields here if needed
      };

      if (password) {
        body.password = password;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/update-profile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${sessionData.user.accessToken}`,
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update profile");
      }

      await update({ email: settings.email });
      setSaveMessage({ type: "success", text: "Settings saved successfully!" });
      setIsConfirmPasswordModalOpen(false);
      setConfirmPassword("");
      
      // Clear success message after 3 seconds
      setTimeout(() => setSaveMessage({ type: "", text: "" }), 3000);

    } catch (err: any) {
      if (password) {
         setConfirmPasswordError(err.message || "An error occurred");
      } else {
         setSaveMessage({ type: "error", text: err.message || "An error occurred" });
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8 animate-fade-in pb-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-serif font-medium text-[#1A2118]">Settings</h1>
            <p className="text-[#596157] mt-1">Manage your store preferences</p>
          </div>
          <div className="flex items-center gap-4">
            {saveMessage.text && (
              <div className={`text-sm font-bold px-4 py-2 rounded-lg ${
                saveMessage.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
              }`}>
                {saveMessage.text}
              </div>
            )}
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 rounded-xl bg-[#1A2118] px-5 py-2.5 text-white hover:bg-[#BC5633] transition-all shadow-lg shadow-[#1A2118]/20 font-bold text-sm disabled:opacity-50"
            >
              {isSaving ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Store Information */}
          <div className="rounded-[2rem] bg-white/60 backdrop-blur-md border border-white/50 p-8 shadow-sm">
            <div className="flex items-center mb-6">
              <div className="p-2 bg-[#BC5633]/10 rounded-lg mr-3">
                 <User className="h-5 w-5 text-[#BC5633]" />
              </div>
              <h3 className="text-lg font-serif font-bold text-[#1A2118]">
                Store Information
              </h3>
            </div>
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#1A2118]/60 mb-1.5">
                  Store Name
                </label>
                <input
                  type="text"
                  value={settings.storeName}
                  onChange={(e) =>
                    setSettings({ ...settings, storeName: e.target.value })
                  }
                  className="block w-full rounded-xl border-[#1A2118]/10 bg-white/50 focus:border-[#BC5633] focus:ring-[#BC5633] transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#1A2118]/60 mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  value={settings.email}
                  onChange={(e) =>
                    setSettings({ ...settings, email: e.target.value })
                  }
                  className="block w-full rounded-xl border-[#1A2118]/10 bg-white/50 focus:border-[#BC5633] focus:ring-[#BC5633] transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="rounded-[2rem] bg-white/60 backdrop-blur-md border border-white/50 p-8 shadow-sm">
            <div className="flex items-center mb-6">
              <div className="p-2 bg-[#5A7D6B]/10 rounded-lg mr-3">
                 <Bell className="h-5 w-5 text-[#5A7D6B]" />
              </div>
              <h3 className="text-lg font-serif font-bold text-[#1A2118]">
                Notifications
              </h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-white/40 rounded-xl border border-[#1A2118]/5">
                <label className="text-sm font-bold text-[#1A2118]">
                  Email notifications
                </label>
                <input
                  type="checkbox"
                  checked={settings.notifications.email}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      notifications: {
                        ...settings.notifications,
                        email: e.target.checked,
                      },
                    })
                  }
                  className="h-5 w-5 text-[#BC5633] focus:ring-[#BC5633] border-gray-300 rounded"
                />
              </div>
              <div className="flex items-center justify-between p-3 bg-white/40 rounded-xl border border-[#1A2118]/5">
                <label className="text-sm font-bold text-[#1A2118]">
                  Push notifications
                </label>
                <input
                  type="checkbox"
                  checked={settings.notifications.push}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      notifications: {
                        ...settings.notifications,
                        push: e.target.checked,
                      },
                    })
                  }
                  className="h-5 w-5 text-[#BC5633] focus:ring-[#BC5633] border-gray-300 rounded"
                />
              </div>
              <div className="flex items-center justify-between p-3 bg-white/40 rounded-xl border border-[#1A2118]/5">
                <label className="text-sm font-bold text-[#1A2118]">
                  SMS notifications
                </label>
                <input
                  type="checkbox"
                  checked={settings.notifications.sms}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      notifications: {
                        ...settings.notifications,
                        sms: e.target.checked,
                      },
                    })
                  }
                  className="h-5 w-5 text-[#BC5633] focus:ring-[#BC5633] border-gray-300 rounded"
                />
              </div>
            </div>
          </div>

          {/* Appearance */}
          <div className="rounded-[2rem] bg-white/60 backdrop-blur-md border border-white/50 p-8 shadow-sm">
            <div className="flex items-center mb-6">
              <div className="p-2 bg-[#E0C075]/10 rounded-lg mr-3">
                 <Palette className="h-5 w-5 text-[#E0C075]" />
              </div>
              <h3 className="text-lg font-serif font-bold text-[#1A2118]">Appearance</h3>
            </div>
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#1A2118]/60 mb-1.5">
                  Theme
                </label>
                <select
                  value={settings.theme}
                  onChange={(e) =>
                    setSettings({ ...settings, theme: e.target.value })
                  }
                  className="block w-full rounded-xl border-[#1A2118]/10 bg-white/50 focus:border-[#BC5633] focus:ring-[#BC5633] transition-colors"
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="auto">Auto</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#1A2118]/60 mb-1.5">
                  Language
                </label>
                <select
                  value={settings.language}
                  onChange={(e) =>
                    setSettings({ ...settings, language: e.target.value })
                  }
                  className="block w-full rounded-xl border-[#1A2118]/10 bg-white/50 focus:border-[#BC5633] focus:ring-[#BC5633] transition-colors"
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                </select>
              </div>
            </div>
          </div>

          {/* Security */}
          <div className="rounded-[2rem] bg-white/60 backdrop-blur-md border border-white/50 p-8 shadow-sm">
            <div className="flex items-center mb-6">
              <div className="p-2 bg-[#1A2118]/10 rounded-lg mr-3">
                 <Shield className="h-5 w-5 text-[#1A2118]" />
              </div>
              <h3 className="text-lg font-serif font-bold text-[#1A2118]">Security</h3>
            </div>
            <div className="space-y-4">
              <button 
                onClick={() => setIsPasswordModalOpen(true)}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-[#1A2118] hover:bg-[#BC5633] transition-colors"
              >
                Change Password
              </button>
              <button className="w-full flex justify-center py-3 px-4 border border-[#1A2118]/10 rounded-xl shadow-sm text-sm font-bold text-[#1A2118] bg-white hover:bg-[#F2F0EA] transition-colors">
                Enable Two-Factor Authentication
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <h3 className="text-xl font-bold text-[#1A2118] mb-6">Change Password</h3>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#1A2118]/60 mb-1.5">
                  Current Password
                </label>
                <input
                  type="password"
                  required
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                  className="block w-full rounded-xl border-[#1A2118]/10 bg-gray-50 focus:border-[#BC5633] focus:ring-[#BC5633] transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#1A2118]/60 mb-1.5">
                  New Password
                </label>
                <input
                  type="password"
                  required
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                  className="block w-full rounded-xl border-[#1A2118]/10 bg-gray-50 focus:border-[#BC5633] focus:ring-[#BC5633] transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#1A2118]/60 mb-1.5">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  required
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                  className="block w-full rounded-xl border-[#1A2118]/10 bg-gray-50 focus:border-[#BC5633] focus:ring-[#BC5633] transition-colors"
                />
              </div>

              {passwordError && (
                <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">
                  {passwordError}
                </div>
              )}

              {passwordSuccess && (
                <div className="text-green-600 text-sm bg-green-50 p-3 rounded-lg">
                  Password changed successfully!
                </div>
              )}

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setIsPasswordModalOpen(false);
                    setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
                    setPasswordError("");
                    setPasswordSuccess(false);
                  }}
                  className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isChangingPassword}
                  className="flex-1 py-2.5 bg-[#BC5633] text-white rounded-xl text-sm font-bold hover:bg-[#A04628] transition-colors disabled:opacity-50"
                >
                  {isChangingPassword ? "Updating..." : "Update Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Confirm Password Modal for Email Change */}
      {isConfirmPasswordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <h3 className="text-xl font-bold text-[#1A2118] mb-4">Confirm Password</h3>
            <p className="text-[#596157] mb-6 text-sm">
              You are changing your email address. For security reasons, please enter your current password to confirm this change.
            </p>
            <form onSubmit={(e) => { e.preventDefault(); executeSave(confirmPassword); }} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#1A2118]/60 mb-1.5">
                  Current Password
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="block w-full rounded-xl border-[#1A2118]/10 bg-gray-50 focus:border-[#BC5633] focus:ring-[#BC5633] transition-colors"
                />
              </div>

              {confirmPasswordError && (
                <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">
                  {confirmPasswordError}
                </div>
              )}

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setIsConfirmPasswordModalOpen(false);
                    setConfirmPassword("");
                    setConfirmPasswordError("");
                  }}
                  className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 py-2.5 bg-[#BC5633] text-white rounded-xl text-sm font-bold hover:bg-[#A04628] transition-colors disabled:opacity-50"
                >
                  {isSaving ? "Verifying..." : "Confirm & Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

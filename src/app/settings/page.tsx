"use client";

import { useState } from "react";
import AdminLayout from "../components/AdminLayout";
import { Save, User, Bell, Shield, Palette } from "lucide-react";

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    storeName: "World of Nature",
    email: "admin@worldofnature.com",
    notifications: {
      email: true,
      push: false,
      sms: false,
    },
    theme: "light",
    language: "en",
  });

  const handleSave = () => {
    // TODO: Implement save functionality
    alert("Settings saved!");
  };

  return (
    <AdminLayout>
      <div className="space-y-8 animate-fade-in pb-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-serif font-medium text-[#1A2118]">Settings</h1>
            <p className="text-[#596157] mt-1">Manage your store preferences</p>
          </div>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 rounded-xl bg-[#1A2118] px-5 py-2.5 text-white hover:bg-[#BC5633] transition-all shadow-lg shadow-[#1A2118]/20 font-bold text-sm"
          >
            <Save className="h-4 w-4" />
            Save Changes
          </button>
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
              <button className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-[#1A2118] hover:bg-[#BC5633] transition-colors">
                Change Password
              </button>
              <button className="w-full flex justify-center py-3 px-4 border border-[#1A2118]/10 rounded-xl shadow-sm text-sm font-bold text-[#1A2118] bg-white hover:bg-[#F2F0EA] transition-colors">
                Enable Two-Factor Authentication
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

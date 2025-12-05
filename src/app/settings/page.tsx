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
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600">
            Manage your store settings and preferences
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Store Information */}
          <div className="rounded-lg bg-white p-6 shadow">
            <div className="flex items-center mb-4">
              <User className="h-5 w-5 text-gray-400 mr-2" />
              <h3 className="text-lg font-medium text-gray-900">
                Store Information
              </h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Store Name
                </label>
                <input
                  type="text"
                  value={settings.storeName}
                  onChange={(e) =>
                    setSettings({ ...settings, storeName: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  value={settings.email}
                  onChange={(e) =>
                    setSettings({ ...settings, email: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="rounded-lg bg-white p-6 shadow">
            <div className="flex items-center mb-4">
              <Bell className="h-5 w-5 text-gray-400 mr-2" />
              <h3 className="text-lg font-medium text-gray-900">
                Notifications
              </h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center">
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
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-900">
                  Email notifications
                </label>
              </div>
              <div className="flex items-center">
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
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-900">
                  Push notifications
                </label>
              </div>
              <div className="flex items-center">
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
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-900">
                  SMS notifications
                </label>
              </div>
            </div>
          </div>

          {/* Appearance */}
          <div className="rounded-lg bg-white p-6 shadow">
            <div className="flex items-center mb-4">
              <Palette className="h-5 w-5 text-gray-400 mr-2" />
              <h3 className="text-lg font-medium text-gray-900">Appearance</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Theme
                </label>
                <select
                  value={settings.theme}
                  onChange={(e) =>
                    setSettings({ ...settings, theme: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="auto">Auto</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Language
                </label>
                <select
                  value={settings.language}
                  onChange={(e) =>
                    setSettings({ ...settings, language: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                </select>
              </div>
            </div>
          </div>

          {/* Security */}
          <div className="rounded-lg bg-white p-6 shadow">
            <div className="flex items-center mb-4">
              <Shield className="h-5 w-5 text-gray-400 mr-2" />
              <h3 className="text-lg font-medium text-gray-900">Security</h3>
            </div>
            <div className="space-y-4">
              <button className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                Change Password
              </button>
              <button className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                Enable Two-Factor Authentication
              </button>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            <Save className="h-4 w-4" />
            Save Changes
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}

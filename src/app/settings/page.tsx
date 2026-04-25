"use client";

import React from 'react';
import { Settings as SettingsIcon, Shield, Bell, User, Globe, HelpCircle } from 'lucide-react';
import Icon from '../components/ui/Icon';

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-tradeflow-dark text-white font-sans p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Settings</h1>
          <p className="text-slate-400">Manage your account preferences and application settings</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Account Settings */}
          <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Icon icon={User} className="text-blue-400" />
              <h2 className="text-xl font-semibold">Account Settings</h2>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Email Notifications</span>
                <button className="w-12 h-6 bg-blue-600 rounded-full relative transition-colors">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full transition-transform"></div>
                </button>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Two-Factor Authentication</span>
                <button className="px-3 py-1 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm transition-colors">
                  Enable
                </button>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Change Password</span>
                <button className="px-3 py-1 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm transition-colors">
                  Update
                </button>
              </div>
            </div>
          </div>

          {/* Privacy Settings */}
          <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Icon icon={Shield} className="text-green-400" />
              <h2 className="text-xl font-semibold">Privacy & Security</h2>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Profile Visibility</span>
                <select className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-1 text-sm">
                  <option>Public</option>
                  <option>Private</option>
                </select>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Data Sharing</span>
                <button className="w-12 h-6 bg-slate-600 rounded-full relative transition-colors">
                  <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform"></div>
                </button>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Clear Cache</span>
                <button className="px-3 py-1 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm transition-colors">
                  Clear
                </button>
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Icon icon={Bell} className="text-yellow-400" />
              <h2 className="text-xl font-semibold">Notifications</h2>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Push Notifications</span>
                <button className="w-12 h-6 bg-blue-600 rounded-full relative transition-colors">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full transition-transform"></div>
                </button>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Email Alerts</span>
                <button className="w-12 h-6 bg-blue-600 rounded-full relative transition-colors">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full transition-transform"></div>
                </button>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Transaction Alerts</span>
                <button className="w-12 h-6 bg-slate-600 rounded-full relative transition-colors">
                  <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform"></div>
                </button>
              </div>
            </div>
          </div>

          {/* Application Settings */}
          <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Icon icon={Globe} className="text-purple-400" />
              <h2 className="text-xl font-semibold">Application</h2>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Language</span>
                <select className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-1 text-sm">
                  <option>English</option>
                  <option>Spanish</option>
                  <option>French</option>
                </select>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Theme</span>
                <select className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-1 text-sm">
                  <option>Dark</option>
                  <option>Light</option>
                  <option>System</option>
                </select>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Currency</span>
                <select className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-1 text-sm">
                  <option>USD</option>
                  <option>EUR</option>
                  <option>GBP</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-8 bg-slate-800/50 rounded-xl border border-slate-700/50 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Icon icon={HelpCircle} className="text-cyan-400" />
            <h2 className="text-xl font-semibold">Help & Support</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="p-4 bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-colors">
              <h3 className="font-medium mb-1">Documentation</h3>
              <p className="text-sm text-slate-400">Browse our comprehensive guides</p>
            </button>
            <button className="p-4 bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-colors">
              <h3 className="font-medium mb-1">Contact Support</h3>
              <p className="text-sm text-slate-400">Get help from our team</p>
            </button>
            <button className="p-4 bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-colors">
              <h3 className="font-medium mb-1">FAQ</h3>
              <p className="text-sm text-slate-400">Find quick answers</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

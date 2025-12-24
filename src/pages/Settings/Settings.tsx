import React, { useState } from 'react';
import { FaKey, FaDatabase, FaCog, FaPlus, FaTrash, FaSync } from 'react-icons/fa';
import { systemSettings } from '../../utils/dummyData';

type SettingsTab = 'api' | 'backup' | 'preferences';

const Settings: React.FC = () => {
    const [activeTab, setActiveTab] = useState<SettingsTab>('api');
    const [preferences, setPreferences] = useState(systemSettings.systemPreferences);

    const togglePreference = (key: keyof typeof preferences) => {
        setPreferences(prev => ({
            ...prev,
            [key]: !prev[key],
        }));
    };

    return (
        <div className="p-6">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">System Settings</h1>
                <p className="text-gray-600 mt-1">Configure system-wide settings and preferences</p>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="border-b border-gray-200">
                    <div className="flex">
                        <button
                            onClick={() => setActiveTab('api')}
                            className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${activeTab === 'api'
                                ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50'
                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                }`}
                        >
                            <FaKey className="inline mr-2" />
                            API Keys
                        </button>
                        <button
                            onClick={() => setActiveTab('backup')}
                            className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${activeTab === 'backup'
                                ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50'
                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                }`}
                        >
                            <FaDatabase className="inline mr-2" />
                            Data Backup
                        </button>
                        <button
                            onClick={() => setActiveTab('preferences')}
                            className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${activeTab === 'preferences'
                                ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50'
                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                }`}
                        >
                            <FaCog className="inline mr-2" />
                            Preferences
                        </button>
                    </div>
                </div>

                <div className="p-6">
                    {/* API Keys */}
                    {activeTab === 'api' && (
                        <div>
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-semibold text-gray-900">API Keys Management</h2>
                                <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                                    <FaPlus />
                                    <span>Generate New Key</span>
                                </button>
                            </div>
                            <div className="space-y-4">
                                {systemSettings.apiKeys.map((apiKey) => (
                                    <div
                                        key={apiKey.id}
                                        className="bg-gray-50 rounded-lg border border-gray-200 p-6"
                                    >
                                        <div className="flex items-start justify-between mb-4">
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-900 mb-1">{apiKey.name}</h3>
                                                <p className="text-xs text-gray-500">Created: {apiKey.createdDate}</p>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${apiKey.status === 'Active'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-gray-100 text-gray-800'
                                                }`}>
                                                {apiKey.status}
                                            </span>
                                        </div>
                                        <div className="mb-4">
                                            <label className="block text-xs font-medium text-gray-600 mb-1">API Key</label>
                                            <div className="flex items-center gap-2">
                                                <code className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded text-sm font-mono">
                                                    {apiKey.key}
                                                </code>
                                                <button className="px-3 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors text-sm">
                                                    Copy
                                                </button>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4 mb-4">
                                            <div className="bg-white rounded p-3">
                                                <p className="text-xs text-gray-600">Last Used</p>
                                                <p className="text-sm font-medium text-gray-900">{apiKey.lastUsed}</p>
                                            </div>
                                            <div className="bg-white rounded p-3">
                                                <p className="text-xs text-gray-600">Requests Today</p>
                                                <p className="text-sm font-medium text-gray-900">{apiKey.requestsToday.toLocaleString()}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button className="flex-1 px-3 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors text-sm font-medium">
                                                <FaSync className="inline mr-1" /> Regenerate
                                            </button>
                                            <button className="flex-1 px-3 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors text-sm font-medium">
                                                <FaTrash className="inline mr-1" /> Revoke
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Data Backup */}
                    {activeTab === 'backup' && (
                        <div className="max-w-3xl">
                            <h2 className="text-xl font-semibold text-gray-900 mb-6">Data Backup Configuration</h2>

                            {/* Backup Status */}
                            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-200 p-6 mb-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold text-gray-900">Current Backup Status</h3>
                                    <span className="px-3 py-1 bg-green-600 text-white rounded-full text-xs font-medium">
                                        {systemSettings.backupSchedule.status}
                                    </span>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="bg-white rounded-lg p-3">
                                        <p className="text-xs text-gray-600">Last Backup</p>
                                        <p className="text-sm font-medium text-gray-900">{systemSettings.backupSchedule.lastBackup}</p>
                                    </div>
                                    <div className="bg-white rounded-lg p-3">
                                        <p className="text-xs text-gray-600">Next Backup</p>
                                        <p className="text-sm font-medium text-gray-900">{systemSettings.backupSchedule.nextBackup}</p>
                                    </div>
                                    <div className="bg-white rounded-lg p-3">
                                        <p className="text-xs text-gray-600">Frequency</p>
                                        <p className="text-sm font-medium text-gray-900">{systemSettings.backupSchedule.frequency}</p>
                                    </div>
                                    <div className="bg-white rounded-lg p-3">
                                        <p className="text-xs text-gray-600">Retention</p>
                                        <p className="text-sm font-medium text-gray-900">{systemSettings.backupSchedule.retentionDays} days</p>
                                    </div>
                                </div>
                            </div>

                            {/* Backup Configuration */}
                            <div className="bg-white rounded-lg border border-gray-200 p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Backup Settings</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Backup Frequency</label>
                                        <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500">
                                            <option>Daily</option>
                                            <option>Weekly</option>
                                            <option>Monthly</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Backup Time</label>
                                        <input
                                            type="time"
                                            defaultValue="02:00"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Retention Period (days)</label>
                                        <input
                                            type="number"
                                            defaultValue={30}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Storage Location</label>
                                        <input
                                            type="text"
                                            defaultValue={systemSettings.backupSchedule.location}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                            disabled
                                        />
                                    </div>
                                    <div className="flex gap-3 pt-4">
                                        <button className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                                            Save Configuration
                                        </button>
                                        <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                                            Backup Now
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* System Preferences */}
                    {activeTab === 'preferences' && (
                        <div className="max-w-2xl">
                            <h2 className="text-xl font-semibold text-gray-900 mb-6">System Preferences</h2>
                            <div className="space-y-4">
                                {Object.entries(preferences).map(([key, value]) => (
                                    <div
                                        key={key}
                                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                                    >
                                        <div>
                                            <p className="font-medium text-gray-900 capitalize">
                                                {key.replace(/([A-Z])/g, ' $1').trim()}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {key === 'maintenanceMode' && 'Enable maintenance mode to restrict access'}
                                                {key === 'debugMode' && 'Show detailed error messages for debugging'}
                                                {key === 'emailNotifications' && 'Send email notifications for important events'}
                                                {key === 'autoBackup' && 'Automatically backup data on schedule'}
                                                {key === 'sessionTimeout' && `User session timeout: ${value} minutes`}
                                                {key === 'maxLoginAttempts' && `Maximum failed login attempts: ${value}`}
                                            </p>
                                        </div>
                                        {typeof value === 'boolean' ? (
                                            <button
                                                onClick={() => togglePreference(key as keyof typeof preferences)}
                                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${value ? 'bg-indigo-600' : 'bg-gray-300'
                                                    }`}
                                            >
                                                <span
                                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${value ? 'translate-x-6' : 'translate-x-1'
                                                        }`}
                                                />
                                            </button>
                                        ) : (
                                            <input
                                                type="number"
                                                value={value}
                                                onChange={(e) =>
                                                    setPreferences(prev => ({
                                                        ...prev,
                                                        [key]: parseInt(e.target.value),
                                                    }))
                                                }
                                                className="w-20 px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                            />
                                        )}
                                    </div>
                                ))}
                                <button className="w-full px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                                    Save Preferences
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Settings;

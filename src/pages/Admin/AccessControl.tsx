import React, { useState } from 'react';
import { FaUserShield, FaCheckCircle, FaTimesCircle, FaKey } from 'react-icons/fa';
import { adminRoles, adminUsers } from '../../utils/dummyData';

const AccessControl: React.FC = () => {
    const [selectedRole, setSelectedRole] = useState(adminRoles[0]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="p-6">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Access Control</h1>
                <p className="text-gray-600 mt-1">Manage roles, permissions, and user access</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                {adminRoles.map((role) => (
                    <div key={role.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                        <div className="flex items-center justify-between mb-2">
                            <FaUserShield className="text-indigo-600 text-2xl" />
                            <span className="text-2xl font-bold text-indigo-600">{role.userCount}</span>
                        </div>
                        <p className="text-sm font-medium text-gray-900">{role.name}</p>
                        <p className="text-xs text-gray-500 mt-1">{role.description}</p>
                    </div>
                ))}
            </div>

            {/* Roles and Permissions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                {/* Roles List */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Roles</h2>
                    <div className="space-y-2">
                        {adminRoles.map((role) => (
                            <button
                                key={role.id}
                                onClick={() => setSelectedRole(role)}
                                className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${selectedRole.id === role.id
                                        ? 'bg-indigo-50 border-2 border-indigo-500'
                                        : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                                    }`}
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium text-gray-900">{role.name}</p>
                                        <p className="text-xs text-gray-500">{role.userCount} users</p>
                                    </div>
                                    <FaUserShield className="text-indigo-600" />
                                </div>
                            </button>
                        ))}
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="w-full mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                        Create New Role
                    </button>
                </div>

                {/* Permissions Matrix */}
                <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                        Permissions for {selectedRole.name}
                    </h2>
                    <p className="text-sm text-gray-600 mb-6">{selectedRole.description}</p>

                    <div className="space-y-3">
                        {['read', 'write', 'delete', 'manage_users', 'manage_roles', 'system_settings', 'export_data'].map((permission) => (
                            <div
                                key={permission}
                                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${selectedRole.permissions.includes(permission)
                                            ? 'bg-green-100'
                                            : 'bg-gray-200'
                                        }`}>
                                        {selectedRole.permissions.includes(permission) ? (
                                            <FaCheckCircle className="text-green-600" />
                                        ) : (
                                            <FaTimesCircle className="text-gray-400" />
                                        )}
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900 capitalize">
                                            {permission.replace('_', ' ')}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {permission === 'read' && 'View content and data'}
                                            {permission === 'write' && 'Create and edit content'}
                                            {permission === 'delete' && 'Remove content and data'}
                                            {permission === 'manage_users' && 'Add, edit, remove users'}
                                            {permission === 'manage_roles' && 'Create and modify roles'}
                                            {permission === 'system_settings' && 'Access system configuration'}
                                            {permission === 'export_data' && 'Export data to CSV/PDF'}
                                        </p>
                                    </div>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${selectedRole.permissions.includes(permission)
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-gray-200 text-gray-600'
                                    }`}>
                                    {selectedRole.permissions.includes(permission) ? 'Granted' : 'Denied'}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Admin Users */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-semibold text-gray-900">Admin Users</h2>
                    <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                        Add Admin User
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">User</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Role</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Last Login</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">2FA</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {adminUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div>
                                            <p className="font-medium text-gray-900">{user.name}</p>
                                            <p className="text-sm text-gray-500">{user.email}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs font-medium">
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{user.lastLogin}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            {user.twoFactorEnabled ? (
                                                <>
                                                    <FaKey className="text-green-600" />
                                                    <span className="text-sm text-green-600">Enabled</span>
                                                </>
                                            ) : (
                                                <>
                                                    <FaKey className="text-gray-400" />
                                                    <span className="text-sm text-gray-500">Disabled</span>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                                            {user.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
                                            Edit
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create Role Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Create New Role</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Role Name</label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                    placeholder="e.g., Content Manager"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                    placeholder="Brief description of the role..."
                                />
                            </div>
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                            >
                                Create
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AccessControl;

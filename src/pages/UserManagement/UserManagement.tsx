import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaPhone, FaCalendar, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { dummyUsers } from '../../utils/dummyData';
import { exportUserData } from '../../utils/exportUtils';
import FilterPanel from '../../components/FilterPanel';
import DataTable from '../../components/DataTable';
import ExportButton from '../../components/ExportButton';

const UserManagement: React.FC = () => {
    const navigate = useNavigate();
    const [filters, setFilters] = useState({
        search: '',
        status: '',
    });

    // Filter users based on search criteria
    const filteredUsers = useMemo(() => {
        return dummyUsers.filter(user => {
            const matchesSearch =
                user.name.toLowerCase().includes(filters.search.toLowerCase()) ||
                user.email.toLowerCase().includes(filters.search.toLowerCase()) ||
                user.id.toLowerCase().includes(filters.search.toLowerCase());

            const matchesStatus = !filters.status || user.status === filters.status;

            return matchesSearch && matchesStatus;
        });
    }, [filters]);

    const handleFilterChange = (name: string, value: string) => {
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleClearFilters = () => {
        setFilters({ search: '', status: '' });
    };

    const handleExport = (format: 'csv' | 'pdf') => {
        exportUserData(filteredUsers, format);
    };

    const filterConfigs = [
        {
            type: 'search' as const,
            name: 'search',
            label: 'Search',
            placeholder: 'Search by name, email, or ID...',
        },
        {
            type: 'select' as const,
            name: 'status',
            label: 'Status',
            options: [
                { label: 'Active', value: 'Active' },
                { label: 'Inactive', value: 'Inactive' },
            ],
        },
    ];

    const columns = [
        {
            key: 'id',
            label: 'User ID',
            sortable: true,
        },
        {
            key: 'name',
            label: 'Name',
            sortable: true,
            render: (value: string) => (
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                        <FaUser className="text-indigo-600 text-sm" />
                    </div>
                    <span className="font-medium">{value}</span>
                </div>
            ),
        },
        {
            key: 'email',
            label: 'Email',
            sortable: true,
            render: (value: string) => (
                <div className="flex items-center gap-2 text-gray-600">
                    <FaEnvelope className="text-gray-400" />
                    <span>{value}</span>
                </div>
            ),
        },
        {
            key: 'phone',
            label: 'Phone',
            sortable: false,
            render: (value: string) => (
                <div className="flex items-center gap-2 text-gray-600">
                    <FaPhone className="text-gray-400" />
                    <span>{value}</span>
                </div>
            ),
        },
        {
            key: 'registrationDate',
            label: 'Registration Date',
            sortable: true,
            render: (value: string) => (
                <div className="flex items-center gap-2 text-gray-600">
                    <FaCalendar className="text-gray-400" />
                    <span>{value}</span>
                </div>
            ),
        },
        {
            key: 'status',
            label: 'Status',
            sortable: true,
            render: (value: string) => (
                <span
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${value === 'Active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                >
                    {value === 'Active' ? (
                        <FaCheckCircle className="text-green-600" />
                    ) : (
                        <FaTimesCircle className="text-gray-600" />
                    )}
                    {value}
                </span>
            ),
        },
    ];

    return (
        <div className="p-6">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
                    <p className="text-gray-600 mt-1">View and manage all registered users</p>
                </div>
                <ExportButton onExport={handleExport} label="Export Users" />
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Total Users</p>
                            <p className="text-2xl font-bold text-gray-900">{dummyUsers.length}</p>
                        </div>
                        <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                            <FaUser className="text-indigo-600 text-xl" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Active Users</p>
                            <p className="text-2xl font-bold text-green-600">
                                {dummyUsers.filter(u => u.status === 'Active').length}
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                            <FaCheckCircle className="text-green-600 text-xl" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Inactive Users</p>
                            <p className="text-2xl font-bold text-gray-600">
                                {dummyUsers.filter(u => u.status === 'Inactive').length}
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                            <FaTimesCircle className="text-gray-600 text-xl" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Filtered Results</p>
                            <p className="text-2xl font-bold text-indigo-600">{filteredUsers.length}</p>
                        </div>
                        <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                            <FaUser className="text-indigo-600 text-xl" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <FilterPanel
                filters={filterConfigs}
                values={filters}
                onChange={handleFilterChange}
                onClear={handleClearFilters}
            />

            {/* Users Table */}
            <DataTable
                data={filteredUsers}
                columns={columns}
                pageSize={10}
                onRowClick={(user) => navigate(`/user-management/${user.id}`)}
            />
        </div>
    );
};

export default UserManagement;

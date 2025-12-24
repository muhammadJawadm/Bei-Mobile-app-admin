import React, { useState, useMemo } from 'react';
import { FaShieldAlt, FaCheckCircle, FaTimesCircle, FaClock } from 'react-icons/fa';
import { adminLogs } from '../../utils/dummyData';
import { exportAdminLogs } from '../../utils/exportUtils';
import FilterPanel from '../../components/FilterPanel';
import DataTable from '../../components/DataTable';
import ExportButton from '../../components/ExportButton';

const AdminLogs: React.FC = () => {
    const [filters, setFilters] = useState({
        search: '',
        status: '',
        dateFrom: '',
    });

    const filteredLogs = useMemo(() => {
        return adminLogs.filter(log => {
            const matchesSearch =
                log.adminName.toLowerCase().includes(filters.search.toLowerCase()) ||
                log.action.toLowerCase().includes(filters.search.toLowerCase()) ||
                log.target.toLowerCase().includes(filters.search.toLowerCase());

            const matchesStatus = !filters.status || log.status.includes(filters.status);

            return matchesSearch && matchesStatus;
        });
    }, [filters]);

    const handleFilterChange = (name: string, value: string) => {
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleClearFilters = () => {
        setFilters({ search: '', status: '', dateFrom: '' });
    };

    const handleExport = (format: 'csv' | 'pdf') => {
        exportAdminLogs(filteredLogs, format);
    };

    const filterConfigs = [
        {
            type: 'search' as const,
            name: 'search',
            label: 'Search',
            placeholder: 'Search by admin, action, or target...',
        },
        {
            type: 'select' as const,
            name: 'status',
            label: 'Status',
            options: [
                { label: 'Success', value: 'Success' },
                { label: 'Failed', value: 'Failed' },
            ],
        },
        {
            type: 'date' as const,
            name: 'dateFrom',
            label: 'Date From',
        },
    ];

    const columns = [
        {
            key: 'timestamp',
            label: 'Timestamp',
            sortable: true,
            render: (value: string) => (
                <div className="flex items-center gap-2 text-gray-600">
                    <FaClock className="text-gray-400" />
                    <span className="text-sm">{value}</span>
                </div>
            ),
        },
        {
            key: 'adminName',
            label: 'Admin',
            sortable: true,
            render: (value: string, row: any) => (
                <div>
                    <p className="font-medium text-gray-900">{value}</p>
                    <p className="text-xs text-gray-500">{row.adminId}</p>
                </div>
            ),
        },
        {
            key: 'action',
            label: 'Action',
            sortable: true,
            render: (value: string) => (
                <span className="font-medium text-gray-900">{value}</span>
            ),
        },
        {
            key: 'target',
            label: 'Target',
            sortable: true,
            render: (value: string) => (
                <span className="text-sm text-gray-600">{value}</span>
            ),
        },
        {
            key: 'ipAddress',
            label: 'IP Address',
            sortable: false,
            render: (value: string) => (
                <code className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">{value}</code>
            ),
        },
        {
            key: 'status',
            label: 'Status',
            sortable: true,
            render: (value: string) => (
                <span
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${value === 'Success'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                >
                    {value === 'Success' ? (
                        <FaCheckCircle className="text-green-600" />
                    ) : (
                        <FaTimesCircle className="text-red-600" />
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
                    <h1 className="text-3xl font-bold text-gray-900">Admin Activity Logs</h1>
                    <p className="text-gray-600 mt-1">Monitor all administrative actions and changes</p>
                </div>
                <ExportButton onExport={handleExport} label="Export Logs" />
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Total Logs</p>
                            <p className="text-2xl font-bold text-gray-900">{adminLogs.length}</p>
                        </div>
                        <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                            <FaShieldAlt className="text-indigo-600 text-xl" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Successful Actions</p>
                            <p className="text-2xl font-bold text-green-600">
                                {adminLogs.filter(l => l.status === 'Success').length}
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
                            <p className="text-sm text-gray-600">Failed Actions</p>
                            <p className="text-2xl font-bold text-red-600">
                                {adminLogs.filter(l => l.status.includes('Failed')).length}
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                            <FaTimesCircle className="text-red-600 text-xl" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Today's Actions</p>
                            <p className="text-2xl font-bold text-indigo-600">
                                {adminLogs.filter(l => l.timestamp.includes('2024-12-23')).length}
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                            <FaClock className="text-indigo-600 text-xl" />
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

            {/* Logs Table */}
            <DataTable
                data={filteredLogs}
                columns={columns}
                pageSize={15}
            />
        </div>
    );
};

export default AdminLogs;

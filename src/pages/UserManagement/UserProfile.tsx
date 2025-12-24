import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { FaArrowLeft, FaUser, FaEnvelope, FaPhone, FaCalendar, FaPills, FaHeartbeat } from 'react-icons/fa';
import { dummyUsers } from '../../utils/dummyData';
import ExportButton from '../../components/ExportButton';
import { exportToPDF } from '../../utils/exportUtils';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const UserProfile: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'baseline' | 'phenotype' | 'progress'>('baseline');

    const user = dummyUsers.find(u => u.id === id);

    if (!user) {
        return (
            <div className="p-6">
                <div className="text-center py-12">
                    <p className="text-gray-600">User not found</p>
                    <button
                        onClick={() => navigate('/user-management')}
                        className="mt-4 text-indigo-600 hover:text-indigo-700"
                    >
                        Return to User Management
                    </button>
                </div>
            </div>
        );
    }

    const handleExport = () => {
        const exportData = [{
            'User ID': user.id,
            'Name': user.name,
            'Email': user.email,
            'Phone': user.phone,
            'Status': user.status,
            'Registration Date': user.registrationDate,
            'Age': user.baselineData.age,
            'Gender': user.baselineData.gender,
            'Blood Type': user.baselineData.bloodType,
            'Chronic Conditions': user.baselineData.chronicConditions.join(', '),
            'Medications': user.baselineData.medications.join(', '),
        }];

        const columns = [
            { header: 'Field', dataKey: 'field' },
            { header: 'Value', dataKey: 'value' },
        ];

        const formattedData = Object.entries(exportData[0]).map(([field, value]) => ({
            field,
            value: value.toString(),
        }));

        exportToPDF(formattedData, columns, `user_${user.id}_profile`, `User Profile: ${user.name}`);
    };

    // Progress chart data
    const progressChartData = {
        labels: user.progress.dates,
        datasets: [
            {
                label: 'Pain Level',
                data: user.progress.painLevelTrend,
                borderColor: 'rgb(239, 68, 68)',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                tension: 0.4,
            },
            {
                label: 'Mood Score',
                data: user.progress.moodScores,
                borderColor: 'rgb(34, 197, 94)',
                backgroundColor: 'rgba(34, 197, 94, 0.1)',
                tension: 0.4,
            },
        ],
    };

    const exerciseSleepChartData = {
        labels: user.progress.dates,
        datasets: [
            {
                label: 'Exercise Minutes',
                data: user.progress.exerciseMinutes,
                borderColor: 'rgb(59, 130, 246)',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                tension: 0.4,
            },
            {
                label: 'Sleep Hours',
                data: user.progress.sleepHours,
                borderColor: 'rgb(168, 85, 247)',
                backgroundColor: 'rgba(168, 85, 247, 0.1)',
                tension: 0.4,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
        },
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };

    return (
        <div className="p-6">
            {/* Header */}
            <div className="mb-6">
                <button
                    onClick={() => navigate('/user-management')}
                    className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 mb-4"
                >
                    <FaArrowLeft />
                    <span>Back to User Management</span>
                </button>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center">
                            <FaUser className="text-indigo-600 text-2xl" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
                            <p className="text-gray-600">{user.id}</p>
                        </div>
                    </div>
                    <ExportButton onExport={handleExport} label="Export Profile" />
                </div>
            </div>

            {/* Basic Info Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="flex items-center gap-3">
                        <FaEnvelope className="text-gray-400 text-xl" />
                        <div>
                            <p className="text-sm text-gray-600">Email</p>
                            <p className="font-medium text-gray-900">{user.email}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <FaPhone className="text-gray-400 text-xl" />
                        <div>
                            <p className="text-sm text-gray-600">Phone</p>
                            <p className="font-medium text-gray-900">{user.phone}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <FaCalendar className="text-gray-400 text-xl" />
                        <div>
                            <p className="text-sm text-gray-600">Registration Date</p>
                            <p className="font-medium text-gray-900">{user.registrationDate}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <FaHeartbeat className="text-gray-400 text-xl" />
                        <div>
                            <p className="text-sm text-gray-600">Status</p>
                            <span
                                className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${user.status === 'Active'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-gray-100 text-gray-800'
                                    }`}
                            >
                                {user.status}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="border-b border-gray-200">
                    <div className="flex">
                        <button
                            onClick={() => setActiveTab('baseline')}
                            className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${activeTab === 'baseline'
                                ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50'
                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                }`}
                        >
                            Baseline Data
                        </button>
                        <button
                            onClick={() => setActiveTab('phenotype')}
                            className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${activeTab === 'phenotype'
                                ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50'
                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                }`}
                        >
                            Phenotype
                        </button>
                        <button
                            onClick={() => setActiveTab('progress')}
                            className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${activeTab === 'progress'
                                ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50'
                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                }`}
                        >
                            Progress
                        </button>
                    </div>
                </div>

                <div className="p-6">
                    {/* Baseline Data Tab */}
                    {activeTab === 'baseline' && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <p className="text-sm text-gray-600 mb-1">Age</p>
                                    <p className="text-2xl font-bold text-gray-900">{user.baselineData.age} years</p>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <p className="text-sm text-gray-600 mb-1">Gender</p>
                                    <p className="text-2xl font-bold text-gray-900">{user.baselineData.gender}</p>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <p className="text-sm text-gray-600 mb-1">Blood Type</p>
                                    <p className="text-2xl font-bold text-gray-900">{user.baselineData.bloodType}</p>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <p className="text-sm text-gray-600 mb-1">Height</p>
                                    <p className="text-2xl font-bold text-gray-900">{user.baselineData.height}</p>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <p className="text-sm text-gray-600 mb-1">Weight</p>
                                    <p className="text-2xl font-bold text-gray-900">{user.baselineData.weight}</p>
                                </div>
                            </div>

                            <div className="border-t border-gray-200 pt-6">
                                <div className="flex items-start gap-3 mb-4">
                                    <FaHeartbeat className="text-red-500 text-xl mt-1" />
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Chronic Conditions</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {user.baselineData.chronicConditions.map((condition, idx) => (
                                                <span
                                                    key={idx}
                                                    className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm"
                                                >
                                                    {condition}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="border-t border-gray-200 pt-6">
                                <div className="flex items-start gap-3">
                                    <FaPills className="text-blue-500 text-xl mt-1" />
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Medications</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {user.baselineData.medications.map((medication, idx) => (
                                                <span
                                                    key={idx}
                                                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                                                >
                                                    {medication}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Phenotype Tab */}
                    {activeTab === 'phenotype' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-6">
                                <p className="text-sm text-red-700 mb-2">Pain Sensitivity</p>
                                <p className="text-3xl font-bold text-red-900">{user.phenotype.painSensitivity}</p>
                            </div>
                            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-6">
                                <p className="text-sm text-orange-700 mb-2">Stress Response</p>
                                <p className="text-3xl font-bold text-orange-900">{user.phenotype.stressResponse}</p>
                            </div>
                            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6">
                                <p className="text-sm text-purple-700 mb-2">Sleep Quality</p>
                                <p className="text-3xl font-bold text-purple-900">{user.phenotype.sleepQuality}</p>
                            </div>
                            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6">
                                <p className="text-sm text-blue-700 mb-2">Physical Activity</p>
                                <p className="text-3xl font-bold text-blue-900">{user.phenotype.physicalActivity}</p>
                            </div>
                            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6">
                                <p className="text-sm text-green-700 mb-2">Diet Quality</p>
                                <p className="text-3xl font-bold text-green-900">{user.phenotype.dietQuality}</p>
                            </div>
                            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg p-6">
                                <p className="text-sm text-indigo-700 mb-2">Cognitive Function</p>
                                <p className="text-3xl font-bold text-indigo-900">{user.phenotype.cognitiveFunction}</p>
                            </div>
                        </div>
                    )}

                    {/* Progress Tab */}
                    {activeTab === 'progress' && (
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Pain & Mood Trends</h3>
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <Line data={progressChartData} options={chartOptions} />
                                </div>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Exercise & Sleep Trends</h3>
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <Line data={exerciseSleepChartData} options={chartOptions} />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserProfile;

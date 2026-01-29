import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Line, Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
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
    Legend,
    ArcElement
);

const UserProfile: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'baseline' | 'phenotype' | 'progress'>('baseline');
    const [currentSessionIndex, setCurrentSessionIndex] = useState(0);

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
            'Other Conditions': user.baselineData.otherConditions?.join(', '),
            'Medications': user.baselineData.medications.join(', '),
        }];

        const columns = [
            { header: 'Field', dataKey: 'field' },
            { header: 'Value', dataKey: 'value' },
        ];

        const formattedData = Object.entries(exportData[0]).map(([field, value]) => ({
            field,
            value: value?.toString(),
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

    // Activity Ring Charts Data
    const educationActivityData = {
        labels: ['Completed', 'Remaining'],
        datasets: [
            {
                data: [60, 40],
                backgroundColor: ['rgb(239, 68, 68)', 'rgba(239, 68, 68, 0.1)'],
                borderWidth: 0,
                cutout: '75%',
            },
        ],
    };

    const exerciseActivityData = {
        labels: ['Completed', 'Remaining'],
        datasets: [
            {
                data: [6, 94],
                backgroundColor: ['rgb(34, 197, 94)', 'rgba(34, 197, 94, 0.1)'],
                borderWidth: 0,
                cutout: '75%',
            },
        ],
    };

    const mentalTrainingData = {
        labels: ['Completed', 'Remaining'],
        datasets: [
            {
                data: [10, 90],
                backgroundColor: ['rgb(59, 130, 246)', 'rgba(59, 130, 246, 0.1)'],
                borderWidth: 0,
                cutout: '75%',
            },
        ],
    };

    const activityChartOptions = {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                enabled: false,
            },
        },
    };

    // Key Areas of Concern Data
    const educationConcernData = {
        value: 127,
        unit: 'ml',
        goal: 125,
        label: 'Education',
        color: 'rgb(59, 130, 246)',
    };

    const physicalConcernData = {
        value: 164,
        unit: 'mg',
        goal: 160,
        label: 'Physical',
        color: 'rgb(239, 68, 68)',
    };

    const mentalConcernData = {
        value: 35,
        unit: '%',
        goal: 40,
        label: 'Mental',
        color: 'rgb(168, 85, 247)',
    };

    // Education Sessions Data
    const educationSessions = [
        { id: 1, color: 'blue', icon: '📘', percentage: null, dateInfo: { label: 'Date done', value: '(i.e. Yesterday)' }, correctAnswers: '3/5' },
        { id: 2, color: 'green', icon: '📗', percentage: '+3.21%', dateInfo: { label: 'Last 30 Days', value: '' }, correctAnswers: '3/5' },
        { id: 3, color: 'purple', icon: '📚', percentage: '+1.5%', dateInfo: { label: 'Last 30 Days', value: '' }, correctAnswers: '3/5' },
        { id: 4, color: 'pink', icon: '📕', percentage: '-4.45%', dateInfo: { label: 'Last 30 Days', value: '' }, correctAnswers: '3/5' },
    ];

    // Navigate sessions with infinite loop
    const handleNextSession = () => {
        setCurrentSessionIndex((prev) => (prev + 1) % educationSessions.length);
    };

    const handlePrevSession = () => {
        setCurrentSessionIndex((prev) => (prev - 1 + educationSessions.length) % educationSessions.length);
    };

    const getColorClasses = (color: string) => {
        const classes = {
            blue: { bg: 'from-blue-50 to-blue-100', border: 'border-blue-200', icon: 'bg-blue-200 text-blue-600', badge: 'bg-blue-500' },
            green: { bg: 'from-green-50 to-green-100', border: 'border-green-200', icon: 'bg-green-200 text-green-600', badge: 'bg-green-500' },
            purple: { bg: 'from-purple-50 to-purple-100', border: 'border-purple-200', icon: 'bg-purple-200 text-purple-600', badge: 'bg-purple-500' },
            pink: { bg: 'from-pink-50 to-pink-100', border: 'border-pink-200', icon: 'bg-pink-200 text-pink-600', badge: 'bg-pink-500' },
        };
        return classes[color as keyof typeof classes] || classes.blue;
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
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <p className="text-sm text-gray-600 mb-1">BMI</p>
                                    <p className="text-2xl font-bold text-gray-900">{user.baselineData.bmi}</p>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <p className="text-sm text-gray-600 mb-1">Diagnosed In</p>
                                    <p className="text-2xl font-bold text-gray-900">{user.baselineData.diagnosedIn}</p>
                                </div>
                            </div>

                            <div className="border-t border-gray-200 pt-6">
                                <div className="flex items-start gap-3 mb-4">
                                    <FaHeartbeat className="text-red-500 text-xl mt-1" />
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Other Conditions</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {user.baselineData.otherConditions?.map((condition, idx) => (
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
                            {/* Activity Section */}
                            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-lg font-semibold text-white">Activity</h3>
                                    <span className="text-xs text-gray-400 flex items-center gap-1">
                                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                        Real Time
                                    </span>
                                </div>
                                <div className="flex items-center gap-8">
                                    {/* Concentric Rings */}
                                    <div className="relative w-48 h-48 flex-shrink-0">
                                        {/* Outer Ring - Education (Red) */}
                                        <div className="absolute inset-0">
                                            <Doughnut
                                                data={{
                                                    labels: ['Completed', 'Remaining'],
                                                    datasets: [{
                                                        data: [60, 40],
                                                        backgroundColor: ['rgb(239, 68, 68)', 'rgba(239, 68, 68, 0.15)'],
                                                        borderWidth: 0,
                                                        rotation: -90,
                                                    }],
                                                }}
                                                options={activityChartOptions}
                                            />
                                        </div>
                                        {/* Middle Ring - Exercise (Green) */}
                                        <div className="absolute inset-4">
                                            <Doughnut
                                                data={{
                                                    labels: ['Completed', 'Remaining'],
                                                    datasets: [{
                                                        data: [6, 94],
                                                        backgroundColor: ['rgb(34, 197, 94)', 'rgba(34, 197, 94, 0.15)'],
                                                        borderWidth: 0,
                                                        rotation: -90,
                                                    }],
                                                }}
                                                options={activityChartOptions}
                                            />
                                        </div>
                                        {/* Inner Ring - Mental (Cyan/Blue) */}
                                        <div className="absolute inset-8">
                                            <Doughnut
                                                data={{
                                                    labels: ['Completed', 'Remaining'],
                                                    datasets: [{
                                                        data: [10, 90],
                                                        backgroundColor: ['rgb(6, 182, 212)', 'rgba(6, 182, 212, 0.15)'],
                                                        borderWidth: 0,
                                                        rotation: -90,
                                                    }],
                                                }}
                                                options={activityChartOptions}
                                            />
                                        </div>
                                    </div>

                                    {/* Labels */}
                                    <div className="flex flex-col gap-4">
                                        {/* Education */}
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
                                                <span className="text-red-500 text-lg">→</span>
                                            </div>
                                            <div>
                                                <p className="text-red-400 font-semibold">Education 60%</p>
                                                <p className="text-white text-lg font-bold">⅔ lessons</p>
                                            </div>
                                        </div>

                                        {/* Exercise */}
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                                                <span className="text-green-500 text-lg">→</span>
                                            </div>
                                            <div>
                                                <p className="text-green-400 font-semibold">EXERCISE 6%</p>
                                                <p className="text-white text-lg font-bold">2/30 MIN</p>
                                            </div>
                                        </div>

                                        {/* Mental Training */}
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center">
                                                <span className="text-cyan-500 text-lg">↑</span>
                                            </div>
                                            <div>
                                                <p className="text-cyan-400 font-semibold">Mental training 10%</p>
                                                <p className="text-white text-lg font-bold">1/3 activities</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Education Sessions Carousel */}
                            <div className="bg-white rounded-lg border border-gray-200 p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Education</h3>
                                <div className="relative">
                                    {/* Left Arrow */}
                                    <button
                                        onClick={handlePrevSession}
                                        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors border border-gray-200"
                                    >
                                        <span className="text-gray-600 text-xl">←</span>
                                    </button>

                                    {/* Session Cards - Show 3 at a time */}
                                    <div className="px-8 overflow-hidden">
                                        <div className="flex gap-4 transition-transform duration-300" style={{ transform: `translateX(-${currentSessionIndex * (100 / 3)}%)` }}>
                                            {/* Render sessions with infinite loop logic */}
                                            {[...educationSessions, ...educationSessions, ...educationSessions].map((session, idx) => {
                                                const colorClasses = getColorClasses(session.color);
                                                return (
                                                    <div key={`session-${idx}`} className="w-1/3 flex-shrink-0 px-2">
                                                        <div className={`bg-gradient-to-br ${colorClasses.bg} rounded-xl p-4 border ${colorClasses.border}`}>
                                                            <div className="flex items-start gap-3 mb-4">
                                                                <div className={`w-10 h-10 ${colorClasses.icon} rounded-lg flex items-center justify-center`}>
                                                                    <span className="text-lg">{session.icon}</span>
                                                                </div>
                                                                <div className="flex-1">
                                                                    <span className={`inline-block px-2 py-0.5 ${colorClasses.badge} text-white text-xs rounded-full mb-1`}>
                                                                        Session {session.id}
                                                                    </span>
                                                                    <p className="text-gray-700 font-medium">29 min.</p>
                                                                </div>
                                                                <div className="text-right">
                                                                    {session.percentage ? (
                                                                        <>
                                                                            <p className={`text-xs font-medium ${session.percentage.startsWith('+') ? 'text-green-600' : 'text-red-500'}`}>
                                                                                {session.percentage}
                                                                            </p>
                                                                            <p className="text-xs text-gray-500">{session.dateInfo.label}</p>
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            <p className="text-xs text-gray-400">{session.dateInfo.label}</p>
                                                                            <p className="text-xs text-gray-500">{session.dateInfo.value}</p>
                                                                        </>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center justify-between">
                                                                <span className="text-sm text-gray-600">Correct answers:</span>
                                                                <span className="text-sm font-bold text-gray-900">{session.correctAnswers}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Right Arrow */}
                                    <button
                                        onClick={handleNextSession}
                                        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors border border-gray-200"
                                    >
                                        <span className="text-gray-600 text-xl">→</span>
                                    </button>
                                </div>
                            </div>

                            {/* Key Areas of Concern */}
                            <div className="bg-white rounded-lg border border-gray-200 p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-6">Key Areas of Concern</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {/* Education */}
                                    <div>
                                        <div className="flex items-baseline justify-between mb-2">
                                            <span className="text-sm text-gray-600">{educationConcernData.label}</span>
                                            <button className="text-xs text-blue-600">Detail</button>
                                        </div>
                                        <div className="mb-3">
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-3xl font-bold text-blue-600">{educationConcernData.value}</span>
                                                <span className="text-sm text-gray-500">{educationConcernData.unit}</span>
                                            </div>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-xs text-gray-500">Your Best Goal</span>
                                                <span className="text-xs text-gray-900 font-medium">{educationConcernData.goal}{educationConcernData.unit}daily</span>
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            {[1, 2, 3, 4, 5, 6, 7].map((day, idx) => (
                                                <div key={idx} className="flex items-center gap-1">
                                                    <div className="flex-1 bg-gray-100 rounded-sm overflow-hidden h-1">
                                                        <div
                                                            className="h-full bg-blue-500 rounded-sm"
                                                            style={{ width: `${Math.random() * 100}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Physical */}
                                    <div>
                                        <div className="flex items-baseline justify-between mb-2">
                                            <span className="text-sm text-gray-600">{physicalConcernData.label}</span>
                                            <button className="text-xs text-blue-600">Detail</button>
                                        </div>
                                        <div className="mb-3">
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-3xl font-bold text-blue-600">{physicalConcernData.value}</span>
                                                <span className="text-sm text-gray-500">{physicalConcernData.unit}</span>
                                            </div>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-xs text-gray-500">Your Best Goal</span>
                                                <span className="text-xs text-gray-900 font-medium">{physicalConcernData.goal}{physicalConcernData.unit}daily</span>
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            {[1, 2, 3, 4, 5, 6, 7].map((day, idx) => (
                                                <div key={idx} className="flex items-center gap-1">
                                                    <div className="flex-1 bg-gray-100 rounded-sm overflow-hidden h-1">
                                                        <div
                                                            className="h-full bg-blue-500 rounded-sm"
                                                            style={{ width: `${Math.random() * 100}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Mental */}
                                    <div>
                                        <div className="flex items-baseline justify-between mb-2">
                                            <span className="text-sm text-gray-600">{mentalConcernData.label}</span>
                                            <button className="text-xs text-blue-600">Detail</button>
                                        </div>
                                        <div className="mb-3">
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-3xl font-bold text-blue-600">{mentalConcernData.value}</span>
                                                <span className="text-sm text-gray-500">{mentalConcernData.unit}</span>
                                            </div>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-xs text-gray-500">Your Best Goal</span>
                                                <span className="text-xs text-gray-900 font-medium">{mentalConcernData.goal}{mentalConcernData.unit}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="flex items-center gap-1">
                                                <span className="text-sm text-gray-600">more than</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <div className="w-8 h-8 bg-blue-100 rounded"></div>
                                                <div className="w-12 h-8 bg-blue-600 rounded"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Physical Exercise Section */}
                            <div className="bg-white rounded-lg border border-gray-200 p-6">
                                <h2 className="text-xl font-bold text-gray-900 mb-6">Physical Exercise</h2>

                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                    {/* Left Column - Your Activity */}
                                    <div className="lg:col-span-1 ">
                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <div className="flex items-center justify-between mb-4">
                                                <h3 className="text-sm font-semibold text-gray-900">Your Activity</h3>
                                                <select className="text-xs border border-gray-300 rounded px-2 py-1 bg-white text-gray-600">
                                                    <option>Today</option>
                                                    <option>This Week</option>
                                                    <option>This Month</option>
                                                </select>
                                            </div>
                                            {/* Bar Chart */}
                                            <div className="flex items-end justify-between gap-2" style={{ height: '240px' }}>
                                                {[
                                                    { day: 'Mon', value: 40 },
                                                    { day: 'Tue', value: 70 },
                                                    { day: 'Wed', value: 55 },
                                                    { day: 'Thu', value: 80 },
                                                    { day: 'Fri', value: 85 },
                                                    { day: 'Sat', value: 90 },
                                                    { day: 'Sun', value: 50 },
                                                ].map((item, idx) => (
                                                    <div key={idx} className="flex-1 flex flex-col justify-end items-center gap-1">
                                                        <div className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t shadow-sm" style={{ height: `${Math.round(item.value * 2.4)}px` }}></div>
                                                        <span className="text-xs text-gray-600 font-medium">{item.day}</span>
                                                    </div>
                                                ))}
                                            </div>

                                        </div>
                                    </div>

                                    {/* Middle Column - Exercise Table */}
                                    <div className="lg:col-span-2">
                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <div className="overflow-x-auto max-h-68 overflow-y-auto">
                                                <table className="w-full text-xs">
                                                    <thead className="sticky top-0 bg-gray-50 z-10">
                                                        <tr className="border-b border-gray-300">
                                                            <th className="text-left py-2 px-2 font-semibold text-gray-900">Type of exercise</th>
                                                            <th className="text-center py-2 px-2 font-semibold text-gray-900">Sets</th>
                                                            <th className="text-center py-2 px-2 font-semibold text-gray-900">Reps</th>
                                                            <th className="text-center py-2 px-2 font-semibold text-gray-900">Weight</th>
                                                            <th className="text-center py-2 px-2 font-semibold text-gray-900">Date</th>
                                                            <th className="text-center py-2 px-2 font-semibold text-gray-900">Completed</th>
                                                            <th className="text-left py-2 px-2 font-semibold text-gray-900">Note</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {[
                                                            { type: 'One po one Maths tutition', sets: '2', reps: '12', weight: '2kg', date: '26/01/2021', completed: 'Yes', note: null },
                                                            { type: 'One po one Maths tutition', sets: '-', reps: '-', weight: '-', date: '24/01/2021', completed: 'Yes', note: 'Session Postponed' },
                                                            { type: 'One po one Maths tutition', sets: '-', reps: '-', weight: 'Maths Equation', date: '23/01/2021', completed: 'No', note: null },
                                                            { type: 'One po one Maths tutition', sets: '-', reps: '-', weight: 'Vertreibt Wunderbrügge', date: '22/01/2021', completed: 'No', note: null },
                                                            { type: 'One po one Maths tutition', sets: '-', reps: '-', weight: 'Vertreibt Wunderbrügge', date: '22/01/2021', completed: 'No', note: null },
                                                        ].map((exercise, idx) => (
                                                            <tr key={idx} className="border-b border-gray-200">
                                                                <td className="py-2 px-2 text-gray-700">{exercise.type}</td>
                                                                <td className="py-2 px-2 text-center text-gray-700">{exercise.sets}</td>
                                                                <td className="py-2 px-2 text-center text-gray-700">{exercise.reps}</td>
                                                                <td className="py-2 px-2 text-center text-gray-700">{exercise.weight}</td>
                                                                <td className="py-2 px-2 text-center text-gray-700">{exercise.date}</td>
                                                                <td className="py-2 px-2 text-center">
                                                                    <span className={`px-2 py-0.5 rounded text-xs ${exercise.completed === 'Yes' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                                        {exercise.completed}
                                                                    </span>
                                                                </td>
                                                                <td className="py-2 px-2 text-gray-700">{exercise.note || '-'}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Health Metrics and Linked Device */}
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                                    {/* Health Metrics Cards */}
                                    <div className="lg:col-span-2">
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            {/* Pain */}
                                            <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4 relative overflow-hidden">
                                                <div className="flex items-center gap-2 mb-3">
                                                    <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center">
                                                        <span className="text-white text-xs">❤️</span>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-gray-600">Pain</p>
                                                        <p className="text-xl font-bold text-gray-900">30</p>
                                                    </div>
                                                </div>
                                                <p className="text-xs text-gray-500 mb-2">of 100</p>
                                                {/* Mini sparkline chart */}
                                                <svg width="100%" height="40" className="relative z-10">
                                                    <defs>
                                                        <linearGradient id="painGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                                            <stop offset="0%" style={{ stopColor: '#ef4444', stopOpacity: 0.3 }} />
                                                            <stop offset="100%" style={{ stopColor: '#ef4444', stopOpacity: 0.05 }} />
                                                        </linearGradient>
                                                    </defs>
                                                    <path d="M 0,30 Q 15,20 30,25 T 60,15 T 90,20 T 120,10" stroke="#ef4444" strokeWidth="2" fill="none" />
                                                    <path d="M 0,30 Q 15,20 30,25 T 60,15 T 90,20 T 120,10 L 120,40 L 0,40 Z" fill="url(#painGradient)" />
                                                </svg>
                                            </div>

                                            {/* Fatigue */}
                                            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 relative overflow-hidden">
                                                <div className="flex items-center gap-2 mb-3">
                                                    <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center">
                                                        <span className="text-white text-xs">😴</span>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-gray-600">Fatigue</p>
                                                        <p className="text-xl font-bold text-gray-900">15</p>
                                                    </div>
                                                </div>
                                                <p className="text-xs text-gray-500 mb-2">of 100</p>
                                                {/* Mini sparkline chart */}
                                                <svg width="100%" height="40" className="relative z-10">
                                                    <defs>
                                                        <linearGradient id="fatigueGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                                            <stop offset="0%" style={{ stopColor: '#8b5cf6', stopOpacity: 0.3 }} />
                                                            <stop offset="100%" style={{ stopColor: '#8b5cf6', stopOpacity: 0.05 }} />
                                                        </linearGradient>
                                                    </defs>
                                                    <path d="M 0,25 Q 15,15 30,20 T 60,10 T 90,15 T 120,8" stroke="#8b5cf6" strokeWidth="2" fill="none" />
                                                    <path d="M 0,25 Q 15,15 30,20 T 60,10 T 90,15 T 120,8 L 120,40 L 0,40 Z" fill="url(#fatigueGradient)" />
                                                </svg>
                                            </div>

                                            {/* Stress */}
                                            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 relative overflow-hidden">
                                                <div className="flex items-center gap-2 mb-3">
                                                    <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center">
                                                        <span className="text-white text-xs">😰</span>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-gray-600">Stress</p>
                                                        <p className="text-xl font-bold text-gray-900">45</p>
                                                    </div>
                                                </div>
                                                <p className="text-xs text-gray-500 mb-2">of 100</p>
                                                {/* Mini sparkline chart */}
                                                <svg width="100%" height="40" className="relative z-10">
                                                    <defs>
                                                        <linearGradient id="stressGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                                            <stop offset="0%" style={{ stopColor: '#3b82f6', stopOpacity: 0.3 }} />
                                                            <stop offset="100%" style={{ stopColor: '#3b82f6', stopOpacity: 0.05 }} />
                                                        </linearGradient>
                                                    </defs>
                                                    <path d="M 0,20 Q 15,25 30,18 T 60,22 T 90,18 T 120,25" stroke="#3b82f6" strokeWidth="2" fill="none" />
                                                    <path d="M 0,20 Q 15,25 30,18 T 60,22 T 90,18 T 120,25 L 120,40 L 0,40 Z" fill="url(#stressGradient)" />
                                                </svg>
                                            </div>

                                            {/* Borg Scale */}
                                            <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-lg p-4 relative overflow-hidden">
                                                <div className="flex items-center gap-2 mb-3">
                                                    <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center">
                                                        <span className="text-white text-xs">💪</span>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-gray-600">Borg Scale</p>
                                                        <p className="text-xl font-bold text-gray-900">30</p>
                                                    </div>
                                                </div>
                                                <p className="text-xs text-gray-500 mb-2">of 100</p>
                                                {/* Mini sparkline chart */}
                                                <svg width="100%" height="40" className="relative z-10">
                                                    <defs>
                                                        <linearGradient id="borgGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                                            <stop offset="0%" style={{ stopColor: '#ec4899', stopOpacity: 0.3 }} />
                                                            <stop offset="100%" style={{ stopColor: '#ec4899', stopOpacity: 0.05 }} />
                                                        </linearGradient>
                                                    </defs>
                                                    <path d="M 0,28 Q 15,22 30,26 T 60,18 T 90,24 T 120,15" stroke="#ec4899" strokeWidth="2" fill="none" />
                                                    <path d="M 0,28 Q 15,22 30,26 T 60,18 T 90,24 T 120,15 L 120,40 L 0,40 Z" fill="url(#borgGradient)" />
                                                </svg>
                                            </div>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-3 text-center">This should open the linked device page</p>
                                    </div>

                                    {/* Linked Device */}
                                    <div className="lg:col-span-1">
                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <div className="flex items-center justify-between mb-3">
                                                <h3 className="text-sm font-semibold text-gray-900">Linked Device</h3>
                                                <button className="text-lg">⋮</button>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                                                    <span className="text-2xl">⌚</span>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-gray-900">Smart Watch</p>
                                                    <p className="text-xs text-gray-600">Amazfit Kratos</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Mental Exercise Section */}
                            <div className="bg-white rounded-lg border border-gray-200 p-6">
                                <h2 className="text-xl font-bold text-gray-900 mb-6">Mental Exercise</h2>

                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                    {/* Left Column - Your Activity */}
                                    <div className="lg:col-span-1">
                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <div className="flex items-center justify-between mb-4">
                                                <h3 className="text-sm font-semibold text-gray-900">Your Activity</h3>
                                                <select className="text-xs border border-gray-300 rounded px-2 py-1 bg-white text-gray-600">
                                                    <option>Today</option>
                                                    <option>This Week</option>
                                                    <option>This Month</option>
                                                </select>
                                            </div>
                                            {/* Bar Chart */}
                                            <div className="flex items-end justify-between gap-2" style={{ height: '240px' }}>
                                                {[
                                                    { day: 'Mon', value: 35 },
                                                    { day: 'Tue', value: 60 },
                                                    { day: 'Wed', value: 80 },
                                                    { day: 'Thu', value: 70 },
                                                    { day: 'Fri', value: 85 },
                                                    { day: 'Sat', value: 65 },
                                                    { day: 'Sun', value: 45 },
                                                ].map((item, idx) => (
                                                    <div key={idx} className="flex-1 flex flex-col justify-end items-center gap-1">
                                                        <div className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t shadow-sm" style={{ height: `${Math.round(item.value * 2.4)}px` }}></div>
                                                        <span className="text-xs text-gray-600 font-medium">{item.day}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Middle Column - Exercise Table */}
                                    <div className="lg:col-span-1">
                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <div className='overflow-x-auto max-h-68 overflow-y-auto'>
                                                <table className="w-full text-xs">
                                                    <thead>
                                                        <tr className="border-b border-gray-300">
                                                            <th className="text-left py-2 px-2 font-semibold text-gray-900">Type of exercise</th>
                                                            <th className="text-center py-2 px-2 font-semibold text-gray-900">Minutes</th>
                                                            <th className="text-center py-2 px-2 font-semibold text-gray-900">Result</th>
                                                            <th className="text-center py-2 px-2 font-semibold text-gray-900">Date</th>
                                                            <th className="text-center py-2 px-2 font-semibold text-gray-900">Completed</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {[
                                                            { type: 'One po one Maths tuition', minutes: '30', result: 'Better Brain', date: '26/01/2025', completed: 'Yes' },
                                                            { type: 'One po one Maths tuition', minutes: '25', result: 'Barnch Cunition', date: '25/01/2025', completed: 'Yes' },
                                                            { type: 'One po one Maths tuition', minutes: '40', result: 'Howard Heaverad', date: '24/01/2025', completed: 'Yes' },
                                                            { type: 'One po one Maths tuition', minutes: '20', result: 'Maths Equation', date: '23/01/2025', completed: 'No' },
                                                            { type: 'One po one Maths tuition', minutes: '15', result: 'Vertreibt Wunderbrügge', date: '22/01/2025', completed: 'No' },
                                                            { type: 'One po one Maths tuition', minutes: '35', result: 'Practice Register', date: '21/01/2025', completed: 'No' },
                                                        ].map((exercise, idx) => (
                                                            <tr key={idx} className="border-b border-gray-200 h-2/3 overflow-y-auto">
                                                                <td className="py-2 px-2 text-gray-700">{exercise.type}</td>
                                                                <td className="py-2 px-2 text-center text-gray-700">{exercise.minutes}</td>
                                                                <td className="py-2 px-2 text-center text-gray-700">{exercise.result}</td>
                                                                <td className="py-2 px-2 text-center text-gray-700">{exercise.date}</td>
                                                                <td className="py-2 px-2 text-center">
                                                                    <span className={`px-2 py-0.5 rounded text-xs ${exercise.completed === 'Yes' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                                        {exercise.completed}
                                                                    </span>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Column - Cognitive Domains */}
                                    <div className="lg:col-span-1">
                                        <div className="bg-gray-50 rounded-lg p-4 max-h-68 ">
                                            <div className="flex items-center justify-between mb-4">
                                                <h3 className="text-sm font-semibold text-gray-900">Cognitive domains</h3>
                                                <span className="px-2 py-1 bg-gray-900 text-white text-xs font-semibold rounded">TODAY</span>
                                            </div>

                                            <div className="space-y-4">
                                                {/* Inhibitory control */}
                                                <div>
                                                    <div className="flex items-center justify-between mb-1">
                                                        <span className="text-xs text-gray-700">Inhibitory control</span>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-xs text-gray-500">30%</span>
                                                            <span className="text-xs text-gray-500">70%</span>
                                                        </div>
                                                    </div>
                                                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                                        <div className="h-full bg-gradient-to-r from-purple-400 to-purple-600 rounded-full" style={{ width: '70%' }}></div>
                                                    </div>
                                                </div>

                                                {/* Selective attention */}
                                                <div>
                                                    <div className="flex items-center justify-between mb-1">
                                                        <span className="text-xs text-gray-700">Selective attention</span>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-xs text-gray-500">45%</span>
                                                            <span className="text-xs text-gray-500">55%</span>
                                                        </div>
                                                    </div>
                                                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                                        <div className="h-full bg-gradient-to-r from-purple-400 to-purple-600 rounded-full" style={{ width: '55%' }}></div>
                                                    </div>
                                                </div>

                                                {/* Working memory */}
                                                <div>
                                                    <div className="flex items-center justify-between mb-1">
                                                        <span className="text-xs text-gray-700">Working memory</span>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-xs text-gray-500">25%</span>
                                                            <span className="text-xs text-gray-500">75%</span>
                                                        </div>
                                                    </div>
                                                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                                        <div className="h-full bg-gradient-to-r from-purple-400 to-purple-600 rounded-full" style={{ width: '75%' }}></div>
                                                    </div>
                                                </div>

                                                {/* Cognitive flexibility */}
                                                <div>
                                                    <div className="flex items-center justify-between mb-1">
                                                        <span className="text-xs text-gray-700">Cognitive flexibility</span>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-xs text-gray-500">50%</span>
                                                            <span className="text-xs text-gray-500">44%</span>
                                                        </div>
                                                    </div>
                                                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                                        <div className="h-full bg-gradient-to-r from-purple-400 to-purple-600 rounded-full" style={{ width: '44%' }}></div>
                                                    </div>
                                                </div>

                                                {/* Sustained attention */}
                                                <div>
                                                    <div className="flex items-center justify-between mb-1">
                                                        <span className="text-xs text-gray-700">Sustained attention</span>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-xs text-gray-500">34%</span>
                                                            <span className="text-xs text-gray-500">60%</span>
                                                        </div>
                                                    </div>
                                                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                                        <div className="h-full bg-gradient-to-r from-purple-400 to-purple-600 rounded-full" style={{ width: '60%' }}></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Existing Charts */}
                            {/* <div>
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
                            </div> */}
                        </div>
                    )}
                </div>
            </div>
        </div >
    );
};

export default UserProfile;

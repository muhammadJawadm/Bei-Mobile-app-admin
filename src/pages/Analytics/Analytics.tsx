import React, { useState } from 'react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { FaUsers, FaChartLine, FaDumbbell } from 'react-icons/fa';
import { analyticsData } from '../../utils/dummyData';
import { exportAnalyticsReport } from '../../utils/exportUtils';
import ExportButton from '../../components/ExportButton';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

const Analytics: React.FC = () => {
    const [dateRange, setDateRange] = useState('7days');

    const handleExport = () => {
        exportAnalyticsReport(analyticsData);
    };

    // Pain Trends Chart
    const painTrendsData = {
        labels: analyticsData.painTrends.labels,
        datasets: [
            {
                label: 'Average Pain Level',
                data: analyticsData.painTrends.data,
                borderColor: 'rgb(239, 68, 68)',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                tension: 0.4,
            },
        ],
    };

    // Cognitive Performance Chart
    const cognitiveData = {
        labels: analyticsData.cognitivePerformance.labels,
        datasets: [
            {
                label: 'Performance Score',
                data: analyticsData.cognitivePerformance.data,
                backgroundColor: [
                    'rgba(79, 70, 229, 0.8)',
                    'rgba(124, 58, 237, 0.8)',
                    'rgba(236, 72, 153, 0.8)',
                    'rgba(59, 130, 246, 0.8)',
                    'rgba(16, 185, 129, 0.8)',
                ],
                borderColor: [
                    'rgb(79, 70, 229)',
                    'rgb(124, 58, 237)',
                    'rgb(236, 72, 153)',
                    'rgb(59, 130, 246)',
                    'rgb(16, 185, 129)',
                ],
                borderWidth: 2,
            },
        ],
    };

    // Exercise, Mood, Sleep Evolution
    const evolutionData = {
        labels: analyticsData.exerciseMoodSleep.labels,
        datasets: [
            {
                label: 'Exercise (mins)',
                data: analyticsData.exerciseMoodSleep.exercise,
                borderColor: 'rgb(59, 130, 246)',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                tension: 0.4,
                yAxisID: 'y',
            },
            {
                label: 'Mood Score',
                data: analyticsData.exerciseMoodSleep.mood,
                borderColor: 'rgb(34, 197, 94)',
                backgroundColor: 'rgba(34, 197, 94, 0.1)',
                tension: 0.4,
                yAxisID: 'y1',
            },
            {
                label: 'Sleep (hours)',
                data: analyticsData.exerciseMoodSleep.sleep,
                borderColor: 'rgb(168, 85, 247)',
                backgroundColor: 'rgba(168, 85, 247, 0.1)',
                tension: 0.4,
                yAxisID: 'y1',
            },
        ],
    };

    // User Engagement Chart
    const engagementData = {
        labels: analyticsData.userEngagement.labels,
        datasets: [
            {
                label: 'Daily Active Users',
                data: analyticsData.userEngagement.data,
                backgroundColor: 'rgba(79, 70, 229, 0.8)',
                borderColor: 'rgb(79, 70, 229)',
                borderWidth: 2,
            },
        ],
    };

    const lineChartOptions = {
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

    const multiAxisOptions = {
        responsive: true,
        interaction: {
            mode: 'index' as const,
            intersect: false,
        },
        plugins: {
            legend: {
                position: 'top' as const,
            },
        },
        scales: {
            y: {
                type: 'linear' as const,
                display: true,
                position: 'left' as const,
                title: {
                    display: true,
                    text: 'Exercise (minutes)',
                },
            },
            y1: {
                type: 'linear' as const,
                display: true,
                position: 'right' as const,
                title: {
                    display: true,
                    text: 'Mood & Sleep',
                },
                grid: {
                    drawOnChartArea: false,
                },
            },
        },
    };

    return (
        <div className="p-6">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
                    <p className="text-gray-600 mt-1">Comprehensive insights and performance metrics</p>
                </div>
                <div className="flex gap-3 items-center">
                    <select
                        value={dateRange}
                        onChange={(e) => setDateRange(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="7days">Last 7 Days</option>
                        <option value="30days">Last 30 Days</option>
                        <option value="90days">Last 90 Days</option>
                        <option value="year">This Year</option>
                    </select>
                    <ExportButton onExport={handleExport} label="Export Report" />
                </div>
            </div>

            {/* Global Usage Statistics */}
            <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Global Usage Statistics</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg p-6 text-white">
                        <div className="flex items-center justify-between mb-2">
                            <FaUsers className="text-3xl opacity-80" />
                            <span className="text-sm font-medium bg-white bg-opacity-20 px-2 py-1 rounded-full">
                                {analyticsData.globalUsageStats.userGrowth}
                            </span>
                        </div>
                        <p className="text-3xl font-bold mb-1">{analyticsData.globalUsageStats.totalUsers.toLocaleString()}</p>
                        <p className="text-indigo-100 text-sm">Total Users</p>
                    </div>
                    <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white">
                        <FaUsers className="text-3xl opacity-80 mb-2" />
                        <p className="text-3xl font-bold mb-1">{analyticsData.globalUsageStats.activeUsers.toLocaleString()}</p>
                        <p className="text-green-100 text-sm">Active Users</p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-6 text-white">
                        <FaDumbbell className="text-3xl opacity-80 mb-2" />
                        <p className="text-3xl font-bold mb-1">{analyticsData.globalUsageStats.totalExercisesCompleted.toLocaleString()}</p>
                        <p className="text-purple-100 text-sm">Exercises Completed</p>
                    </div>
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white">
                        <FaChartLine className="text-3xl opacity-80 mb-2" />
                        <p className="text-3xl font-bold mb-1">{analyticsData.globalUsageStats.engagement}</p>
                        <p className="text-blue-100 text-sm">Engagement Rate</p>
                    </div>
                </div>
            </div>

            {/* Additional Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <p className="text-sm text-gray-600 mb-1">Total Sessions</p>
                    <p className="text-3xl font-bold text-gray-900">{analyticsData.globalUsageStats.totalSessions.toLocaleString()}</p>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <p className="text-sm text-gray-600 mb-1">Avg. Session Duration</p>
                    <p className="text-3xl font-bold text-gray-900">{analyticsData.globalUsageStats.averageSessionDuration}</p>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <p className="text-sm text-gray-600 mb-1">Assessments Completed</p>
                    <p className="text-3xl font-bold text-gray-900">{analyticsData.globalUsageStats.totalAssessmentsCompleted.toLocaleString()}</p>
                </div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Pain Trends */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">{analyticsData.painTrends.title}</h3>
                    <Line data={painTrendsData} options={lineChartOptions} />
                </div>

                {/* User Engagement */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">{analyticsData.userEngagement.title}</h3>
                    <Bar data={engagementData} options={lineChartOptions} />
                </div>
            </div>

            {/* Cognitive Performance */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 lg:col-span-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">{analyticsData.cognitivePerformance.title}</h3>
                    <Doughnut data={cognitiveData} />
                </div>

                {/* Exercise, Mood, Sleep Evolution */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 lg:col-span-2">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">{analyticsData.exerciseMoodSleep.title}</h3>
                    <Line data={evolutionData} options={multiAxisOptions} />
                </div>
            </div>

            {/* Summary Insights */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg border border-indigo-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Insights</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white rounded-lg p-4">
                        <p className="text-sm text-gray-600 mb-1">📉 Pain Reduction</p>
                        <p className="text-lg font-bold text-green-600">34% decrease</p>
                        <p className="text-xs text-gray-500 mt-1">Average pain level dropped from 6.5 to 4.3 over 12 months</p>
                    </div>
                    <div className="bg-white rounded-lg p-4">
                        <p className="text-sm text-gray-600 mb-1">📈 Activity Increase</p>
                        <p className="text-lg font-bold text-blue-600">133% increase</p>
                        <p className="text-xs text-gray-500 mt-1">Average exercise time increased from 120 to 280 minutes weekly</p>
                    </div>
                    <div className="bg-white rounded-lg p-4">
                        <p className="text-sm text-gray-600 mb-1">😊 Mood Improvement</p>
                        <p className="text-lg font-bold text-purple-600">38% improvement</p>
                        <p className="text-xs text-gray-500 mt-1">Mood scores improved from 5.5 to 7.6 on average</p>
                    </div>
                    <div className="bg-white rounded-lg p-4">
                        <p className="text-sm text-gray-600 mb-1">😴 Better Sleep</p>
                        <p className="text-lg font-bold text-indigo-600">29% increase</p>
                        <p className="text-xs text-gray-500 mt-1">Sleep quality improved from 5.8 to 7.5 hours nightly</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;

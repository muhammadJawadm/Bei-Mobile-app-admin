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
    const [painVariable, setPainVariable] = useState('averagePain');
    const [engagementMetric, setEngagementMetric] = useState('dau');
    const [evolutionVar1, setEvolutionVar1] = useState('exercise');
    const [evolutionVar2, setEvolutionVar2] = useState('mood');
    const [evolutionVar3, setEvolutionVar3] = useState('sleep');

    const handleExport = () => {
        exportAnalyticsReport(analyticsData);
    };

    // Pain Trends Chart - Dynamic based on selection
    const painVariableOptions: { [key: string]: { label: string; data: number[]; color: string } } = {
        averagePain: { label: 'Average Pain Level', data: analyticsData.painTrends.data, color: 'rgb(239, 68, 68)' },
        maxPain: { label: 'Maximum Pain Level', data: [7.2, 6.8, 7.5, 6.9, 7.1, 6.5, 6.8, 6.3, 6.6, 5.9, 6.2, 5.8], color: 'rgb(220, 38, 38)' },
        minPain: { label: 'Minimum Pain Level', data: [4.5, 4.2, 4.8, 4.3, 4.6, 4.0, 4.2, 3.8, 3.9, 3.5, 3.6, 3.2], color: 'rgb(252, 165, 165)' },
        painFrequency: { label: 'Pain Frequency (episodes/day)', data: [3.5, 3.2, 3.8, 3.1, 3.4, 2.8, 3.0, 2.5, 2.7, 2.2, 2.4, 2.0], color: 'rgb(185, 28, 28)' },
    };

    const painTrendsData = {
        labels: analyticsData.painTrends.labels,
        datasets: [
            {
                label: painVariableOptions[painVariable].label,
                data: painVariableOptions[painVariable].data,
                borderColor: painVariableOptions[painVariable].color,
                backgroundColor: painVariableOptions[painVariable].color.replace('rgb', 'rgba').replace(')', ', 0.1)'),
                tension: 0.4,
            },
        ],
    };

    // Cognitive Performance Chart - By Module (Pie Chart)
    const cognitiveData = {
        labels: ['Exercise Module', 'Education Module', 'Cognitive/Mental Training Module', 'Chat Interaction'],
        datasets: [
            {
                label: 'Usage by Module',
                data: [35, 25, 28, 12],
                backgroundColor: [
                    'rgba(79, 70, 229, 0.8)',
                    'rgba(124, 58, 237, 0.8)',
                    'rgba(236, 72, 153, 0.8)',
                    'rgba(59, 130, 246, 0.8)',
                ],
                borderColor: [
                    'rgb(79, 70, 229)',
                    'rgb(124, 58, 237)',
                    'rgb(236, 72, 153)',
                    'rgb(59, 130, 246)',
                ],
                borderWidth: 2,
            },
        ],
    };

    // Exercise, Mood, Sleep Evolution - Dynamic based on selection
    const evolutionVariableOptions: { [key: string]: { label: string; data: number[]; color: string } } = {
        exercise: { label: 'Exercise (mins)', data: analyticsData.exerciseMoodSleep.exercise, color: 'rgb(59, 130, 246)' },
        mood: { label: 'Mood Score', data: analyticsData.exerciseMoodSleep.mood, color: 'rgb(34, 197, 94)' },
        sleep: { label: 'Sleep (hours)', data: analyticsData.exerciseMoodSleep.sleep, color: 'rgb(168, 85, 247)' },
    };

    const selectedVars = [evolutionVar1, evolutionVar2, evolutionVar3].filter((v, i, arr) => arr.indexOf(v) === i); // Remove duplicates

    const evolutionData = {
        labels: analyticsData.exerciseMoodSleep.labels,
        datasets: selectedVars.map(varKey => ({
            label: evolutionVariableOptions[varKey].label,
            data: evolutionVariableOptions[varKey].data,
            borderColor: evolutionVariableOptions[varKey].color,
            backgroundColor: evolutionVariableOptions[varKey].color.replace('rgb', 'rgba').replace(')', ', 0.1)'),
            tension: 0.4,
        })),
    };

    // User Engagement Chart - Dynamic based on metric selection
    const engagementMetricOptions: { [key: string]: { label: string; data: number[] } } = {
        dau: { label: 'Daily Active Users', data: analyticsData.userEngagement.data },
        wau: { label: 'Weekly Active Users', data: [1250, 1280, 1320, 1290, 1350, 1400, 1380] },
        mau: { label: 'Monthly Active Users', data: [4200, 4350, 4500, 4480, 4620, 4750, 4890] },
        ratio: { label: 'DAU/MAU Ratio (%)', data: [18.5, 19.2, 19.8, 20.1, 20.5, 21.2, 21.8] },
        inactive7: { label: 'Inactive Users (>7 days)', data: [320, 310, 295, 280, 275, 260, 245] },
        inactive14: { label: 'Inactive Users (>14 days)', data: [580, 560, 540, 520, 510, 490, 470] },
        inactive30: { label: 'Inactive Users (>30 days)', data: [890, 870, 850, 830, 810, 790, 760] },
    };

    const engagementData = {
        labels: analyticsData.userEngagement.labels,
        datasets: [
            {
                label: engagementMetricOptions[engagementMetric].label,
                data: engagementMetricOptions[engagementMetric].data,
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
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Average Pain Level Over Time</h3>
                        <select
                            value={painVariable}
                            onChange={(e) => setPainVariable(e.target.value)}
                            className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="averagePain">Average Pain Level</option>
                            <option value="maxPain">Maximum Pain Level</option>
                            <option value="minPain">Minimum Pain Level</option>
                            <option value="painFrequency">Pain Frequency</option>
                        </select>
                    </div>
                    <Line data={painTrendsData} options={lineChartOptions} />
                </div>

                {/* User Engagement */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">User Engagement Metrics</h3>
                        <select
                            value={engagementMetric}
                            onChange={(e) => setEngagementMetric(e.target.value)}
                            className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="dau">Daily Active Users</option>
                            <option value="wau">Weekly Active Users</option>
                            <option value="mau">Monthly Active Users</option>
                            <option value="ratio">DAU/MAU Ratio</option>
                            <option value="inactive7">Inactive Users (7 days)</option>
                            <option value="inactive14">Inactive Users (14 days)</option>
                            <option value="inactive30">Inactive Users (30 days)</option>
                        </select>
                    </div>
                    <Bar data={engagementData} options={lineChartOptions} />
                </div>
            </div>

            {/* Cognitive Performance and Evolution */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 lg:col-span-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Usage by Module</h3>
                    <Doughnut data={cognitiveData} />
                </div>

                {/* Exercise, Mood, Sleep Evolution */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 lg:col-span-2">
                    <div className="mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Exercise, Mood & Sleep Evolution</h3>
                        <div className="grid grid-cols-3 gap-3">
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Variable 1</label>
                                <select
                                    value={evolutionVar1}
                                    onChange={(e) => setEvolutionVar1(e.target.value)}
                                    className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                >
                                    <option value="exercise">Exercise</option>
                                    <option value="mood">Mood Score</option>
                                    <option value="sleep">Sleep</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Variable 2</label>
                                <select
                                    value={evolutionVar2}
                                    onChange={(e) => setEvolutionVar2(e.target.value)}
                                    className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                >
                                    <option value="exercise">Exercise</option>
                                    <option value="mood">Mood Score</option>
                                    <option value="sleep">Sleep</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Variable 3</label>
                                <select
                                    value={evolutionVar3}
                                    onChange={(e) => setEvolutionVar3(e.target.value)}
                                    className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                >
                                    <option value="exercise">Exercise</option>
                                    <option value="mood">Mood Score</option>
                                    <option value="sleep">Sleep</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <Line data={evolutionData} options={lineChartOptions} />
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

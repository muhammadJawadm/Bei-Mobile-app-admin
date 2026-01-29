import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaUser, FaFileAlt, FaCalendar, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import { questionnaireResponses } from '../../utils/dummyData';
import ExportButton from '../../components/ExportButton';
import { exportToPDF } from '../../utils/exportUtils';

const QuestionnaireDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const response = questionnaireResponses.find(r => r.id === id);

    if (!response) {
        return (
            <div className="p-6">
                <div className="text-center py-12">
                    <p className="text-gray-600">Questionnaire not found</p>
                    <button
                        onClick={() => navigate('/questionnaires')}
                        className="mt-4 text-indigo-600 hover:text-indigo-700"
                    >
                        Return to Questionnaires
                    </button>
                </div>
            </div>
        );
    }

    const handleExport = () => {
        const exportData = Object.entries(response.responses).map(([question, answer]) => ({
            question,
            answer: answer.toString(),
        }));

        const columns = [
            { header: 'Question', dataKey: 'question' },
            { header: 'Answer', dataKey: 'answer' },
        ];

        exportToPDF(
            exportData,
            columns,
            `questionnaire_${response.id}`,
            `${response.questionnaireName} - ${response.userName}`
        );
    };

    const domainColors: Record<string, string> = {
        Biological: 'from-red-500 to-red-600',
        Psychological: 'from-purple-500 to-purple-600',
        Social: 'from-blue-500 to-blue-600',
    };

    return (
        <div className="p-6">
            {/* Header */}
            <div className="mb-6">
                <button
                    onClick={() => navigate('/questionnaires')}
                    className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 mb-4"
                >
                    <FaArrowLeft />
                    <span>Back to Questionnaires</span>
                </button>
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">{response.questionnaireName}</h1>
                        <p className="text-gray-600 mt-1">Response ID: {response.id}</p>
                    </div>
                    <ExportButton onExport={handleExport} label="Export Response" />
                </div>
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                            <FaUser className="text-indigo-600 text-xl" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Respondent</p>
                            <p className="font-medium text-gray-900">{response.userName}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 bg-gradient-to-br ${domainColors[response.domain]} rounded-lg flex items-center justify-center`}>
                            <FaFileAlt className="text-white text-xl" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Domain</p>
                            <p className="font-medium text-gray-900">{response.domain}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                            <FaCalendar className="text-gray-600 text-xl" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Date</p>
                            <p className="font-medium text-gray-900">{response.date}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${response.status === 'Complete' ? 'bg-green-100' : 'bg-yellow-100'
                            }`}>
                            {response.status === 'Complete' ? (
                                <FaCheckCircle className="text-green-600 text-xl" />
                            ) : (
                                <FaExclamationTriangle className="text-yellow-600 text-xl" />
                            )}
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Status</p>
                            <p className={`font-medium ${response.status === 'Complete' ? 'text-green-600' : 'text-yellow-600'
                                }`}>
                                {response.status}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Score Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Overall Score</h2>
                <div className="flex items-center gap-4">
                    <div className="flex-1">
                        <div className="w-full bg-gray-200 rounded-full h-4">
                            <div
                                className="bg-indigo-600 h-4 rounded-full transition-all duration-500"
                                style={{ width: `${response.score}%` }}
                            />
                        </div>
                    </div>
                    <div className="text-3xl font-bold text-indigo-600">{response.score}%</div>
                </div>
            </div>


            {/* Biological Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Biological</h2>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Pain Diary Table */}
                    <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-semibold text-gray-900">Pain Diary</h3>
                            <button className="text-xs text-blue-600 hover:text-blue-700">Load & Month ↓</button>
                        </div>
                        <table className="w-full text-xs">
                            <thead>
                                <tr className="border-b border-gray-300">
                                    <th className="text-left py-2 px-2 font-semibold text-gray-900">Intensity</th>
                                    <th className="text-center py-2 px-2 font-semibold text-gray-900">When</th>
                                    <th className="text-center py-2 px-2 font-semibold text-gray-900">Notes</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[
                                    { part: 'part of the body (i.e.: shoulder pain)', intensity: '3/10', when: 'Day & exact Time', notes: '"I took this med."', color: 'bg-green-100 text-green-700' },
                                    { part: 'part of the body (i.e.: shoulder pain)', intensity: '3/10', when: 'Day & exact Time', notes: 'No', color: 'bg-green-100 text-green-700' },
                                    { part: 'part of the body (i.e.: shoulder pain)', intensity: '6/10', when: 'Day & exact Time', notes: 'Yes', color: 'bg-yellow-100 text-yellow-700' },
                                    { part: 'part of the body (i.e.: shoulder pain)', intensity: '8/10', when: '26/01/2025', notes: 'No', color: 'bg-red-100 text-red-700' },
                                    { part: 'part of the body (i.e.: shoulder pain)', intensity: '-', when: '25/01/2025', notes: 'No', color: 'bg-gray-100 text-gray-700' },
                                    { part: 'part of the body (i.e.: shoulder pain)', intensity: '-', when: '24/01/2025', notes: 'No', color: 'bg-gray-100 text-gray-700' },
                                ].map((item, idx) => (
                                    <tr key={idx} className="border-b border-gray-200">
                                        <td className="py-2 px-2">
                                            <span className={`px-2 py-0.5 rounded text-xs font-semibold ${item.color}`}>
                                                {item.intensity}
                                            </span>
                                        </td>
                                        <td className="py-2 px-2 text-center text-gray-700">{item.when}</td>
                                        <td className="py-2 px-2 text-center text-gray-700">{item.notes}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Symptoms Table */}
                    <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-semibold text-gray-900">Symptoms</h3>
                            <button className="text-xs text-blue-600 hover:text-blue-700">Load & Month ↓</button>
                        </div>
                        <table className="w-full text-xs">
                            <thead>
                                <tr className="border-b border-gray-300">
                                    <th className="text-left py-2 px-2 font-semibold text-gray-900">When</th>
                                    <th className="text-center py-2 px-2 font-semibold text-gray-900">How many times</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[
                                    { symptom: 'i.e headache', when: 'Day & exact Time', times: '1' },
                                    { symptom: 'anxiety', when: 'Day & exact Time', times: '32' },
                                    { symptom: 'fibra fog', when: '', times: '' },
                                    { symptom: 'One to one Maths tuition', when: '26/01/2025', times: '' },
                                    { symptom: 'One to one Maths tuition', when: '25/01/2025', times: '' },
                                    { symptom: 'One to one Maths tuition', when: '24/01/2025', times: '' },
                                ].map((item, idx) => (
                                    <tr key={idx} className="border-b border-gray-200">
                                        <td className="py-2 px-2 text-gray-700">{item.when}</td>
                                        <td className="py-2 px-2 text-center text-gray-700">{item.times}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Bar Chart */}
                    <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-semibold text-gray-900">Select questionnaire</h3>
                            <button className="text-xs text-blue-600 hover:text-blue-700">Load & Month ↓</button>
                        </div>
                        <div className="h-48 bg-white rounded p-2">
                            <div className="flex items-end justify-between gap-1" style={{ height: '160px' }}>
                                {[
                                    { month: 'Apr', value: 60 },
                                    { month: 'May', value: 70 },
                                    { month: 'Jun', value: 75 },
                                    { month: 'Jul', value: 90 },
                                    { month: 'Aug', value: 65 },
                                    { month: 'Sep', value: 80 },
                                    { month: 'Oct', value: 70 },
                                    { month: 'Nov', value: 85 },
                                ].map((item, idx) => (
                                    <div key={idx} className="flex-1 flex flex-col justify-end items-center">
                                        <div
                                            className={`w-full ${idx === 3 ? 'bg-gray-800' : 'bg-gradient-to-t from-purple-500 to-purple-400'} rounded-t`}
                                            style={{ height: `${Math.round(item.value * 1.6)}px` }}
                                        ></div>
                                    </div>
                                ))}
                            </div>
                            <div className="flex items-center justify-between gap-1 mt-2">
                                {['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'].map((month, idx) => (
                                    <span key={idx} className="text-xs text-gray-600 font-medium flex-1 text-center">{month}</span>
                                ))}
                            </div>
                        </div>
                        <div className="mt-4 space-y-2">
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-gray-600">Select questionnaire</span>
                                <span className="text-gray-600">Select questionnaire</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Psychological Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Psychological</h2>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left - Bar Chart */}
                    <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-semibold text-gray-900">Select questionnaire</h3>
                            <button className="text-xs text-blue-600 hover:text-blue-700">Load & Month ↓</button>
                        </div>
                        <div className="h-48 bg-white rounded p-2">
                            <div className="flex items-end justify-between gap-1" style={{ height: '160px' }}>
                                {[
                                    { month: 'Apr', value: 55 },
                                    { month: 'May', value: 65 },
                                    { month: 'Jun', value: 75 },
                                    { month: 'Jul', value: 88 },
                                    { month: 'Aug', value: 70 },
                                    { month: 'Sep', value: 60 },
                                    { month: 'Oct', value: 68 },
                                    { month: 'Nov', value: 78 },
                                ].map((item, idx) => (
                                    <div key={idx} className="flex-1 flex flex-col justify-end items-center">
                                        <div
                                            className={`w-full ${idx === 3 ? 'bg-gray-800' : 'bg-gradient-to-t from-purple-500 to-purple-400'} rounded-t`}
                                            style={{ height: `${Math.round(item.value * 1.6)}px` }}
                                        ></div>
                                    </div>
                                ))}
                            </div>
                            <div className="flex items-center justify-between gap-1 mt-2">
                                {['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'].map((month, idx) => (
                                    <span key={idx} className="text-xs text-gray-600 font-medium flex-1 text-center">{month}</span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Middle - Line Chart */}
                    <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-semibold text-gray-900">Select questionnaires</h3>
                            <button className="text-xs text-blue-600 hover:text-blue-700">Load & Month ↓</button>
                        </div>
                        <div className="h-48 bg-white rounded p-4 relative">
                            <svg width="100%" height="100%" viewBox="0 0 300 150">
                                {/* Grid lines */}
                                <line x1="0" y1="140" x2="300" y2="140" stroke="#e5e7eb" strokeWidth="1" />
                                <line x1="0" y1="105" x2="300" y2="105" stroke="#e5e7eb" strokeWidth="1" />
                                <line x1="0" y1="70" x2="300" y2="70" stroke="#e5e7eb" strokeWidth="1" />
                                <line x1="0" y1="35" x2="300" y2="35" stroke="#e5e7eb" strokeWidth="1" />
                                {/* Blue line (upper) */}
                                <path d="M 20,100 L 60,80 L 100,70 L 140,50 L 180,45 L 220,40 L 260,35" stroke="#3b82f6" strokeWidth="2" fill="none" />
                                {/* Purple line (lower) */}
                                <path d="M 20,120 L 60,115 L 100,110 L 140,105 L 180,100 L 220,98 L 260,95" stroke="#8b5cf6" strokeWidth="2" fill="none" />
                                {/* Shaded area */}
                                <path d="M 20,120 L 60,115 L 100,110 L 140,105 L 180,100 L 220,98 L 260,95 L 260,140 L 20,140 Z" fill="#e0e7ff" opacity="0.3" />
                            </svg>
                        </div>
                    </div>

                    {/* Right - Summary Card */}
                    <div className="bg-gray-50 rounded-lg p-4 flex flex-col justify-center">
                        <div className="bg-white rounded-lg p-6 text-center">
                            <p className="text-sm text-gray-600 mb-2">Completed <span className="font-semibold">questionnaires</span></p>
                            <div className="flex items-baseline justify-center gap-2 mb-2">
                                <span className="text-4xl font-bold text-gray-900">10</span>
                                <span className="text-2xl text-gray-500">/20</span>
                            </div>
                            <p className="text-xs text-gray-500">📈 +4.50% from last week</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Social Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Social</h2>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left - Bar Chart */}
                    <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-semibold text-gray-900">Select questionnaire</h3>
                            <button className="text-xs text-blue-600 hover:text-blue-700">Load & Month ↓</button>
                        </div>
                        <div className="h-48 bg-white rounded p-2">
                            <div className="flex items-end justify-between gap-1" style={{ height: '160px' }}>
                                {[
                                    { month: 'Apr', value: 50 },
                                    { month: 'May', value: 70 },
                                    { month: 'Jun', value: 80 },
                                    { month: 'Jul', value: 85 },
                                    { month: 'Aug', value: 65 },
                                    { month: 'Sep', value: 75 },
                                    { month: 'Oct', value: 70 },
                                    { month: 'Nov', value: 82 },
                                ].map((item, idx) => (
                                    <div key={idx} className="flex-1 flex flex-col justify-end items-center">
                                        <div
                                            className={`w-full ${idx === 3 ? 'bg-gray-800' : 'bg-gradient-to-t from-purple-500 to-purple-400'} rounded-t`}
                                            style={{ height: `${Math.round(item.value * 1.6)}px` }}
                                        ></div>
                                    </div>
                                ))}
                            </div>
                            <div className="flex items-center justify-between gap-1 mt-2">
                                {['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'].map((month, idx) => (
                                    <span key={idx} className="text-xs text-gray-600 font-medium flex-1 text-center">{month}</span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Middle - Line Chart */}
                    <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-semibold text-gray-900">Select questionnaires</h3>
                            <button className="text-xs text-blue-600 hover:text-blue-700">Load & Month ↓</button>
                        </div>
                        <div className="h-48 bg-white rounded p-4 relative">
                            <svg width="100%" height="100%" viewBox="0 0 300 150">
                                {/* Grid lines */}
                                <line x1="0" y1="140" x2="300" y2="140" stroke="#e5e7eb" strokeWidth="1" />
                                <line x1="0" y1="105" x2="300" y2="105" stroke="#e5e7eb" strokeWidth="1" />
                                <line x1="0" y1="70" x2="300" y2="70" stroke="#e5e7eb" strokeWidth="1" />
                                <line x1="0" y1="35" x2="300" y2="35" stroke="#e5e7eb" strokeWidth="1" />
                                {/* Blue line (upper) */}
                                <path d="M 20,110 L 60,95 L 100,85 L 140,75 L 180,65 L 220,58 L 260,52" stroke="#3b82f6" strokeWidth="2" fill="none" />
                                {/* Purple line (lower) */}
                                <path d="M 20,125 L 60,122 L 100,118 L 140,115 L 180,110 L 220,108 L 260,105" stroke="#8b5cf6" strokeWidth="2" fill="none" />
                                {/* Shaded area */}
                                <path d="M 20,125 L 60,122 L 100,118 L 140,115 L 180,110 L 220,108 L 260,105 L 260,140 L 20,140 Z" fill="#e0e7ff" opacity="0.3" />
                            </svg>
                        </div>
                    </div>

                    {/* Right - Summary Card */}
                    <div className="bg-gray-50 rounded-lg p-4 flex flex-col justify-center">
                        <div className="bg-white rounded-lg p-6 text-center">
                            <p className="text-sm text-gray-600 mb-2">Completed <span className="font-semibold">questionnaires</span></p>
                            <div className="flex items-baseline justify-center gap-2 mb-2">
                                <span className="text-4xl font-bold text-gray-900">10</span>
                                <span className="text-2xl text-gray-500">/20</span>
                            </div>
                            <p className="text-xs text-gray-500">📈 +4.50% from last week</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuestionnaireDetail;

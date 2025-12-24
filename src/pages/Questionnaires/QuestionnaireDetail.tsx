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

            {/* Responses */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Detailed Responses</h2>
                <div className="space-y-4">
                    {Object.entries(response.responses).map(([question, answer], idx) => (
                        <div
                            key={idx}
                            className="border-l-4 border-indigo-500 bg-gray-50 p-4 rounded-r-lg"
                        >
                            <p className="text-sm font-medium text-gray-700 mb-2">{question}</p>
                            <p className={`text-gray-900 ${answer === 'Not answered' ? 'italic text-gray-500' : ''
                                }`}>
                                {answer}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default QuestionnaireDetail;

import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaExclamationTriangle, FaCheckCircle, FaFileAlt, FaUser, FaCalendar, FaPlus, FaTrash } from 'react-icons/fa';
import { questionnaireResponses } from '../../utils/dummyData';
import { exportQuestionnaireData } from '../../utils/exportUtils';
import FilterPanel from '../../components/FilterPanel';
import DataTable from '../../components/DataTable';
import ExportButton from '../../components/ExportButton';

interface Question {
    id: string;
    text: string;
    type: 'text' | 'multiple-choice' | 'scale' | 'yes-no';
    options?: string[];
}

const Questionnaires: React.FC = () => {
    const navigate = useNavigate();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [questionnaireData, setQuestionnaireData] = useState({
        title: '',
        domain: 'Biological',
        description: '',
    });
    const [questions, setQuestions] = useState<Question[]>([]);
    const [filters, setFilters] = useState({
        search: '',
        domain: '',
        status: '',
        dateFrom: '',
        dateTo: '',
    });

    // Filter questionnaires
    const filteredQuestionnaires = useMemo(() => {
        return questionnaireResponses.filter(response => {
            const matchesSearch =
                response.userName.toLowerCase().includes(filters.search.toLowerCase()) ||
                response.questionnaireName.toLowerCase().includes(filters.search.toLowerCase());

            const matchesDomain = !filters.domain || response.domain === filters.domain;
            const matchesStatus = !filters.status || response.status === filters.status;

            const responseDate = new Date(response.date);
            const matchesDateFrom = !filters.dateFrom || responseDate >= new Date(filters.dateFrom);
            const matchesDateTo = !filters.dateTo || responseDate <= new Date(filters.dateTo);

            return matchesSearch && matchesDomain && matchesStatus && matchesDateFrom && matchesDateTo;
        });
    }, [filters]);

    const handleFilterChange = (name: string, value: string) => {
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleClearFilters = () => {
        setFilters({ search: '', domain: '', status: '', dateFrom: '', dateTo: '' });
    };

    const handleExport = (format: 'csv' | 'pdf') => {
        exportQuestionnaireData(filteredQuestionnaires, format);
    };

    const filterConfigs = [
        {
            type: 'search' as const,
            name: 'search',
            label: 'Search',
            placeholder: 'Search by user or questionnaire...',
        },
        {
            type: 'select' as const,
            name: 'domain',
            label: 'Domain',
            options: [
                { label: 'Biological', value: 'Biological' },
                { label: 'Psychological', value: 'Psychological' },
                { label: 'Social', value: 'Social' },
            ],
        },
        {
            type: 'select' as const,
            name: 'status',
            label: 'Status',
            options: [
                { label: 'Complete', value: 'Complete' },
                { label: 'Incomplete', value: 'Incomplete' },
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
            key: 'id',
            label: 'ID',
            sortable: true,
        },
        {
            key: 'userName',
            label: 'User',
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
            key: 'questionnaireName',
            label: 'Questionnaire',
            sortable: true,
            render: (value: string) => (
                <div className="flex items-center gap-2">
                    <FaFileAlt className="text-gray-400" />
                    <span>{value}</span>
                </div>
            ),
        },
        {
            key: 'domain',
            label: 'Domain',
            sortable: true,
            render: (value: string) => {
                const colors: Record<string, string> = {
                    Biological: 'bg-red-100 text-red-800',
                    Psychological: 'bg-purple-100 text-purple-800',
                    Social: 'bg-blue-100 text-blue-800',
                };
                return (
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${colors[value]}`}>
                        {value}
                    </span>
                );
            },
        },
        {
            key: 'date',
            label: 'Date',
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
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${value === 'Complete'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                        }`}
                >
                    {value === 'Complete' ? (
                        <FaCheckCircle className="text-green-600" />
                    ) : (
                        <FaExclamationTriangle className="text-yellow-600" />
                    )}
                    {value}
                </span>
            ),
        },
        {
            key: 'score',
            label: 'Score',
            sortable: true,
            render: (value: number) => (
                <div className="flex items-center gap-2">
                    <div className="w-full bg-gray-200 rounded-full h-2 max-w-[100px]">
                        <div
                            className="bg-indigo-600 h-2 rounded-full"
                            style={{ width: `${value}%` }}
                        />
                    </div>
                    <span className="text-sm font-medium text-gray-700">{value}%</span>
                </div>
            ),
        },
    ];

    return (
        <div className="p-6">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Questionnaires & Assessments</h1>
                    <p className="text-gray-600 mt-1">View and manage questionnaire responses</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                        <FaPlus />
                        <span>Create Questionnaire</span>
                    </button>
                    <ExportButton onExport={handleExport} label="Export Responses" />
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Total Responses</p>
                            <p className="text-2xl font-bold text-gray-900">{questionnaireResponses.length}</p>
                        </div>
                        <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                            <FaFileAlt className="text-indigo-600 text-xl" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Complete</p>
                            <p className="text-2xl font-bold text-green-600">
                                {questionnaireResponses.filter(r => r.status === 'Complete').length}
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
                            <p className="text-sm text-gray-600">Incomplete</p>
                            <p className="text-2xl font-bold text-yellow-600">
                                {questionnaireResponses.filter(r => r.status === 'Incomplete').length}
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                            <FaExclamationTriangle className="text-yellow-600 text-xl" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Filtered Results</p>
                            <p className="text-2xl font-bold text-indigo-600">{filteredQuestionnaires.length}</p>
                        </div>
                        <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                            <FaFileAlt className="text-indigo-600 text-xl" />
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

            {/* Questionnaires Table */}
            <DataTable
                data={filteredQuestionnaires}
                columns={columns}
                pageSize={10}
                onRowClick={(response) => navigate(`/questionnaires/${response.id}`)}
            />

            {/* Create Questionnaire Modal */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Create New Questionnaire</h3>

                        {/* Basic Info */}
                        <div className="space-y-4 mb-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                <input
                                    type="text"
                                    value={questionnaireData.title}
                                    onChange={(e) => setQuestionnaireData({ ...questionnaireData, title: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                    placeholder="e.g., Daily Pain Assessment"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Domain</label>
                                <select
                                    value={questionnaireData.domain}
                                    onChange={(e) => setQuestionnaireData({ ...questionnaireData, domain: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                >
                                    <option value="Biological">Biological</option>
                                    <option value="Psychological">Psychological</option>
                                    <option value="Social">Social</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    value={questionnaireData.description}
                                    onChange={(e) => setQuestionnaireData({ ...questionnaireData, description: e.target.value })}
                                    rows={2}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                    placeholder="Brief description of the questionnaire"
                                />
                            </div>
                        </div>

                        {/* Questions Section */}
                        <div className="mb-6">
                            <div className="flex justify-between items-center mb-3">
                                <h4 className="text-lg font-semibold text-gray-900">Questions</h4>
                                <button
                                    onClick={() => setQuestions([...questions, { id: Date.now().toString(), text: '', type: 'text' }])}
                                    className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                                >
                                    <FaPlus />
                                    <span>Add Question</span>
                                </button>
                            </div>

                            <div className="space-y-3">
                                {questions.map((question, index) => (
                                    <div key={question.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                        <div className="flex items-start gap-3 mb-3">
                                            <span className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                                                {index + 1}
                                            </span>
                                            <div className="flex-1 space-y-3">
                                                <input
                                                    type="text"
                                                    value={question.text}
                                                    onChange={(e) => {
                                                        const updated = [...questions];
                                                        updated[index].text = e.target.value;
                                                        setQuestions(updated);
                                                    }}
                                                    placeholder="Enter question text"
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                                />
                                                <select
                                                    value={question.type}
                                                    onChange={(e) => {
                                                        const updated = [...questions];
                                                        updated[index].type = e.target.value as any;
                                                        setQuestions(updated);
                                                    }}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                                >
                                                    <option value="text">Text Response</option>
                                                    <option value="multiple-choice">Multiple Choice</option>
                                                    <option value="scale">Scale (1-10)</option>
                                                    <option value="yes-no">Yes/No</option>
                                                </select>
                                                {question.type === 'multiple-choice' && (
                                                    <div className="pl-4">
                                                        <label className="block text-xs font-medium text-gray-600 mb-1">Options (comma-separated)</label>
                                                        <input
                                                            type="text"
                                                            placeholder="Option 1, Option 2, Option 3"
                                                            onChange={(e) => {
                                                                const updated = [...questions];
                                                                updated[index].options = e.target.value.split(',').map(o => o.trim());
                                                                setQuestions(updated);
                                                            }}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                            <button
                                                onClick={() => setQuestions(questions.filter((_, i) => i !== index))}
                                                className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                {questions.length === 0 && (
                                    <div className="text-center py-8 text-gray-500">
                                        <FaFileAlt className="mx-auto text-4xl mb-2 text-gray-300" />
                                        <p>No questions added yet. Click "Add Question" to start.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3">
                            <button
                                onClick={() => {
                                    setIsCreateModalOpen(false);
                                    setQuestionnaireData({ title: '', domain: 'Biological', description: '' });
                                    setQuestions([]);
                                }}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    alert(`Questionnaire "${questionnaireData.title}" created with ${questions.length} questions!`);
                                    setIsCreateModalOpen(false);
                                    setQuestionnaireData({ title: '', domain: 'Biological', description: '' });
                                    setQuestions([]);
                                }}
                                disabled={!questionnaireData.title || questions.length === 0}
                                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Create Questionnaire
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Questionnaires;

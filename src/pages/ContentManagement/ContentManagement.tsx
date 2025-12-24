import React, { useState } from 'react';
import { FaPlus, FaEdit, FaTrash, FaPlay, FaUsers, FaStar, FaEye, FaClock } from 'react-icons/fa';
import {
    physicalExercises,
    educationalModules,
} from '../../utils/dummyData';

type ContentTab = 'exercises' | 'educational';

const ContentManagement: React.FC = () => {
    const [activeTab, setActiveTab] = useState<ContentTab>('exercises');
    const [selectedItem, setSelectedItem] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const handleAdd = () => {
        setSelectedItem(null);
        setIsModalOpen(true);
    };

    const handleEdit = (item: any) => {
        setSelectedItem(item);
        setIsModalOpen(true);
    };

    const handleDelete = (item: any) => {
        setSelectedItem(item);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        // In real app, would delete from state/API
        setIsDeleteModalOpen(false);
        setSelectedItem(null);
    };

    return (
        <div className="p-6">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Content Management</h1>
                <p className="text-gray-600 mt-1">Manage physical exercises, cognitive training, and educational content</p>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
                <div className="border-b border-gray-200">
                    <div className="flex">
                        <button
                            onClick={() => setActiveTab('exercises')}
                            className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${activeTab === 'exercises'
                                ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50'
                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                }`}
                        >
                            Physical Exercises ({physicalExercises.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('educational')}
                            className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${activeTab === 'educational'
                                ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50'
                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                }`}
                        >
                            Educational Modules ({educationalModules.length})
                        </button>
                    </div>
                </div>

                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold text-gray-900">
                            {activeTab === 'exercises' && 'Physical Exercises'}
                            {activeTab === 'educational' && 'Educational Content'}
                        </h2>
                        <button
                            onClick={handleAdd}
                            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                            <FaPlus />
                            <span>Add New</span>
                        </button>
                    </div>

                    {/* Physical Exercises Grid */}
                    {activeTab === 'exercises' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {physicalExercises.map((exercise) => (
                                <div
                                    key={exercise.id}
                                    className="bg-gray-50 rounded-lg overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow"
                                >
                                    <div className="relative h-48 bg-gray-300">
                                        <img
                                            src={exercise.thumbnailUrl}
                                            alt={exercise.title}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                            <FaPlay className="text-white text-4xl" />
                                        </div>
                                        <div className="absolute top-3 right-3">
                                            <span className="px-2 py-1 bg-indigo-600 text-white text-xs rounded-full">
                                                {exercise.difficulty}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{exercise.title}</h3>
                                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{exercise.description}</p>
                                        <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                                            <div className="flex items-center gap-1">
                                                <FaClock />
                                                <span>{exercise.duration}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <FaEye />
                                                <span>{exercise.views}</span>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleEdit(exercise)}
                                                className="flex-1 px-3 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors text-sm font-medium"
                                            >
                                                <FaEdit className="inline mr-1" /> Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(exercise)}
                                                className="flex-1 px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
                                            >
                                                <FaTrash className="inline mr-1" /> Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Educational Modules Grid */}
                    {activeTab === 'educational' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {educationalModules.map((module) => (
                                <div
                                    key={module.id}
                                    className="bg-white rounded-lg overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow"
                                >
                                    <div className="relative h-48 bg-gray-300">
                                        <img
                                            src={module.imageUrl}
                                            alt={module.title}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute top-3 left-3">
                                            <span className="px-2 py-1 bg-green-600 text-white text-xs rounded-full">
                                                {module.type}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{module.title}</h3>
                                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{module.description}</p>
                                        <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                                            <div className="flex items-center gap-1">
                                                <FaClock />
                                                <span>{module.duration}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <FaUsers />
                                                <span>{module.completed}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <FaStar className="text-yellow-500" />
                                                <span>{module.rating}</span>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleEdit(module)}
                                                className="flex-1 px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm font-medium"
                                            >
                                                <FaEdit className="inline mr-1" /> Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(module)}
                                                className="flex-1 px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
                                            >
                                                <FaTrash className="inline mr-1" /> Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Confirm Delete</h3>
                        <p className="text-gray-600 mb-6">
                            Are you sure you want to delete "{selectedItem?.title}"? This action cannot be undone.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setIsDeleteModalOpen(false)}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add/Edit Modal Placeholder */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">
                            {selectedItem ? 'Edit' : 'Add New'} {activeTab === 'exercises' ? 'Exercise' : 'Educational Module'}
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                <input
                                    type="text"
                                    defaultValue={selectedItem?.title || ''}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    defaultValue={selectedItem?.description || ''}
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                                    <input
                                        type="text"
                                        defaultValue={selectedItem?.duration || ''}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        {activeTab === 'exercises' ? 'Difficulty' : 'Type'}
                                    </label>
                                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                                        <option>Beginner</option>
                                        <option>Intermediate</option>
                                        <option>Advanced</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ContentManagement;

import React from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';

interface FilterOption {
    label: string;
    value: string;
}

interface FilterConfig {
    type: 'search' | 'select' | 'date';
    name: string;
    label: string;
    placeholder?: string;
    options?: FilterOption[];
}

interface FilterPanelProps {
    filters: FilterConfig[];
    values: Record<string, string>;
    onChange: (name: string, value: string) => void;
    onClear: () => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ filters, values, onChange, onClear }) => {
    const hasActiveFilters = Object.values(values).some(value => value !== '');

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {filters.map((filter) => (
                    <div key={filter.name}>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {filter.label}
                        </label>
                        {filter.type === 'search' && (
                            <div className="relative">
                                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    value={values[filter.name] || ''}
                                    onChange={(e) => onChange(filter.name, e.target.value)}
                                    placeholder={filter.placeholder}
                                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>
                        )}
                        {filter.type === 'select' && (
                            <select
                                value={values[filter.name] || ''}
                                onChange={(e) => onChange(filter.name, e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                <option value="">All</option>
                                {filter.options?.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        )}
                        {filter.type === 'date' && (
                            <input
                                type="date"
                                value={values[filter.name] || ''}
                                onChange={(e) => onChange(filter.name, e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        )}
                    </div>
                ))}
            </div>

            {hasActiveFilters && (
                <div className="mt-4 flex justify-end">
                    <button
                        onClick={onClear}
                        className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <FaTimes />
                        <span>Clear Filters</span>
                    </button>
                </div>
            )}
        </div>
    );
};

export default FilterPanel;

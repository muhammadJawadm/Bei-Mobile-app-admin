import React, { useState } from 'react';
import { FaFileDownload, FaFileCsv, FaFilePdf } from 'react-icons/fa';

interface ExportButtonProps {
    onExport: (format: 'csv' | 'pdf') => void;
    disabled?: boolean;
    label?: string;
}

const ExportButton: React.FC<ExportButtonProps> = ({ onExport, disabled = false, label = "Export" }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [exporting, setExporting] = useState(false);

    const handleExport = async (format: 'csv' | 'pdf') => {
        setExporting(true);
        try {
            await onExport(format);
        } finally {
            setExporting(false);
            setIsOpen(false);
        }
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                disabled={disabled || exporting}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <FaFileDownload />
                <span>{exporting ? 'Exporting...' : label}</span>
            </button>

            {isOpen && !exporting && (
                <>
                    <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-20">
                        <button
                            onClick={() => handleExport('csv')}
                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left rounded-t-lg"
                        >
                            <FaFileCsv className="text-green-600 text-xl" />
                            <div>
                                <div className="font-medium text-gray-900">Export as CSV</div>
                                <div className="text-xs text-gray-500">Spreadsheet format</div>
                            </div>
                        </button>
                        <button
                            onClick={() => handleExport('pdf')}
                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left rounded-b-lg border-t border-gray-100"
                        >
                            <FaFilePdf className="text-red-600 text-xl" />
                            <div>
                                <div className="font-medium text-gray-900">Export as PDF</div>
                                <div className="text-xs text-gray-500">Document format</div>
                            </div>
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default ExportButton;

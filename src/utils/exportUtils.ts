import Papa from 'papaparse';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Export data to CSV
export const exportToCSV = (data: any[], filename: string) => {
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

// Export data to PDF with custom table
export const exportToPDF = (
    data: any[],
    columns: { header: string; dataKey: string }[],
    filename: string,
    title?: string
) => {
    const doc = new jsPDF();

    // Add title if provided
    if (title) {
        doc.setFontSize(18);
        doc.setTextColor(40);
        doc.text(title, 14, 20);
    }

    // Add generation date
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, title ? 30 : 20);

    // Create table
    autoTable(doc, {
        startY: title ? 35 : 25,
        head: [columns.map(col => col.header)],
        body: data.map(row => columns.map(col => row[col.dataKey] || '')),
        theme: 'striped',
        headStyles: {
            fillColor: [79, 70, 229], // Indigo color
            textColor: 255,
            fontStyle: 'bold',
        },
        styles: {
            fontSize: 9,
            cellPadding: 3,
        },
        alternateRowStyles: {
            fillColor: [245, 247, 250],
        },
    });

    doc.save(`${filename}_${new Date().toISOString().split('T')[0]}.pdf`);
};

// Export user data specifically
export const exportUserData = (users: any[], format: 'csv' | 'pdf') => {
    const exportData = users.map(user => ({
        ID: user.id,
        Name: user.name,
        Email: user.email,
        Phone: user.phone,
        Status: user.status,
        'Registration Date': user.registrationDate,
        'Chronic Conditions': user.baselineData?.chronicConditions?.join(', ') || 'N/A',
    }));

    if (format === 'csv') {
        exportToCSV(exportData, 'users');
    } else {
        const columns = [
            { header: 'ID', dataKey: 'ID' },
            { header: 'Name', dataKey: 'Name' },
            { header: 'Email', dataKey: 'Email' },
            { header: 'Phone', dataKey: 'Phone' },
            { header: 'Status', dataKey: 'Status' },
            { header: 'Registration Date', dataKey: 'Registration Date' },
            { header: 'Chronic Conditions', dataKey: 'Chronic Conditions' },
        ];
        exportToPDF(exportData, columns, 'users', 'User Management Report');
    }
};

// Export questionnaire responses
export const exportQuestionnaireData = (responses: any[], format: 'csv' | 'pdf') => {
    const exportData = responses.map(response => ({
        ID: response.id,
        User: response.userName,
        Questionnaire: response.questionnaireName,
        Domain: response.domain,
        Date: response.date,
        Status: response.status,
        Score: response.score,
    }));

    if (format === 'csv') {
        exportToCSV(exportData, 'questionnaire_responses');
    } else {
        const columns = [
            { header: 'ID', dataKey: 'ID' },
            { header: 'User', dataKey: 'User' },
            { header: 'Questionnaire', dataKey: 'Questionnaire' },
            { header: 'Domain', dataKey: 'Domain' },
            { header: 'Date', dataKey: 'Date' },
            { header: 'Status', dataKey: 'Status' },
            { header: 'Score', dataKey: 'Score' },
        ];
        exportToPDF(exportData, columns, 'questionnaire_responses', 'Questionnaire Responses Report');
    }
};

// Export admin logs
export const exportAdminLogs = (logs: any[], format: 'csv' | 'pdf') => {
    const exportData = logs.map(log => ({
        ID: log.id,
        Admin: log.adminName,
        Action: log.action,
        Target: log.target,
        Timestamp: log.timestamp,
        'IP Address': log.ipAddress,
        Status: log.status,
    }));

    if (format === 'csv') {
        exportToCSV(exportData, 'admin_logs');
    } else {
        const columns = [
            { header: 'ID', dataKey: 'ID' },
            { header: 'Admin', dataKey: 'Admin' },
            { header: 'Action', dataKey: 'Action' },
            { header: 'Target', dataKey: 'Target' },
            { header: 'Timestamp', dataKey: 'Timestamp' },
            { header: 'IP Address', dataKey: 'IP Address' },
            { header: 'Status', dataKey: 'Status' },
        ];
        exportToPDF(exportData, columns, 'admin_logs', 'Admin Activity Logs Report');
    }
};

// Export analytics data
export const exportAnalyticsReport = (analyticsData: any) => {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(20);
    doc.setTextColor(40);
    doc.text('Analytics Report', 14, 20);

    // Date
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 30);

    // Global Usage Stats
    doc.setFontSize(14);
    doc.setTextColor(40);
    doc.text('Global Usage Statistics', 14, 45);

    const statsData = [
        ['Total Users', analyticsData.globalUsageStats.totalUsers.toString()],
        ['Active Users', analyticsData.globalUsageStats.activeUsers.toString()],
        ['Total Sessions', analyticsData.globalUsageStats.totalSessions.toString()],
        ['Average Session Duration', analyticsData.globalUsageStats.averageSessionDuration],
        ['Total Exercises Completed', analyticsData.globalUsageStats.totalExercisesCompleted.toString()],
        ['Total Assessments Completed', analyticsData.globalUsageStats.totalAssessmentsCompleted.toString()],
        ['User Growth', analyticsData.globalUsageStats.userGrowth],
        ['Engagement Rate', analyticsData.globalUsageStats.engagement],
    ];

    autoTable(doc, {
        startY: 50,
        head: [['Metric', 'Value']],
        body: statsData,
        theme: 'striped',
        headStyles: {
            fillColor: [79, 70, 229],
            textColor: 255,
            fontStyle: 'bold',
        },
    });

    doc.save(`analytics_report_${new Date().toISOString().split('T')[0]}.pdf`);
};

// Generic export function
export const exportData = (
    data: any[],
    columns: { header: string; dataKey: string }[],
    filename: string,
    format: 'csv' | 'pdf',
    title?: string
) => {
    if (format === 'csv') {
        const exportData = data.map(row => {
            const obj: any = {};
            columns.forEach(col => {
                obj[col.header] = row[col.dataKey] || '';
            });
            return obj;
        });
        exportToCSV(exportData, filename);
    } else {
        exportToPDF(data, columns, filename, title);
    }
};

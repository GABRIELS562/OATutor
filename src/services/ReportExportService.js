/**
 * ReportExportService - Export data to PDF and Excel formats
 *
 * Uses:
 * - jsPDF for PDF generation
 * - SheetJS (xlsx) for Excel export
 * - Canvas for charts
 */

/**
 * Export data to CSV (works without extra dependencies)
 */
function exportToCSV(data, filename = 'export.csv') {
    if (!data || data.length === 0) {
        console.warn('[ReportExport] No data to export');
        return;
    }

    // Get headers from first object
    const headers = Object.keys(data[0]);

    // Build CSV content
    const csvContent = [
        headers.join(','),
        ...data.map(row =>
            headers.map(header => {
                let value = row[header];
                // Handle special characters
                if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
                    value = `"${value.replace(/"/g, '""')}"`;
                }
                return value ?? '';
            }).join(',')
        )
    ].join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    downloadBlob(blob, filename);
}

/**
 * Export to Excel using SheetJS (if available)
 */
async function exportToExcel(data, filename = 'export.xlsx', sheetName = 'Data') {
    try {
        // Dynamic import of xlsx
        const XLSX = await import('xlsx').catch(() => null);

        if (!XLSX) {
            console.warn('[ReportExport] xlsx not available, falling back to CSV');
            exportToCSV(data, filename.replace('.xlsx', '.csv'));
            return;
        }

        // Create workbook
        const workbook = XLSX.utils.book_new();

        // Create worksheet from data
        const worksheet = XLSX.utils.json_to_sheet(data);

        // Add worksheet to workbook
        XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

        // Generate file and download
        XLSX.writeFile(workbook, filename);

    } catch (error) {
        console.error('[ReportExport] Excel export error:', error);
        // Fallback to CSV
        exportToCSV(data, filename.replace('.xlsx', '.csv'));
    }
}

/**
 * Export to PDF using jsPDF (if available)
 */
async function exportToPDF(options) {
    const {
        title = 'Report',
        subtitle = '',
        content = [],
        data = [],
        filename = 'report.pdf',
        orientation = 'portrait',
        includeHeader = true,
    } = options;

    try {
        // Dynamic import of jsPDF
        const { jsPDF } = await import('jspdf').catch(() => ({ jsPDF: null }));

        if (!jsPDF) {
            console.warn('[ReportExport] jsPDF not available');
            alert('PDF export requires jsPDF. Install with: npm install jspdf');
            return;
        }

        // Create PDF
        const doc = new jsPDF({
            orientation: orientation,
            unit: 'mm',
            format: 'a4',
        });

        let yPosition = 20;

        // Header
        if (includeHeader) {
            doc.setFontSize(20);
            doc.setTextColor(26, 35, 126); // Primary color
            doc.text(title, 20, yPosition);
            yPosition += 10;

            if (subtitle) {
                doc.setFontSize(12);
                doc.setTextColor(100);
                doc.text(subtitle, 20, yPosition);
                yPosition += 10;
            }

            // Date
            doc.setFontSize(10);
            doc.setTextColor(150);
            doc.text(`Generated: ${new Date().toLocaleDateString()}`, 20, yPosition);
            yPosition += 15;

            // Line separator
            doc.setDrawColor(200);
            doc.line(20, yPosition, 190, yPosition);
            yPosition += 10;
        }

        // Content sections
        doc.setTextColor(0);
        for (const section of content) {
            // Section title
            if (section.title) {
                doc.setFontSize(14);
                doc.setFont(undefined, 'bold');
                doc.text(section.title, 20, yPosition);
                yPosition += 8;
            }

            // Section text
            if (section.text) {
                doc.setFontSize(11);
                doc.setFont(undefined, 'normal');
                const lines = doc.splitTextToSize(section.text, 170);
                doc.text(lines, 20, yPosition);
                yPosition += lines.length * 6 + 5;
            }

            // Section list
            if (section.list) {
                doc.setFontSize(11);
                doc.setFont(undefined, 'normal');
                section.list.forEach((item, i) => {
                    doc.text(`• ${item}`, 25, yPosition);
                    yPosition += 6;
                });
                yPosition += 5;
            }

            // Check for page break
            if (yPosition > 270) {
                doc.addPage();
                yPosition = 20;
            }
        }

        // Data table
        if (data.length > 0) {
            yPosition = addTableToPDF(doc, data, yPosition);
        }

        // Footer
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(9);
            doc.setTextColor(150);
            doc.text(
                `Page ${i} of ${pageCount} - Angelo Tutoring`,
                105,
                290,
                { align: 'center' }
            );
        }

        // Save
        doc.save(filename);

    } catch (error) {
        console.error('[ReportExport] PDF export error:', error);
        alert('Error generating PDF. Please try again.');
    }
}

/**
 * Add a table to PDF document
 */
function addTableToPDF(doc, data, startY) {
    if (!data || data.length === 0) return startY;

    const headers = Object.keys(data[0]);
    const colWidth = 170 / headers.length;
    let y = startY;

    // Table header
    doc.setFillColor(26, 35, 126);
    doc.rect(20, y - 5, 170, 8, 'F');
    doc.setTextColor(255);
    doc.setFontSize(10);
    doc.setFont(undefined, 'bold');

    headers.forEach((header, i) => {
        doc.text(header.substring(0, 15), 22 + i * colWidth, y);
    });

    y += 8;

    // Table rows
    doc.setTextColor(0);
    doc.setFont(undefined, 'normal');
    doc.setFontSize(9);

    data.forEach((row, rowIndex) => {
        // Alternating row colors
        if (rowIndex % 2 === 0) {
            doc.setFillColor(245, 245, 245);
            doc.rect(20, y - 4, 170, 6, 'F');
        }

        headers.forEach((header, i) => {
            const value = String(row[header] ?? '').substring(0, 20);
            doc.text(value, 22 + i * colWidth, y);
        });

        y += 6;

        // Check for page break
        if (y > 270) {
            doc.addPage();
            y = 20;
        }
    });

    return y + 10;
}

/**
 * Export slides to PDF
 */
async function exportSlidesToPDF(slideData, filename = 'presentation.pdf') {
    const { jsPDF } = await import('jspdf').catch(() => ({ jsPDF: null }));

    if (!jsPDF) {
        console.warn('[ReportExport] jsPDF not available');
        return;
    }

    const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
    });

    const { title, slides } = slideData;

    slides.forEach((slide, index) => {
        if (index > 0) {
            doc.addPage();
        }

        // Slide background
        if (slide.type === 'title') {
            doc.setFillColor(26, 35, 126);
            doc.rect(0, 0, 297, 210, 'F');
            doc.setTextColor(255);
        } else {
            doc.setFillColor(255);
            doc.rect(0, 0, 297, 210, 'F');

            // Header bar
            doc.setFillColor(26, 35, 126);
            doc.rect(0, 0, 297, 25, 'F');
            doc.setTextColor(255);
            doc.setFontSize(16);
            doc.text(slide.title || `Slide ${index + 1}`, 15, 16);

            doc.setTextColor(0);
        }

        // Content
        let y = slide.type === 'title' ? 80 : 40;

        if (slide.type === 'title') {
            doc.setFontSize(32);
            doc.text(slide.title || title, 148, y, { align: 'center' });
            y += 20;
            doc.setFontSize(18);
            if (slide.content) {
                slide.content.forEach(line => {
                    doc.text(line, 148, y, { align: 'center' });
                    y += 12;
                });
            }
        } else {
            doc.setFontSize(14);
            if (slide.content) {
                slide.content.forEach(line => {
                    doc.text(`• ${line}`, 20, y);
                    y += 10;
                });
            }
        }

        // Slide number
        doc.setFontSize(10);
        doc.setTextColor(150);
        doc.text(`${index + 1} / ${slides.length}`, 280, 200);
    });

    doc.save(filename);
}

/**
 * Export attendance report
 */
async function exportAttendanceReport(attendanceData, classInfo, dateRange) {
    const reportData = attendanceData.map(record => ({
        'Student Name': record.studentName,
        'Date': new Date(record.date).toLocaleDateString(),
        'Status': record.status,
        'Notes': record.notes || '',
    }));

    const summary = {
        present: attendanceData.filter(r => r.status === 'present').length,
        absent: attendanceData.filter(r => r.status === 'absent').length,
        late: attendanceData.filter(r => r.status === 'late').length,
    };

    await exportToPDF({
        title: `Attendance Report - ${classInfo.name}`,
        subtitle: `${dateRange.start} to ${dateRange.end}`,
        content: [
            {
                title: 'Summary',
                list: [
                    `Total Records: ${attendanceData.length}`,
                    `Present: ${summary.present} (${Math.round(summary.present / attendanceData.length * 100)}%)`,
                    `Absent: ${summary.absent}`,
                    `Late: ${summary.late}`,
                ],
            },
        ],
        data: reportData,
        filename: `attendance-${classInfo.name}-${new Date().toISOString().split('T')[0]}.pdf`,
    });
}

/**
 * Export student progress report
 */
async function exportProgressReport(studentData, progressData) {
    const reportData = progressData.map(record => ({
        'Skill': record.skillName,
        'Mastery': `${Math.round(record.mastery * 100)}%`,
        'Problems': record.problemsAttempted,
        'Accuracy': `${Math.round(record.accuracy * 100)}%`,
        'Last Practiced': new Date(record.lastPracticed).toLocaleDateString(),
    }));

    await exportToPDF({
        title: `Progress Report - ${studentData.name}`,
        subtitle: `Grade ${studentData.grade} Mathematics`,
        content: [
            {
                title: 'Overview',
                list: [
                    `Overall Mastery: ${Math.round(studentData.overallMastery * 100)}%`,
                    `Total Problems Completed: ${studentData.totalProblems}`,
                    `Average Accuracy: ${Math.round(studentData.averageAccuracy * 100)}%`,
                    `Current Streak: ${studentData.streak} days`,
                ],
            },
        ],
        data: reportData,
        filename: `progress-${studentData.name}-${new Date().toISOString().split('T')[0]}.pdf`,
    });
}

/**
 * Helper to download a blob
 */
function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

const ReportExportService = {
    exportToCSV,
    exportToExcel,
    exportToPDF,
    exportSlidesToPDF,
    exportAttendanceReport,
    exportProgressReport,
};

export default ReportExportService;

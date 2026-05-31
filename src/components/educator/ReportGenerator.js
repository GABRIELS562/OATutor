/**
 * ReportGenerator - Generate comprehensive reports for classes and students
 * Export to PDF, Excel, and CSV formats
 */

import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
    Paper,
    Typography,
    Grid,
    Card,
    CardContent,
    Button,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Checkbox,
    FormControlLabel,
    FormGroup,
    LinearProgress,
    Chip,
    Divider,
    TextField,
} from '@material-ui/core';
import {
    Description,
    PictureAsPdf,
    TableChart,
    InsertDriveFile,
    Assessment,
    Group,
    Person,
    School,
    DateRange,
} from '@material-ui/icons';
import ReportExportService from '../../services/ReportExportService';

const useStyles = makeStyles((theme) => ({
    root: {
        padding: theme.spacing(3),
    },
    header: {
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing(2),
        marginBottom: theme.spacing(3),
    },
    headerIcon: {
        fontSize: 40,
        color: '#1a237e',
    },
    title: {
        fontWeight: 600,
        color: '#333',
    },
    subtitle: {
        color: '#666',
    },
    reportTypeGrid: {
        marginBottom: theme.spacing(4),
    },
    reportCard: {
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        border: '2px solid transparent',
        '&:hover': {
            boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
            transform: 'translateY(-2px)',
        },
    },
    reportCardSelected: {
        borderColor: '#1a237e',
        backgroundColor: 'rgba(26, 35, 126, 0.03)',
    },
    reportCardIcon: {
        fontSize: 48,
        color: '#1a237e',
        marginBottom: theme.spacing(1),
    },
    reportCardTitle: {
        fontWeight: 600,
        marginBottom: theme.spacing(0.5),
    },
    configSection: {
        padding: theme.spacing(3),
        marginBottom: theme.spacing(3),
    },
    sectionTitle: {
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing(1),
        marginBottom: theme.spacing(2),
        fontWeight: 600,
    },
    formRow: {
        display: 'flex',
        gap: theme.spacing(2),
        marginBottom: theme.spacing(2),
        flexWrap: 'wrap',
    },
    formControl: {
        minWidth: 200,
        flex: '1 1 auto',
    },
    checkboxGroup: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    previewSection: {
        padding: theme.spacing(3),
        backgroundColor: 'rgba(26, 35, 126, 0.02)',
    },
    previewHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing(2),
    },
    previewChip: {
        marginRight: theme.spacing(1),
    },
    previewContent: {
        padding: theme.spacing(2),
        backgroundColor: 'white',
        borderRadius: theme.shape.borderRadius,
        border: '1px solid rgba(0,0,0,0.08)',
    },
    previewRow: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: theme.spacing(1, 0),
        borderBottom: '1px solid rgba(0,0,0,0.05)',
        '&:last-child': {
            borderBottom: 'none',
        },
    },
    exportButtons: {
        display: 'flex',
        gap: theme.spacing(2),
        justifyContent: 'center',
        marginTop: theme.spacing(3),
    },
    exportButton: {
        minWidth: 150,
    },
    pdfButton: {
        backgroundColor: '#d32f2f',
        color: 'white',
        '&:hover': {
            backgroundColor: '#b71c1c',
        },
    },
    excelButton: {
        backgroundColor: '#2e7d32',
        color: 'white',
        '&:hover': {
            backgroundColor: '#1b5e20',
        },
    },
    csvButton: {
        backgroundColor: '#1565c0',
        color: 'white',
        '&:hover': {
            backgroundColor: '#0d47a1',
        },
    },
    loadingContainer: {
        padding: theme.spacing(4),
        textAlign: 'center',
    },
}));

// Report types
const REPORT_TYPES = [
    {
        id: 'class-progress',
        name: 'Class Progress Report',
        description: 'Overall class performance and skill mastery',
        icon: Group,
    },
    {
        id: 'student-progress',
        name: 'Student Progress Report',
        description: 'Individual student performance details',
        icon: Person,
    },
    {
        id: 'attendance',
        name: 'Attendance Report',
        description: 'Class attendance records and statistics',
        icon: DateRange,
    },
    {
        id: 'assessment',
        name: 'Assessment Report',
        description: 'Test and assignment results',
        icon: Assessment,
    },
];

// Mock data
const MOCK_CLASSES = [
    { id: '1', name: 'Grade 12A Mathematics' },
    { id: '2', name: 'Grade 12B Mathematics' },
    { id: '3', name: 'Grade 11A Mathematics' },
];

const MOCK_STUDENTS = [
    { id: '1', name: 'Thabo Mokoena', class: '1' },
    { id: '2', name: 'Lerato Nkosi', class: '1' },
    { id: '3', name: 'Sipho Dlamini', class: '1' },
    { id: '4', name: 'Ayanda Zulu', class: '2' },
];

const ReportGenerator = () => {
    const classes = useStyles();

    // State
    const [selectedReport, setSelectedReport] = useState(null);
    const [selectedClass, setSelectedClass] = useState('');
    const [selectedStudent, setSelectedStudent] = useState('all');
    const [dateRange, setDateRange] = useState({
        start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        end: new Date().toISOString().split('T')[0],
    });
    const [includeSections, setIncludeSections] = useState({
        summary: true,
        skills: true,
        problems: true,
        attendance: true,
        recommendations: true,
    });
    const [isGenerating, setIsGenerating] = useState(false);
    const [previewData, setPreviewData] = useState(null);

    // Handle section toggle
    const handleSectionToggle = (section) => {
        setIncludeSections({
            ...includeSections,
            [section]: !includeSections[section],
        });
    };

    // Generate preview data
    const generatePreview = () => {
        // Mock preview data based on report type
        const mockData = {
            reportType: selectedReport,
            className: MOCK_CLASSES.find(c => c.id === selectedClass)?.name || 'All Classes',
            studentName: selectedStudent === 'all' ? 'All Students' : MOCK_STUDENTS.find(s => s.id === selectedStudent)?.name,
            dateRange: `${dateRange.start} to ${dateRange.end}`,
            summary: {
                totalStudents: 28,
                averageMastery: 72,
                problemsCompleted: 1245,
                attendanceRate: 94,
            },
            skills: [
                { name: 'Euclidean Geometry', mastery: 85, problems: 145 },
                { name: 'Trigonometry', mastery: 72, problems: 132 },
                { name: 'Calculus', mastery: 65, problems: 98 },
                { name: 'Statistics', mastery: 88, problems: 167 },
            ],
        };

        setPreviewData(mockData);
    };

    // Export to PDF
    const handleExportPDF = async () => {
        setIsGenerating(true);

        try {
            const reportContent = [];

            if (includeSections.summary) {
                reportContent.push({
                    title: 'Summary',
                    list: [
                        `Total Students: ${previewData.summary.totalStudents}`,
                        `Average Mastery: ${previewData.summary.averageMastery}%`,
                        `Problems Completed: ${previewData.summary.problemsCompleted}`,
                        `Attendance Rate: ${previewData.summary.attendanceRate}%`,
                    ],
                });
            }

            if (includeSections.skills) {
                reportContent.push({
                    title: 'Skill Mastery',
                    list: previewData.skills.map(s => `${s.name}: ${s.mastery}% (${s.problems} problems)`),
                });
            }

            if (includeSections.recommendations) {
                reportContent.push({
                    title: 'Recommendations',
                    list: [
                        'Focus on Calculus - currently lowest mastery area',
                        'Maintain strong performance in Statistics',
                        'Consider additional practice for Trigonometry',
                    ],
                });
            }

            await ReportExportService.exportToPDF({
                title: `${REPORT_TYPES.find(r => r.id === selectedReport)?.name}`,
                subtitle: `${previewData.className} - ${previewData.dateRange}`,
                content: reportContent,
                filename: `report-${selectedReport}-${new Date().toISOString().split('T')[0]}.pdf`,
            });

        } catch (error) {
            console.error('Export error:', error);
        } finally {
            setIsGenerating(false);
        }
    };

    // Export to Excel
    const handleExportExcel = async () => {
        setIsGenerating(true);

        try {
            const data = previewData.skills.map(skill => ({
                Skill: skill.name,
                'Mastery (%)': skill.mastery,
                'Problems Completed': skill.problems,
            }));

            await ReportExportService.exportToExcel(
                data,
                `report-${selectedReport}-${new Date().toISOString().split('T')[0]}.xlsx`,
                'Skills Report'
            );

        } catch (error) {
            console.error('Export error:', error);
        } finally {
            setIsGenerating(false);
        }
    };

    // Export to CSV
    const handleExportCSV = () => {
        const data = previewData.skills.map(skill => ({
            Skill: skill.name,
            'Mastery (%)': skill.mastery,
            'Problems Completed': skill.problems,
        }));

        ReportExportService.exportToCSV(
            data,
            `report-${selectedReport}-${new Date().toISOString().split('T')[0]}.csv`
        );
    };

    // Filter students by class
    const filteredStudents = selectedClass
        ? MOCK_STUDENTS.filter(s => s.class === selectedClass)
        : MOCK_STUDENTS;

    return (
        <div className={classes.root}>
            {/* Header */}
            <div className={classes.header}>
                <Description className={classes.headerIcon} />
                <div>
                    <Typography variant="h5" className={classes.title}>
                        Report Generator
                    </Typography>
                    <Typography variant="body2" className={classes.subtitle}>
                        Create comprehensive reports for classes and students
                    </Typography>
                </div>
            </div>

            {/* Report Type Selection */}
            <Typography variant="h6" gutterBottom>
                1. Select Report Type
            </Typography>
            <Grid container spacing={2} className={classes.reportTypeGrid}>
                {REPORT_TYPES.map(report => {
                    const IconComponent = report.icon;
                    return (
                        <Grid item xs={6} sm={3} key={report.id}>
                            <Card
                                className={`${classes.reportCard} ${selectedReport === report.id ? classes.reportCardSelected : ''}`}
                                onClick={() => setSelectedReport(report.id)}
                            >
                                <CardContent style={{ textAlign: 'center' }}>
                                    <IconComponent className={classes.reportCardIcon} />
                                    <Typography className={classes.reportCardTitle}>
                                        {report.name}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        {report.description}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    );
                })}
            </Grid>

            {/* Configuration */}
            {selectedReport && (
                <Paper className={classes.configSection}>
                    <Typography variant="h6" className={classes.sectionTitle}>
                        <School /> 2. Configure Report
                    </Typography>

                    <div className={classes.formRow}>
                        <FormControl variant="outlined" className={classes.formControl}>
                            <InputLabel>Class</InputLabel>
                            <Select
                                value={selectedClass}
                                onChange={(e) => {
                                    setSelectedClass(e.target.value);
                                    setSelectedStudent('all');
                                }}
                                label="Class"
                            >
                                <MenuItem value="">All Classes</MenuItem>
                                {MOCK_CLASSES.map(c => (
                                    <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        {(selectedReport === 'student-progress') && (
                            <FormControl variant="outlined" className={classes.formControl}>
                                <InputLabel>Student</InputLabel>
                                <Select
                                    value={selectedStudent}
                                    onChange={(e) => setSelectedStudent(e.target.value)}
                                    label="Student"
                                >
                                    <MenuItem value="all">All Students</MenuItem>
                                    {filteredStudents.map(s => (
                                        <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        )}

                        <TextField
                            type="date"
                            label="Start Date"
                            variant="outlined"
                            value={dateRange.start}
                            onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                            InputLabelProps={{ shrink: true }}
                            className={classes.formControl}
                        />

                        <TextField
                            type="date"
                            label="End Date"
                            variant="outlined"
                            value={dateRange.end}
                            onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                            InputLabelProps={{ shrink: true }}
                            className={classes.formControl}
                        />
                    </div>

                    <Divider style={{ margin: '16px 0' }} />

                    <Typography variant="subtitle2" gutterBottom>
                        Include in Report:
                    </Typography>
                    <FormGroup className={classes.checkboxGroup}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={includeSections.summary}
                                    onChange={() => handleSectionToggle('summary')}
                                    color="primary"
                                />
                            }
                            label="Summary Statistics"
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={includeSections.skills}
                                    onChange={() => handleSectionToggle('skills')}
                                    color="primary"
                                />
                            }
                            label="Skill Mastery"
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={includeSections.problems}
                                    onChange={() => handleSectionToggle('problems')}
                                    color="primary"
                                />
                            }
                            label="Problem Statistics"
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={includeSections.attendance}
                                    onChange={() => handleSectionToggle('attendance')}
                                    color="primary"
                                />
                            }
                            label="Attendance Data"
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={includeSections.recommendations}
                                    onChange={() => handleSectionToggle('recommendations')}
                                    color="primary"
                                />
                            }
                            label="Recommendations"
                        />
                    </FormGroup>

                    <div style={{ textAlign: 'center', marginTop: 16 }}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={generatePreview}
                            disabled={!selectedReport}
                        >
                            Generate Preview
                        </Button>
                    </div>
                </Paper>
            )}

            {/* Preview */}
            {previewData && (
                <Paper className={classes.previewSection}>
                    <div className={classes.previewHeader}>
                        <div>
                            <Typography variant="h6" className={classes.sectionTitle}>
                                <Assessment /> 3. Preview & Export
                            </Typography>
                            <div>
                                <Chip
                                    label={previewData.className}
                                    size="small"
                                    className={classes.previewChip}
                                    icon={<Group />}
                                />
                                <Chip
                                    label={previewData.dateRange}
                                    size="small"
                                    className={classes.previewChip}
                                    icon={<DateRange />}
                                />
                            </div>
                        </div>
                    </div>

                    <div className={classes.previewContent}>
                        {includeSections.summary && (
                            <>
                                <Typography variant="subtitle1" gutterBottom style={{ fontWeight: 600 }}>
                                    Summary
                                </Typography>
                                <div className={classes.previewRow}>
                                    <span>Total Students</span>
                                    <strong>{previewData.summary.totalStudents}</strong>
                                </div>
                                <div className={classes.previewRow}>
                                    <span>Average Mastery</span>
                                    <strong>{previewData.summary.averageMastery}%</strong>
                                </div>
                                <div className={classes.previewRow}>
                                    <span>Problems Completed</span>
                                    <strong>{previewData.summary.problemsCompleted}</strong>
                                </div>
                                <div className={classes.previewRow}>
                                    <span>Attendance Rate</span>
                                    <strong>{previewData.summary.attendanceRate}%</strong>
                                </div>
                                <Divider style={{ margin: '16px 0' }} />
                            </>
                        )}

                        {includeSections.skills && (
                            <>
                                <Typography variant="subtitle1" gutterBottom style={{ fontWeight: 600 }}>
                                    Skill Mastery
                                </Typography>
                                {previewData.skills.map((skill, index) => (
                                    <div key={index} className={classes.previewRow}>
                                        <span>{skill.name}</span>
                                        <strong>{skill.mastery}%</strong>
                                    </div>
                                ))}
                            </>
                        )}
                    </div>

                    {/* Export Buttons */}
                    <div className={classes.exportButtons}>
                        <Button
                            variant="contained"
                            className={`${classes.exportButton} ${classes.pdfButton}`}
                            startIcon={<PictureAsPdf />}
                            onClick={handleExportPDF}
                            disabled={isGenerating}
                        >
                            Export PDF
                        </Button>
                        <Button
                            variant="contained"
                            className={`${classes.exportButton} ${classes.excelButton}`}
                            startIcon={<TableChart />}
                            onClick={handleExportExcel}
                            disabled={isGenerating}
                        >
                            Export Excel
                        </Button>
                        <Button
                            variant="contained"
                            className={`${classes.exportButton} ${classes.csvButton}`}
                            startIcon={<InsertDriveFile />}
                            onClick={handleExportCSV}
                            disabled={isGenerating}
                        >
                            Export CSV
                        </Button>
                    </div>

                    {isGenerating && (
                        <div className={classes.loadingContainer}>
                            <LinearProgress />
                            <Typography variant="body2" color="textSecondary" style={{ marginTop: 8 }}>
                                Generating report...
                            </Typography>
                        </div>
                    )}
                </Paper>
            )}
        </div>
    );
};

export default ReportGenerator;

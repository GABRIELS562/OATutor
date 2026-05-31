import React, { useState, useEffect } from "react";
import {
    Container,
    Typography,
    Box,
    Paper,
    Tabs,
    Tab,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Chip,
    Grid,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Button
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";
import SchoolIcon from "@material-ui/icons/School";
import MenuBookIcon from "@material-ui/icons/MenuBook";
import ScienceIcon from "@material-ui/icons/EmojiObjects";
import BiotechIcon from "@material-ui/icons/Eco";
import GetAppIcon from "@material-ui/icons/GetApp";
import OpenInNewIcon from "@material-ui/icons/OpenInNew";
import { capsCurriculum } from "../../data/caps-curriculum";
import { SITE_NAME } from "../../config/config";

// Official CAPS curriculum document links from DBE
const curriculumLinks = {
    mathematics: {
        name: "Mathematics",
        caps: "https://www.education.gov.za/Portals/0/CD/National%20Curriculum%20Statements%20and%20Vocational/CAPS%20FET%20_%20MATHEMATICS%20_%20GR%2010-12%20_%20Web_1133.pdf?ver=2015-01-27-154314-253",
        examGuidelines: "https://www.education.gov.za/Portals/0/Documents/Publications/Exam%20Guidelines%202021/Mathematics%20GR%2012%20Exam%20Guidelines%202021%20Eng.pdf?ver=2021-05-17-133042-957",
        pastPapers: "https://www.education.gov.za/Curriculum/NationalSeniorCertificate(NSC)Examinations.aspx"
    },
    physicalSciences: {
        name: "Physical Sciences",
        caps: "https://www.education.gov.za/Portals/0/CD/National%20Curriculum%20Statements%20and%20Vocational/CAPS%20FET%20_%20PHYSICAL%20SCIENCES%20_%20GR%2010-12%20_%20Web_6F87.pdf?ver=2015-01-27-154258-683",
        examGuidelines: "https://www.education.gov.za/Portals/0/Documents/Publications/Exam%20Guidelines%202021/Physical%20Sciences%20GR%2012%20Exam%20Guidelines%202021%20Eng.pdf?ver=2021-05-17-133055-020",
        pastPapers: "https://www.education.gov.za/Curriculum/NationalSeniorCertificate(NSC)Examinations.aspx"
    },
    lifeSciences: {
        name: "Life Sciences",
        caps: "https://www.education.gov.za/Portals/0/CD/National%20Curriculum%20Statements%20and%20Vocational/CAPS%20FET%20_%20LIFE%20SCIENCES%20_%20GR%2010-12%20_%20Web_7E4D.pdf?ver=2015-01-27-154330-867",
        examGuidelines: "https://www.education.gov.za/Portals/0/Documents/Publications/Exam%20Guidelines%202021/Life%20Sciences%20GR%2012%20Exam%20Guidelines%202021%20Eng.pdf?ver=2021-05-17-133044-847",
        pastPapers: "https://www.education.gov.za/Curriculum/NationalSeniorCertificate(NSC)Examinations.aspx"
    }
};

// Dark mode detection hook
const useIsDarkMode = () => {
    const [isDark, setIsDark] = useState(() => {
        // Initial check including system preference
        if (typeof window === 'undefined') return false;
        const root = document.documentElement;
        const hasThemeClass = root.classList.contains('theme-dark') ||
                             root.getAttribute('data-theme') === 'dark';
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const explicitLight = root.classList.contains('theme-light') ||
                              root.getAttribute('data-theme') === 'light';
        // If explicitly light, not dark. Otherwise check class or system preference.
        return explicitLight ? false : (hasThemeClass || systemPrefersDark);
    });

    useEffect(() => {
        const checkDarkMode = () => {
            const root = document.documentElement;
            const hasThemeClass = root.classList.contains('theme-dark') ||
                                 root.getAttribute('data-theme') === 'dark';
            const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            const explicitLight = root.classList.contains('theme-light') ||
                                  root.getAttribute('data-theme') === 'light';
            setIsDark(explicitLight ? false : (hasThemeClass || systemPrefersDark));
        };

        // Initial check
        checkDarkMode();

        // Watch for class changes on root
        const observer = new MutationObserver(checkDarkMode);
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class', 'data-theme']
        });

        // Watch for system preference changes
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        mediaQuery.addEventListener('change', checkDarkMode);

        return () => {
            observer.disconnect();
            mediaQuery.removeEventListener('change', checkDarkMode);
        };
    }, []);

    return isDark;
};

// Subject icons and colors
const subjectConfig = {
    mathematics: {
        icon: <MenuBookIcon />,
        color: "#7B2FF7",
        gradient: "linear-gradient(135deg, #7B2FF7 0%, #A855F7 100%)"
    },
    physicalSciences: {
        icon: <ScienceIcon />,
        color: "#00D4FF",
        gradient: "linear-gradient(135deg, #00D4FF 0%, #0891B2 100%)"
    },
    lifeSciences: {
        icon: <BiotechIcon />,
        color: "#10B981",
        gradient: "linear-gradient(135deg, #10B981 0%, #059669 100%)"
    }
};

const CurriculumReference = () => {
    const [selectedSubject, setSelectedSubject] = useState("mathematics");
    const [selectedGrade, setSelectedGrade] = useState(12);
    const isDarkMode = useIsDarkMode();

    const currentSubject = capsCurriculum[selectedSubject];
    const config = subjectConfig[selectedSubject];
    const gradeData = currentSubject.grades[`grade${selectedGrade}`];

    // Theme-aware colors
    const colors = {
        pageBg: isDarkMode ? "#0f0f1a" : "#f8fafc",
        cardBg: isDarkMode ? "#1e1e32" : "#ffffff",
        accordionBg: isDarkMode ? "#252540" : "#ffffff",
        accordionDetailsBg: isDarkMode ? "#1a1a30" : "#fafafa",
        textPrimary: isDarkMode ? "#ffffff" : "#1a1a2e",
        textSecondary: isDarkMode ? "#94A3B8" : "#64748B",
        textMuted: isDarkMode ? "#CBD5E1" : "#374151",
        chipBg: isDarkMode ? "#2d2d4a" : "#ffffff",
        chipBorder: isDarkMode ? "#4a4a6a" : "#e5e7eb",
    };

    const handleSubjectChange = (event, newValue) => {
        setSelectedSubject(newValue);
    };

    const handleGradeChange = (grade) => {
        setSelectedGrade(grade);
    };

    return (
        <Box className="curriculum-reference-page" style={{ minHeight: "100vh", paddingBottom: "40px", background: colors.pageBg }}>
            {/* Header */}
            <Box
                style={{
                    background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
                    padding: "40px 20px",
                    color: "#fff",
                    marginBottom: "30px"
                }}
            >
                <Container maxWidth="lg">
                    <Typography variant="h4" style={{ fontWeight: 700, marginBottom: "8px" }}>
                        CAPS Curriculum Reference
                    </Typography>
                    <Typography variant="body1" style={{ opacity: 0.9 }}>
                        Official South African Curriculum and Assessment Policy Statement for Grade 10-12
                    </Typography>
                </Container>
            </Box>

            <Container maxWidth="lg">
                {/* Subject Tabs */}
                <Paper style={{ marginBottom: "24px", borderRadius: "12px", background: colors.cardBg }}>
                    <Tabs
                        value={selectedSubject}
                        onChange={handleSubjectChange}
                        indicatorColor="primary"
                        textColor="primary"
                        variant="fullWidth"
                    >
                        <Tab
                            value="mathematics"
                            label="Mathematics"
                            icon={<MenuBookIcon />}
                            style={{ textTransform: "none", fontWeight: 600, color: colors.textPrimary }}
                        />
                        <Tab
                            value="physicalSciences"
                            label="Physical Sciences"
                            icon={<ScienceIcon />}
                            style={{ textTransform: "none", fontWeight: 600, color: colors.textPrimary }}
                        />
                        <Tab
                            value="lifeSciences"
                            label="Life Sciences"
                            icon={<BiotechIcon />}
                            style={{ textTransform: "none", fontWeight: 600, color: colors.textPrimary }}
                        />
                    </Tabs>
                </Paper>

                {/* Subject Info Card */}
                <Paper
                    style={{
                        padding: "24px",
                        marginBottom: "24px",
                        borderRadius: "16px",
                        borderLeft: `4px solid ${config.color}`,
                        background: colors.cardBg
                    }}
                >
                    <Typography variant="h5" style={{ fontWeight: 700, marginBottom: "12px", color: colors.textPrimary }}>
                        {currentSubject.subject}
                    </Typography>
                    <Typography variant="body1" style={{ marginBottom: "16px", color: colors.textSecondary }}>
                        {currentSubject.description}
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <Chip
                                icon={<SchoolIcon />}
                                label={`Time: ${currentSubject.timeAllocation}`}
                                style={{ background: `${config.color}15`, color: config.color }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="body2" style={{ color: colors.textSecondary }}>
                                <strong>Paper 1:</strong> {currentSubject.papers.paper1}
                            </Typography>
                            <Typography variant="body2" style={{ color: colors.textSecondary }}>
                                <strong>Paper 2:</strong> {currentSubject.papers.paper2}
                            </Typography>
                        </Grid>
                    </Grid>
                </Paper>

                {/* Official Document Links */}
                <Paper
                    style={{
                        padding: "20px",
                        marginBottom: "24px",
                        borderRadius: "16px",
                        background: isDarkMode
                            ? "linear-gradient(135deg, rgba(123, 47, 247, 0.15) 0%, rgba(0, 212, 255, 0.1) 100%)"
                            : "linear-gradient(135deg, rgba(123, 47, 247, 0.08) 0%, rgba(0, 212, 255, 0.05) 100%)",
                        border: `1px solid ${config.color}30`
                    }}
                >
                    <Typography variant="subtitle1" style={{ fontWeight: 700, marginBottom: "12px", color: colors.textPrimary }}>
                        📄 Official DBE Curriculum Documents
                    </Typography>
                    <Box style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
                        <Button
                            variant="contained"
                            size="small"
                            startIcon={<GetAppIcon />}
                            href={curriculumLinks[selectedSubject].caps}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                background: config.gradient,
                                color: "#fff",
                                textTransform: "none",
                                fontWeight: 600,
                                borderRadius: "8px"
                            }}
                        >
                            Download Full CAPS Document (PDF)
                        </Button>
                        <Button
                            variant="outlined"
                            size="small"
                            startIcon={<OpenInNewIcon />}
                            href={curriculumLinks[selectedSubject].examGuidelines}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                borderColor: config.color,
                                color: config.color,
                                textTransform: "none",
                                fontWeight: 600,
                                borderRadius: "8px"
                            }}
                        >
                            Exam Guidelines
                        </Button>
                        <Button
                            variant="outlined"
                            size="small"
                            startIcon={<OpenInNewIcon />}
                            href={curriculumLinks[selectedSubject].pastPapers}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                borderColor: config.color,
                                color: config.color,
                                textTransform: "none",
                                fontWeight: 600,
                                borderRadius: "8px"
                            }}
                        >
                            Past Papers (DBE)
                        </Button>
                    </Box>
                    <Typography variant="caption" style={{ display: "block", marginTop: "12px", color: colors.textSecondary }}>
                        Links to official Department of Basic Education (education.gov.za) resources
                    </Typography>
                </Paper>

                {/* Grade Selector */}
                <Box style={{ marginBottom: "24px", display: "flex", gap: "12px", justifyContent: "center" }}>
                    {[10, 11, 12].map((grade) => (
                        <Chip
                            key={grade}
                            label={`Grade ${grade}`}
                            onClick={() => handleGradeChange(grade)}
                            style={{
                                padding: "20px 16px",
                                fontSize: "1rem",
                                fontWeight: 600,
                                background: selectedGrade === grade ? config.gradient : colors.chipBg,
                                color: selectedGrade === grade ? "#fff" : colors.textSecondary,
                                border: selectedGrade === grade ? "none" : `1px solid ${colors.chipBorder}`,
                                cursor: "pointer"
                            }}
                        />
                    ))}
                </Box>

                {/* Topics List */}
                <Typography variant="h6" style={{ fontWeight: 700, marginBottom: "16px", color: colors.textPrimary }}>
                    Grade {selectedGrade} Topics
                </Typography>

                {gradeData?.topics.map((topic, index) => (
                    <Accordion
                        key={index}
                        style={{
                            marginBottom: "12px",
                            borderRadius: "12px",
                            overflow: "hidden",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                            background: colors.accordionBg
                        }}
                    >
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon style={{ color: colors.textSecondary }} />}
                            style={{ background: colors.accordionBg }}
                        >
                            <Box style={{ display: "flex", alignItems: "center", gap: "12px", width: "100%" }}>
                                <Box
                                    style={{
                                        width: "36px",
                                        height: "36px",
                                        borderRadius: "8px",
                                        background: config.gradient,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        color: "#fff",
                                        fontWeight: 700,
                                        fontSize: "14px"
                                    }}
                                >
                                    {index + 1}
                                </Box>
                                <Box style={{ flex: 1 }}>
                                    <Typography style={{ fontWeight: 600, color: colors.textPrimary }}>
                                        {topic.name}
                                    </Typography>
                                    <Typography variant="caption" style={{ color: colors.textSecondary }}>
                                        {topic.subtopics.length} subtopics
                                        {topic.term && ` • Term ${topic.term}`}
                                        {topic.paper && ` • Paper ${topic.paper}`}
                                    </Typography>
                                </Box>
                            </Box>
                        </AccordionSummary>
                        <AccordionDetails style={{ padding: "16px 24px", background: colors.accordionDetailsBg }}>
                            <List dense>
                                {topic.subtopics.map((subtopic, subIndex) => (
                                    <ListItem key={subIndex} style={{ paddingLeft: 0 }}>
                                        <ListItemIcon style={{ minWidth: "32px" }}>
                                            <CheckCircleOutlineIcon
                                                style={{ fontSize: "18px", color: config.color }}
                                            />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={subtopic}
                                            primaryTypographyProps={{
                                                style: { fontSize: "0.95rem", color: colors.textMuted }
                                            }}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        </AccordionDetails>
                    </Accordion>
                ))}

                {/* Footer Note */}
                <Paper
                    style={{
                        padding: "20px",
                        marginTop: "32px",
                        borderRadius: "12px",
                        background: isDarkMode
                            ? "linear-gradient(135deg, rgba(123, 47, 247, 0.15) 0%, rgba(0, 212, 255, 0.15) 100%)"
                            : "linear-gradient(135deg, rgba(123, 47, 247, 0.05) 0%, rgba(0, 212, 255, 0.05) 100%)",
                        border: isDarkMode
                            ? "1px solid rgba(123, 47, 247, 0.3)"
                            : "1px solid rgba(123, 47, 247, 0.1)"
                    }}
                >
                    <Typography variant="body2" style={{ textAlign: "center", color: colors.textSecondary }}>
                        <strong>Sources:</strong> Department of Basic Education (education.gov.za),
                        WCED ePortal (wcedeportal.co.za), South African History Online (sahistory.org.za)
                    </Typography>
                    <Typography variant="body2" style={{ textAlign: "center", marginTop: "8px", color: colors.textSecondary }}>
                        {SITE_NAME} problems are aligned to these CAPS curriculum topics.
                    </Typography>
                </Paper>
            </Container>
        </Box>
    );
};

export default CurriculumReference;

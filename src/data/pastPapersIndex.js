/**
 * Past Papers Index - SA CAPS Papers
 *
 * Sources:
 * - DBE (Department of Basic Education) NSC Papers
 * - IEB (Independent Examinations Board) Papers
 * - Provincial Papers (Trial/Preparatory exams)
 *
 * Papers are stored in /public/past-papers/
 */

// Paper types
export const PAPER_TYPES = {
    NSC: 'nsc',           // National Senior Certificate (November)
    NSC_SUPPLEMENTARY: 'nsc-supp',  // NSC Supplementary (February/March)
    IEB: 'ieb',           // Independent Examinations Board
    PROVINCIAL: 'provincial',  // Provincial trial/prep exams
    TRIAL: 'trial',       // Trial exams
};

// Paper variants
export const PAPER_VARIANTS = {
    PAPER_1: 'p1',        // Paper 1
    PAPER_2: 'p2',        // Paper 2
};

// Subjects
export const SUBJECTS = {
    MATHEMATICS: 'mathematics',
    MATH_LITERACY: 'math-literacy',
    PHYSICAL_SCIENCES: 'physical-sciences',
    LIFE_SCIENCES: 'life-sciences',
};

// Provinces
export const PROVINCES = [
    'gauteng',
    'western-cape',
    'kzn',
    'eastern-cape',
    'free-state',
    'mpumalanga',
    'limpopo',
    'north-west',
    'northern-cape',
];

/**
 * Get file prefix for subject
 */
const getFilePrefix = (subject, isProvincial = false) => {
    if (isProvincial) {
        switch (subject) {
            case SUBJECTS.MATHEMATICS:
                return 'maths';
            case SUBJECTS.PHYSICAL_SCIENCES:
                return 'physics';
            case SUBJECTS.LIFE_SCIENCES:
                return 'life-sciences';
            default:
                return subject;
        }
    }
    switch (subject) {
        case SUBJECTS.MATHEMATICS:
            return 'maths';
        case SUBJECTS.PHYSICAL_SCIENCES:
            return 'physics';
        case SUBJECTS.LIFE_SCIENCES:
            return 'life-sci';
        case SUBJECTS.MATH_LITERACY:
            return 'maths-lit';
        default:
            return subject;
    }
};

/**
 * Generate paper URL path
 */
export const getPaperPath = (paper) => {
    const { type, year, subject, variant, province } = paper;
    const baseUrl = process.env.PUBLIC_URL || '';

    if ((type === PAPER_TYPES.PROVINCIAL || type === PAPER_TYPES.TRIAL) && province) {
        const filePrefix = getFilePrefix(subject, true);
        return `${baseUrl}/past-papers/provincial/${province}/${year}/${filePrefix}-${variant}-memo.pdf`;
    }

    const filePrefix = getFilePrefix(subject, false);
    return `${baseUrl}/past-papers/${type}/${year}/${subject}/${filePrefix}-${variant}.pdf`;
};

export const getMemoPath = (paper) => {
    const { type, year, subject, variant, province } = paper;
    const baseUrl = process.env.PUBLIC_URL || '';

    if ((type === PAPER_TYPES.PROVINCIAL || type === PAPER_TYPES.TRIAL) && province) {
        // Provincial papers have memo combined
        return getPaperPath(paper);
    }

    const filePrefix = getFilePrefix(subject, false);
    return `${baseUrl}/past-papers/${type}/${year}/${subject}/${filePrefix}-${variant}-memo.pdf`;
};

// Helper to generate NSC paper entries
const generateNSCPapers = (year, subject, subjectName, topics1, topics2) => [
    {
        id: `nsc-${year}-${subjectName}-p1`,
        title: `${subjectName === 'maths' ? 'Mathematics' : subjectName === 'physics' ? 'Physical Sciences' : 'Life Sciences'} Paper 1`,
        year,
        type: PAPER_TYPES.NSC,
        subject,
        variant: PAPER_VARIANTS.PAPER_1,
        grade: 12,
        topics: topics1,
        totalMarks: 150,
        duration: subject === SUBJECTS.LIFE_SCIENCES ? 150 : 180,
        hasMemo: true,
        isAvailable: true,
    },
    {
        id: `nsc-${year}-${subjectName}-p2`,
        title: `${subjectName === 'maths' ? 'Mathematics' : subjectName === 'physics' ? 'Physical Sciences' : 'Life Sciences'} Paper 2`,
        year,
        type: PAPER_TYPES.NSC,
        subject,
        variant: PAPER_VARIANTS.PAPER_2,
        grade: 12,
        topics: topics2,
        totalMarks: 150,
        duration: subject === SUBJECTS.LIFE_SCIENCES ? 150 : 180,
        hasMemo: true,
        isAvailable: true,
    },
];

// Mathematics topics
const mathsTopics1 = ['algebra', 'functions', 'calculus', 'sequences', 'finance'];
const mathsTopics2 = ['trigonometry', 'euclidean-geometry', 'analytical-geometry', 'statistics'];

// Physical Sciences topics
const physicsTopics1 = ['mechanics', 'waves', 'electricity', 'magnetism', 'optical-phenomena'];
const physicsTopics2 = ['chemical-change', 'chemical-systems', 'organic-chemistry', 'electrochemistry'];

// Life Sciences topics
const lifeTopics1 = ['dna-rna', 'meiosis', 'genetics', 'evolution', 'human-evolution'];
const lifeTopics2 = ['nervous-system', 'endocrine-system', 'homeostasis', 'reproduction', 'human-impact'];

/**
 * Past Papers Database
 */
export const pastPapersIndex = [
    // ============================================
    // NSC MATHEMATICS PAPERS (2019-2024)
    // ============================================
    ...generateNSCPapers(2024, SUBJECTS.MATHEMATICS, 'maths', mathsTopics1, mathsTopics2),
    ...generateNSCPapers(2023, SUBJECTS.MATHEMATICS, 'maths', mathsTopics1, mathsTopics2),
    ...generateNSCPapers(2022, SUBJECTS.MATHEMATICS, 'maths', mathsTopics1, mathsTopics2),
    ...generateNSCPapers(2021, SUBJECTS.MATHEMATICS, 'maths', mathsTopics1, mathsTopics2),
    ...generateNSCPapers(2020, SUBJECTS.MATHEMATICS, 'maths', mathsTopics1, mathsTopics2),
    ...generateNSCPapers(2019, SUBJECTS.MATHEMATICS, 'maths', mathsTopics1, mathsTopics2),

    // ============================================
    // NSC PHYSICAL SCIENCES PAPERS (2019-2024)
    // ============================================
    ...generateNSCPapers(2024, SUBJECTS.PHYSICAL_SCIENCES, 'physics', physicsTopics1, physicsTopics2),
    ...generateNSCPapers(2023, SUBJECTS.PHYSICAL_SCIENCES, 'physics', physicsTopics1, physicsTopics2),
    ...generateNSCPapers(2022, SUBJECTS.PHYSICAL_SCIENCES, 'physics', physicsTopics1, physicsTopics2),
    ...generateNSCPapers(2021, SUBJECTS.PHYSICAL_SCIENCES, 'physics', physicsTopics1, physicsTopics2),
    ...generateNSCPapers(2020, SUBJECTS.PHYSICAL_SCIENCES, 'physics', physicsTopics1, physicsTopics2),
    ...generateNSCPapers(2019, SUBJECTS.PHYSICAL_SCIENCES, 'physics', physicsTopics1, physicsTopics2),

    // ============================================
    // NSC LIFE SCIENCES PAPERS (2019-2024)
    // ============================================
    ...generateNSCPapers(2024, SUBJECTS.LIFE_SCIENCES, 'life-sci', lifeTopics1, lifeTopics2),
    ...generateNSCPapers(2023, SUBJECTS.LIFE_SCIENCES, 'life-sci', lifeTopics1, lifeTopics2),
    ...generateNSCPapers(2022, SUBJECTS.LIFE_SCIENCES, 'life-sci', lifeTopics1, lifeTopics2),
    ...generateNSCPapers(2021, SUBJECTS.LIFE_SCIENCES, 'life-sci', lifeTopics1, lifeTopics2),
    ...generateNSCPapers(2020, SUBJECTS.LIFE_SCIENCES, 'life-sci', lifeTopics1, lifeTopics2),
    ...generateNSCPapers(2019, SUBJECTS.LIFE_SCIENCES, 'life-sci', lifeTopics1, lifeTopics2),

    // ============================================
    // GAUTENG PROVINCIAL TRIAL PAPERS
    // ============================================
    // 2024 Gauteng
    {
        id: 'gauteng-2024-maths-p1',
        title: 'Gauteng Trial Mathematics Paper 1',
        year: 2024,
        type: PAPER_TYPES.PROVINCIAL,
        subject: SUBJECTS.MATHEMATICS,
        variant: PAPER_VARIANTS.PAPER_1,
        grade: 12,
        province: 'gauteng',
        topics: mathsTopics1,
        totalMarks: 150,
        duration: 180,
        hasMemo: true,
        isAvailable: true,
    },
    {
        id: 'gauteng-2024-maths-p2',
        title: 'Gauteng Trial Mathematics Paper 2',
        year: 2024,
        type: PAPER_TYPES.PROVINCIAL,
        subject: SUBJECTS.MATHEMATICS,
        variant: PAPER_VARIANTS.PAPER_2,
        grade: 12,
        province: 'gauteng',
        topics: mathsTopics2,
        totalMarks: 150,
        duration: 180,
        hasMemo: true,
        isAvailable: true,
    },
    {
        id: 'gauteng-2024-physics-p1',
        title: 'Gauteng Trial Physical Sciences Paper 1',
        year: 2024,
        type: PAPER_TYPES.PROVINCIAL,
        subject: SUBJECTS.PHYSICAL_SCIENCES,
        variant: PAPER_VARIANTS.PAPER_1,
        grade: 12,
        province: 'gauteng',
        topics: physicsTopics1,
        totalMarks: 150,
        duration: 180,
        hasMemo: true,
        isAvailable: true,
    },
    {
        id: 'gauteng-2024-physics-p2',
        title: 'Gauteng Trial Physical Sciences Paper 2',
        year: 2024,
        type: PAPER_TYPES.PROVINCIAL,
        subject: SUBJECTS.PHYSICAL_SCIENCES,
        variant: PAPER_VARIANTS.PAPER_2,
        grade: 12,
        province: 'gauteng',
        topics: physicsTopics2,
        totalMarks: 150,
        duration: 180,
        hasMemo: true,
        isAvailable: true,
    },
    {
        id: 'gauteng-2024-life-sci-p1',
        title: 'Gauteng Trial Life Sciences Paper 1',
        year: 2024,
        type: PAPER_TYPES.PROVINCIAL,
        subject: SUBJECTS.LIFE_SCIENCES,
        variant: PAPER_VARIANTS.PAPER_1,
        grade: 12,
        province: 'gauteng',
        topics: lifeTopics1,
        totalMarks: 150,
        duration: 150,
        hasMemo: true,
        isAvailable: true,
    },
    {
        id: 'gauteng-2024-life-sci-p2',
        title: 'Gauteng Trial Life Sciences Paper 2',
        year: 2024,
        type: PAPER_TYPES.PROVINCIAL,
        subject: SUBJECTS.LIFE_SCIENCES,
        variant: PAPER_VARIANTS.PAPER_2,
        grade: 12,
        province: 'gauteng',
        topics: lifeTopics2,
        totalMarks: 150,
        duration: 150,
        hasMemo: true,
        isAvailable: true,
    },
    // 2023 Gauteng
    {
        id: 'gauteng-2023-maths-p1',
        title: 'Gauteng Trial Mathematics Paper 1',
        year: 2023,
        type: PAPER_TYPES.PROVINCIAL,
        subject: SUBJECTS.MATHEMATICS,
        variant: PAPER_VARIANTS.PAPER_1,
        grade: 12,
        province: 'gauteng',
        topics: mathsTopics1,
        totalMarks: 150,
        duration: 180,
        hasMemo: true,
        isAvailable: true,
    },
    {
        id: 'gauteng-2023-maths-p2',
        title: 'Gauteng Trial Mathematics Paper 2',
        year: 2023,
        type: PAPER_TYPES.PROVINCIAL,
        subject: SUBJECTS.MATHEMATICS,
        variant: PAPER_VARIANTS.PAPER_2,
        grade: 12,
        province: 'gauteng',
        topics: mathsTopics2,
        totalMarks: 150,
        duration: 180,
        hasMemo: true,
        isAvailable: true,
    },
    {
        id: 'gauteng-2023-physics-p1',
        title: 'Gauteng Trial Physical Sciences Paper 1',
        year: 2023,
        type: PAPER_TYPES.PROVINCIAL,
        subject: SUBJECTS.PHYSICAL_SCIENCES,
        variant: PAPER_VARIANTS.PAPER_1,
        grade: 12,
        province: 'gauteng',
        topics: physicsTopics1,
        totalMarks: 150,
        duration: 180,
        hasMemo: true,
        isAvailable: true,
    },
    {
        id: 'gauteng-2023-physics-p2',
        title: 'Gauteng Trial Physical Sciences Paper 2',
        year: 2023,
        type: PAPER_TYPES.PROVINCIAL,
        subject: SUBJECTS.PHYSICAL_SCIENCES,
        variant: PAPER_VARIANTS.PAPER_2,
        grade: 12,
        province: 'gauteng',
        topics: physicsTopics2,
        totalMarks: 150,
        duration: 180,
        hasMemo: true,
        isAvailable: true,
    },

    // ============================================
    // KZN PROVINCIAL TRIAL PAPERS
    // ============================================
    // 2024 KZN
    {
        id: 'kzn-2024-maths-p1',
        title: 'KZN Trial Mathematics Paper 1',
        year: 2024,
        type: PAPER_TYPES.PROVINCIAL,
        subject: SUBJECTS.MATHEMATICS,
        variant: PAPER_VARIANTS.PAPER_1,
        grade: 12,
        province: 'kzn',
        topics: mathsTopics1,
        totalMarks: 150,
        duration: 180,
        hasMemo: true,
        isAvailable: true,
    },
    {
        id: 'kzn-2024-maths-p2',
        title: 'KZN Trial Mathematics Paper 2',
        year: 2024,
        type: PAPER_TYPES.PROVINCIAL,
        subject: SUBJECTS.MATHEMATICS,
        variant: PAPER_VARIANTS.PAPER_2,
        grade: 12,
        province: 'kzn',
        topics: mathsTopics2,
        totalMarks: 150,
        duration: 180,
        hasMemo: true,
        isAvailable: true,
    },
    {
        id: 'kzn-2024-physics-p1',
        title: 'KZN Trial Physical Sciences Paper 1',
        year: 2024,
        type: PAPER_TYPES.PROVINCIAL,
        subject: SUBJECTS.PHYSICAL_SCIENCES,
        variant: PAPER_VARIANTS.PAPER_1,
        grade: 12,
        province: 'kzn',
        topics: physicsTopics1,
        totalMarks: 150,
        duration: 180,
        hasMemo: true,
        isAvailable: true,
    },
    {
        id: 'kzn-2024-physics-p2',
        title: 'KZN Trial Physical Sciences Paper 2',
        year: 2024,
        type: PAPER_TYPES.PROVINCIAL,
        subject: SUBJECTS.PHYSICAL_SCIENCES,
        variant: PAPER_VARIANTS.PAPER_2,
        grade: 12,
        province: 'kzn',
        topics: physicsTopics2,
        totalMarks: 150,
        duration: 180,
        hasMemo: true,
        isAvailable: true,
    },
    {
        id: 'kzn-2024-life-sci-p1',
        title: 'KZN Trial Life Sciences Paper 1',
        year: 2024,
        type: PAPER_TYPES.PROVINCIAL,
        subject: SUBJECTS.LIFE_SCIENCES,
        variant: PAPER_VARIANTS.PAPER_1,
        grade: 12,
        province: 'kzn',
        topics: lifeTopics1,
        totalMarks: 150,
        duration: 150,
        hasMemo: true,
        isAvailable: true,
    },
    {
        id: 'kzn-2024-life-sci-p2',
        title: 'KZN Trial Life Sciences Paper 2',
        year: 2024,
        type: PAPER_TYPES.PROVINCIAL,
        subject: SUBJECTS.LIFE_SCIENCES,
        variant: PAPER_VARIANTS.PAPER_2,
        grade: 12,
        province: 'kzn',
        topics: lifeTopics2,
        totalMarks: 150,
        duration: 150,
        hasMemo: true,
        isAvailable: true,
    },
    // 2023 KZN
    {
        id: 'kzn-2023-maths-p1',
        title: 'KZN Trial Mathematics Paper 1',
        year: 2023,
        type: PAPER_TYPES.PROVINCIAL,
        subject: SUBJECTS.MATHEMATICS,
        variant: PAPER_VARIANTS.PAPER_1,
        grade: 12,
        province: 'kzn',
        topics: mathsTopics1,
        totalMarks: 150,
        duration: 180,
        hasMemo: true,
        isAvailable: true,
    },
    {
        id: 'kzn-2023-maths-p2',
        title: 'KZN Trial Mathematics Paper 2',
        year: 2023,
        type: PAPER_TYPES.PROVINCIAL,
        subject: SUBJECTS.MATHEMATICS,
        variant: PAPER_VARIANTS.PAPER_2,
        grade: 12,
        province: 'kzn',
        topics: mathsTopics2,
        totalMarks: 150,
        duration: 180,
        hasMemo: true,
        isAvailable: true,
    },
    {
        id: 'kzn-2023-physics-p1',
        title: 'KZN Trial Physical Sciences Paper 1',
        year: 2023,
        type: PAPER_TYPES.PROVINCIAL,
        subject: SUBJECTS.PHYSICAL_SCIENCES,
        variant: PAPER_VARIANTS.PAPER_1,
        grade: 12,
        province: 'kzn',
        topics: physicsTopics1,
        totalMarks: 150,
        duration: 180,
        hasMemo: true,
        isAvailable: true,
    },
    {
        id: 'kzn-2023-physics-p2',
        title: 'KZN Trial Physical Sciences Paper 2',
        year: 2023,
        type: PAPER_TYPES.PROVINCIAL,
        subject: SUBJECTS.PHYSICAL_SCIENCES,
        variant: PAPER_VARIANTS.PAPER_2,
        grade: 12,
        province: 'kzn',
        topics: physicsTopics2,
        totalMarks: 150,
        duration: 180,
        hasMemo: true,
        isAvailable: true,
    },
    {
        id: 'kzn-2023-life-sci-p1',
        title: 'KZN Trial Life Sciences Paper 1',
        year: 2023,
        type: PAPER_TYPES.PROVINCIAL,
        subject: SUBJECTS.LIFE_SCIENCES,
        variant: PAPER_VARIANTS.PAPER_1,
        grade: 12,
        province: 'kzn',
        topics: lifeTopics1,
        totalMarks: 150,
        duration: 150,
        hasMemo: true,
        isAvailable: true,
    },
    {
        id: 'kzn-2023-life-sci-p2',
        title: 'KZN Trial Life Sciences Paper 2',
        year: 2023,
        type: PAPER_TYPES.PROVINCIAL,
        subject: SUBJECTS.LIFE_SCIENCES,
        variant: PAPER_VARIANTS.PAPER_2,
        grade: 12,
        province: 'kzn',
        topics: lifeTopics2,
        totalMarks: 150,
        duration: 150,
        hasMemo: true,
        isAvailable: true,
    },

    // ============================================
    // WESTERN CAPE PROVINCIAL TRIAL PAPERS
    // ============================================
    {
        id: 'wc-2024-physics-p1',
        title: 'Western Cape Trial Physical Sciences Paper 1',
        year: 2024,
        type: PAPER_TYPES.PROVINCIAL,
        subject: SUBJECTS.PHYSICAL_SCIENCES,
        variant: PAPER_VARIANTS.PAPER_1,
        grade: 12,
        province: 'western-cape',
        topics: physicsTopics1,
        totalMarks: 150,
        duration: 180,
        hasMemo: true,
        isAvailable: true,
    },
    {
        id: 'wc-2024-physics-p2',
        title: 'Western Cape Trial Physical Sciences Paper 2',
        year: 2024,
        type: PAPER_TYPES.PROVINCIAL,
        subject: SUBJECTS.PHYSICAL_SCIENCES,
        variant: PAPER_VARIANTS.PAPER_2,
        grade: 12,
        province: 'western-cape',
        topics: physicsTopics2,
        totalMarks: 150,
        duration: 180,
        hasMemo: true,
        isAvailable: true,
    },
];

/**
 * Get all available years
 */
export const getAvailableYears = () => {
    const years = [...new Set(pastPapersIndex.map(p => p.year))];
    return years.sort((a, b) => b - a); // Descending
};

/**
 * Get all available paper types
 */
export const getAvailableTypes = () => {
    return [...new Set(pastPapersIndex.map(p => p.type))];
};

/**
 * Get all available subjects
 */
export const getAvailableSubjects = () => {
    return [...new Set(pastPapersIndex.map(p => p.subject))];
};

/**
 * Get all available provinces
 */
export const getAvailableProvinces = () => {
    return [...new Set(pastPapersIndex.filter(p => p.province).map(p => p.province))];
};

/**
 * Filter papers by criteria
 */
export const filterPapers = (filters = {}) => {
    let papers = [...pastPapersIndex];

    if (filters.year) {
        papers = papers.filter(p => p.year === filters.year);
    }

    if (filters.type) {
        papers = papers.filter(p => p.type === filters.type);
    }

    if (filters.subject) {
        papers = papers.filter(p => p.subject === filters.subject);
    }

    if (filters.variant) {
        papers = papers.filter(p => p.variant === filters.variant);
    }

    if (filters.province) {
        papers = papers.filter(p => p.province === filters.province);
    }

    if (filters.topics && filters.topics.length > 0) {
        papers = papers.filter(p =>
            filters.topics.some(topic => p.topics.includes(topic))
        );
    }

    if (filters.availableOnly) {
        papers = papers.filter(p => p.isAvailable);
    }

    return papers;
};

/**
 * Get paper by ID
 */
export const getPaperById = (id) => {
    return pastPapersIndex.find(p => p.id === id);
};

/**
 * Get papers by subject
 */
export const getPapersBySubject = (subject) => {
    return pastPapersIndex.filter(p => p.subject === subject);
};

/**
 * Get NSC papers only
 */
export const getNSCPapers = () => {
    return pastPapersIndex.filter(p => p.type === PAPER_TYPES.NSC);
};

/**
 * Get provincial papers only
 */
export const getProvincialPapers = () => {
    return pastPapersIndex.filter(p => p.type === PAPER_TYPES.PROVINCIAL);
};

export default pastPapersIndex;

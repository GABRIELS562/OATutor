/**
 * Past Papers Index - SA CAPS Mathematics Papers
 *
 * Sources:
 * - DBE (Department of Basic Education) NSC Papers
 * - IEB (Independent Examinations Board) Papers
 * - Provincial Papers (March, June, September)
 *
 * Papers are stored in /public/past-papers/
 */

// Paper types
export const PAPER_TYPES = {
    NSC: 'nsc',           // National Senior Certificate (November)
    NSC_SUPPLEMENTARY: 'nsc-supp',  // NSC Supplementary (February/March)
    IEB: 'ieb',           // Independent Examinations Board
    PROVINCIAL: 'provincial',  // Provincial exams
    TRIAL: 'trial',       // Trial exams
};

// Paper variants
export const PAPER_VARIANTS = {
    PAPER_1: 'p1',        // Paper 1 (Algebra, Functions, Calculus)
    PAPER_2: 'p2',        // Paper 2 (Geometry, Trig, Stats)
};

// Subjects
export const SUBJECTS = {
    MATHEMATICS: 'mathematics',
    MATH_LITERACY: 'math-literacy',
    PHYSICAL_SCIENCE: 'physical-science',
    LIFE_SCIENCE: 'life-science',
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
 * Generate paper URL path
 */
export const getPaperPath = (paper) => {
    const { type, year, subject, variant, province } = paper;
    const baseUrl = process.env.PUBLIC_URL || '';

    if (type === PAPER_TYPES.PROVINCIAL && province) {
        return `${baseUrl}/past-papers/provincial/${province}/${year}/${subject}-${variant}.pdf`;
    }

    return `${baseUrl}/past-papers/${type}/${year}/${subject}-${variant}.pdf`;
};

export const getMemoPath = (paper) => {
    const paperPath = getPaperPath(paper);
    return paperPath.replace('.pdf', '-memo.pdf');
};

/**
 * Past Papers Database
 * This would ideally be loaded from an API or database
 */
export const pastPapersIndex = [
    // 2024 NSC Papers
    {
        id: 'nsc-2024-maths-p1',
        title: 'Mathematics Paper 1',
        year: 2024,
        type: PAPER_TYPES.NSC,
        subject: SUBJECTS.MATHEMATICS,
        variant: PAPER_VARIANTS.PAPER_1,
        grade: 12,
        topics: ['algebra', 'functions', 'calculus', 'sequences', 'finance'],
        totalMarks: 150,
        duration: 180, // minutes
        hasMemo: true,
        isAvailable: true,
    },
    {
        id: 'nsc-2024-maths-p2',
        title: 'Mathematics Paper 2',
        year: 2024,
        type: PAPER_TYPES.NSC,
        subject: SUBJECTS.MATHEMATICS,
        variant: PAPER_VARIANTS.PAPER_2,
        grade: 12,
        topics: ['trigonometry', 'euclidean-geometry', 'analytical-geometry', 'statistics'],
        totalMarks: 150,
        duration: 180,
        hasMemo: true,
        isAvailable: true,
    },

    // 2023 NSC Papers
    {
        id: 'nsc-2023-maths-p1',
        title: 'Mathematics Paper 1',
        year: 2023,
        type: PAPER_TYPES.NSC,
        subject: SUBJECTS.MATHEMATICS,
        variant: PAPER_VARIANTS.PAPER_1,
        grade: 12,
        topics: ['algebra', 'functions', 'calculus', 'sequences', 'finance'],
        totalMarks: 150,
        duration: 180,
        hasMemo: true,
        isAvailable: true,
    },
    {
        id: 'nsc-2023-maths-p2',
        title: 'Mathematics Paper 2',
        year: 2023,
        type: PAPER_TYPES.NSC,
        subject: SUBJECTS.MATHEMATICS,
        variant: PAPER_VARIANTS.PAPER_2,
        grade: 12,
        topics: ['trigonometry', 'euclidean-geometry', 'analytical-geometry', 'statistics'],
        totalMarks: 150,
        duration: 180,
        hasMemo: true,
        isAvailable: true,
    },

    // 2022 NSC Papers
    {
        id: 'nsc-2022-maths-p1',
        title: 'Mathematics Paper 1',
        year: 2022,
        type: PAPER_TYPES.NSC,
        subject: SUBJECTS.MATHEMATICS,
        variant: PAPER_VARIANTS.PAPER_1,
        grade: 12,
        topics: ['algebra', 'functions', 'calculus', 'sequences', 'finance'],
        totalMarks: 150,
        duration: 180,
        hasMemo: true,
        isAvailable: true,
    },
    {
        id: 'nsc-2022-maths-p2',
        title: 'Mathematics Paper 2',
        year: 2022,
        type: PAPER_TYPES.NSC,
        subject: SUBJECTS.MATHEMATICS,
        variant: PAPER_VARIANTS.PAPER_2,
        grade: 12,
        topics: ['trigonometry', 'euclidean-geometry', 'analytical-geometry', 'statistics'],
        totalMarks: 150,
        duration: 180,
        hasMemo: true,
        isAvailable: true,
    },

    // 2021 NSC Papers
    {
        id: 'nsc-2021-maths-p1',
        title: 'Mathematics Paper 1',
        year: 2021,
        type: PAPER_TYPES.NSC,
        subject: SUBJECTS.MATHEMATICS,
        variant: PAPER_VARIANTS.PAPER_1,
        grade: 12,
        topics: ['algebra', 'functions', 'calculus', 'sequences', 'finance'],
        totalMarks: 150,
        duration: 180,
        hasMemo: true,
        isAvailable: true,
    },
    {
        id: 'nsc-2021-maths-p2',
        title: 'Mathematics Paper 2',
        year: 2021,
        type: PAPER_TYPES.NSC,
        subject: SUBJECTS.MATHEMATICS,
        variant: PAPER_VARIANTS.PAPER_2,
        grade: 12,
        topics: ['trigonometry', 'euclidean-geometry', 'analytical-geometry', 'statistics'],
        totalMarks: 150,
        duration: 180,
        hasMemo: true,
        isAvailable: true,
    },

    // 2020 NSC Papers
    {
        id: 'nsc-2020-maths-p1',
        title: 'Mathematics Paper 1',
        year: 2020,
        type: PAPER_TYPES.NSC,
        subject: SUBJECTS.MATHEMATICS,
        variant: PAPER_VARIANTS.PAPER_1,
        grade: 12,
        topics: ['algebra', 'functions', 'calculus', 'sequences', 'finance'],
        totalMarks: 150,
        duration: 180,
        hasMemo: true,
        isAvailable: true,
    },
    {
        id: 'nsc-2020-maths-p2',
        title: 'Mathematics Paper 2',
        year: 2020,
        type: PAPER_TYPES.NSC,
        subject: SUBJECTS.MATHEMATICS,
        variant: PAPER_VARIANTS.PAPER_2,
        grade: 12,
        topics: ['trigonometry', 'euclidean-geometry', 'analytical-geometry', 'statistics'],
        totalMarks: 150,
        duration: 180,
        hasMemo: true,
        isAvailable: true,
    },

    // IEB Papers (example)
    {
        id: 'ieb-2024-maths-p1',
        title: 'IEB Mathematics Paper 1',
        year: 2024,
        type: PAPER_TYPES.IEB,
        subject: SUBJECTS.MATHEMATICS,
        variant: PAPER_VARIANTS.PAPER_1,
        grade: 12,
        topics: ['algebra', 'functions', 'calculus', 'sequences', 'finance'],
        totalMarks: 150,
        duration: 180,
        hasMemo: true,
        isAvailable: false, // IEB papers require license
        note: 'IEB papers require license purchase',
    },
    {
        id: 'ieb-2024-maths-p2',
        title: 'IEB Mathematics Paper 2',
        year: 2024,
        type: PAPER_TYPES.IEB,
        subject: SUBJECTS.MATHEMATICS,
        variant: PAPER_VARIANTS.PAPER_2,
        grade: 12,
        topics: ['trigonometry', 'euclidean-geometry', 'analytical-geometry', 'statistics'],
        totalMarks: 150,
        duration: 180,
        hasMemo: true,
        isAvailable: false,
        note: 'IEB papers require license purchase',
    },

    // Gauteng Trial Papers
    {
        id: 'gauteng-trial-2024-maths-p1',
        title: 'Gauteng Trial Paper 1',
        year: 2024,
        type: PAPER_TYPES.TRIAL,
        subject: SUBJECTS.MATHEMATICS,
        variant: PAPER_VARIANTS.PAPER_1,
        grade: 12,
        province: 'gauteng',
        topics: ['algebra', 'functions', 'calculus', 'sequences', 'finance'],
        totalMarks: 150,
        duration: 180,
        hasMemo: true,
        isAvailable: true,
    },
    {
        id: 'gauteng-trial-2024-maths-p2',
        title: 'Gauteng Trial Paper 2',
        year: 2024,
        type: PAPER_TYPES.TRIAL,
        subject: SUBJECTS.MATHEMATICS,
        variant: PAPER_VARIANTS.PAPER_2,
        grade: 12,
        province: 'gauteng',
        topics: ['trigonometry', 'euclidean-geometry', 'analytical-geometry', 'statistics'],
        totalMarks: 150,
        duration: 180,
        hasMemo: true,
        isAvailable: true,
    },

    // KZN Trial Papers
    {
        id: 'kzn-trial-2024-maths-p2',
        title: 'KZN Trial Paper 2',
        year: 2024,
        type: PAPER_TYPES.TRIAL,
        subject: SUBJECTS.MATHEMATICS,
        variant: PAPER_VARIANTS.PAPER_2,
        grade: 12,
        province: 'kzn',
        topics: ['trigonometry', 'euclidean-geometry', 'analytical-geometry', 'statistics'],
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

export default pastPapersIndex;

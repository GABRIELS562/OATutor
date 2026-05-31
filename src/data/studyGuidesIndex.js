/**
 * Study Guides Index - SA CAPS Grade 12
 *
 * Official Mind the Gap Study Guides from Department of Basic Education
 * These are free, openly licensed resources aligned to CAPS curriculum
 */

export const SUBJECTS = {
    MATHEMATICS: 'mathematics',
    PHYSICAL_SCIENCES: 'physical-sciences',
    LIFE_SCIENCES: 'life-sciences',
};

export const studyGuidesIndex = [
    {
        id: 'mtg-maths-gr12',
        title: 'Mind the Gap: Mathematics',
        subject: SUBJECTS.MATHEMATICS,
        grade: 12,
        description: 'Comprehensive Grade 12 Mathematics study guide covering all CAPS topics including Algebra, Functions, Calculus, Trigonometry, Euclidean Geometry, and Statistics.',
        topics: [
            'algebraic-expressions',
            'equations-inequalities',
            'number-patterns',
            'functions-graphs',
            'finance-growth-decay',
            'differential-calculus',
            'analytical-geometry',
            'trigonometry',
            'euclidean-geometry',
            'statistics',
            'counting-probability'
        ],
        pages: 276,
        filePath: '/study-guides/mathematics/mind-the-gap-maths.pdf',
        source: 'Department of Basic Education',
        license: 'Creative Commons',
        edition: '2nd Edition',
        isAvailable: true,
    },
    {
        id: 'mtg-physics-gr12',
        title: 'Mind the Gap: Physical Sciences',
        subject: SUBJECTS.PHYSICAL_SCIENCES,
        grade: 12,
        description: 'Grade 12 Physical Sciences study guide covering Physics (Paper 1) and Chemistry (Paper 2) topics aligned to CAPS curriculum.',
        topics: [
            // Physics (Paper 1)
            'momentum-impulse',
            'vertical-projectile-motion',
            'work-energy-power',
            'doppler-effect',
            'electrostatics',
            'electric-circuits',
            'electromagnetism',
            'optical-phenomena',
            // Chemistry (Paper 2)
            'organic-chemistry',
            'reaction-rates',
            'chemical-equilibrium',
            'acids-bases',
            'electrochemistry',
            'fertilizers'
        ],
        pages: 212,
        filePath: '/study-guides/physical-sciences/mind-the-gap-physics.pdf',
        source: 'Department of Basic Education',
        license: 'Creative Commons',
        edition: '2nd Edition',
        isAvailable: true,
    },
    {
        id: 'mtg-life-sci-gr12',
        title: 'Mind the Gap: Life Sciences',
        subject: SUBJECTS.LIFE_SCIENCES,
        grade: 12,
        description: 'Grade 12 Life Sciences study guide covering DNA, Genetics, Evolution, Human Physiology, and Environmental Studies aligned to CAPS.',
        topics: [
            // Paper 1
            'dna-code-of-life',
            'meiosis',
            'reproduction-in-vertebrates',
            'human-reproduction',
            'genetics-inheritance',
            // Paper 2
            'human-nervous-system',
            'human-endocrine-system',
            'homeostasis',
            'human-impact-on-environment',
            'evolution',
            'human-evolution'
        ],
        pages: 180,
        filePath: '/study-guides/life-sciences/mind-the-gap-life-sci.pdf',
        source: 'Department of Basic Education',
        license: 'Creative Commons',
        edition: '2nd Edition',
        isAvailable: true,
    },
];

/**
 * Get study guide by subject
 */
export const getStudyGuideBySubject = (subject) => {
    return studyGuidesIndex.find(g => g.subject === subject);
};

/**
 * Get all available subjects
 */
export const getAvailableSubjects = () => {
    return [...new Set(studyGuidesIndex.map(g => g.subject))];
};

/**
 * Get study guide path
 */
export const getStudyGuidePath = (guide) => {
    const baseUrl = process.env.PUBLIC_URL || '';
    return `${baseUrl}${guide.filePath}`;
};

export default studyGuidesIndex;

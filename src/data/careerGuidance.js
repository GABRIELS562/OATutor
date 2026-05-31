/**
 * Career Guidance Data - SA Careers requiring Mathematics
 *
 * Organized by field with entry requirements, salary ranges,
 * and links to further information
 */

export const CAREER_FIELDS = [
    {
        id: 'engineering',
        name: 'Engineering',
        icon: 'engineering',
        color: '#1CB0F6',
        description: 'Design, build and maintain systems, structures, and technology',
    },
    {
        id: 'finance',
        name: 'Finance & Accounting',
        icon: 'account_balance',
        color: '#2e7d32',
        description: 'Manage money, investments, and financial planning',
    },
    {
        id: 'technology',
        name: 'Information Technology',
        icon: 'computer',
        color: '#6a1b9a',
        description: 'Develop software, systems, and digital solutions',
    },
    {
        id: 'science',
        name: 'Science & Research',
        icon: 'science',
        color: '#00838f',
        description: 'Discover and advance knowledge through research',
    },
    {
        id: 'healthcare',
        name: 'Healthcare',
        icon: 'local_hospital',
        color: '#c62828',
        description: 'Diagnose, treat, and care for patients',
    },
    {
        id: 'education',
        name: 'Education',
        icon: 'school',
        color: '#ef6c00',
        description: 'Teach and develop the next generation',
    },
    {
        id: 'business',
        name: 'Business & Management',
        icon: 'business',
        color: '#37474f',
        description: 'Lead organizations and drive business growth',
    },
    {
        id: 'actuarial',
        name: 'Actuarial Science',
        icon: 'trending_up',
        color: '#0277bd',
        description: 'Analyze risk and uncertainty using mathematics',
    },
];

export const CAREERS = [
    // Engineering
    {
        id: 'civil-engineer',
        field: 'engineering',
        title: 'Civil Engineer',
        description: 'Design and supervise construction of infrastructure like roads, bridges, and buildings.',
        mathsRequired: 'Pure Mathematics (Level 6+)',
        otherSubjects: ['Physical Sciences', 'Technical Drawing'],
        qualification: 'BEng Civil Engineering (4 years)',
        universities: ['UCT', 'Wits', 'UP', 'Stellenbosch', 'UJ'],
        salaryRange: { min: 350000, max: 900000, currency: 'ZAR' },
        growthOutlook: 'Good - Infrastructure development ongoing',
        skills: ['Problem solving', 'Technical drawing', 'Project management'],
    },
    {
        id: 'electrical-engineer',
        field: 'engineering',
        title: 'Electrical Engineer',
        description: 'Design electrical systems for power generation, telecommunications, and electronics.',
        mathsRequired: 'Pure Mathematics (Level 6+)',
        otherSubjects: ['Physical Sciences'],
        qualification: 'BEng Electrical Engineering (4 years)',
        universities: ['UCT', 'Wits', 'UP', 'Stellenbosch', 'UKZN'],
        salaryRange: { min: 380000, max: 950000, currency: 'ZAR' },
        growthOutlook: 'Excellent - Renewable energy growth',
        skills: ['Circuit design', 'Programming', 'Mathematics'],
    },
    {
        id: 'mechanical-engineer',
        field: 'engineering',
        title: 'Mechanical Engineer',
        description: 'Design and develop mechanical systems, machines, and thermal devices.',
        mathsRequired: 'Pure Mathematics (Level 6+)',
        otherSubjects: ['Physical Sciences'],
        qualification: 'BEng Mechanical Engineering (4 years)',
        universities: ['UCT', 'Wits', 'UP', 'Stellenbosch', 'NWU'],
        salaryRange: { min: 360000, max: 880000, currency: 'ZAR' },
        growthOutlook: 'Good - Manufacturing sector',
        skills: ['CAD design', 'Problem solving', 'Physics'],
    },

    // Finance
    {
        id: 'chartered-accountant',
        field: 'finance',
        title: 'Chartered Accountant (CA)',
        description: 'Audit, tax planning, and financial advisory services.',
        mathsRequired: 'Mathematics (Level 5+)',
        otherSubjects: ['Accounting', 'Business Studies'],
        qualification: 'BCom Accounting + SAICA articles (5+ years)',
        universities: ['UCT', 'Wits', 'UP', 'Stellenbosch', 'UJ'],
        salaryRange: { min: 450000, max: 2000000, currency: 'ZAR' },
        growthOutlook: 'Excellent - Always in demand',
        skills: ['Analytical thinking', 'Attention to detail', 'Communication'],
    },
    {
        id: 'financial-analyst',
        field: 'finance',
        title: 'Financial Analyst',
        description: 'Analyze financial data to guide investment decisions.',
        mathsRequired: 'Mathematics (Level 5+)',
        otherSubjects: ['Accounting', 'Economics'],
        qualification: 'BCom Finance / CFA (3-4 years)',
        universities: ['UCT', 'Wits', 'Stellenbosch', 'UJ'],
        salaryRange: { min: 400000, max: 1200000, currency: 'ZAR' },
        growthOutlook: 'Good - Financial services growth',
        skills: ['Data analysis', 'Financial modeling', 'Excel'],
    },
    {
        id: 'investment-banker',
        field: 'finance',
        title: 'Investment Banker',
        description: 'Advise on mergers, acquisitions, and capital raising.',
        mathsRequired: 'Mathematics (Level 5+)',
        otherSubjects: ['Accounting', 'Economics'],
        qualification: 'BCom / BBusSci + Honours (4-5 years)',
        universities: ['UCT', 'Wits', 'Stellenbosch'],
        salaryRange: { min: 600000, max: 3000000, currency: 'ZAR' },
        growthOutlook: 'Competitive but lucrative',
        skills: ['Financial analysis', 'Negotiation', 'Networking'],
    },

    // Technology
    {
        id: 'software-developer',
        field: 'technology',
        title: 'Software Developer',
        description: 'Design and build applications, websites, and systems.',
        mathsRequired: 'Mathematics (Level 4+)',
        otherSubjects: ['IT / CAT (recommended)'],
        qualification: 'BSc Computer Science / BIT (3-4 years)',
        universities: ['UCT', 'Wits', 'UP', 'Stellenbosch', 'UJ', 'UNISA'],
        salaryRange: { min: 350000, max: 1200000, currency: 'ZAR' },
        growthOutlook: 'Excellent - Digital transformation',
        skills: ['Programming', 'Problem solving', 'Logical thinking'],
    },
    {
        id: 'data-scientist',
        field: 'technology',
        title: 'Data Scientist',
        description: 'Analyze complex data to extract insights and build predictive models.',
        mathsRequired: 'Pure Mathematics (Level 6+)',
        otherSubjects: ['Statistics (recommended)'],
        qualification: 'BSc Mathematics/Statistics + MSc (4-6 years)',
        universities: ['UCT', 'Wits', 'UP', 'Stellenbosch'],
        salaryRange: { min: 500000, max: 1500000, currency: 'ZAR' },
        growthOutlook: 'Excellent - AI/ML growth',
        skills: ['Statistics', 'Python/R', 'Machine learning'],
    },
    {
        id: 'cybersecurity-analyst',
        field: 'technology',
        title: 'Cybersecurity Analyst',
        description: 'Protect systems and data from cyber threats.',
        mathsRequired: 'Mathematics (Level 4+)',
        otherSubjects: ['IT'],
        qualification: 'BSc Computer Science + certifications (3-4 years)',
        universities: ['UCT', 'Wits', 'UP', 'UJ', 'Rhodes'],
        salaryRange: { min: 400000, max: 1100000, currency: 'ZAR' },
        growthOutlook: 'Excellent - Cybercrime increasing',
        skills: ['Security tools', 'Networking', 'Problem solving'],
    },

    // Science
    {
        id: 'physicist',
        field: 'science',
        title: 'Physicist',
        description: 'Research fundamental laws of nature and apply physics principles.',
        mathsRequired: 'Pure Mathematics (Level 7)',
        otherSubjects: ['Physical Sciences'],
        qualification: 'BSc Physics + MSc/PhD (5-10 years)',
        universities: ['UCT', 'Wits', 'Stellenbosch', 'UP'],
        salaryRange: { min: 300000, max: 800000, currency: 'ZAR' },
        growthOutlook: 'Moderate - Research dependent',
        skills: ['Advanced mathematics', 'Research', 'Analysis'],
    },
    {
        id: 'statistician',
        field: 'science',
        title: 'Statistician',
        description: 'Collect, analyze, and interpret data for various industries.',
        mathsRequired: 'Pure Mathematics (Level 6+)',
        otherSubjects: ['Statistics (if available)'],
        qualification: 'BSc Statistics / Mathematical Statistics (3-4 years)',
        universities: ['UCT', 'Wits', 'UP', 'Stellenbosch', 'UFS'],
        salaryRange: { min: 350000, max: 900000, currency: 'ZAR' },
        growthOutlook: 'Excellent - Data-driven decisions',
        skills: ['Statistical software', 'Data analysis', 'Communication'],
    },

    // Healthcare
    {
        id: 'doctor',
        field: 'healthcare',
        title: 'Medical Doctor',
        description: 'Diagnose and treat illnesses, prescribe medications.',
        mathsRequired: 'Mathematics (Level 5+)',
        otherSubjects: ['Life Sciences', 'Physical Sciences'],
        qualification: 'MBChB (6 years) + Internship (2 years)',
        universities: ['UCT', 'Wits', 'UP', 'Stellenbosch', 'UKZN', 'UFS'],
        salaryRange: { min: 500000, max: 2500000, currency: 'ZAR' },
        growthOutlook: 'Excellent - Healthcare always needed',
        skills: ['Empathy', 'Problem solving', 'Communication'],
    },
    {
        id: 'pharmacist',
        field: 'healthcare',
        title: 'Pharmacist',
        description: 'Dispense medications and advise on drug use.',
        mathsRequired: 'Mathematics (Level 5+)',
        otherSubjects: ['Life Sciences', 'Physical Sciences'],
        qualification: 'BPharm (4 years)',
        universities: ['Wits', 'UP', 'Rhodes', 'NWU', 'UWC'],
        salaryRange: { min: 400000, max: 900000, currency: 'ZAR' },
        growthOutlook: 'Good - Healthcare growth',
        skills: ['Attention to detail', 'Chemistry', 'Communication'],
    },

    // Education
    {
        id: 'maths-teacher',
        field: 'education',
        title: 'Mathematics Teacher',
        description: 'Teach mathematics at high school level.',
        mathsRequired: 'Mathematics (Level 5+)',
        otherSubjects: ['Any (for second teaching subject)'],
        qualification: 'BEd (4 years) or PGCE (1 year after degree)',
        universities: ['All SA universities with education faculties'],
        salaryRange: { min: 280000, max: 550000, currency: 'ZAR' },
        growthOutlook: 'Good - Teacher shortage',
        skills: ['Communication', 'Patience', 'Subject knowledge'],
    },
    {
        id: 'university-lecturer',
        field: 'education',
        title: 'University Lecturer',
        description: 'Teach and research at tertiary level.',
        mathsRequired: 'Pure Mathematics (Level 7)',
        otherSubjects: ['Depends on specialization'],
        qualification: 'Masters/PhD in subject area (6-10 years)',
        universities: ['All SA universities'],
        salaryRange: { min: 450000, max: 1200000, currency: 'ZAR' },
        growthOutlook: 'Moderate - Academic positions limited',
        skills: ['Research', 'Writing', 'Teaching'],
    },

    // Actuarial
    {
        id: 'actuary',
        field: 'actuarial',
        title: 'Actuary',
        description: 'Analyze financial risk using mathematics and statistics for insurance and pensions.',
        mathsRequired: 'Pure Mathematics (Level 7)',
        otherSubjects: ['Physical Sciences (recommended)'],
        qualification: 'BSc Actuarial Science + ASSA exams (5-8 years)',
        universities: ['UCT', 'Wits', 'UP', 'Stellenbosch'],
        salaryRange: { min: 600000, max: 3000000, currency: 'ZAR' },
        growthOutlook: 'Excellent - High demand, limited supply',
        skills: ['Advanced mathematics', 'Statistics', 'Problem solving'],
    },
    {
        id: 'quantitative-analyst',
        field: 'actuarial',
        title: 'Quantitative Analyst (Quant)',
        description: 'Develop mathematical models for trading and risk management.',
        mathsRequired: 'Pure Mathematics (Level 7)',
        otherSubjects: ['Physical Sciences'],
        qualification: 'BSc Mathematics/Physics + Masters (5-7 years)',
        universities: ['UCT', 'Wits', 'Stellenbosch'],
        salaryRange: { min: 700000, max: 2500000, currency: 'ZAR' },
        growthOutlook: 'Good - Financial markets',
        skills: ['Mathematical modeling', 'Programming', 'Finance'],
    },

    // Business
    {
        id: 'management-consultant',
        field: 'business',
        title: 'Management Consultant',
        description: 'Advise businesses on strategy, operations, and efficiency.',
        mathsRequired: 'Mathematics (Level 4+)',
        otherSubjects: ['Business Studies', 'Accounting'],
        qualification: 'BCom / BBA + MBA (optional)',
        universities: ['UCT GSB', 'Wits Business School', 'UP Gordon'],
        salaryRange: { min: 500000, max: 2000000, currency: 'ZAR' },
        growthOutlook: 'Good - Business transformation',
        skills: ['Analytical thinking', 'Communication', 'Problem solving'],
    },
    {
        id: 'entrepreneur',
        field: 'business',
        title: 'Entrepreneur',
        description: 'Start and run your own business.',
        mathsRequired: 'Mathematics (Level 4+)',
        otherSubjects: ['Business Studies', 'Accounting'],
        qualification: 'Any degree + business acumen',
        universities: ['Any, or self-taught'],
        salaryRange: { min: 0, max: 10000000, currency: 'ZAR' },
        growthOutlook: 'Variable - Depends on venture',
        skills: ['Innovation', 'Risk-taking', 'Leadership'],
    },
];

/**
 * Get careers by field
 */
export function getCareersByField(fieldId) {
    return CAREERS.filter(career => career.field === fieldId);
}

/**
 * Get career by ID
 */
export function getCareerById(careerId) {
    return CAREERS.find(career => career.id === careerId);
}

/**
 * Search careers by keyword
 */
export function searchCareers(query) {
    const lowerQuery = query.toLowerCase();
    return CAREERS.filter(career =>
        career.title.toLowerCase().includes(lowerQuery) ||
        career.description.toLowerCase().includes(lowerQuery) ||
        career.skills.some(skill => skill.toLowerCase().includes(lowerQuery))
    );
}

/**
 * Get careers by maths level
 */
export function getCareersByMathsLevel(level) {
    const levelNum = parseInt(level, 10);
    return CAREERS.filter(career => {
        const match = career.mathsRequired.match(/Level (\d+)/);
        if (match) {
            return parseInt(match[1], 10) <= levelNum;
        }
        return true;
    });
}

/**
 * Format salary range
 */
export function formatSalaryRange(salary) {
    const formatter = new Intl.NumberFormat('en-ZA', {
        style: 'currency',
        currency: 'ZAR',
        maximumFractionDigits: 0,
    });
    return `${formatter.format(salary.min)} - ${formatter.format(salary.max)} per year`;
}

export default {
    CAREER_FIELDS,
    CAREERS,
    getCareersByField,
    getCareerById,
    searchCareers,
    getCareersByMathsLevel,
    formatSalaryRange,
};

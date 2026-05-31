/**
 * South African Bursaries Database
 *
 * Bursary and scholarship opportunities for Grade 12 learners
 * and university students
 */

export const BURSARY_CATEGORIES = [
    { id: 'government', name: 'Government Bursaries', icon: 'account_balance' },
    { id: 'corporate', name: 'Corporate Bursaries', icon: 'business' },
    { id: 'university', name: 'University Scholarships', icon: 'school' },
    { id: 'ngo', name: 'NGO & Foundation Bursaries', icon: 'volunteer_activism' },
    { id: 'sector', name: 'Sector-Specific Bursaries', icon: 'work' },
];

export const BURSARIES = [
    // Government Bursaries
    {
        id: 'nsfas',
        category: 'government',
        name: 'NSFAS - National Student Financial Aid Scheme',
        provider: 'Department of Higher Education',
        description: 'Government funding for students from low-income households to study at public universities and TVET colleges.',
        coverage: ['Tuition fees', 'Accommodation', 'Book allowance', 'Living allowance', 'Transport allowance'],
        eligibility: [
            'South African citizen',
            'Combined household income below R350,000 per year',
            'Admitted to a public university or TVET college',
            'SASSA grant recipients automatically qualify',
        ],
        fieldsOfStudy: ['All fields at public institutions'],
        applicationDeadline: 'November (for following year)',
        website: 'https://www.nsfas.org.za',
        applicationLink: 'https://my.nsfas.org.za',
        contact: '0800 067 327',
        featured: true,
    },
    {
        id: 'funza-lushaka',
        category: 'government',
        name: 'Funza Lushaka Bursary',
        provider: 'Department of Basic Education',
        description: 'Bursary for students who want to become teachers in public schools.',
        coverage: ['Full tuition', 'Accommodation', 'Books', 'Living allowance'],
        eligibility: [
            'South African citizen',
            'Studying towards a teaching qualification (BEd or PGCE)',
            'Commit to teaching in public school for same years as funded',
            'Meet academic requirements',
        ],
        fieldsOfStudy: ['Education - especially Mathematics, Science, Technology, Languages'],
        applicationDeadline: 'January annually',
        website: 'https://www.funzalushaka.doe.gov.za',
        applicationLink: 'https://www.funzalushaka.doe.gov.za/bursaries',
        contact: '0800 202 933',
        featured: true,
    },
    {
        id: 'dhet-scarce-skills',
        category: 'government',
        name: 'DHET Scarce Skills Bursary',
        provider: 'Department of Higher Education',
        description: 'Funding for students studying in fields where there is a skills shortage.',
        coverage: ['Tuition', 'Accommodation', 'Books'],
        eligibility: [
            'South African citizen',
            'Study in a scarce skills field',
            'Meet academic requirements',
        ],
        fieldsOfStudy: ['Engineering', 'Medicine', 'Actuarial Science', 'IT', 'Agriculture'],
        applicationDeadline: 'Varies',
        website: 'https://www.dhet.gov.za',
        contact: '0800 872 222',
    },

    // Corporate Bursaries
    {
        id: 'sasol',
        category: 'corporate',
        name: 'Sasol Bursary Programme',
        provider: 'Sasol Limited',
        description: 'Comprehensive bursary for engineering and science students.',
        coverage: ['Full tuition', 'Accommodation', 'Books', 'Laptop', 'Vacation work'],
        eligibility: [
            'South African citizen',
            'Minimum 70% average in Grade 12',
            'Strong Mathematics and Physical Sciences',
            'Pass psychometric assessment',
        ],
        fieldsOfStudy: ['Chemical Engineering', 'Mechanical Engineering', 'Electrical Engineering', 'Mining Engineering', 'Chemistry'],
        applicationDeadline: 'June - August',
        website: 'https://www.sasol.com/careers/bursaries',
        featured: true,
    },
    {
        id: 'eskom',
        category: 'corporate',
        name: 'Eskom Bursary Scheme',
        provider: 'Eskom Holdings',
        description: 'Bursary for engineering and technical students with vacation work opportunities.',
        coverage: ['Tuition', 'Accommodation', 'Books', 'Stipend', 'Vacation employment'],
        eligibility: [
            'South African citizen',
            'Minimum 60% in Mathematics and Physical Sciences',
            'Studying at a South African university',
        ],
        fieldsOfStudy: ['Electrical Engineering', 'Mechanical Engineering', 'Civil Engineering', 'IT', 'Finance'],
        applicationDeadline: 'March - July',
        website: 'https://www.eskom.co.za/careers',
    },
    {
        id: 'absa',
        category: 'corporate',
        name: 'Absa Bursary Programme',
        provider: 'Absa Group',
        description: 'Banking and finance bursary with work experience opportunities.',
        coverage: ['Tuition fees', 'Books', 'Laptop', 'Internship opportunities'],
        eligibility: [
            'South African citizen',
            'Minimum 65% average',
            'Studying at a South African university',
        ],
        fieldsOfStudy: ['BCom Accounting', 'Finance', 'Economics', 'Information Systems', 'Actuarial Science'],
        applicationDeadline: 'September - November',
        website: 'https://www.absa.co.za/careers',
    },
    {
        id: 'anglogold-ashanti',
        category: 'corporate',
        name: 'AngloGold Ashanti Bursary',
        provider: 'AngloGold Ashanti',
        description: 'Mining industry bursary with practical training.',
        coverage: ['Full tuition', 'Accommodation', 'Books', 'Living allowance'],
        eligibility: [
            'South African citizen',
            'From mining communities (preferred)',
            'Minimum 65% in Maths and Science',
        ],
        fieldsOfStudy: ['Mining Engineering', 'Metallurgy', 'Geology', 'Mechanical Engineering', 'Electrical Engineering'],
        applicationDeadline: 'April - July',
        website: 'https://www.anglogoldashanti.com/careers',
    },
    {
        id: 'standard-bank',
        category: 'corporate',
        name: 'Standard Bank Bursary',
        provider: 'Standard Bank Group',
        description: 'Banking sector bursary for commerce and IT students.',
        coverage: ['Tuition', 'Books', 'Internship', 'Mentorship'],
        eligibility: [
            'South African citizen',
            'Academic excellence',
            'Leadership potential',
        ],
        fieldsOfStudy: ['BCom', 'Finance', 'IT', 'Data Science', 'Actuarial Science'],
        applicationDeadline: 'August - October',
        website: 'https://www.standardbank.co.za/careers',
    },

    // University Scholarships
    {
        id: 'uct-scholarships',
        category: 'university',
        name: 'UCT Merit & Need-Based Scholarships',
        provider: 'University of Cape Town',
        description: 'Various scholarships for academically excellent students.',
        coverage: ['Varies - partial to full funding'],
        eligibility: [
            'Admitted to UCT',
            'Academic excellence (varies by scholarship)',
            'Some scholarships need-based',
        ],
        fieldsOfStudy: ['All fields'],
        applicationDeadline: 'Automatic consideration with admission',
        website: 'https://www.uct.ac.za/students/fees-funding',
    },
    {
        id: 'wits-scholarships',
        category: 'university',
        name: 'Wits Scholarships',
        provider: 'University of the Witwatersrand',
        description: 'Merit and need-based scholarships for undergraduate and postgraduate students.',
        coverage: ['Varies by scholarship'],
        eligibility: [
            'Admitted to Wits',
            'Academic criteria vary',
        ],
        fieldsOfStudy: ['All fields'],
        applicationDeadline: 'With application or after admission',
        website: 'https://www.wits.ac.za/finance/student-fees/bursaries-and-scholarships/',
    },
    {
        id: 'stellenbosch-merit',
        category: 'university',
        name: 'Stellenbosch University Merit Bursaries',
        provider: 'Stellenbosch University',
        description: 'Automatic merit awards for top achieving students.',
        coverage: ['R15,000 - R50,000+ depending on average'],
        eligibility: [
            'First-time entering students',
            '80%+ Grade 12 average for consideration',
        ],
        fieldsOfStudy: ['All fields'],
        applicationDeadline: 'Automatic with admission',
        website: 'https://www.sun.ac.za/english/maties/bursaries',
    },

    // NGO & Foundation
    {
        id: 'allan-gray-orbis',
        category: 'ngo',
        name: 'Allan Gray Orbis Foundation Fellowship',
        provider: 'Allan Gray Orbis Foundation',
        description: 'Prestigious fellowship for future leaders with entrepreneurial potential.',
        coverage: ['Full university costs', 'Laptop', 'Leadership development', 'Mentorship', 'Seed funding for ventures'],
        eligibility: [
            'South African citizen',
            'Grade 12 with 70%+ average',
            'Entrepreneurial mindset',
            'Pass rigorous selection process',
        ],
        fieldsOfStudy: ['Any field at partner universities (UCT, Wits, Stellenbosch, Rhodes, UJ)'],
        applicationDeadline: 'February - March (Grade 11)',
        website: 'https://www.allangrayorbis.org',
        featured: true,
    },
    {
        id: 'oppenheimer-memorial',
        category: 'ngo',
        name: 'Oppenheimer Memorial Trust Scholarships',
        provider: 'Oppenheimer Memorial Trust',
        description: 'Postgraduate scholarships for exceptional students.',
        coverage: ['Full funding for postgraduate study'],
        eligibility: [
            'South African citizen',
            'Honours or Masters student',
            'Academic excellence',
        ],
        fieldsOfStudy: ['All fields'],
        applicationDeadline: 'March',
        website: 'https://www.omt.org.za',
    },
    {
        id: 'tshikululu',
        category: 'ngo',
        name: 'Tshikululu Social Investments Bursary',
        provider: 'Tshikululu Social Investments',
        description: 'Bursaries for previously disadvantaged students.',
        coverage: ['Tuition', 'Accommodation', 'Books'],
        eligibility: [
            'From disadvantaged background',
            'Academic potential',
            'Leadership qualities',
        ],
        fieldsOfStudy: ['Engineering', 'Commerce', 'Science'],
        applicationDeadline: 'Varies',
        website: 'https://www.tshikululu.org.za',
    },

    // Sector-Specific
    {
        id: 'chieta',
        category: 'sector',
        name: 'CHIETA Bursary (Chemical Industries)',
        provider: 'Chemical Industries Education & Training Authority',
        description: 'Bursary for students in chemical-related fields.',
        coverage: ['Tuition', 'Accommodation', 'Books'],
        eligibility: [
            'South African citizen',
            'Studying chemistry-related qualification',
            'Financial need',
        ],
        fieldsOfStudy: ['Chemical Engineering', 'Chemistry', 'Pharmaceutical Sciences'],
        applicationDeadline: 'October - December',
        website: 'https://www.chieta.org.za',
    },
    {
        id: 'merseta',
        category: 'sector',
        name: 'MerSETA Bursary (Manufacturing)',
        provider: 'Manufacturing, Engineering and Related Services SETA',
        description: 'Funding for manufacturing and engineering studies.',
        coverage: ['Tuition', 'Books'],
        eligibility: [
            'South African citizen',
            'Studying engineering or manufacturing-related field',
        ],
        fieldsOfStudy: ['Mechanical Engineering', 'Electrical Engineering', 'Industrial Engineering'],
        applicationDeadline: 'Varies',
        website: 'https://www.merseta.org.za',
    },
    {
        id: 'bankseta',
        category: 'sector',
        name: 'BANKSETA Bursary (Banking Sector)',
        provider: 'Banking Sector Education and Training Authority',
        description: 'Bursary for commerce and finance students.',
        coverage: ['Tuition', 'Books', 'Laptop'],
        eligibility: [
            'South African citizen',
            'Studying banking/finance related field',
            'Academic merit',
        ],
        fieldsOfStudy: ['BCom', 'Finance', 'Economics', 'Accounting', 'IT'],
        applicationDeadline: 'September - November',
        website: 'https://www.bankseta.org.za',
    },
];

/**
 * Get bursaries by category
 */
export function getBursariesByCategory(categoryId) {
    return BURSARIES.filter(b => b.category === categoryId);
}

/**
 * Get featured bursaries
 */
export function getFeaturedBursaries() {
    return BURSARIES.filter(b => b.featured);
}

/**
 * Search bursaries
 */
export function searchBursaries(query) {
    const lowerQuery = query.toLowerCase();
    return BURSARIES.filter(b =>
        b.name.toLowerCase().includes(lowerQuery) ||
        b.provider.toLowerCase().includes(lowerQuery) ||
        b.description.toLowerCase().includes(lowerQuery) ||
        b.fieldsOfStudy.some(f => f.toLowerCase().includes(lowerQuery))
    );
}

/**
 * Get bursaries by field of study
 */
export function getBursariesByField(field) {
    const lowerField = field.toLowerCase();
    return BURSARIES.filter(b =>
        b.fieldsOfStudy.some(f => f.toLowerCase().includes(lowerField))
    );
}

/**
 * Get upcoming deadlines
 */
export function getUpcomingDeadlines() {
    // This would ideally parse dates, but for now returns all with deadlines
    return BURSARIES.filter(b => b.applicationDeadline)
        .sort((a, b) => a.applicationDeadline.localeCompare(b.applicationDeadline));
}

export default {
    BURSARY_CATEGORIES,
    BURSARIES,
    getBursariesByCategory,
    getFeaturedBursaries,
    searchBursaries,
    getBursariesByField,
    getUpcomingDeadlines,
};

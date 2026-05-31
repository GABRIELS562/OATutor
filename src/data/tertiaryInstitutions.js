/**
 * South African Tertiary Institutions Database
 *
 * Universities, Universities of Technology, and TVET Colleges
 */

export const INSTITUTION_TYPES = [
    { id: 'university', name: 'Universities', icon: 'school' },
    { id: 'uot', name: 'Universities of Technology', icon: 'precision_manufacturing' },
    { id: 'tvet', name: 'TVET Colleges', icon: 'build' },
    { id: 'private', name: 'Private Institutions', icon: 'domain' },
];

export const PROVINCES = [
    { id: 'gp', name: 'Gauteng' },
    { id: 'wc', name: 'Western Cape' },
    { id: 'kzn', name: 'KwaZulu-Natal' },
    { id: 'ec', name: 'Eastern Cape' },
    { id: 'fs', name: 'Free State' },
    { id: 'nw', name: 'North West' },
    { id: 'mp', name: 'Mpumalanga' },
    { id: 'lp', name: 'Limpopo' },
    { id: 'nc', name: 'Northern Cape' },
];

export const INSTITUTIONS = [
    // Traditional Universities
    {
        id: 'uct',
        type: 'university',
        name: 'University of Cape Town',
        shortName: 'UCT',
        province: 'wc',
        city: 'Cape Town',
        established: 1829,
        ranking: 1,
        description: 'Africa\'s leading research university, known for excellence in research and teaching.',
        website: 'https://www.uct.ac.za',
        applyLink: 'https://applyonline.uct.ac.za',
        faculties: [
            'Commerce', 'Engineering & Built Environment', 'Health Sciences',
            'Humanities', 'Law', 'Science'
        ],
        notablePrograms: ['Medicine', 'Actuarial Science', 'Engineering', 'Law', 'Commerce'],
        apsRange: '35-45+',
        applicationDeadline: '31 July',
        accommodationAvailable: true,
        nsfasAccredited: true,
        contact: {
            phone: '021 650 9111',
            email: 'admissions@uct.ac.za',
        },
    },
    {
        id: 'wits',
        type: 'university',
        name: 'University of the Witwatersrand',
        shortName: 'Wits',
        province: 'gp',
        city: 'Johannesburg',
        established: 1896,
        ranking: 2,
        description: 'A leading African research university located in the economic hub of South Africa.',
        website: 'https://www.wits.ac.za',
        applyLink: 'https://www.wits.ac.za/applications/',
        faculties: [
            'Commerce, Law and Management', 'Engineering & Built Environment',
            'Health Sciences', 'Humanities', 'Science'
        ],
        notablePrograms: ['Mining Engineering', 'Medicine', 'Law', 'Business', 'Sciences'],
        apsRange: '32-42+',
        applicationDeadline: '30 September',
        accommodationAvailable: true,
        nsfasAccredited: true,
        contact: {
            phone: '011 717 1000',
            email: 'studentenquiries@wits.ac.za',
        },
    },
    {
        id: 'stellenbosch',
        type: 'university',
        name: 'Stellenbosch University',
        shortName: 'SU / Maties',
        province: 'wc',
        city: 'Stellenbosch',
        established: 1866,
        ranking: 3,
        description: 'A research-intensive university known for innovation and academic excellence.',
        website: 'https://www.sun.ac.za',
        applyLink: 'https://www.sun.ac.za/english/maties/apply-now',
        faculties: [
            'AgriSciences', 'Arts & Social Sciences', 'Economic & Management Sciences',
            'Education', 'Engineering', 'Law', 'Medicine & Health Sciences',
            'Military Science', 'Science', 'Theology'
        ],
        notablePrograms: ['Engineering', 'AgriSciences', 'Business', 'Medicine'],
        apsRange: '32-40+',
        applicationDeadline: '30 June',
        accommodationAvailable: true,
        nsfasAccredited: true,
        contact: {
            phone: '021 808 9111',
            email: 'info@sun.ac.za',
        },
    },
    {
        id: 'up',
        type: 'university',
        name: 'University of Pretoria',
        shortName: 'UP / Tuks',
        province: 'gp',
        city: 'Pretoria',
        established: 1908,
        ranking: 4,
        description: 'One of South Africa\'s largest residential universities with comprehensive programs.',
        website: 'https://www.up.ac.za',
        applyLink: 'https://www.up.ac.za/online-application',
        faculties: [
            'Economic & Management Sciences', 'Education', 'Engineering, Built Environment & IT',
            'Health Sciences', 'Humanities', 'Law', 'Natural & Agricultural Sciences',
            'Theology & Religion', 'Veterinary Science'
        ],
        notablePrograms: ['Veterinary Science', 'Engineering', 'Medicine', 'Law'],
        apsRange: '30-40+',
        applicationDeadline: '30 June',
        accommodationAvailable: true,
        nsfasAccredited: true,
        contact: {
            phone: '012 420 4111',
            email: 'csc@up.ac.za',
        },
    },
    {
        id: 'ukzn',
        type: 'university',
        name: 'University of KwaZulu-Natal',
        shortName: 'UKZN',
        province: 'kzn',
        city: 'Durban / Pietermaritzburg',
        established: 2004,
        ranking: 5,
        description: 'A comprehensive university with campuses in Durban and Pietermaritzburg.',
        website: 'https://www.ukzn.ac.za',
        applyLink: 'https://applications.ukzn.ac.za/',
        faculties: [
            'Agriculture, Engineering & Science', 'Health Sciences',
            'Humanities', 'Law & Management Studies'
        ],
        notablePrograms: ['Medicine', 'Engineering', 'Agriculture', 'Law'],
        apsRange: '28-38+',
        applicationDeadline: '30 September',
        accommodationAvailable: true,
        nsfasAccredited: true,
        contact: {
            phone: '031 260 1111',
            email: 'enquiries@ukzn.ac.za',
        },
    },
    {
        id: 'uj',
        type: 'university',
        name: 'University of Johannesburg',
        shortName: 'UJ',
        province: 'gp',
        city: 'Johannesburg',
        established: 2005,
        ranking: 6,
        description: 'A comprehensive university offering a wide range of programs across multiple campuses.',
        website: 'https://www.uj.ac.za',
        applyLink: 'https://www.uj.ac.za/studyatUJ/apply-to-uj/',
        faculties: [
            'Art, Design & Architecture', 'College of Business & Economics',
            'Education', 'Engineering & Built Environment',
            'Health Sciences', 'Humanities', 'Law', 'Science'
        ],
        notablePrograms: ['Engineering', 'Accounting', 'IT', 'Design'],
        apsRange: '26-36+',
        applicationDeadline: '30 September',
        accommodationAvailable: true,
        nsfasAccredited: true,
        contact: {
            phone: '011 559 4555',
            email: 'studentenquiries@uj.ac.za',
        },
    },
    {
        id: 'rhodes',
        type: 'university',
        name: 'Rhodes University',
        shortName: 'Rhodes',
        province: 'ec',
        city: 'Makhanda (Grahamstown)',
        established: 1904,
        ranking: 7,
        description: 'A small, intimate university known for its excellent student-to-staff ratio.',
        website: 'https://www.ru.ac.za',
        applyLink: 'https://www.ru.ac.za/admissionshub/',
        faculties: [
            'Commerce', 'Education', 'Humanities', 'Law', 'Pharmacy', 'Science'
        ],
        notablePrograms: ['Pharmacy', 'Journalism', 'Law', 'Computer Science'],
        apsRange: '30-38+',
        applicationDeadline: '30 September',
        accommodationAvailable: true,
        nsfasAccredited: true,
        contact: {
            phone: '046 603 8111',
            email: 'registrar@ru.ac.za',
        },
    },
    {
        id: 'ufs',
        type: 'university',
        name: 'University of the Free State',
        shortName: 'UFS / Kovsies',
        province: 'fs',
        city: 'Bloemfontein',
        established: 1904,
        ranking: 8,
        description: 'A multicultural university with strong research focus.',
        website: 'https://www.ufs.ac.za',
        applyLink: 'https://www.ufs.ac.za/prospective-students',
        faculties: [
            'Economic & Management Sciences', 'Education', 'Health Sciences',
            'Humanities', 'Law', 'Natural & Agricultural Sciences', 'Theology'
        ],
        notablePrograms: ['Medicine', 'Agriculture', 'Law', 'Education'],
        apsRange: '28-36+',
        applicationDeadline: '30 September',
        accommodationAvailable: true,
        nsfasAccredited: true,
        contact: {
            phone: '051 401 3000',
            email: 'info@ufs.ac.za',
        },
    },
    {
        id: 'nwu',
        type: 'university',
        name: 'North-West University',
        shortName: 'NWU',
        province: 'nw',
        city: 'Potchefstroom / Mahikeng / Vanderbijlpark',
        established: 2004,
        ranking: 9,
        description: 'A multi-campus university with strong focus on research and innovation.',
        website: 'https://www.nwu.ac.za',
        applyLink: 'https://studies.nwu.ac.za/',
        faculties: [
            'Economic & Management Sciences', 'Education', 'Engineering',
            'Health Sciences', 'Humanities', 'Law', 'Natural & Agricultural Sciences', 'Theology'
        ],
        notablePrograms: ['Pharmacy', 'Engineering', 'Education', 'BCom'],
        apsRange: '26-34+',
        applicationDeadline: '30 September',
        accommodationAvailable: true,
        nsfasAccredited: true,
        contact: {
            phone: '018 299 1111',
            email: 'info@nwu.ac.za',
        },
    },

    // Universities of Technology
    {
        id: 'cput',
        type: 'uot',
        name: 'Cape Peninsula University of Technology',
        shortName: 'CPUT',
        province: 'wc',
        city: 'Cape Town',
        established: 2005,
        description: 'The only university of technology in the Western Cape, focused on career-oriented programs.',
        website: 'https://www.cput.ac.za',
        applyLink: 'https://www.cput.ac.za/study/apply',
        faculties: [
            'Applied Sciences', 'Business & Management Sciences', 'Education',
            'Engineering & Built Environment', 'Health & Wellness Sciences', 'Informatics & Design'
        ],
        notablePrograms: ['Engineering', 'IT', 'Design', 'Business'],
        apsRange: '22-30+',
        applicationDeadline: '30 September',
        accommodationAvailable: true,
        nsfasAccredited: true,
        contact: {
            phone: '021 959 6767',
            email: 'info@cput.ac.za',
        },
    },
    {
        id: 'tut',
        type: 'uot',
        name: 'Tshwane University of Technology',
        shortName: 'TUT',
        province: 'gp',
        city: 'Pretoria',
        established: 2004,
        description: 'The largest residential university in South Africa with a focus on practical training.',
        website: 'https://www.tut.ac.za',
        applyLink: 'https://www.tut.ac.za/Prospective/Howto/Pages/Apply.aspx',
        faculties: [
            'Arts & Design', 'Economics & Finance', 'Engineering & Built Environment',
            'Humanities', 'ICT', 'Management Sciences', 'Science'
        ],
        notablePrograms: ['Engineering', 'IT', 'Hospitality', 'Journalism'],
        apsRange: '22-30+',
        applicationDeadline: '31 October',
        accommodationAvailable: true,
        nsfasAccredited: true,
        contact: {
            phone: '086 110 2421',
            email: 'general@tut.ac.za',
        },
    },
    {
        id: 'dut',
        type: 'uot',
        name: 'Durban University of Technology',
        shortName: 'DUT',
        province: 'kzn',
        city: 'Durban',
        established: 2002,
        description: 'A university of technology offering career-focused qualifications in KZN.',
        website: 'https://www.dut.ac.za',
        applyLink: 'https://www.dut.ac.za/apply-online/',
        faculties: [
            'Accounting & Informatics', 'Applied Sciences', 'Arts & Design',
            'Engineering & Built Environment', 'Health Sciences', 'Management Sciences'
        ],
        notablePrograms: ['Engineering', 'IT', 'Health Sciences', 'Design'],
        apsRange: '22-28+',
        applicationDeadline: '30 September',
        accommodationAvailable: true,
        nsfasAccredited: true,
        contact: {
            phone: '031 373 2000',
            email: 'info@dut.ac.za',
        },
    },

    // TVET Colleges (Sample)
    {
        id: 'central-jburg-tvet',
        type: 'tvet',
        name: 'Central Johannesburg TVET College',
        shortName: 'CJC',
        province: 'gp',
        city: 'Johannesburg',
        description: 'Offers technical and vocational programs for skills development.',
        website: 'https://www.cjc.edu.za',
        applyLink: 'https://www.cjc.edu.za/apply',
        programs: [
            'N1-N6 Engineering Studies', 'NCV Programs', 'Business Studies',
            'IT', 'Hospitality', 'Education & Development'
        ],
        nsfasAccredited: true,
        contact: {
            phone: '011 351 6000',
            email: 'info@cjc.edu.za',
        },
    },
    {
        id: 'false-bay-tvet',
        type: 'tvet',
        name: 'False Bay TVET College',
        shortName: 'False Bay',
        province: 'wc',
        city: 'Cape Town',
        description: 'One of the leading TVET colleges in the Western Cape.',
        website: 'https://www.falsebaycollege.co.za',
        applyLink: 'https://www.falsebaycollege.co.za/apply-online',
        programs: [
            'Engineering Studies', 'Business Studies', 'IT',
            'Hospitality', 'Tourism', 'Safety in Society'
        ],
        nsfasAccredited: true,
        contact: {
            phone: '021 787 0800',
            email: 'info@falsebaycollege.co.za',
        },
    },
];

/**
 * Get institutions by type
 */
export function getInstitutionsByType(typeId) {
    return INSTITUTIONS.filter(i => i.type === typeId);
}

/**
 * Get institutions by province
 */
export function getInstitutionsByProvince(provinceId) {
    return INSTITUTIONS.filter(i => i.province === provinceId);
}

/**
 * Get institution by ID
 */
export function getInstitutionById(id) {
    return INSTITUTIONS.find(i => i.id === id);
}

/**
 * Search institutions
 */
export function searchInstitutions(query) {
    const lowerQuery = query.toLowerCase();
    return INSTITUTIONS.filter(i =>
        i.name.toLowerCase().includes(lowerQuery) ||
        i.shortName?.toLowerCase().includes(lowerQuery) ||
        i.city?.toLowerCase().includes(lowerQuery) ||
        i.faculties?.some(f => f.toLowerCase().includes(lowerQuery)) ||
        i.notablePrograms?.some(p => p.toLowerCase().includes(lowerQuery))
    );
}

/**
 * Get institutions by program/faculty
 */
export function getInstitutionsByProgram(program) {
    const lowerProgram = program.toLowerCase();
    return INSTITUTIONS.filter(i =>
        i.faculties?.some(f => f.toLowerCase().includes(lowerProgram)) ||
        i.notablePrograms?.some(p => p.toLowerCase().includes(lowerProgram))
    );
}

export default {
    INSTITUTION_TYPES,
    PROVINCES,
    INSTITUTIONS,
    getInstitutionsByType,
    getInstitutionsByProvince,
    getInstitutionById,
    searchInstitutions,
    getInstitutionsByProgram,
};

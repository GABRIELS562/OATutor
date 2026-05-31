/**
 * Past Papers Seed Data
 *
 * Metadata for SA CAPS past examination papers
 * PDFs stored locally in: /papers/<subject>/<grade>/<year>_<paper>_<lang>.pdf
 *
 * Subjects: Mathematics, Physical Sciences
 * Grades: 10, 11, 12
 * Languages: English (en), Afrikaans (af)
 */

// Generate paper ID
const generatePaperId = (subject, grade, year, paperNum, examType, language) => {
    return `${subject.substring(0, 4)}-gr${grade}-${year}-p${paperNum}-${examType}-${language}`;
};

// Generate file paths
const generatePaperPath = (subject, grade, year, paperNum, examType, language) => {
    const subjectFolder = subject === 'mathematics' ? 'mathematics' : 'physical_sciences';
    const filename = `${year}_${examType}_p${paperNum}_${language}.pdf`;
    return `/papers/${subjectFolder}/grade${grade}/${filename}`;
};

const generateMemoPath = (subject, grade, year, paperNum, examType, language) => {
    const subjectFolder = subject === 'mathematics' ? 'mathematics' : 'physical_sciences';
    const filename = `${year}_${examType}_p${paperNum}_${language}_memo.pdf`;
    return `/papers/${subjectFolder}/grade${grade}/${filename}`;
};

// Years with DBE papers available
const DBE_YEARS = [2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014, 2013, 2012, 2011, 2010, 2009];

// Topic tags for each paper type
const MATHS_TOPICS = {
    p1: ['algebra', 'sequences', 'functions', 'calculus', 'financial_maths', 'probability'],
    p2: ['trigonometry', 'geometry', 'statistics', 'analytical_geometry'],
};

const PHYSICS_TOPICS = {
    p1: ['mechanics', 'momentum', 'work_energy_power', 'waves', 'electricity', 'magnetism'],
    p2: ['organic_chemistry', 'chemical_change', 'electrochemistry', 'chemical_industry'],
};

// Generate seed data
export function generatePastPapersSeed() {
    const papers = [];

    // Generate papers for each subject, grade, year
    const subjects = ['mathematics', 'physical_sciences'];
    const grades = [10, 11, 12];
    const languages = ['en', 'af'];
    const paperNumbers = [1, 2];

    for (const subject of subjects) {
        for (const grade of grades) {
            for (const year of DBE_YEARS) {
                for (const paperNum of paperNumbers) {
                    for (const lang of languages) {
                        // NSC (DBE) papers
                        const nscPaper = {
                            id: generatePaperId(subject, grade, year, paperNum, 'nsc', lang),
                            subject,
                            grade,
                            year,
                            paper_number: paperNum,
                            exam_type: 'nsc',
                            language: lang,
                            province: null,
                            paper_path: generatePaperPath(subject, grade, year, paperNum, 'nsc', lang),
                            memo_path: generateMemoPath(subject, grade, year, paperNum, 'nsc', lang),
                            is_available: year >= 2019 ? 1 : 0, // Only recent years available initially
                            file_size_bytes: null,
                            topics: subject === 'mathematics'
                                ? MATHS_TOPICS[`p${paperNum}`]
                                : PHYSICS_TOPICS[`p${paperNum}`],
                        };
                        papers.push(nscPaper);

                        // Supplementary papers (March) - Grade 12 only, recent years
                        if (grade === 12 && year >= 2019 && lang === 'en') {
                            const suppPaper = {
                                ...nscPaper,
                                id: generatePaperId(subject, grade, year, paperNum, 'supplementary', lang),
                                exam_type: 'supplementary',
                                paper_path: generatePaperPath(subject, grade, year, paperNum, 'supplementary', lang),
                                memo_path: generateMemoPath(subject, grade, year, paperNum, 'supplementary', lang),
                                is_available: 0, // Supplementary less commonly available
                            };
                            papers.push(suppPaper);
                        }
                    }
                }
            }
        }
    }

    // Add some provincial trial papers (Gauteng, Western Cape, KZN)
    const provinces = [
        { name: 'gauteng', displayName: 'Gauteng' },
        { name: 'western_cape', displayName: 'Western Cape' },
        { name: 'kzn', displayName: 'KwaZulu-Natal' },
    ];

    const provincialYears = [2024, 2023, 2022, 2021, 2020];

    for (const province of provinces) {
        for (const subject of subjects) {
            for (const year of provincialYears) {
                for (const paperNum of paperNumbers) {
                    const provPaper = {
                        id: generatePaperId(subject, 12, year, paperNum, province.name, 'en'),
                        subject,
                        grade: 12,
                        year,
                        paper_number: paperNum,
                        exam_type: 'provincial',
                        language: 'en',
                        province: province.displayName,
                        paper_path: generatePaperPath(subject, 12, year, paperNum, province.name, 'en'),
                        memo_path: generateMemoPath(subject, 12, year, paperNum, province.name, 'en'),
                        is_available: year >= 2022 ? 1 : 0,
                        file_size_bytes: null,
                        topics: subject === 'mathematics'
                            ? MATHS_TOPICS[`p${paperNum}`]
                            : PHYSICS_TOPICS[`p${paperNum}`],
                    };
                    papers.push(provPaper);
                }
            }
        }
    }

    return papers;
}

// Get all seed papers
export const SEED_PAPERS = generatePastPapersSeed();

// Filter functions
export function filterPapers(papers, filters = {}) {
    return papers.filter(paper => {
        if (filters.subject && paper.subject !== filters.subject) return false;
        if (filters.grade && paper.grade !== parseInt(filters.grade)) return false;
        if (filters.year && paper.year !== parseInt(filters.year)) return false;
        if (filters.paper_number && paper.paper_number !== parseInt(filters.paper_number)) return false;
        if (filters.language && paper.language !== filters.language) return false;
        if (filters.exam_type && paper.exam_type !== filters.exam_type) return false;
        if (filters.availableOnly && !paper.is_available) return false;
        return true;
    });
}

// Get unique values for filters
export function getFilterOptions(papers) {
    const years = [...new Set(papers.map(p => p.year))].sort((a, b) => b - a);
    const subjects = [...new Set(papers.map(p => p.subject))];
    const grades = [...new Set(papers.map(p => p.grade))].sort((a, b) => a - b);
    const examTypes = [...new Set(papers.map(p => p.exam_type))];
    const provinces = [...new Set(papers.filter(p => p.province).map(p => p.province))];

    return { years, subjects, grades, examTypes, provinces };
}

// Seed the database
export async function seedPastPapers(db) {
    console.debug('Seeding past papers...');

    const papers = SEED_PAPERS;

    for (const paper of papers) {
        await db.addPaper(paper);
    }

    console.debug(`Seeded ${papers.length} past papers`);
}

// Stats
export const PAPER_STATS = {
    totalPapers: SEED_PAPERS.length,
    availablePapers: SEED_PAPERS.filter(p => p.is_available).length,
    bySubject: {
        mathematics: SEED_PAPERS.filter(p => p.subject === 'mathematics').length,
        physical_sciences: SEED_PAPERS.filter(p => p.subject === 'physical_sciences').length,
    },
    byGrade: {
        10: SEED_PAPERS.filter(p => p.grade === 10).length,
        11: SEED_PAPERS.filter(p => p.grade === 11).length,
        12: SEED_PAPERS.filter(p => p.grade === 12).length,
    },
    yearRange: {
        min: Math.min(...DBE_YEARS),
        max: Math.max(...DBE_YEARS),
    },
};

export default {
    SEED_PAPERS,
    filterPapers,
    getFilterOptions,
    seedPastPapers,
    PAPER_STATS,
    generatePaperPath,
    generateMemoPath,
};

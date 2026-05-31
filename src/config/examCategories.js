// Exam Categories Configuration
// Used for filtering lessons by exam type (JSDT Solutions style)

export const EXAM_CATEGORIES = [
    {
        id: 'all',
        name: 'All Content',
        shortName: 'All',
        icon: 'apps',
        color: '#64748B',
        description: 'View all available content'
    },
    {
        id: 'activities',
        name: 'Activities',
        shortName: 'Activities',
        icon: 'assignment',
        color: '#58CC02',
        description: 'Interactive learning activities'
    },
    {
        id: 'practice',
        name: 'Practice Problems',
        shortName: 'Practice',
        icon: 'school',
        color: '#1CB0F6',
        description: 'General practice problems'
    },
    {
        id: 'march-test',
        name: 'March Tests',
        shortName: 'March',
        icon: 'quiz',
        color: '#10B981',
        description: 'Term 1 assessment preparation'
    },
    {
        id: 'june-exam',
        name: 'June Exams',
        shortName: 'June',
        icon: 'assignment_turned_in',
        color: '#F59E0B',
        description: 'Mid-year exam preparation'
    },
    {
        id: 'sept-test',
        name: 'September Tests',
        shortName: 'Sept',
        icon: 'quiz',
        color: '#EF4444',
        description: 'Term 3 / Preliminary exam preparation'
    },
    {
        id: 'nov-exam',
        name: 'November Exams',
        shortName: 'Nov',
        icon: 'star',
        color: '#FF9600',
        description: 'Final exam (NSC/IEB) preparation'
    },
    {
        id: 'ieb',
        name: 'IEB Papers',
        shortName: 'IEB',
        icon: 'description',
        color: '#6366F1',
        description: 'Independent Examinations Board papers'
    }
];

/**
 * Get a category by its ID
 * @param {string} id - Category ID
 * @returns {Object|undefined} Category object or undefined
 */
export const getCategoryById = (id) =>
    EXAM_CATEGORIES.find(cat => cat.id === id);

/**
 * Get the color for a category
 * @param {string} id - Category ID
 * @returns {string} Color hex code
 */
export const getCategoryColor = (id) =>
    getCategoryById(id)?.color || '#64748B';

/**
 * Get the short name for a category (used on mobile)
 * @param {string} id - Category ID
 * @returns {string} Short name
 */
export const getCategoryShortName = (id) =>
    getCategoryById(id)?.shortName || getCategoryById(id)?.name || id;

/**
 * Get all category IDs except 'all'
 * @returns {string[]} Array of category IDs
 */
export const getFilterableCategoryIds = () =>
    EXAM_CATEGORIES.filter(cat => cat.id !== 'all').map(cat => cat.id);

export default EXAM_CATEGORIES;

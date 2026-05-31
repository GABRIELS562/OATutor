// Business Links Configuration
// Customizable links for tutoring services, team recruitment, and external resources
// Based on JSDT Solutions-style business features

export const BUSINESS_LINKS = [
    {
        id: 'book-tutoring',
        name: 'Book Online Tutoring',
        shortName: 'Book Tutoring',
        description: 'Schedule a one-on-one session with our expert tutors',
        icon: 'event',
        color: '#58CC02',
        gradient: '#58CC02',
        url: 'https://calendly.com/angelo-tutoring', // Replace with actual booking link
        external: true,
        featured: true,
        order: 1
    },
    {
        id: 'join-team',
        name: 'Join Our Tutoring Team',
        shortName: 'Join Team',
        description: 'Become a tutor and help students succeed',
        icon: 'people',
        color: '#10B981',
        gradient: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
        url: 'https://forms.gle/angelo-tutoring-apply', // Replace with actual application form
        external: true,
        featured: true,
        order: 2
    },
    {
        id: 'visit-website',
        name: 'Visit Our Website',
        shortName: 'Website',
        description: 'Learn more about Angelo Tutoring services',
        icon: 'language',
        color: '#1CB0F6',
        gradient: '#1CB0F6',
        url: 'https://angelotutoring.co.za', // Replace with actual website
        external: true,
        featured: false,
        order: 3
    },
    {
        id: 'maths-coach',
        name: 'The Maths Coach',
        shortName: 'Maths Coach',
        description: 'Additional resources and coaching tips',
        icon: 'school',
        color: '#F59E0B',
        gradient: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
        url: 'https://themathscoach.co.za', // Replace with actual resource link
        external: true,
        featured: false,
        order: 4
    },
    {
        id: 'whatsapp',
        name: 'WhatsApp Us',
        shortName: 'WhatsApp',
        description: 'Get quick answers via WhatsApp',
        icon: 'chat',
        color: '#25D366',
        gradient: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
        url: 'https://wa.me/27XXXXXXXXXX', // Replace with actual WhatsApp number
        external: true,
        featured: true,
        order: 5
    },
    {
        id: 'youtube',
        name: 'Video Tutorials',
        shortName: 'Videos',
        description: 'Watch free video lessons on YouTube',
        icon: 'play_circle',
        color: '#FF0000',
        gradient: 'linear-gradient(135deg, #FF0000 0%, #CC0000 100%)',
        url: 'https://youtube.com/@angelotutoring', // Replace with actual YouTube channel
        external: true,
        featured: false,
        order: 6
    }
];

/**
 * Get a business link by its ID
 * @param {string} id - Link ID
 * @returns {Object|undefined} Link object or undefined
 */
export const getBusinessLinkById = (id) =>
    BUSINESS_LINKS.find(link => link.id === id);

/**
 * Get featured business links (shown prominently)
 * @returns {Array} Array of featured link objects
 */
export const getFeaturedLinks = () =>
    BUSINESS_LINKS.filter(link => link.featured).sort((a, b) => a.order - b.order);

/**
 * Get all business links sorted by order
 * @returns {Array} Array of all link objects
 */
export const getAllLinks = () =>
    [...BUSINESS_LINKS].sort((a, b) => a.order - b.order);

/**
 * Get non-featured business links
 * @returns {Array} Array of non-featured link objects
 */
export const getSecondaryLinks = () =>
    BUSINESS_LINKS.filter(link => !link.featured).sort((a, b) => a.order - b.order);

export default BUSINESS_LINKS;

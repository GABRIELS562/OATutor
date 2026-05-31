// Angelo Tutoring - Duolingo-Inspired Custom Styles
const angeloColors = {
    primary: '#58CC02',      // Duolingo Green
    secondary: '#1CB0F6',    // Duolingo Blue
    accent: '#FF9600',       // Duolingo Orange
    success: '#58CC02',      // Green
    warning: '#FFC800',      // Yellow
    error: '#FF4B4B',        // Red
    background: '#FFFFFF',
    dark: '#131F24',
    darkPaper: '#1A2A31',
    text: '#3C3C3C',
    textSecondary: '#777777',
    // Extra Duolingo colors
    greenDark: '#58A700',
    blueDark: '#1899D6',
    purple: '#CE82FF',
};

const gradients = {
    primary: 'linear-gradient(135deg, #58CC02 0%, #89E219 100%)',
    button: '#58CC02',  // Solid green for Duolingo style
    success: '#58CC02',
    card: 'linear-gradient(180deg, rgba(88, 204, 2, 0.02) 0%, rgba(28, 176, 246, 0.02) 100%)',
};

const styles = theme => ({
    // Main problem card - responsive width
    card: {
        width: '65%',
        marginLeft: 'auto',
        marginRight: 'auto',
        marginBottom: 20,
        borderRadius: 16,
        boxShadow: '0 4px 25px rgba(123, 47, 247, 0.08)',
        border: '1px solid rgba(123, 47, 247, 0.08)',
        background: `${gradients.card}, #FFFFFF`,
        transition: 'all 0.3s ease',
        // Tablet
        [theme.breakpoints.down('md')]: {
            width: '80%',
            borderRadius: 14,
        },
        // Mobile
        [theme.breakpoints.down('sm')]: {
            width: '95%',
            marginLeft: '2.5%',
            marginRight: '2.5%',
            marginBottom: 16,
            borderRadius: 12,
        },
        // Small phones
        [theme.breakpoints.down('xs')]: {
            width: 'calc(100% - 16px)',
            marginLeft: '8px',
            marginRight: '8px',
            marginBottom: 12,
            borderRadius: 10,
        },
        '&:hover': {
            boxShadow: '0 8px 35px rgba(123, 47, 247, 0.15)',
            transform: 'translateY(-3px)',
            borderColor: 'rgba(123, 47, 247, 0.15)',
            // Disable hover transform on touch devices
            '@media (hover: none)': {
                transform: 'none',
                boxShadow: '0 4px 25px rgba(123, 47, 247, 0.08)',
            },
        },
    },

    // Hint card - responsive
    hintCard: {
        width: '40em',
        maxWidth: '90%',
        marginLeft: 'auto',
        marginRight: 'auto',
        marginBottom: 20,
        borderRadius: 12,
        borderLeft: `4px solid ${angeloColors.secondary}`,
        backgroundColor: 'rgba(0, 212, 255, 0.04)',
        boxShadow: '0 2px 12px rgba(0, 212, 255, 0.1)',
        [theme.breakpoints.down('sm')]: {
            width: '95%',
            marginBottom: 16,
            borderRadius: 10,
        },
        [theme.breakpoints.down('xs')]: {
            width: 'calc(100% - 16px)',
            marginLeft: '8px',
            marginRight: '8px',
            borderRadius: 8,
        },
    },

    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
    },

    title: {
        fontSize: 14,
        color: angeloColors.primary,
        fontWeight: 600,
        [theme.breakpoints.down('xs')]: {
            fontSize: 13,
        },
    },

    pos: {
        marginBottom: 12,
        [theme.breakpoints.down('xs')]: {
            marginBottom: 8,
        },
    },

    // Button - Duolingo 3D style
    button: {
        background: '#58CC02',
        color: '#FFFFFF',
        marginLeft: 'auto',
        marginRight: 'auto',
        paddingLeft: 28,
        paddingRight: 28,
        paddingTop: 12,
        paddingBottom: 12,
        borderRadius: 16,
        fontWeight: 700,
        textTransform: 'none',
        boxShadow: '0 4px 0 0 #58A700',
        transition: 'all 0.1s ease',
        border: 'none',
        minHeight: 44,
        fontSize: '1rem',
        fontFamily: '"Nunito", sans-serif',
        [theme.breakpoints.down('sm')]: {
            paddingLeft: 20,
            paddingRight: 20,
            minHeight: 48,
            fontSize: '1rem',
        },
        [theme.breakpoints.down('xs')]: {
            paddingLeft: 16,
            paddingRight: 16,
            minHeight: 52,
            width: '100%',
            fontSize: '1.05rem',
        },
        '&:hover': {
            background: '#89E219',
            boxShadow: '0 4px 0 0 #58CC02',
            transform: 'none',
        },
        '&:active': {
            boxShadow: '0 2px 0 0 #58A700',
            transform: 'translateY(2px)',
        },
        '&:disabled': {
            background: '#E5E5E5',
            color: '#AFAFAF',
            boxShadow: '0 4px 0 0 #CDCDCD',
        },
    },

    successButton: {
        background: gradients.success,
        color: '#FFFFFF',
        boxShadow: '0 4px 15px rgba(16, 185, 129, 0.35)',
        '&:hover': {
            background: gradients.success,
            boxShadow: '0 6px 20px rgba(16, 185, 129, 0.45)',
        },
    },

    // View Answer Button - Cyan/Blue theme to differentiate from purple hints
    viewAnswerButton: {
        background: 'linear-gradient(135deg, #0891B2 0%, #00D4FF 100%)',
        color: '#FFFFFF',
        padding: '8px 16px',
        borderRadius: 8,
        fontWeight: 600,
        textTransform: 'none',
        fontSize: '0.85rem',
        minHeight: 44,
        boxShadow: '0 2px 10px rgba(0, 212, 255, 0.3)',
        transition: 'all 0.3s ease',
        border: 'none',
        [theme.breakpoints.down('sm')]: {
            padding: '6px 12px',
            fontSize: '0.8rem',
            minHeight: 46,
        },
        [theme.breakpoints.down('xs')]: {
            padding: '8px 10px',
            fontSize: '0.8rem',
            minHeight: 48,
        },
        '&:hover': {
            background: 'linear-gradient(135deg, #0891B2 0%, #00D4FF 100%)',
            boxShadow: '0 4px 15px rgba(0, 212, 255, 0.4)',
            transform: 'translateY(-1px)',
            '@media (hover: none)': {
                transform: 'none',
            },
        },
        '&:active': {
            transform: 'scale(0.98)',
        },
        '&:disabled': {
            background: '#E2E8F0',
            color: '#94A3B8',
            boxShadow: 'none',
        },
    },

    // Step header - responsive typography
    stepHeader: {
        fontSize: 20,
        marginTop: 0,
        marginLeft: 10,
        fontWeight: 600,
        color: 'inherit',
        [theme.breakpoints.down('sm')]: {
            fontSize: 18,
            marginLeft: 8,
        },
        [theme.breakpoints.down('xs')]: {
            fontSize: 17,
            marginLeft: 4,
        },
    },

    // Step body - readable on mobile
    stepBody: {
        fontSize: 18,
        marginTop: 10,
        marginBottom: 30,
        marginLeft: 10,
        color: 'inherit',
        lineHeight: 1.7,
        [theme.breakpoints.down('sm')]: {
            fontSize: 17,
            marginLeft: 8,
            marginBottom: 24,
            lineHeight: 1.65,
        },
        [theme.breakpoints.down('xs')]: {
            fontSize: 16,
            marginLeft: 4,
            marginBottom: 20,
            marginTop: 8,
            lineHeight: 1.6,
        },
    },

    inputField: {
        width: '100%',
        textAlign: 'center',
    },

    muiUsedHint: {
        borderWidth: '2px',
        borderColor: `${angeloColors.secondary} !important`,
        boxShadow: `0 0 0 3px rgba(0, 212, 255, 0.15)`,
    },

    inputHintField: {
        width: '10em',
        [theme.breakpoints.down('xs')]: {
            width: '100%',
        },
    },

    center: {
        marginLeft: '19em',
        marginRight: '19em',
        marginTop: '1em',
        [theme.breakpoints.down('md')]: {
            marginLeft: '8em',
            marginRight: '8em',
        },
        [theme.breakpoints.down('sm')]: {
            marginLeft: '2em',
            marginRight: '2em',
        },
        [theme.breakpoints.down('xs')]: {
            marginLeft: '1em',
            marginRight: '1em',
        },
    },

    checkImage: {
        width: '3em',
        marginLeft: '0.5em',
        [theme.breakpoints.down('xs')]: {
            width: '2.5em',
            marginLeft: '0.25em',
        },
    },

    root: {
        flexGrow: 1,
    },

    paper: {
        padding: theme.spacing(3, 2),
        borderRadius: 16,
        boxShadow: '0 4px 25px rgba(123, 47, 247, 0.08)',
        transition: 'all 0.3s ease',
        border: '1px solid rgba(123, 47, 247, 0.08)',
        background: `${gradients.card}, #FFFFFF`,
        [theme.breakpoints.down('sm')]: {
            padding: theme.spacing(2, 1.5),
            borderRadius: 12,
        },
        [theme.breakpoints.down('xs')]: {
            padding: theme.spacing(2, 1),
            borderRadius: 10,
        },
        '&:hover': {
            boxShadow: '0 8px 35px rgba(123, 47, 247, 0.12)',
            transform: 'translateY(-4px)',
            borderColor: 'rgba(123, 47, 247, 0.15)',
            '@media (hover: none)': {
                transform: 'none',
            },
        },
    },

    // Problem styles - responsive
    prompt: {
        marginLeft: 0,
        marginRight: 0,
        marginTop: 20,
        textAlign: 'center',
        fontSize: 20,
        fontFamily: 'Titillium Web, sans-serif',
        color: 'inherit',
        [theme.breakpoints.down('sm')]: {
            marginTop: 16,
            fontSize: 18,
        },
        [theme.breakpoints.down('xs')]: {
            marginTop: 12,
            fontSize: 16,
        },
    },

    titleCard: {
        width: '75%',
        marginLeft: 'auto',
        marginRight: 'auto',
        paddingBottom: 0,
        [theme.breakpoints.down('md')]: {
            width: '85%',
        },
        [theme.breakpoints.down('sm')]: {
            width: '95%',
        },
        [theme.breakpoints.down('xs')]: {
            width: 'calc(100% - 16px)',
            marginLeft: '8px',
            marginRight: '8px',
        },
    },

    problemHeader: {
        fontSize: 26,
        marginTop: 0,
        fontWeight: 600,
        color: 'inherit',
        [theme.breakpoints.down('sm')]: {
            fontSize: 22,
        },
        [theme.breakpoints.down('xs')]: {
            fontSize: 20,
            lineHeight: 1.3,
        },
    },

    problemBody: {
        fontSize: 18,
        marginTop: 10,
        lineHeight: 1.7,
        color: 'inherit',
        [theme.breakpoints.down('sm')]: {
            fontSize: 17,
            marginTop: 8,
            lineHeight: 1.65,
        },
        [theme.breakpoints.down('xs')]: {
            fontSize: 16,
            marginTop: 6,
            lineHeight: 1.6,
        },
    },

    problemStepHeader: {
        fontSize: 24,
        marginTop: 0,
        marginLeft: 10,
        fontWeight: 600,
        color: angeloColors.primary,
        [theme.breakpoints.down('sm')]: {
            fontSize: 20,
            marginLeft: 8,
        },
        [theme.breakpoints.down('xs')]: {
            fontSize: 18,
            marginLeft: 4,
        },
    },

    problemStepBody: {
        fontSize: 18,
        marginTop: 10,
        marginLeft: 10,
        lineHeight: 1.7,
        [theme.breakpoints.down('sm')]: {
            fontSize: 17,
            marginLeft: 8,
            lineHeight: 1.65,
        },
        [theme.breakpoints.down('xs')]: {
            fontSize: 16,
            marginLeft: 4,
            marginTop: 8,
            lineHeight: 1.6,
        },
    },

    textBox: {
        paddingLeft: 70,
        paddingRight: 70,
        [theme.breakpoints.down('md')]: {
            paddingLeft: 40,
            paddingRight: 40,
        },
        [theme.breakpoints.down('sm')]: {
            paddingLeft: 20,
            paddingRight: 20,
        },
        [theme.breakpoints.down('xs')]: {
            paddingLeft: 12,
            paddingRight: 12,
        },
    },

    textBoxHeader: {
        fontWeight: 600,
        fontSize: 16,
        color: angeloColors.primary,
        [theme.breakpoints.down('xs')]: {
            fontSize: 14,
        },
    },

    // Math input field - touch-friendly
    textBoxLatex: {
        border: "2px solid #E2E8F0",
        borderRadius: "10px",
        transition: 'all 0.2s ease',
        '&:hover': {
            border: `2px solid ${angeloColors.primary}40`,
        },
        '&:focus-within': {
            border: `2px solid ${angeloColors.primary}`,
            boxShadow: `0 0 0 4px rgba(123, 47, 247, 0.1)`,
        },
        height: 50,
        width: '100%',
        [theme.breakpoints.down('xs')]: {
            height: 56, // Larger on mobile
            borderRadius: '8px',
            fontSize: '18px', // Prevent iOS zoom
        },
        '& > .mq-editable-field': {
            display: 'table',
            tableLayout: 'fixed'
        },
        '& > * > *[mathquill-block-id]': {
            height: 50,
            display: 'table-cell',
            paddingBottom: 5,
            [theme.breakpoints.down('xs')]: {
                height: 56,
            },
        }
    },

    textBoxLatexIncorrect: {
        boxShadow: `0 0 0 3px rgba(247, 37, 133, 0.2)`,
        border: `2px solid ${angeloColors.error}`,
        '&:focus-within': {
            border: `2px solid ${angeloColors.error}`,
        },
    },

    textBoxLatexCorrect: {
        boxShadow: `0 0 0 3px rgba(16, 185, 129, 0.2)`,
        border: `2px solid ${angeloColors.success}`,
        '&:focus-within': {
            border: `2px solid ${angeloColors.success}`,
        },
    },

    textBoxLatexUsedHint: {
        boxShadow: `0 0 0 3px rgba(0, 212, 255, 0.2)`,
        border: `2px solid ${angeloColors.secondary}`,
        '&:focus-within': {
            border: `2px solid ${angeloColors.secondary}`,
        },
    },

    // Progress indicator
    progressBar: {
        height: 8,
        borderRadius: 4,
        background: 'rgba(123, 47, 247, 0.1)',
        [theme.breakpoints.down('xs')]: {
            height: 6,
        },
        '& .MuiLinearProgress-bar': {
            background: gradients.primary,
            borderRadius: 4,
        },
    },

    // Correct/Incorrect feedback
    correctFeedback: {
        color: angeloColors.success,
        fontWeight: 600,
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '1rem',
        [theme.breakpoints.down('xs')]: {
            fontSize: '0.9rem',
            gap: '6px',
        },
    },

    incorrectFeedback: {
        color: angeloColors.error,
        fontWeight: 600,
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '1rem',
        [theme.breakpoints.down('xs')]: {
            fontSize: '0.9rem',
            gap: '6px',
        },
    },

    // Mobile-specific utility classes
    mobileFullWidth: {
        [theme.breakpoints.down('xs')]: {
            width: '100% !important',
        },
    },

    mobileHidden: {
        [theme.breakpoints.down('xs')]: {
            display: 'none !important',
        },
    },

    tabletHidden: {
        [theme.breakpoints.down('sm')]: {
            display: 'none !important',
        },
    },

    mobileOnly: {
        display: 'none !important',
        [theme.breakpoints.down('xs')]: {
            display: 'block !important',
        },
    },

    // Touch-friendly controls
    touchFriendly: {
        minHeight: 44,
        minWidth: 44,
        [theme.breakpoints.down('xs')]: {
            minHeight: 48,
            minWidth: 48,
        },
    },

    // Loading state
    loadingContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: theme.spacing(4),
        [theme.breakpoints.down('xs')]: {
            padding: theme.spacing(3),
        },
    },

    // Error state
    errorContainer: {
        textAlign: 'center',
        padding: theme.spacing(4),
        maxWidth: 500,
        margin: '0 auto',
        [theme.breakpoints.down('xs')]: {
            padding: theme.spacing(3),
            margin: theme.spacing(2),
        },
    },

    // Animation classes
    fadeIn: {
        animation: '$fadeIn 0.3s ease-out',
    },
    '@keyframes fadeIn': {
        from: {
            opacity: 0,
            transform: 'translateY(10px)',
        },
        to: {
            opacity: 1,
            transform: 'translateY(0)',
        },
    },

    slideUp: {
        animation: '$slideUp 0.4s ease-out',
    },
    '@keyframes slideUp': {
        from: {
            opacity: 0,
            transform: 'translateY(20px)',
        },
        to: {
            opacity: 1,
            transform: 'translateY(0)',
        },
    },

    // Skeleton loading
    skeleton: {
        background: 'linear-gradient(90deg, rgba(123, 47, 247, 0.05) 25%, rgba(123, 47, 247, 0.12) 50%, rgba(123, 47, 247, 0.05) 75%)',
        backgroundSize: '200% 100%',
        animation: '$shimmer 1.5s infinite',
        borderRadius: 8,
    },
    '@keyframes shimmer': {
        '0%': { backgroundPosition: '200% 0' },
        '100%': { backgroundPosition: '-200% 0' },
    },
});

export default styles;
export { angeloColors, gradients };

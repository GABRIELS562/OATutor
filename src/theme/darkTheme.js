/**
 * Dark Theme - Angelo Tutoring
 * Duolingo-inspired dark mode with playful, gamified aesthetic
 */

import { createMuiTheme } from '@material-ui/core/styles';

// Duolingo-Inspired Dark Mode Palette
const duoColorsDark = {
    // Primary Greens (dimmed for dark mode)
    green: '#58CC02',
    greenLight: '#7ED321',
    greenDark: '#4CAF00',
    greenMuted: '#2D5016',

    // Secondary Blues
    blue: '#1CB0F6',
    blueLight: '#49C0F8',
    blueDark: '#1899D6',
    blueMuted: '#0D3B4D',

    // Accent Colors
    red: '#FF4B4B',
    redMuted: '#4D1616',
    orange: '#FF9600',
    orangeMuted: '#4D2D00',
    purple: '#CE82FF',
    purpleMuted: '#3D2650',
    yellow: '#FFC800',
    yellowMuted: '#4D3C00',
    pink: '#FF86D0',

    // Dark Mode Neutrals
    dark1: '#131F24',     // Darkest background
    dark2: '#1A2A31',     // Card backgrounds
    dark3: '#233640',     // Elevated surfaces
    dark4: '#2E4450',     // Borders, dividers
    dark5: '#3C5665',     // Muted elements

    // Text colors
    textPrimary: '#FFFFFF',
    textSecondary: '#AFAFAF',
    textMuted: '#777777',

    // Semantic colors
    success: '#58CC02',
    error: '#FF4B4B',
    warning: '#FFC800',
    info: '#1CB0F6',
};

const darkTheme = createMuiTheme({
    palette: {
        type: 'dark',
        primary: {
            main: duoColorsDark.green,
            light: duoColorsDark.greenLight,
            dark: duoColorsDark.greenDark,
            contrastText: '#FFFFFF',
        },
        secondary: {
            main: duoColorsDark.blue,
            light: duoColorsDark.blueLight,
            dark: duoColorsDark.blueDark,
            contrastText: '#FFFFFF',
        },
        error: {
            main: duoColorsDark.red,
            light: '#FF6B6B',
            dark: '#E53E3E',
        },
        warning: {
            main: duoColorsDark.yellow,
            light: '#FFD93D',
            dark: '#E5B400',
        },
        success: {
            main: duoColorsDark.green,
            light: duoColorsDark.greenLight,
            dark: duoColorsDark.greenDark,
        },
        info: {
            main: duoColorsDark.blue,
            light: duoColorsDark.blueLight,
            dark: duoColorsDark.blueDark,
        },
        background: {
            default: duoColorsDark.dark1,
            paper: duoColorsDark.dark2,
        },
        text: {
            primary: duoColorsDark.textPrimary,
            secondary: duoColorsDark.textSecondary,
            disabled: duoColorsDark.textMuted,
        },
        divider: duoColorsDark.dark4,
        action: {
            active: duoColorsDark.textPrimary,
            hover: 'rgba(88, 204, 2, 0.08)',
            selected: 'rgba(88, 204, 2, 0.16)',
            disabled: duoColorsDark.textMuted,
            disabledBackground: duoColorsDark.dark3,
        },
    },
    typography: {
        fontFamily: '"Nunito", "Roboto", "Helvetica", "Arial", sans-serif',
        fontWeightLight: 400,
        fontWeightRegular: 600,
        fontWeightMedium: 700,
        fontWeightBold: 800,
        h1: {
            fontWeight: 800,
            letterSpacing: '-0.02em',
        },
        h2: {
            fontWeight: 800,
            letterSpacing: '-0.01em',
        },
        h3: {
            fontWeight: 700,
        },
        h4: {
            fontWeight: 700,
        },
        h5: {
            fontWeight: 700,
        },
        h6: {
            fontWeight: 700,
        },
        body1: {
            fontWeight: 600,
            lineHeight: 1.6,
        },
        body2: {
            fontWeight: 600,
            lineHeight: 1.5,
        },
        button: {
            textTransform: 'none',
            fontWeight: 700,
            letterSpacing: '0.5px',
        },
    },
    shape: {
        borderRadius: 16,
    },
    overrides: {
        MuiCssBaseline: {
            '@global': {
                body: {
                    backgroundColor: duoColorsDark.dark1,
                    scrollbarColor: `${duoColorsDark.dark4} ${duoColorsDark.dark2}`,
                    '&::-webkit-scrollbar, & *::-webkit-scrollbar': {
                        backgroundColor: duoColorsDark.dark2,
                        width: 10,
                        borderRadius: 5,
                    },
                    '&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb': {
                        borderRadius: 10,
                        backgroundColor: duoColorsDark.dark5,
                        border: `2px solid ${duoColorsDark.dark2}`,
                    },
                    '&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover': {
                        backgroundColor: duoColorsDark.green,
                    },
                },
            },
        },
        MuiPaper: {
            root: {
                backgroundColor: duoColorsDark.dark2,
                backgroundImage: 'none',
            },
            rounded: {
                borderRadius: 16,
            },
            elevation1: {
                boxShadow: `0 2px 0 0 ${duoColorsDark.dark4}`,
            },
            elevation2: {
                boxShadow: `0 4px 0 0 ${duoColorsDark.dark4}`,
            },
            elevation3: {
                boxShadow: `0 4px 0 0 ${duoColorsDark.dark4}`,
            },
        },
        MuiCard: {
            root: {
                backgroundColor: duoColorsDark.dark2,
                border: `2px solid ${duoColorsDark.dark4}`,
                borderRadius: 16,
                boxShadow: `0 4px 0 0 ${duoColorsDark.dark4}`,
                transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: `0 6px 0 0 ${duoColorsDark.dark4}`,
                },
            },
        },
        MuiButton: {
            root: {
                borderRadius: 16,
                padding: '12px 24px',
                fontWeight: 700,
                fontSize: '15px',
                textTransform: 'none',
                transition: 'all 0.1s ease',
            },
            contained: {
                boxShadow: 'none',
                '&:hover': {
                    boxShadow: 'none',
                },
            },
            // Duolingo 3D button effect - Primary (Green)
            containedPrimary: {
                backgroundColor: duoColorsDark.green,
                color: '#FFFFFF',
                border: 'none',
                boxShadow: `0 4px 0 0 ${duoColorsDark.greenDark}`,
                '&:hover': {
                    backgroundColor: duoColorsDark.greenLight,
                    boxShadow: `0 4px 0 0 ${duoColorsDark.green}`,
                },
                '&:active': {
                    boxShadow: `0 2px 0 0 ${duoColorsDark.greenDark}`,
                    transform: 'translateY(2px)',
                },
                '&.Mui-disabled': {
                    backgroundColor: duoColorsDark.dark4,
                    color: duoColorsDark.textMuted,
                    boxShadow: `0 4px 0 0 ${duoColorsDark.dark5}`,
                },
            },
            // Secondary (Blue)
            containedSecondary: {
                backgroundColor: duoColorsDark.blue,
                color: '#FFFFFF',
                boxShadow: `0 4px 0 0 ${duoColorsDark.blueDark}`,
                '&:hover': {
                    backgroundColor: duoColorsDark.blueLight,
                    boxShadow: `0 4px 0 0 ${duoColorsDark.blue}`,
                },
                '&:active': {
                    boxShadow: `0 2px 0 0 ${duoColorsDark.blueDark}`,
                    transform: 'translateY(2px)',
                },
            },
            // Outlined buttons
            outlined: {
                borderWidth: 2,
                borderColor: duoColorsDark.dark4,
                color: duoColorsDark.textPrimary,
                backgroundColor: 'transparent',
                boxShadow: `0 4px 0 0 ${duoColorsDark.dark4}`,
                '&:hover': {
                    borderWidth: 2,
                    borderColor: duoColorsDark.green,
                    backgroundColor: 'rgba(88, 204, 2, 0.08)',
                    boxShadow: `0 4px 0 0 ${duoColorsDark.greenMuted}`,
                },
                '&:active': {
                    boxShadow: `0 2px 0 0 ${duoColorsDark.dark4}`,
                    transform: 'translateY(2px)',
                },
            },
            outlinedPrimary: {
                borderColor: duoColorsDark.green,
                color: duoColorsDark.green,
                boxShadow: `0 4px 0 0 ${duoColorsDark.greenMuted}`,
                '&:hover': {
                    borderColor: duoColorsDark.greenLight,
                    backgroundColor: 'rgba(88, 204, 2, 0.08)',
                },
            },
            // Text buttons
            text: {
                color: duoColorsDark.green,
                fontWeight: 700,
                '&:hover': {
                    backgroundColor: 'rgba(88, 204, 2, 0.08)',
                },
            },
        },
        MuiTextField: {
            root: {
                '& .MuiOutlinedInput-root': {
                    backgroundColor: duoColorsDark.dark3,
                    borderRadius: 16,
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: duoColorsDark.green,
                        borderWidth: 2,
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: duoColorsDark.green,
                        borderWidth: 2,
                    },
                },
            },
        },
        MuiOutlinedInput: {
            root: {
                borderRadius: 16,
                '&:hover $notchedOutline': {
                    borderColor: duoColorsDark.green,
                },
                '&$focused $notchedOutline': {
                    borderColor: duoColorsDark.green,
                    borderWidth: 2,
                },
            },
            notchedOutline: {
                borderColor: duoColorsDark.dark4,
                borderWidth: 2,
            },
            input: {
                padding: '14px 16px',
            },
        },
        MuiInputLabel: {
            outlined: {
                color: duoColorsDark.textSecondary,
                fontWeight: 600,
                '&.Mui-focused': {
                    color: duoColorsDark.green,
                },
            },
        },
        MuiAppBar: {
            colorPrimary: {
                backgroundColor: duoColorsDark.dark2,
                borderBottom: `2px solid ${duoColorsDark.dark4}`,
                boxShadow: 'none',
            },
        },
        MuiDrawer: {
            paper: {
                backgroundColor: duoColorsDark.dark1,
                borderRight: `2px solid ${duoColorsDark.dark4}`,
            },
        },
        MuiChip: {
            root: {
                borderRadius: 12,
                fontWeight: 700,
                border: `2px solid ${duoColorsDark.dark4}`,
                backgroundColor: duoColorsDark.dark3,
            },
            colorPrimary: {
                backgroundColor: duoColorsDark.greenMuted,
                color: duoColorsDark.green,
                border: `2px solid ${duoColorsDark.green}`,
            },
            colorSecondary: {
                backgroundColor: duoColorsDark.blueMuted,
                color: duoColorsDark.blue,
                border: `2px solid ${duoColorsDark.blue}`,
            },
            outlined: {
                borderWidth: 2,
                borderColor: duoColorsDark.dark4,
            },
        },
        MuiLinearProgress: {
            root: {
                height: 16,
                borderRadius: 8,
                backgroundColor: duoColorsDark.dark4,
            },
            barColorPrimary: {
                backgroundColor: duoColorsDark.green,
                borderRadius: 8,
            },
            barColorSecondary: {
                backgroundColor: duoColorsDark.blue,
                borderRadius: 8,
            },
        },
        MuiSwitch: {
            root: {
                width: 52,
                height: 32,
                padding: 0,
            },
            switchBase: {
                padding: 4,
                '&.Mui-checked': {
                    transform: 'translateX(20px)',
                    color: '#fff',
                    '& + .MuiSwitch-track': {
                        backgroundColor: duoColorsDark.green,
                        opacity: 1,
                    },
                },
            },
            thumb: {
                width: 24,
                height: 24,
                boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
            },
            track: {
                borderRadius: 16,
                backgroundColor: duoColorsDark.dark4,
                opacity: 1,
            },
        },
        MuiTooltip: {
            tooltip: {
                backgroundColor: duoColorsDark.dark3,
                color: duoColorsDark.textPrimary,
                border: `2px solid ${duoColorsDark.dark4}`,
                borderRadius: 12,
                fontSize: '14px',
                fontWeight: 600,
                padding: '8px 12px',
            },
            arrow: {
                color: duoColorsDark.dark3,
            },
        },
        MuiDialog: {
            paper: {
                backgroundColor: duoColorsDark.dark2,
                border: `2px solid ${duoColorsDark.dark4}`,
                borderRadius: 20,
                boxShadow: `0 8px 0 0 ${duoColorsDark.dark4}`,
            },
        },
        MuiMenu: {
            paper: {
                backgroundColor: duoColorsDark.dark2,
                border: `2px solid ${duoColorsDark.dark4}`,
                borderRadius: 16,
                boxShadow: `0 4px 0 0 ${duoColorsDark.dark4}`,
            },
        },
        MuiMenuItem: {
            root: {
                borderRadius: 8,
                margin: '2px 8px',
                padding: '10px 16px',
                fontWeight: 600,
                '&:hover': {
                    backgroundColor: duoColorsDark.dark3,
                },
                '&.Mui-selected': {
                    backgroundColor: duoColorsDark.greenMuted,
                    color: duoColorsDark.green,
                    '&:hover': {
                        backgroundColor: duoColorsDark.greenMuted,
                    },
                },
            },
        },
        MuiListItem: {
            root: {
                borderRadius: 12,
                '&.Mui-selected': {
                    backgroundColor: duoColorsDark.greenMuted,
                    borderLeft: `4px solid ${duoColorsDark.green}`,
                },
            },
            button: {
                '&:hover': {
                    backgroundColor: duoColorsDark.dark3,
                },
            },
        },
        MuiTableCell: {
            root: {
                borderBottom: `2px solid ${duoColorsDark.dark4}`,
                fontWeight: 600,
            },
            head: {
                backgroundColor: duoColorsDark.dark3,
                fontWeight: 700,
                color: duoColorsDark.textPrimary,
            },
        },
        MuiTabs: {
            root: {
                backgroundColor: duoColorsDark.dark2,
                borderRadius: 16,
                padding: 4,
            },
            indicator: {
                display: 'none',
            },
        },
        MuiTab: {
            root: {
                borderRadius: 12,
                fontWeight: 700,
                textTransform: 'none',
                minHeight: 44,
                margin: '0 2px',
                '&.Mui-selected': {
                    backgroundColor: duoColorsDark.green,
                    color: '#FFFFFF',
                },
            },
        },
        MuiAccordion: {
            root: {
                backgroundColor: duoColorsDark.dark2,
                border: `2px solid ${duoColorsDark.dark4}`,
                borderRadius: '16px !important',
                marginBottom: 12,
                '&:before': {
                    display: 'none',
                },
                '&.Mui-expanded': {
                    margin: '0 0 12px 0',
                },
            },
        },
        MuiAccordionSummary: {
            root: {
                borderRadius: 14,
                '&:hover': {
                    backgroundColor: duoColorsDark.dark3,
                },
            },
        },
        MuiAlert: {
            root: {
                borderRadius: 16,
                border: '2px solid',
                fontWeight: 600,
            },
            standardSuccess: {
                backgroundColor: duoColorsDark.greenMuted,
                borderColor: duoColorsDark.green,
                color: duoColorsDark.green,
            },
            standardError: {
                backgroundColor: duoColorsDark.redMuted,
                borderColor: duoColorsDark.red,
                color: duoColorsDark.red,
            },
            standardWarning: {
                backgroundColor: duoColorsDark.yellowMuted,
                borderColor: duoColorsDark.yellow,
                color: duoColorsDark.yellow,
            },
            standardInfo: {
                backgroundColor: duoColorsDark.blueMuted,
                borderColor: duoColorsDark.blue,
                color: duoColorsDark.blue,
            },
        },
        MuiBadge: {
            colorPrimary: {
                backgroundColor: duoColorsDark.green,
                fontWeight: 700,
            },
            colorSecondary: {
                backgroundColor: duoColorsDark.red,
                fontWeight: 700,
            },
        },
        MuiAvatar: {
            colorDefault: {
                backgroundColor: duoColorsDark.dark3,
                color: duoColorsDark.textPrimary,
                border: `2px solid ${duoColorsDark.dark4}`,
            },
        },
        MuiIconButton: {
            root: {
                color: duoColorsDark.textSecondary,
                '&:hover': {
                    backgroundColor: duoColorsDark.dark3,
                    color: duoColorsDark.green,
                },
            },
        },
        MuiFab: {
            primary: {
                backgroundColor: duoColorsDark.green,
                boxShadow: `0 4px 0 0 ${duoColorsDark.greenDark}`,
                '&:hover': {
                    backgroundColor: duoColorsDark.greenLight,
                },
                '&:active': {
                    boxShadow: `0 2px 0 0 ${duoColorsDark.greenDark}`,
                    transform: 'translateY(2px)',
                },
            },
        },
        MuiSnackbarContent: {
            root: {
                backgroundColor: duoColorsDark.dark3,
                color: duoColorsDark.textPrimary,
                borderRadius: 16,
                border: `2px solid ${duoColorsDark.dark4}`,
                fontWeight: 600,
            },
        },
    },
    props: {
        MuiButton: {
            disableElevation: true,
        },
        MuiPaper: {
            elevation: 0,
        },
        MuiCard: {
            elevation: 0,
        },
    },
});

export default darkTheme;

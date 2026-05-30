/**
 * Dark Theme - Angelo Tutoring
 * JSDT-style dark mode with glassmorphism effects
 */

import { createMuiTheme } from '@material-ui/core/styles';

const darkTheme = createMuiTheme({
    palette: {
        type: 'dark',
        primary: {
            main: '#7B2FF7', // Purple accent
            light: '#9D5FFF',
            dark: '#5B1FD7',
            contrastText: '#ffffff',
        },
        secondary: {
            main: '#00D4FF', // Cyan accent
            light: '#33DDFF',
            dark: '#00A7CC',
            contrastText: '#000000',
        },
        error: {
            main: '#FF6B6B',
            light: '#FF8E8E',
            dark: '#E54B4B',
        },
        warning: {
            main: '#FFB830',
            light: '#FFC850',
            dark: '#E5A020',
        },
        success: {
            main: '#10B981',
            light: '#34D399',
            dark: '#059669',
        },
        info: {
            main: '#00D4FF',
            light: '#33DDFF',
            dark: '#00A7CC',
        },
        background: {
            default: '#0f0f23', // Deep dark blue
            paper: '#1a1a2e', // Slightly lighter
        },
        text: {
            primary: '#ffffff',
            secondary: 'rgba(255, 255, 255, 0.7)',
            disabled: 'rgba(255, 255, 255, 0.38)',
        },
        divider: 'rgba(255, 255, 255, 0.12)',
        action: {
            active: '#ffffff',
            hover: 'rgba(255, 255, 255, 0.08)',
            selected: 'rgba(123, 47, 247, 0.16)',
            disabled: 'rgba(255, 255, 255, 0.26)',
            disabledBackground: 'rgba(255, 255, 255, 0.12)',
        },
    },
    typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        h1: {
            fontWeight: 700,
            letterSpacing: '-0.02em',
        },
        h2: {
            fontWeight: 700,
            letterSpacing: '-0.01em',
        },
        h3: {
            fontWeight: 600,
        },
        h4: {
            fontWeight: 600,
        },
        h5: {
            fontWeight: 600,
        },
        h6: {
            fontWeight: 600,
        },
        button: {
            textTransform: 'none',
            fontWeight: 600,
        },
    },
    shape: {
        borderRadius: 12,
    },
    overrides: {
        MuiCssBaseline: {
            '@global': {
                body: {
                    backgroundColor: '#0f0f23',
                    scrollbarColor: '#3d3d5c #1a1a2e',
                    '&::-webkit-scrollbar, & *::-webkit-scrollbar': {
                        backgroundColor: '#1a1a2e',
                        width: 8,
                    },
                    '&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb': {
                        borderRadius: 8,
                        backgroundColor: '#3d3d5c',
                        border: '2px solid #1a1a2e',
                    },
                    '&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover': {
                        backgroundColor: '#5d5d7c',
                    },
                },
            },
        },
        MuiPaper: {
            root: {
                backgroundColor: '#16213e',
                backgroundImage: 'none',
            },
            elevation1: {
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
            },
            elevation2: {
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
            },
            elevation3: {
                boxShadow: '0 6px 16px rgba(0, 0, 0, 0.5)',
            },
        },
        MuiCard: {
            root: {
                backgroundColor: '#16213e',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                borderRadius: 16,
            },
        },
        MuiButton: {
            root: {
                borderRadius: 10,
                padding: '10px 20px',
            },
            contained: {
                boxShadow: '0 4px 14px rgba(123, 47, 247, 0.4)',
                '&:hover': {
                    boxShadow: '0 6px 20px rgba(123, 47, 247, 0.5)',
                },
            },
            containedPrimary: {
                background: 'linear-gradient(135deg, #7B2FF7 0%, #9D5FFF 100%)',
                '&:hover': {
                    background: 'linear-gradient(135deg, #9D5FFF 0%, #7B2FF7 100%)',
                },
            },
            outlined: {
                borderColor: 'rgba(255, 255, 255, 0.23)',
                '&:hover': {
                    borderColor: '#7B2FF7',
                    backgroundColor: 'rgba(123, 47, 247, 0.08)',
                },
            },
        },
        MuiTextField: {
            root: {
                '& .MuiOutlinedInput-root': {
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#7B2FF7',
                    },
                },
            },
        },
        MuiOutlinedInput: {
            notchedOutline: {
                borderColor: 'rgba(255, 255, 255, 0.15)',
            },
        },
        MuiInputLabel: {
            outlined: {
                color: 'rgba(255, 255, 255, 0.6)',
            },
        },
        MuiAppBar: {
            colorPrimary: {
                backgroundColor: 'rgba(15, 15, 35, 0.8)',
                backdropFilter: 'blur(10px)',
            },
        },
        MuiDrawer: {
            paper: {
                backgroundColor: '#0f0f23',
                borderRight: '1px solid rgba(255, 255, 255, 0.05)',
            },
        },
        MuiChip: {
            root: {
                backgroundColor: 'rgba(123, 47, 247, 0.2)',
            },
            outlined: {
                borderColor: 'rgba(255, 255, 255, 0.23)',
            },
        },
        MuiLinearProgress: {
            root: {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderRadius: 10,
            },
            barColorPrimary: {
                background: 'linear-gradient(90deg, #7B2FF7, #00D4FF)',
                borderRadius: 10,
            },
        },
        MuiSwitch: {
            colorPrimary: {
                '&.Mui-checked': {
                    color: '#7B2FF7',
                    '& + .MuiSwitch-track': {
                        backgroundColor: '#7B2FF7',
                    },
                },
            },
            track: {
                backgroundColor: 'rgba(255, 255, 255, 0.3)',
            },
        },
        MuiTooltip: {
            tooltip: {
                backgroundColor: '#16213e',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                fontSize: '0.875rem',
            },
        },
        MuiDialog: {
            paper: {
                backgroundColor: '#16213e',
                border: '1px solid rgba(255, 255, 255, 0.1)',
            },
        },
        MuiMenu: {
            paper: {
                backgroundColor: '#16213e',
                border: '1px solid rgba(255, 255, 255, 0.1)',
            },
        },
        MuiListItem: {
            root: {
                '&.Mui-selected': {
                    backgroundColor: 'rgba(123, 47, 247, 0.16)',
                },
            },
        },
        MuiTableCell: {
            root: {
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            },
            head: {
                backgroundColor: '#0f0f23',
                fontWeight: 600,
            },
        },
        MuiTabs: {
            indicator: {
                backgroundColor: '#7B2FF7',
            },
        },
        MuiTab: {
            root: {
                '&.Mui-selected': {
                    color: '#7B2FF7',
                },
            },
        },
        MuiAccordion: {
            root: {
                backgroundColor: '#16213e',
                '&:before': {
                    display: 'none',
                },
                '&.Mui-expanded': {
                    margin: 0,
                },
            },
        },
    },
    props: {
        MuiButton: {
            disableElevation: false,
        },
        MuiPaper: {
            elevation: 0,
        },
    },
});

export default darkTheme;

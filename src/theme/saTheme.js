/**
 * Duolingo-Inspired Theme for Angelo Tutoring
 * Bright, playful, gamified design
 * Clean whites, bold colors, chunky UI elements
 */

import { createTheme, responsiveFontSizes } from "@material-ui/core/styles";

// Duolingo-Inspired Color Palette
const duoColors = {
    // Primary - Duolingo Green (the signature color!)
    green: "#58CC02",
    greenLight: "#89E219",
    greenDark: "#58A700",

    // Secondary colors - bright and playful
    blue: "#1CB0F6",
    blueLight: "#84D8FF",
    blueDark: "#1899D6",

    red: "#FF4B4B",
    redLight: "#FF6B6B",
    redDark: "#EA2B2B",

    orange: "#FF9600",
    orangeLight: "#FFC800",
    orangeDark: "#CD7900",

    purple: "#CE82FF",
    purpleLight: "#DDA0FF",
    purpleDark: "#A855F7",

    // Neutrals
    white: "#FFFFFF",
    snow: "#F7F7F7",
    grayLight: "#E5E5E5",
    grayMedium: "#AFAFAF",
    grayDark: "#777777",
    charcoal: "#4B4B4B",
    dark: "#3C3C3C",

    // Semantic
    primary: {
        main: "#58CC02",
        light: "#89E219",
        dark: "#58A700",
        contrastText: "#FFFFFF",
    },
    secondary: {
        main: "#1CB0F6",
        light: "#84D8FF",
        dark: "#1899D6",
        contrastText: "#FFFFFF",
    },
    success: {
        main: "#58CC02",
        light: "#89E219",
        dark: "#58A700",
    },
    warning: {
        main: "#FF9600",
        light: "#FFC800",
        dark: "#CD7900",
    },
    error: {
        main: "#FF4B4B",
        light: "#FF6B6B",
        dark: "#EA2B2B",
    },
    info: {
        main: "#1CB0F6",
        light: "#84D8FF",
        dark: "#1899D6",
    },
    background: {
        default: "#FFFFFF",
        paper: "#FFFFFF",
        gray: "#F7F7F7",
    },
    text: {
        primary: "#4B4B4B",
        secondary: "#777777",
    },
};

// Create Duolingo-style theme
let duoTheme = createTheme({
    palette: {
        type: 'light',
        primary: duoColors.primary,
        secondary: duoColors.secondary,
        success: duoColors.success,
        warning: duoColors.warning,
        error: duoColors.error,
        info: duoColors.info,
        background: {
            default: '#FFFFFF',
            paper: '#FFFFFF',
        },
        text: {
            primary: '#4B4B4B',
            secondary: '#777777',
        },
        divider: '#E5E5E5',
        action: {
            active: '#4B4B4B',
            hover: 'rgba(88, 204, 2, 0.08)',
            selected: 'rgba(88, 204, 2, 0.12)',
            disabled: '#AFAFAF',
            disabledBackground: '#E5E5E5',
        },
    },
    typography: {
        // Nunito - friendly, rounded font like Duolingo
        fontFamily: [
            "Nunito",
            "DIN Rounded",
            "-apple-system",
            "BlinkMacSystemFont",
            "Segoe UI",
            "Roboto",
            "sans-serif",
        ].join(","),
        h1: {
            fontWeight: 800,
            fontSize: "2.5rem",
            letterSpacing: "-0.01em",
            color: "#4B4B4B",
        },
        h2: {
            fontWeight: 700,
            fontSize: "2rem",
            letterSpacing: "-0.01em",
            color: "#4B4B4B",
        },
        h3: {
            fontWeight: 700,
            fontSize: "1.75rem",
            color: "#4B4B4B",
        },
        h4: {
            fontWeight: 700,
            fontSize: "1.5rem",
            color: "#4B4B4B",
        },
        h5: {
            fontWeight: 700,
            fontSize: "1.25rem",
            color: "#4B4B4B",
        },
        h6: {
            fontWeight: 700,
            fontSize: "1rem",
            color: "#4B4B4B",
        },
        button: {
            textTransform: "none",
            fontWeight: 700,
            letterSpacing: "0.03em",
            fontSize: "1rem",
        },
        body1: {
            lineHeight: 1.6,
            fontWeight: 500,
            color: "#4B4B4B",
        },
        body2: {
            lineHeight: 1.5,
            fontWeight: 500,
            color: "#777777",
        },
    },
    shape: {
        borderRadius: 16, // Very rounded - Duolingo style
    },
    overrides: {
        // AppBar - Clean white header with green accent
        MuiAppBar: {
            colorPrimary: {
                backgroundColor: "#FFFFFF",
                color: "#4B4B4B",
                boxShadow: "0 2px 0 0 #E5E5E5",
            },
        },
        // Button - Chunky 3D buttons like Duolingo
        MuiButton: {
            root: {
                borderRadius: 16,
                padding: "12px 24px",
                fontSize: "1rem",
                fontWeight: 700,
                transition: "all 0.15s ease",
                textTransform: "none",
            },
            containedPrimary: {
                backgroundColor: duoColors.green,
                color: "#FFFFFF",
                boxShadow: `0 4px 0 0 ${duoColors.greenDark}`,
                border: "none",
                "&:hover": {
                    backgroundColor: duoColors.greenLight,
                    boxShadow: `0 4px 0 0 ${duoColors.green}`,
                    transform: "translateY(-1px)",
                },
                "&:active": {
                    boxShadow: `0 2px 0 0 ${duoColors.greenDark}`,
                    transform: "translateY(2px)",
                },
            },
            containedSecondary: {
                backgroundColor: duoColors.blue,
                color: "#FFFFFF",
                boxShadow: `0 4px 0 0 ${duoColors.blueDark}`,
                "&:hover": {
                    backgroundColor: duoColors.blueLight,
                    boxShadow: `0 4px 0 0 ${duoColors.blue}`,
                    transform: "translateY(-1px)",
                },
                "&:active": {
                    boxShadow: `0 2px 0 0 ${duoColors.blueDark}`,
                    transform: "translateY(2px)",
                },
            },
            outlined: {
                borderWidth: 2,
                borderColor: "#E5E5E5",
                color: "#777777",
                fontWeight: 700,
                "&:hover": {
                    borderWidth: 2,
                    borderColor: duoColors.green,
                    color: duoColors.green,
                    backgroundColor: "rgba(88, 204, 2, 0.05)",
                },
            },
            outlinedPrimary: {
                borderWidth: 2,
                borderColor: duoColors.green,
                color: duoColors.green,
                "&:hover": {
                    borderWidth: 2,
                    backgroundColor: "rgba(88, 204, 2, 0.08)",
                },
            },
            text: {
                color: duoColors.blue,
                fontWeight: 700,
                "&:hover": {
                    backgroundColor: "rgba(28, 176, 246, 0.08)",
                },
            },
        },
        // Card - Clean white cards with subtle borders
        MuiCard: {
            root: {
                borderRadius: 16,
                boxShadow: "none",
                border: "2px solid #E5E5E5",
                backgroundColor: "#FFFFFF",
                color: "#4B4B4B",
                transition: "all 0.2s ease",
                "&:hover": {
                    borderColor: duoColors.green,
                    boxShadow: "0 4px 12px rgba(88, 204, 2, 0.15)",
                },
            },
        },
        // Linear Progress - Chunky green progress bar
        MuiLinearProgress: {
            root: {
                borderRadius: 10,
                height: 16,
                backgroundColor: "#E5E5E5",
            },
            barColorPrimary: {
                borderRadius: 10,
                backgroundColor: duoColors.green,
            },
        },
        // Circular Progress
        MuiCircularProgress: {
            colorPrimary: {
                color: duoColors.green,
            },
        },
        // Toolbar
        MuiToolbar: {
            root: {
                minHeight: 64,
            },
        },
        // Paper - Clean white
        MuiPaper: {
            root: {
                backgroundColor: '#FFFFFF',
                color: '#4B4B4B',
            },
            rounded: {
                borderRadius: 16,
            },
            elevation1: {
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
            },
            elevation2: {
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            },
            elevation3: {
                boxShadow: "0 6px 16px rgba(0, 0, 0, 0.12)",
            },
        },
        // Chip - Rounded pill chips
        MuiChip: {
            root: {
                borderRadius: 20,
                fontWeight: 700,
                fontSize: "0.875rem",
            },
            colorPrimary: {
                backgroundColor: duoColors.green,
                color: "#FFFFFF",
            },
            colorSecondary: {
                backgroundColor: duoColors.blue,
                color: "#FFFFFF",
            },
            outlined: {
                borderWidth: 2,
            },
        },
        // TextField - Rounded inputs with thick borders
        MuiOutlinedInput: {
            root: {
                borderRadius: 12,
                backgroundColor: "#F7F7F7",
                transition: "all 0.2s ease",
                "& .MuiOutlinedInput-notchedOutline": {
                    borderWidth: 2,
                    borderColor: "#E5E5E5",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#AFAFAF",
                },
                "&.Mui-focused": {
                    backgroundColor: "#FFFFFF",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: duoColors.blue,
                    borderWidth: 2,
                },
            },
            input: {
                padding: "14px 16px",
                fontWeight: 500,
            },
        },
        // Tab - Bold tabs
        MuiTab: {
            root: {
                textTransform: "none",
                fontWeight: 700,
                fontSize: "1rem",
                minWidth: 100,
                color: "#AFAFAF",
                "&.Mui-selected": {
                    color: duoColors.green,
                },
            },
        },
        MuiTabs: {
            indicator: {
                height: 4,
                borderRadius: 2,
                backgroundColor: duoColors.green,
            },
        },
        // Tooltip - Rounded dark tooltip
        MuiTooltip: {
            tooltip: {
                backgroundColor: "#3C3C3C",
                fontSize: "0.875rem",
                fontWeight: 600,
                borderRadius: 8,
                padding: "8px 12px",
            },
            arrow: {
                color: "#3C3C3C",
            },
        },
        // Drawer
        MuiDrawer: {
            paper: {
                borderRadius: "0 16px 16px 0",
                backgroundColor: "#FFFFFF",
                color: "#4B4B4B",
            },
        },
        // Dialog - Rounded dialogs
        MuiDialog: {
            paper: {
                borderRadius: 20,
                backgroundColor: "#FFFFFF",
                color: "#4B4B4B",
            },
        },
        MuiDialogTitle: {
            root: {
                fontWeight: 700,
                fontSize: "1.25rem",
            },
        },
        // Menu
        MuiMenu: {
            paper: {
                borderRadius: 12,
                border: "2px solid #E5E5E5",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                backgroundColor: "#FFFFFF",
                color: "#4B4B4B",
            },
        },
        // Popover
        MuiPopover: {
            paper: {
                borderRadius: 12,
                backgroundColor: "#FFFFFF",
                color: "#4B4B4B",
            },
        },
        // List items - Rounded with hover
        MuiListItem: {
            root: {
                borderRadius: 12,
                margin: "4px 8px",
                width: "auto",
                color: "#4B4B4B",
                "&.Mui-selected": {
                    backgroundColor: "rgba(88, 204, 2, 0.12)",
                    "&:hover": {
                        backgroundColor: "rgba(88, 204, 2, 0.18)",
                    },
                },
            },
            button: {
                "&:hover": {
                    backgroundColor: "#F7F7F7",
                },
            },
        },
        // MenuItem
        MuiMenuItem: {
            root: {
                borderRadius: 8,
                margin: "2px 8px",
                color: "#4B4B4B",
                fontWeight: 600,
                "&:hover": {
                    backgroundColor: "#F7F7F7",
                },
                "&.Mui-selected": {
                    backgroundColor: "rgba(88, 204, 2, 0.12)",
                },
            },
        },
        // Input fields
        MuiInputBase: {
            root: {
                color: "#4B4B4B",
                fontWeight: 500,
            },
        },
        MuiInputLabel: {
            root: {
                color: "#777777",
                fontWeight: 600,
            },
        },
        // Table
        MuiTableCell: {
            root: {
                color: "#4B4B4B",
                borderBottom: "2px solid #E5E5E5",
                padding: "16px",
            },
            head: {
                backgroundColor: "#F7F7F7",
                fontWeight: 700,
                color: "#4B4B4B",
            },
        },
        // Accordion
        MuiAccordion: {
            root: {
                backgroundColor: "#FFFFFF",
                color: "#4B4B4B",
                borderRadius: "12px !important",
                border: "2px solid #E5E5E5",
                boxShadow: "none",
                "&:before": {
                    display: "none",
                },
                "&.Mui-expanded": {
                    margin: "8px 0",
                    borderColor: duoColors.green,
                },
            },
        },
        MuiAccordionSummary: {
            root: {
                fontWeight: 700,
                "&.Mui-expanded": {
                    minHeight: 48,
                },
            },
        },
        // Typography
        MuiTypography: {
            colorTextPrimary: {
                color: "#4B4B4B",
            },
            colorTextSecondary: {
                color: "#777777",
            },
        },
        // Badge - Playful badges
        MuiBadge: {
            colorPrimary: {
                backgroundColor: duoColors.green,
            },
            colorSecondary: {
                backgroundColor: duoColors.orange,
            },
            colorError: {
                backgroundColor: duoColors.red,
            },
        },
        // Avatar
        MuiAvatar: {
            colorDefault: {
                backgroundColor: duoColors.green,
                color: "#FFFFFF",
                fontWeight: 700,
            },
        },
        // Switch - Green toggle
        MuiSwitch: {
            colorPrimary: {
                "&.Mui-checked": {
                    color: duoColors.green,
                },
                "&.Mui-checked + .MuiSwitch-track": {
                    backgroundColor: duoColors.green,
                },
            },
        },
        // Checkbox - Green checkbox
        MuiCheckbox: {
            colorPrimary: {
                "&.Mui-checked": {
                    color: duoColors.green,
                },
            },
        },
        // Radio - Green radio
        MuiRadio: {
            colorPrimary: {
                "&.Mui-checked": {
                    color: duoColors.green,
                },
            },
        },
        // Fab - Floating action button
        MuiFab: {
            primary: {
                backgroundColor: duoColors.green,
                boxShadow: `0 4px 0 0 ${duoColors.greenDark}`,
                "&:hover": {
                    backgroundColor: duoColors.greenLight,
                },
            },
        },
        // Snackbar
        MuiSnackbarContent: {
            root: {
                borderRadius: 12,
                fontWeight: 600,
            },
        },
        // Alert
        MuiAlert: {
            root: {
                borderRadius: 12,
                fontWeight: 600,
            },
            standardSuccess: {
                backgroundColor: "rgba(88, 204, 2, 0.12)",
                color: duoColors.greenDark,
            },
            standardError: {
                backgroundColor: "rgba(255, 75, 75, 0.12)",
                color: duoColors.redDark,
            },
            standardWarning: {
                backgroundColor: "rgba(255, 150, 0, 0.12)",
                color: duoColors.orangeDark,
            },
            standardInfo: {
                backgroundColor: "rgba(28, 176, 246, 0.12)",
                color: duoColors.blueDark,
            },
        },
    },
});

// Make fonts responsive
duoTheme = responsiveFontSizes(duoTheme);

export default duoTheme;
export { duoColors as angeloColors }; // Export with old name for compatibility

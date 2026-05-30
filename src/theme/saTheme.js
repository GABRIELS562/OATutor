/**
 * Angelo Tutoring Custom Theme
 * Modern gradient color scheme: Cyan → Purple → Pink
 * Designed for South African Grade 10-12 students
 */

import { createTheme, responsiveFontSizes } from "@material-ui/core/styles";

// Angelo Tutoring Color Palette
const angeloColors = {
    // Primary gradient colors
    cyan: "#00D4FF",
    purple: "#7B2FF7",
    pink: "#F72585",

    // Primary - Deep purple/navy (professional, modern)
    primary: {
        main: "#7B2FF7",
        light: "#A855F7",
        dark: "#5B21B6",
        contrastText: "#FFFFFF",
    },
    // Secondary - Cyan (fresh, tech-forward)
    secondary: {
        main: "#00D4FF",
        light: "#67E8F9",
        dark: "#0891B2",
        contrastText: "#1a1a2e",
    },
    // Success - Green
    success: {
        main: "#10B981",
        light: "#34D399",
        dark: "#059669",
    },
    // Warning - Amber
    warning: {
        main: "#F59E0B",
        light: "#FBBF24",
        dark: "#D97706",
    },
    // Error - Red/Pink
    error: {
        main: "#F72585",
        light: "#FB7185",
        dark: "#E11D48",
    },
    // Background colors
    background: {
        default: "#F8FAFC",
        paper: "#FFFFFF",
        dark: "#1a1a2e",
        darkPaper: "#16213e",
    },
    // Text colors
    text: {
        primary: "#1E293B",
        secondary: "#64748B",
        dark: "#FFFFFF",
        darkSecondary: "#94A3B8",
    },
    // Gradient definitions
    gradients: {
        primary: "linear-gradient(135deg, #00D4FF 0%, #7B2FF7 50%, #F72585 100%)",
        header: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
        button: "linear-gradient(135deg, #7B2FF7 0%, #F72585 100%)",
        success: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
        card: "linear-gradient(180deg, rgba(123, 47, 247, 0.03) 0%, rgba(0, 212, 255, 0.03) 100%)",
    },
};

// Create base theme
let angeloTheme = createTheme({
    palette: {
        primary: angeloColors.primary,
        secondary: angeloColors.secondary,
        success: angeloColors.success,
        warning: angeloColors.warning,
        error: angeloColors.error,
        background: angeloColors.background,
        text: {
            primary: angeloColors.text.primary,
            secondary: angeloColors.text.secondary,
        },
    },
    typography: {
        fontFamily: [
            "Titillium Web",
            "-apple-system",
            "BlinkMacSystemFont",
            "Segoe UI",
            "Roboto",
            "sans-serif",
        ].join(","),
        h1: {
            fontWeight: 700,
            fontSize: "2.5rem",
            letterSpacing: "-0.02em",
        },
        h2: {
            fontWeight: 600,
            fontSize: "2rem",
            letterSpacing: "-0.01em",
        },
        h3: {
            fontWeight: 600,
            fontSize: "1.75rem",
        },
        h4: {
            fontWeight: 600,
            fontSize: "1.5rem",
        },
        h5: {
            fontWeight: 500,
            fontSize: "1.25rem",
        },
        h6: {
            fontWeight: 500,
            fontSize: "1rem",
        },
        button: {
            textTransform: "none",
            fontWeight: 600,
            letterSpacing: "0.02em",
        },
        body1: {
            lineHeight: 1.7,
        },
    },
    shape: {
        borderRadius: 12,
    },
    overrides: {
        // AppBar - Dark gradient header
        MuiAppBar: {
            colorPrimary: {
                backgroundColor: angeloColors.background.dark,
                background: angeloColors.gradients.header,
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.25)",
            },
        },
        // Button - Gradient primary buttons
        MuiButton: {
            root: {
                borderRadius: 10,
                padding: "10px 28px",
                fontSize: "0.95rem",
                transition: "all 0.3s ease",
            },
            containedPrimary: {
                background: angeloColors.gradients.button,
                boxShadow: "0 4px 15px rgba(123, 47, 247, 0.35)",
                "&:hover": {
                    background: angeloColors.gradients.button,
                    boxShadow: "0 6px 20px rgba(123, 47, 247, 0.45)",
                    transform: "translateY(-2px)",
                },
            },
            containedSecondary: {
                backgroundColor: angeloColors.secondary.main,
                boxShadow: "0 4px 15px rgba(0, 212, 255, 0.35)",
                "&:hover": {
                    backgroundColor: angeloColors.secondary.dark,
                    boxShadow: "0 6px 20px rgba(0, 212, 255, 0.45)",
                    transform: "translateY(-2px)",
                },
            },
            outlined: {
                borderWidth: 2,
                "&:hover": {
                    borderWidth: 2,
                    transform: "translateY(-2px)",
                },
            },
        },
        // Card - Modern clean cards with subtle gradient
        MuiCard: {
            root: {
                borderRadius: 16,
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.06)",
                border: "1px solid rgba(123, 47, 247, 0.08)",
                background: angeloColors.gradients.card + ", #FFFFFF",
                transition: "all 0.3s ease",
                "&:hover": {
                    boxShadow: "0 8px 30px rgba(123, 47, 247, 0.12)",
                    transform: "translateY(-4px)",
                    borderColor: "rgba(123, 47, 247, 0.15)",
                },
            },
        },
        // Linear Progress - Gradient progress bar
        MuiLinearProgress: {
            root: {
                borderRadius: 6,
                height: 10,
                backgroundColor: "rgba(123, 47, 247, 0.1)",
            },
            barColorPrimary: {
                borderRadius: 6,
                background: angeloColors.gradients.primary,
            },
        },
        // Circular Progress - Gradient
        MuiCircularProgress: {
            colorPrimary: {
                color: angeloColors.primary.main,
            },
        },
        // Toolbar
        MuiToolbar: {
            root: {
                minHeight: 70,
            },
        },
        // Paper - Clean modern paper
        MuiPaper: {
            rounded: {
                borderRadius: 16,
            },
            elevation1: {
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.06)",
            },
            elevation2: {
                boxShadow: "0 6px 25px rgba(0, 0, 0, 0.08)",
            },
            elevation3: {
                boxShadow: "0 8px 30px rgba(0, 0, 0, 0.1)",
            },
        },
        // Chip - Modern chips
        MuiChip: {
            root: {
                borderRadius: 8,
                fontWeight: 500,
            },
            colorPrimary: {
                background: angeloColors.gradients.button,
            },
        },
        // TextField - Modern input fields
        MuiOutlinedInput: {
            root: {
                borderRadius: 10,
                transition: "all 0.2s ease",
                "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: angeloColors.primary.light,
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: angeloColors.primary.main,
                    borderWidth: 2,
                },
            },
        },
        // Tab - Modern tabs
        MuiTab: {
            root: {
                textTransform: "none",
                fontWeight: 600,
                fontSize: "0.95rem",
                minWidth: 100,
            },
        },
        MuiTabs: {
            indicator: {
                height: 3,
                borderRadius: "3px 3px 0 0",
                background: angeloColors.gradients.button,
            },
        },
        // Tooltip
        MuiTooltip: {
            tooltip: {
                backgroundColor: angeloColors.background.dark,
                fontSize: "0.85rem",
                borderRadius: 8,
                padding: "8px 14px",
            },
        },
        // Drawer
        MuiDrawer: {
            paper: {
                borderRadius: "0 16px 16px 0",
            },
        },
        // List
        MuiListItem: {
            root: {
                borderRadius: 10,
                margin: "4px 8px",
                width: "auto",
                "&.Mui-selected": {
                    background: "rgba(123, 47, 247, 0.08)",
                    "&:hover": {
                        background: "rgba(123, 47, 247, 0.12)",
                    },
                },
            },
            button: {
                "&:hover": {
                    background: "rgba(123, 47, 247, 0.06)",
                },
            },
        },
    },
});

// Make fonts responsive
angeloTheme = responsiveFontSizes(angeloTheme);

export default angeloTheme;
export { angeloColors };

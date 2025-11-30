// Theme color definitions
export const darkTheme = {
    // Backgrounds
    bgPrimary: '#0d1117',
    bgSecondary: '#161b22',
    bgTertiary: '#21262d',
    bgHover: '#30363d',

    // Text
    textPrimary: '#c9d1d9',
    textSecondary: '#8b949e',
    textMuted: '#6e7681',

    // Accents
    accentBlue: '#58a6ff',
    accentGreen: '#7ee787',
    accentOrange: '#ffa657',
    accentPurple: '#d2a8ff',
    accentRed: '#f85149',

    // Borders
    borderPrimary: '#30363d',
    borderSecondary: '#21262d',

    // Buttons
    btnPrimaryBg: '#238636',
    btnPrimaryHover: '#2ea043',
    btnSecondaryBg: '#21262d',
    btnSecondaryHover: '#30363d',

    // Special
    successGreen: '#238636',
    errorRed: '#f85149',
    warningOrange: '#ffa657',

    // Overlays
    overlayBg: 'rgba(0, 0, 0, 0.5)',
} as const;

export const lightTheme = {
    // Backgrounds
    bgPrimary: '#ffffff',
    bgSecondary: '#f6f8fa',
    bgTertiary: '#eaeef2',
    bgHover: '#d0d7de',

    // Text
    textPrimary: '#24292f',
    textSecondary: '#57606a',
    textMuted: '#6e7781',

    // Accents
    accentBlue: '#0969da',
    accentGreen: '#1a7f37',
    accentOrange: '#bc4c00',
    accentPurple: '#8250df',
    accentRed: '#cf222e',

    // Borders
    borderPrimary: '#d0d7de',
    borderSecondary: '#eaeef2',

    // Buttons
    btnPrimaryBg: '#1a7f37',
    btnPrimaryHover: '#2da44e',
    btnSecondaryBg: '#f6f8fa',
    btnSecondaryHover: '#eaeef2',

    // Special
    successGreen: '#1a7f37',
    errorRed: '#cf222e',
    warningOrange: '#bc4c00',

    // Overlays
    overlayBg: 'rgba(0, 0, 0, 0.3)',
} as const;

export type Theme = typeof darkTheme | typeof lightTheme;
export type ThemeMode = 'dark' | 'light';

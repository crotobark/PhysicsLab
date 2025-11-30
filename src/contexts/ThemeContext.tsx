import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { darkTheme, lightTheme, type ThemeMode, type Theme } from '../styles/themes';

interface ThemeContextType {
    theme: Theme;
    mode: ThemeMode;
    toggleTheme: () => void;
    setTheme: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
    children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
    const [mode, setMode] = useState<ThemeMode>(() => {
        // Check localStorage for saved preference
        const saved = localStorage.getItem('theme-mode');
        if (saved === 'light' || saved === 'dark') {
            return saved;
        }
        // Default to dark mode
        return 'dark';
    });

    const theme = mode === 'dark' ? darkTheme : lightTheme;

    // Apply theme to document root
    useEffect(() => {
        const root = document.documentElement;

        // Set data-theme attribute for CSS
        root.setAttribute('data-theme', mode);

        // Apply CSS variables
        Object.entries(theme).forEach(([key, value]) => {
            root.style.setProperty(`--${camelToKebab(key)}`, value);
        });

        // Save to localStorage
        localStorage.setItem('theme-mode', mode);
    }, [mode, theme]);

    const toggleTheme = () => {
        setMode(prev => prev === 'dark' ? 'light' : 'dark');
    };

    const setTheme = (newMode: ThemeMode) => {
        setMode(newMode);
    };

    return (
        <ThemeContext.Provider value={{ theme, mode, toggleTheme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within ThemeProvider');
    }
    return context;
}

// Helper function to convert camelCase to kebab-case
function camelToKebab(str: string): string {
    return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

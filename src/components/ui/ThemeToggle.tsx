import { motion } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';

export default function ThemeToggle() {
    const { mode, toggleTheme } = useTheme();
    const isDark = mode === 'dark';

    return (
        <motion.button
            onClick={toggleTheme}
            className="relative w-14 h-7 rounded-full transition-colors"
            style={{
                backgroundColor: isDark ? 'var(--bg-tertiary)' : 'var(--accent-blue)',
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title={isDark ? 'Переключить на светлую тему' : 'Переключить на темную тему'}
        >
            {/* Toggle slider */}
            <motion.div
                className="absolute top-1 w-5 h-5 rounded-full bg-white shadow-md flex items-center justify-center"
                animate={{
                    left: isDark ? 4 : 32,
                }}
                transition={{
                    type: 'spring',
                    stiffness: 500,
                    damping: 30,
                }}
            >
                {/* Icon */}
                <span className="text-xs">
                    {isDark ? '🌙' : '☀️'}
                </span>
            </motion.div>
        </motion.button>
    );
}

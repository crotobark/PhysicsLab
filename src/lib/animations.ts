// Animation variants for common use cases
export const fadeIn = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
};

export const slideUp = {
    initial: { y: 20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: -20, opacity: 0 },
};

export const slideDown = {
    initial: { y: -20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: 20, opacity: 0 },
};

export const slideRight = {
    initial: { x: -20, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: 20, opacity: 0 },
};

export const scaleIn = {
    initial: { scale: 0.9, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.9, opacity: 0 },
};

export const popIn = {
    initial: { scale: 0, opacity: 0 },
    animate: {
        scale: 1,
        opacity: 1,
        transition: { type: 'spring', stiffness: 300, damping: 20 }
    },
    exit: { scale: 0, opacity: 0 },
};

// Stagger children animation
export const staggerContainer = {
    animate: {
        transition: {
            staggerChildren: 0.1,
        },
    },
};

// Hover animations
export const hoverScale = {
    scale: 1.05,
    transition: { duration: 0.2 },
};

export const hoverGlow = {
    boxShadow: '0 0 20px rgba(88, 166, 255, 0.5)',
    transition: { duration: 0.3 },
};

// Page transition
export const pageTransition = {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
    transition: { duration: 0.3, ease: 'easeInOut' },
};

// Star celebration animation
export const starPop = {
    initial: { scale: 0, rotate: -180 },
    animate: {
        scale: 1,
        rotate: 0,
    },
};

export const starPopTransition = {
    type: 'spring' as const,
    stiffness: 260,
    damping: 20,
    delay: 0.1
};

// Modal/Panel animations
export const modalOverlay = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
};

export const modalOverlayTransition = {
    duration: 0.2,
};

export const modalPanel = {
    initial: { y: 50, opacity: 0, scale: 0.95 },
    animate: {
        y: 0,
        opacity: 1,
        scale: 1,
    },
    exit: { y: 50, opacity: 0, scale: 0.95 },
};

export const modalPanelTransition = {
    type: 'spring' as const,
    stiffness: 300,
    damping: 30,
};

// Tab switching
export const tabContent = {
    initial: { opacity: 0, x: -10 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 10 },
    transition: { duration: 0.2 },
};

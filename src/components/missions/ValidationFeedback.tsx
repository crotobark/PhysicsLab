import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProgressStore } from '../../store/useProgressStore';
import { useAppStore } from '../../store/useAppStore';
import type { ValidationResult } from '../../engine/validation/MissionValidator';
import { modalPanel, modalPanelTransition, starPop, starPopTransition, staggerContainer, scaleIn } from '../../lib/animations';

interface ValidationFeedbackProps {
    result: ValidationResult | null;
    onClose?: () => void;
}

export default function ValidationFeedback({ result, onClose }: ValidationFeedbackProps) {
    const currentMission = useAppStore((state) => state.currentMission);
    const markMissionComplete = useProgressStore((state) => state.markMissionComplete);

    // Auto-save progress when validation passes
    useEffect(() => {
        if (result && result.passed && currentMission) {
            markMissionComplete(currentMission.id, result.score);
        }
    }, [result, currentMission, markMissionComplete]);

    if (!result) return null;

    const { passed, score, feedback, errors } = result;

    return (
        <AnimatePresence>
            <motion.div
                className="fixed bottom-4 right-4 w-96 bg-[#161b22] border-2 rounded-lg shadow-2xl z-50 overflow-hidden"
                style={{
                    borderColor: passed ? '#7ee787' : errors.length > 0 ? '#f85149' : '#58a6ff',
                }}
                {...modalPanel}
                transition={modalPanelTransition}
            >
                {/* Header */}
                <motion.div
                    className="px-4 py-3 flex items-center justify-between"
                    style={{
                        backgroundColor: passed ? '#23863620' : errors.length > 0 ? '#f8514920' : '#58a6ff20',
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                >
                    <div className="flex items-center gap-3">
                        <motion.div
                            className="text-2xl"
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                        >
                            {passed ? '✅' : errors.length > 0 ? '❌' : '⏳'}
                        </motion.div>
                        <div>
                            <h3 className="font-semibold text-[#c9d1d9]">
                                {passed ? 'Отличная работа!' : errors.length > 0 ? 'Есть ошибки' : 'Проверка...'}
                            </h3>
                            <div className="flex gap-1 mt-1">
                                {[1, 2, 3].map((star, index) => (
                                    <motion.span
                                        key={star}
                                        className={`text-lg ${star <= score ? 'text-yellow-400' : 'text-gray-600'}`}
                                        {...(star <= score ? starPop : {})}
                                        transition={{
                                            ...starPopTransition,
                                            delay: 0.3 + index * 0.1,
                                        }}
                                    >
                                        ⭐
                                    </motion.span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {onClose && (
                        <motion.button
                            onClick={onClose}
                            className="text-[#8b949e] hover:text-[#c9d1d9] transition-colors"
                            whileHover={{ scale: 1.1, rotate: 90 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            ✕
                        </motion.button>
                    )}
                </motion.div>

                {/* Content */}
                <motion.div
                    className="p-4 max-h-64 overflow-y-auto"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    {/* Success feedback */}
                    {feedback.length > 0 && (
                        <motion.div
                            className="mb-3"
                            {...staggerContainer}
                        >
                            <p className="text-xs text-[#8b949e] mb-2 font-semibold">✓ Выполнено:</p>
                            <ul className="space-y-1">
                                {feedback.map((item, index) => (
                                    <motion.li
                                        key={index}
                                        className="text-sm text-[#7ee787] flex items-start gap-2"
                                        {...scaleIn}
                                        transition={{ delay: 0.3 + index * 0.05 }}
                                    >
                                        <span className="mt-0.5">•</span>
                                        <span>{item}</span>
                                    </motion.li>
                                ))}
                            </ul>
                        </motion.div>
                    )}

                    {/* Errors */}
                    {errors.length > 0 && (
                        <motion.div {...staggerContainer}>
                            <p className="text-xs text-[#8b949e] mb-2 font-semibold">✗ Требуется исправить:</p>
                            <ul className="space-y-1">
                                {errors.map((error, index) => (
                                    <motion.li
                                        key={index}
                                        className="text-sm text-[#f85149] flex items-start gap-2"
                                        {...scaleIn}
                                        transition={{ delay: 0.3 + index * 0.05 }}
                                    >
                                        <span className="mt-0.5">•</span>
                                        <span>{error}</span>
                                    </motion.li>
                                ))}
                            </ul>
                        </motion.div>
                    )}

                    {/* Hint */}
                    {!passed && errors.length > 0 && (
                        <motion.div
                            className="mt-4 p-3 bg-[#0d1117] border border-[#30363d] rounded"
                            {...scaleIn}
                            transition={{ delay: 0.5 }}
                        >
                            <p className="text-xs text-[#8b949e]">
                                💡 <span className="font-semibold">Подсказка:</span> Проверьте требования миссии
                                и убедитесь, что ваш код точно соответствует заданию.
                            </p>
                        </motion.div>
                    )}
                </motion.div>

                {/* Footer */}
                {passed && (
                    <motion.div
                        className="px-4 py-3 bg-[#0d1117] border-t border-[#30363d] flex justify-between items-center"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <p className="text-xs text-[#8b949e]">
                            {score === 3 ? '🏆 Идеально!' : score === 2 ? '✨ Хорошо!' : '👍 Неплохо!'}
                        </p>
                        <motion.button
                            className="px-3 py-1.5 bg-[#238636] hover:bg-[#2ea043] text-white text-sm rounded transition-colors"
                            onClick={() => {
                                if (onClose) onClose();
                            }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Продолжить →
                        </motion.button>
                    </motion.div>
                )}
            </motion.div>
        </AnimatePresence>
    );
}

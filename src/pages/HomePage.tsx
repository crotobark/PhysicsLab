import { Link } from 'react-router-dom';

export default function HomePage() {
    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-[#0d1117] via-[#161b22] to-[#0d1117] overflow-auto">
            {/* Hero Section */}
            <div className="container mx-auto px-4 py-16">
                {/* Header */}
                <header className="text-center mb-16 animate-fade-in">
                    <div className="inline-block mb-6">
                        <div className="flex items-center gap-4 text-6xl">
                            <span className="animate-bounce">🚀</span>
                            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-[#58a6ff] via-[#7ee787] to-[#d2a8ff] bg-clip-text text-transparent">
                                PhysicsCodeLab
                            </h1>
                            <span className="animate-bounce delay-150">⚛️</span>
                        </div>
                    </div>

                    <p className="text-xl md:text-2xl text-[#8b949e] max-w-3xl mx-auto mb-8">
                        Интерактивная платформа для изучения <span className="text-[#58a6ff] font-semibold">Python</span>,
                        <span className="text-[#7ee787] font-semibold"> математики</span> и
                        <span className="text-[#d2a8ff] font-semibold"> физики</span>
                    </p>

                    <div className="flex flex-wrap gap-4 justify-center mb-12">
                        <div className="bg-[#161b22] border border-[#30363d] rounded-lg px-6 py-3">
                            <div className="text-3xl font-bold text-[#58a6ff]">7</div>
                            <div className="text-sm text-[#8b949e]">Миссий</div>
                        </div>
                        <div className="bg-[#161b22] border border-[#30363d] rounded-lg px-6 py-3">
                            <div className="text-3xl font-bold text-[#7ee787]">2</div>
                            <div className="text-sm text-[#8b949e]">Модуля</div>
                        </div>
                        <div className="bg-[#161b22] border border-[#30363d] rounded-lg px-6 py-3">
                            <div className="text-3xl font-bold text-[#d2a8ff]">∞</div>
                            <div className="text-sm text-[#8b949e]">Возможностей</div>
                        </div>
                    </div>

                    <Link
                        to="/missions"
                        className="inline-block px-8 py-4 bg-gradient-to-r from-[#238636] to-[#2ea043] hover:from-[#2ea043] hover:to-[#238636] text-white text-lg font-semibold rounded-lg transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
                    >
                        🎯 Начать обучение
                    </Link>
                </header>

                {/* Modules Grid */}
                <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    {/* Module 1: Physics */}
                    <Link to="/missions?module=1" className="group">
                        <div className="bg-[#161b22] border-2 border-[#30363d] rounded-xl p-8 hover:border-[#58a6ff] transition-all transform hover:scale-105 hover:shadow-2xl">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="text-5xl">⚛️</div>
                                <div>
                                    <h2 className="text-2xl font-bold text-[#c9d1d9] group-hover:text-[#58a6ff] transition-colors">
                                        Модуль 1: Физика
                                    </h2>
                                    <p className="text-[#8b949e]">Механика и движение</p>
                                </div>
                            </div>

                            <div className="space-y-2 mb-6">
                                <div className="flex items-center gap-2 text-[#8b949e]">
                                    <span className="text-[#7ee787]">✓</span>
                                    <span>Ball physics simulation</span>
                                </div>
                                <div className="flex items-center gap-2 text-[#8b949e]">
                                    <span className="text-[#7ee787]">✓</span>
                                    <span>Gravity \u0026 collisions</span>
                                </div>
                                <div className="flex items-center gap-2 text-[#8b949e]">
                                    <span className="text-[#7ee787]">✓</span>
                                    <span>Platform interactions</span>
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="text-sm text-[#8b949e]">
                                    <span className="text-[#58a6ff] font-semibold">1</span> / 1 миссий
                                </div>
                                <div className="text-[#58a6ff] group-hover:translate-x-2 transition-transform">
                                    →
                                </div>
                            </div>
                        </div>
                    </Link>

                    {/* Module 5: Algebra */}
                    <Link to="/missions?module=5" className="group">
                        <div className="bg-[#161b22] border-2 border-[#30363d] rounded-xl p-8 hover:border-[#7ee787] transition-all transform hover:scale-105 hover:shadow-2xl">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="text-5xl">📊</div>
                                <div>
                                    <h2 className="text-2xl font-bold text-[#c9d1d9] group-hover:text-[#7ee787] transition-colors">
                                        Модуль 5: Алгебра
                                    </h2>
                                    <p className="text-[#8b949e]">Функции и графики</p>
                                </div>
                            </div>

                            <div className="space-y-2 mb-6">
                                <div className="flex items-center gap-2 text-[#8b949e]">
                                    <span className="text-[#7ee787]">✓</span>
                                    <span>6 типов функций</span>
                                </div>
                                <div className="flex items-center gap-2 text-[#8b949e]">
                                    <span className="text-[#7ee787]">✓</span>
                                    <span>Интерактивные слайдеры 🎛️</span>
                                </div>
                                <div className="flex items-center gap-2 text-[#8b949e]">
                                    <span className="text-[#7ee787]">✓</span>
                                    <span>Реал-тайм визуализация</span>
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="text-sm text-[#8b949e]">
                                    <span className="text-[#7ee787] font-semibold">6</span> / 6 миссий ✨
                                </div>
                                <div className="text-[#7ee787] group-hover:translate-x-2 transition-transform">
                                    →
                                </div>
                            </div>
                        </div>
                    </Link>
                </div>

                {/* Features Section */}
                <div className="mt-20 max-w-5xl mx-auto">
                    <h3 className="text-3xl font-bold text-center text-[#c9d1d9] mb-12">
                        ✨ Особенности платформы
                    </h3>

                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-6 text-center hover:border-[#58a6ff] transition-colors">
                            <div className="text-4xl mb-4">🐍</div>
                            <h4 className="text-lg font-semibold text-[#c9d1d9] mb-2">Python в браузере</h4>
                            <p className="text-sm text-[#8b949e]">Pyodide — полноценный Python прямо в браузере, без установки</p>
                        </div>

                        <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-6 text-center hover:border-[#7ee787] transition-colors">
                            <div className="text-4xl mb-4">🎨</div>
                            <h4 className="text-lg font-semibold text-[#c9d1d9] mb-2">Визуализация</h4>
                            <p className="text-sm text-[#8b949e]">Графики, анимации и Canvas для наглядного обучения</p>
                        </div>

                        <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-6 text-center hover:border-[#d2a8ff] transition-colors">
                            <div className="text-4xl mb-4">🎯</div>
                            <h4 className="text-lg font-semibold text-[#c9d1d9] mb-2">Интерактивность</h4>
                            <p className="text-sm text-[#8b949e]">Слайдеры, параметры и мгновенная обратная связь</p>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <footer className="mt-20 text-center text-[#6e7681]">
                    <p className="mb-2">Made with ❤️ for learners</p>
                    <p className="text-sm">Inspired by Alan Becker's "Animation vs Math"</p>
                </footer>
            </div>

            {/* Background decorations */}
            <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden -z-10">
                <div className="absolute top-20 left-10 w-64 h-64 bg-[#58a6ff] rounded-full opacity-5 blur-3xl"></div>
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#7ee787] rounded-full opacity-5 blur-3xl"></div>
                <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-[#d2a8ff] rounded-full opacity-5 blur-3xl"></div>
            </div>

            <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }

        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .animate-bounce {
          animation: bounce 2s ease-in-out infinite;
        }

        .delay-150 {
          animation-delay: 0.15s;
        }
      `}</style>
        </div>
    );
}

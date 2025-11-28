import type { Mission } from '../../types';

const mission1_1: Mission = {
  id: '1_1',
  module: 1,
  order: 1,
  title: 'Первый шаг',
  briefing: {
    situation: 'Робот-исследователь должен переместиться к точке сбора данных.',
    task: 'Установи координаты точки, чтобы робот оказался в правильном месте.',
    context: 'Это твоя первая миссия. Ознакомься с интерфейсом и базовыми командами.',
  },
  starterCode: `from physicslab import *

# Создаём мир
world = World(gravity=0, width=800, height=600)

# === ТВОЙ КОД ===
# Установи координаты для робота
x = ___  # координата X (0-800)
y = ___  # координата Y (0-600)
# ================

# Создаём робота в указанной точке
robot = Ball(x=x, y=y, radius=20, color="blue")
world.add(robot)

# Целевая точка (нужно попасть сюда)
target = Ball(x=400, y=300, radius=30, color="green", fixed=True)
world.add(target)

# Запускаем визуализацию
world.run()
`,
  theory: ['coordinates', 'variables'],
  checks: [
    {
      type: 'position_match',
      target_x: 400,
      target_y: 300,
      tolerance: 50,
      message_success: 'Отлично! Робот достиг цели!',
      message_fail: 'Робот не достиг цели. Проверь координаты.',
    },
  ],
  hints: [
    {
      level: 1,
      text: 'Целевая точка находится в центре экрана. Экран имеет размер 800×600 пикселей.',
    },
    {
      level: 2,
      text: 'Центр экрана — это половина от ширины и высоты: x=400, y=300',
    },
    {
      level: 3,
      text: 'Попробуй установить x=400 и y=300',
    },
  ],
  rewards: {
    xp: 10,
    stars: {
      '1': 'Базовое выполнение',
      '2': 'Точность < 20 пикселей',
      '3': 'Точность < 5 пикселей',
    },
  },
  metadata: {
    difficulty: 'intro',
    estimatedTime: 5,
    prerequisites: [],
    tags: ['coordinates', 'basics', 'position'],
  },
};

export default mission1_1;

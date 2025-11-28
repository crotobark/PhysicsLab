// Core Physics Types
export interface Vector2 {
  x: number;
  y: number;
}

export interface PhysicsBody {
  id: string;
  position: Vector2;
  velocity: Vector2;
  acceleration: Vector2;
  mass: number;
  radius?: number;
  width?: number;
  height?: number;
  fixed: boolean;
}

export interface WorldConfig {
  gravity: number;
  width: number;
  height: number;
  boundaries: boolean;
}

export interface WorldState {
  bodies: PhysicsBody[];
  time: number;
  paused: boolean;
  config: WorldConfig;
}

// Mission Types
export interface MissionBriefing {
  situation: string;
  task: string;
  context?: string;
}

export interface MissionCheck {
  type: string;
  message_success: string;
  message_fail: string;
  [key: string]: any;
}

export interface MissionHint {
  level: number;
  text: string;
}

export interface Mission {
  id: string;
  module: number;
  order: number;
  title: string;
  briefing: MissionBriefing;
  starterCode: string;
  theory: string[];
  checks: MissionCheck[];
  hints: MissionHint[];
  rewards: {
    xp: number;
    stars: Record<string, string>;
  };
  metadata: {
    difficulty: 'intro' | 'basic' | 'applied' | 'challenge' | 'master';
    estimatedTime: number;
    prerequisites: string[];
    tags: string[];
  };
}

// UI State Types
export interface AppState {
  currentMission: Mission | null;
  code: string;
  isRunning: boolean;
  isPaused: boolean;
  worldState: WorldState | null;
  theoryPanelOpen: boolean;
  consoleOutput: string[];
  showHints: boolean;
}

// Python Bridge Types
export interface PythonOutput {
  type: 'log' | 'error' | 'result';
  content: string;
  timestamp: number;
}

export interface PythonExecutionResult {
  success: boolean;
  output: PythonOutput[];
  worldState?: WorldState;
  error?: string;
}

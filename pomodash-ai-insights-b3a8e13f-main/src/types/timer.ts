
export type TimerPhase = 'work' | 'shortBreak' | 'longBreak';

export interface TimerSettings {
  workMinutes: number;
  shortBreakMinutes: number;
  longBreakMinutes: number;
  pomosBeforeLongBreak: number;
}

export interface TimerState {
  isRunning: boolean;
  timeRemaining: number;
  currentPhase: TimerPhase;
  completedPomos: number;
  showSettings: boolean;
}

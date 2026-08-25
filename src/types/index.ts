export type Theme = 'midnight' | 'mint' | 'sakura' | 'sunset' | 'cyber';
export type WidgetSize = 'S' | 'M' | 'L';
export type SalaryType = 'afterTax' | 'beforeTax';
export type GoalStatus = 'active' | 'completed';

export interface Schedule {
  start: string;
  end: string;
}

export interface UserProfile {
  salary: number;
  salaryType: SalaryType;
  workingDaysPerMonth: number;
  workSchedules: Schedule[];
}

export interface Goal {
  id: string;
  name: string;
  priceCents: number;
  image?: string;
  category?: string;
  priority?: number;
  createdAt: number;
  completedAt?: number;
  status: GoalStatus;
  workedMinutes?: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: number;
}

export interface UserProgress {
  xp: number;
  totalWorkMinutes: number;
  totalEarnedCents: number;
  level: number;
}

export interface DailyRecord {
  date: string;
  workedMinutes: number;
  earnedCents: number;
  completed: boolean;
}

export interface WidgetConfig {
  size: WidgetSize;
  opacity: number;
  alwaysOnTop: boolean;
  showIncome: boolean;
  showMonthlyIncome: boolean;
  showRate: boolean;
  showProgress: boolean;
  showCountdown: boolean;
  showGoal: boolean;
  showGoalTime: boolean;
  showLevel: boolean;
  showXp: boolean;
  showStatus: boolean;
  showQuote: boolean;
  showCompanion: boolean;
}

export interface AppState {
  onboardingComplete: boolean;
  user: UserProfile;
  goals: Goal[];
  progress: UserProgress;
  achievements: Achievement[];
  dailyRecords: DailyRecord[];
  widget: WidgetConfig;
  theme: Theme;
  compact: boolean;
  setOnboardingComplete: (value: boolean) => void;
  setUser: (value: Partial<UserProfile>) => void;
  setGoals: (value: Goal[]) => void;
  setProgress: (value: Partial<UserProgress>) => void;
  setAchievements: (value: Achievement[]) => void;
  setDailyRecords: (value: DailyRecord[]) => void;
  setWidget: (value: Partial<WidgetConfig>) => void;
  setTheme: (value: Theme) => void;
  setCompact: (value: boolean) => void;
  resetData: () => void;
}

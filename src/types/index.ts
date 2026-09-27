export type Perspective = 'caregiver' | 'child' | 'echo_past';
export type Ending = 'safe_connection' | 'repaired_boundary' | 'distant_guarded';
export interface AccessibilitySettings {
  fontSize: 'sm' | 'normal' | 'large' | 'extra-large';
  textSpeed: 'slow' | 'normal' | 'instant';
  highContrast: boolean;
  reducedMotion: boolean;
  dyslexicFont: boolean;
  soundIndicators: boolean;
}
export interface RelationalState {
  perceivedSafety: number;
  truthDisclosureTrust: number;
  admitMistakeTrust: number;
  supportedAutonomy: number;
  predictability: number;
  caregiverLoad: number;
  accumulatedTension: number;
  repairCapability: number;
}
export interface Memory {
  id: string;
  domain: string;
  title: string;
  description: string;
  perspective: Perspective;
  agePhase: string;
  polarity: 'positive' | 'neutral' | 'strained';
  createdAt: number;
}
export type Condition =
  | { type: 'memory'; id: string }
  | { type: 'flag'; key: string; value: boolean | string | number }
  | { type: 'relationship'; key: keyof RelationalState; min?: number; max?: number }
  | { type: 'all' | 'any'; conditions: Condition[] }
  | { type: 'not'; condition: Condition };
export interface SceneChoice {
  id: string;
  text: string;
  internalIntent?: string;
  isRepairAction?: boolean;
  condition?: Condition;
  nextSceneId: string;
  effects: {
    relationalDeltas?: Partial<RelationalState>;
    addMemories?: Omit<Memory, 'createdAt'>[];
    setFlags?: GameState['flags'];
    educationalCardId?: string;
    triggerEchoId?: string;
    triggerPerspectiveSwitch?: { targetPerspective: Perspective; sceneId: string; narrativeIntro: string };
  };
}
export interface SceneNode {
  id: string;
  chapterId: string;
  age: number;
  perspective: Perspective;
  speaker: { id: string; name: string; role: string; avatarStyle: string };
  location: string;
  dialogue?: string;
  internalMonologue?: string;
  sensoryDetails?: string;
  soundCue?: string;
  educationalCardId?: string;
  isRepairOpportunity?: boolean;
  isEchoSequence?: boolean;
  isEnding?: boolean;
  endingType?: Ending;
  choices: SceneChoice[];
}
export interface GameState {
  version: 1;
  currentSceneId: string;
  perspective: Perspective;
  relationalState: RelationalState;
  accessibility: AccessibilitySettings;
  memories: Memory[];
  flags: Record<string, boolean | string | number>;
  chapterFinished: boolean;
  currentEnding: Ending | null;
  seenSceneIds: string[];
  history: { sceneId: string; speakerName: string; text: string; chosenOptionText: string }[];
}
export interface EducationalCard {
  id: string;
  title: string;
  category: 'ECA' | 'PSYCHOLOGY' | 'DEVELOPMENT';
  articleOrSource: string;
  officialCitation: string;
  summary: string;
  practicalMeaning: string;
  whatItIsNot: string;
  reviewStatus: 'APPROVED' | 'PENDING';
}

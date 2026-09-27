import { z } from 'zod';
import type { AccessibilitySettings, GameState } from '../types';
import { CHAPTER_DOOR_13_SCENES } from '../content/chapters/door_13';

export const SAVE_KEY = 'entre_lacos_save_v1';
const perspective = z.enum(['caregiver', 'child', 'echo_past']);
const score = z.number().finite().min(0).max(10);
const accessibilitySchema = z.object({
  fontSize: z.enum(['sm', 'normal', 'large', 'extra-large']),
  textSpeed: z.enum(['slow', 'normal', 'instant']),
  highContrast: z.boolean(), reducedMotion: z.boolean(), dyslexicFont: z.boolean(), soundIndicators: z.boolean(),
});
const sceneId = z.string().refine(id => Object.hasOwn(CHAPTER_DOOR_13_SCENES, id));
const saveSchema = z.object({
  version: z.literal(1), currentSceneId: sceneId, perspective,
  relationalState: z.object({
    perceivedSafety: score, truthDisclosureTrust: score, admitMistakeTrust: score,
    supportedAutonomy: score, predictability: score, caregiverLoad: score,
    accumulatedTension: score, repairCapability: score,
  }),
  accessibility: accessibilitySchema,
  memories: z.array(z.object({
    id: z.string(), domain: z.string(), title: z.string(), description: z.string(),
    perspective, agePhase: z.string(), polarity: z.enum(['positive', 'neutral', 'strained']), createdAt: z.number().finite(),
  })),
  flags: z.record(z.union([z.boolean(), z.string(), z.number().finite()])),
  chapterFinished: z.boolean(),
  currentEnding: z.enum(['safe_connection', 'repaired_boundary', 'distant_guarded']).nullable(),
  seenSceneIds: z.array(sceneId),
  history: z.array(z.object({ sceneId, speakerName: z.string(), text: z.string(), chosenOptionText: z.string() })),
}).refine(state => !state.chapterFinished || Boolean(CHAPTER_DOOR_13_SCENES[state.currentSceneId].endingType));

export function createInitialState(): GameState {
  return {
    version: 1, currentSceneId: 'door_01_corridor_arrival', perspective: 'caregiver',
    relationalState: { perceivedSafety: 5, truthDisclosureTrust: 5, admitMistakeTrust: 5, supportedAutonomy: 5, predictability: 5, caregiverLoad: 5, accumulatedTension: 3, repairCapability: 5 },
    accessibility: { fontSize: 'normal', textSpeed: 'normal', highContrast: false, reducedMotion: false, dyslexicFont: false, soundIndicators: true },
    memories: [], flags: {}, chapterFinished: false, currentEnding: null,
    seenSceneIds: ['door_01_corridor_arrival'], history: [],
  };
}

type StorageProvider = () => Pick<Storage, 'getItem' | 'setItem'>;
export function createStateManager(getStorage: StorageProvider = () => window.localStorage) {
  let state = createInitialState();
  try {
    const raw = getStorage().getItem(SAVE_KEY);
    const parsed = raw ? saveSchema.safeParse(JSON.parse(raw)) : null;
    if (parsed?.success) {
      state = parsed.data;
      const scene = CHAPTER_DOOR_13_SCENES[state.currentSceneId];
      state.perspective = scene.perspective;
      state.currentEnding = scene.endingType ?? null;
    }
  } catch { /* Invalid or unavailable storage must never prevent playing. */ }
  const listeners = new Set<(state: GameState) => void>();
  const updateState = (update: (previous: GameState) => GameState) => {
    state = update(state);
    try { getStorage().setItem(SAVE_KEY, JSON.stringify(state)); } catch { /* Continue in memory if storage is blocked/full. */ }
    listeners.forEach(listener => listener(state));
  };
  return {
    getState: () => state,
    subscribe(listener: (state: GameState) => void) { listeners.add(listener); return () => { listeners.delete(listener); }; },
    updateState,
    updateAccessibility(settings: Partial<AccessibilitySettings>) {
      updateState(previous => ({ ...previous, accessibility: accessibilitySchema.parse({ ...previous.accessibility, ...settings }) }));
    },
    resetGame() { updateState(previous => ({ ...createInitialState(), accessibility: previous.accessibility })); },
    clearAll() { updateState(() => createInitialState()); },
  };
}

export const stateManager = createStateManager();

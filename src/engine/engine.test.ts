import { describe, expect, it } from 'vitest';
import { createInitialState, createStateManager, SAVE_KEY } from './stateManager';
import { applyRelationalDeltas } from './relationshipManager';
import { evaluateCondition } from './conditionEvaluator';
import { CHAPTER_DOOR_13_SCENES as scenes } from '../content/chapters/door_13';
import { EDUCATIONAL_CARDS as cards } from '../content/educational/cards';

function storage(initial?: string) {
  const values = new Map(initial ? [[SAVE_KEY, initial]] : []);
  return { getItem: (key: string) => values.get(key) ?? null, setItem: (key: string, value: string) => { values.set(key, value); } };
}

describe('persistência local', () => {
  it('restaura progresso e configurações depois de recarregar', () => {
    const disk = storage();
    const manager = createStateManager(() => disk);
    manager.updateAccessibility({ fontSize: 'large' });
    manager.updateState(previous => ({ ...previous, currentSceneId: 'door_02_alex_reaction' }));
    const restored = createStateManager(() => disk).getState();
    expect(restored.currentSceneId).toBe('door_02_alex_reaction');
    expect(restored.accessibility.fontSize).toBe('large');
  });
  it.each(['{', 'null', '{}', JSON.stringify({ ...createInitialState(), memories: [null] }), JSON.stringify({ ...createInitialState(), currentSceneId: 'missing' })])('ignora save inválido: %s', raw => {
    expect(createStateManager(() => storage(raw)).getState()).toEqual(createInitialState());
  });
  it('continua funcionando sem acesso ao armazenamento', () => {
    const manager = createStateManager(() => { throw new Error('Blocked'); });
    expect(() => manager.updateAccessibility({ highContrast: true })).not.toThrow();
    expect(manager.getState().accessibility.highContrast).toBe(true);
  });
  it('reinicia preservando preferências; limpar dados restaura tudo', () => {
    const manager = createStateManager(() => storage());
    manager.updateAccessibility({ textSpeed: 'instant' });
    manager.resetGame();
    expect(manager.getState().accessibility.textSpeed).toBe('instant');
    manager.clearAll();
    expect(manager.getState()).toEqual(createInitialState());
  });
  it('notifica assinantes e permite cancelar a inscrição', () => {
    const manager = createStateManager(() => storage());
    let count = 0;
    const unsubscribe = manager.subscribe(() => count++);
    manager.resetGame();
    unsubscribe();
    manager.resetGame();
    expect(count).toBe(1);
  });
});

it('mantém variáveis entre 0 e 10 sem alterar o estado anterior', () => {
  const state = createInitialState().relationalState;
  const next = applyRelationalDeltas(state, { perceivedSafety: 100, caregiverLoad: -100 });
  expect(next.perceivedSafety).toBe(10);
  expect(next.caregiverLoad).toBe(0);
  expect(state.perceivedSafety).toBe(5);
});

it('avalia condições de memória, flags, relações e combinações', () => {
  const state = createInitialState();
  expect(evaluateCondition(undefined, state)).toBe(true);
  expect(evaluateCondition({ type: 'memory', id: 'missing' }, state)).toBe(false);
  expect(evaluateCondition({ type: 'all', conditions: [
    { type: 'relationship', key: 'perceivedSafety', min: 4, max: 6 },
    { type: 'not', condition: { type: 'flag', key: 'done', value: true } },
  ] }, state)).toBe(true);
});

it('todas as rotas terminam, e todos os cards e destinos existem', () => {
  const reached = new Set<string>();
  const endings = new Set<string>();
  let paths = 0;
  function visit(id: string, ancestors: Set<string>) {
    expect(ancestors.has(id)).toBe(false);
    const scene = scenes[id];
    expect(scene).toBeDefined();
    reached.add(id);
    if (scene.educationalCardId) expect(cards[scene.educationalCardId]).toBeDefined();
    expect(scene.choices.length).toBeGreaterThan(0);
    for (const choice of scene.choices) {
      if (choice.effects.educationalCardId) expect(cards[choice.effects.educationalCardId]).toBeDefined();
      if (choice.nextSceneId === 'chapter_reflection_screen') {
        expect(scene.endingType).toBeTruthy();
        endings.add(scene.endingType!);
        paths++;
      } else visit(choice.nextSceneId, new Set([...ancestors, id]));
    }
  }
  visit(createInitialState().currentSceneId, new Set());
  expect(reached.size).toBe(Object.keys(scenes).length);
  expect(endings.size).toBe(3);
  expect(paths).toBe(48);
});

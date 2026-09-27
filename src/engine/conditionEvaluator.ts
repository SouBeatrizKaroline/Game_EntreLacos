import type { Condition, GameState } from '../types';

export function evaluateCondition(condition: Condition | undefined, state: GameState): boolean {
  if (!condition) return true;
  switch (condition.type) {
    case 'memory': return state.memories.some(memory => memory.id === condition.id);
    case 'flag': return state.flags[condition.key] === condition.value;
    case 'relationship': return state.relationalState[condition.key] >= (condition.min ?? 0) && state.relationalState[condition.key] <= (condition.max ?? 10);
    case 'all': return condition.conditions.every(item => evaluateCondition(item, state));
    case 'any': return condition.conditions.some(item => evaluateCondition(item, state));
    case 'not': return !evaluateCondition(condition.condition, state);
  }
}

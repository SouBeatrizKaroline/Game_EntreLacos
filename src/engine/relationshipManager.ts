import type { Perspective, RelationalState } from '../types';

export function applyRelationalDeltas(state: RelationalState, deltas: Partial<RelationalState> = {}): RelationalState {
  const next = { ...state };
  for (const key of Object.keys(state) as (keyof RelationalState)[]) {
    const delta = deltas[key] ?? 0;
    next[key] = Math.max(0, Math.min(10, state[key] + (Number.isFinite(delta) ? delta : 0)));
  }
  return next;
}

export function getBehavioralCues(state: RelationalState, perspective: Perspective): string[] {
  if (perspective === 'echo_past') return [];
  const cues: string[] = [];
  if (state.accumulatedTension >= 7) cues.push('O silêncio fica mais pesado; as respostas saem curtas.');
  if (state.perceivedSafety <= 3) cues.push('O olhar se desvia e o corpo permanece retraído.');
  if (state.perceivedSafety >= 7) cues.push('Os ombros relaxam aos poucos e o olhar encontra espaço para voltar.');
  if (state.truthDisclosureTrust >= 7) cues.push('As palavras começam a sair com menos hesitação.');
  if (perspective === 'caregiver' && state.caregiverLoad >= 7) cues.push('A respiração está curta; uma pausa pode ajudar a organizar as palavras.');
  return cues;
}

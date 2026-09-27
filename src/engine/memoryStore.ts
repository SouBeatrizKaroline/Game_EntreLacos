import type { Memory } from '../types';

export function createMemory(memory: Omit<Memory, 'createdAt'>): Memory {
  return { ...memory, createdAt: Date.now() };
}

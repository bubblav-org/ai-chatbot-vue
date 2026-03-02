import { vi } from 'vitest';

// Mock Vue's onMounted to execute immediately in tests
vi.mock('vue', async (importOriginal) => {
  const actual = await importOriginal<typeof import('vue')>();
  return {
    ...actual,
    onMounted: vi.fn((fn) => fn()),
  };
});

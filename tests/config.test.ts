import {afterEach, describe, expect, it, vi} from 'vitest';

const expected = '0xe377EBA9359CA71Ad64D4BB65e5BC0Ff897aC3D8';
afterEach(() => { vi.unstubAllEnvs(); vi.resetModules(); });

describe('contract configuration', () => {
  it('uses the intended deployment when no override is configured', async () => {
    vi.stubEnv('VITE_GENLAYER_CONTRACT_ADDRESS', '');
    const {CONTRACT, DEFAULT_CONTRACT} = await import('../src/lib/genlayer');
    expect(DEFAULT_CONTRACT).toBe(expected);
    expect(CONTRACT).toBe(expected);
  });
  it('uses the intended deployment when explicitly configured', async () => {
    vi.stubEnv('VITE_GENLAYER_CONTRACT_ADDRESS', expected);
    const {CONTRACT} = await import('../src/lib/genlayer');
    expect(CONTRACT).toBe(expected);
  });
  it('honours a deliberate environment override', async () => {
    const override = '0x0000000000000000000000000000000000000001';
    vi.stubEnv('VITE_GENLAYER_CONTRACT_ADDRESS', override);
    const {CONTRACT} = await import('../src/lib/genlayer');
    expect(CONTRACT).toBe(override);
  });
});

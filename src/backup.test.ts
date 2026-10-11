import { describe, expect, it } from 'vitest';
import { isValidBackup } from './backup';

const backup = {
  version: 1,
  exercises: [{ id: 'e1', name: 'Squat', muscle: 'Benen', equipment: 'Barbell', type: 'weighted', instructions: '' }],
  routines: [{ id: 'r1', name: 'Benen', updatedAt: 1, exercises: [{ exerciseId: 'e1', sets: 3, reps: '8-12', weight: 50, note: '' }] }],
  workouts: [{ id: 'w1', name: 'Benen', startedAt: 1, endedAt: 2, note: '', exercises: [{ exerciseId: 'e1', name: 'Squat', sets: [{ weight: 50, reps: 8, done: true }] }] }],
  measurements: [{ id: 'm1', date: '2026-10-11', weight: 75 }],
  settings: { unit: 'kg', restSeconds: 90, theme: 'dark', trackBodyweight: true },
};

describe('backup validation', () => {
  it('accepts a complete valid export', () => expect(isValidBackup(backup)).toBe(true));
  it('rejects a wrong version and malformed nested set data', () => {
    expect(isValidBackup({ ...backup, version: 2 })).toBe(false);
    expect(isValidBackup({ ...backup, workouts: [{ ...backup.workouts[0], exercises: [{ exerciseId: 'e1', name: 'Squat', sets: [{ weight: 'heavy', reps: 8, done: true }] }] }] })).toBe(false);
  });
  it('rejects missing required collections', () => expect(isValidBackup({ version: 1, exercises: [] })).toBe(false));
});

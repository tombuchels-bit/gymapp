import 'fake-indexeddb/auto';
import Dexie from 'dexie';
import { beforeEach, describe, expect, it } from 'vitest';
import { db, initialize } from './db';
import type { Workout } from './types';

describe('IndexedDB persistence', () => {
  beforeEach(async () => {
    if (!db.isOpen()) await db.open();
    await db.transaction('rw', db.exercises, db.routines, db.workouts, db.measurements, db.settings, async () => {
      await Promise.all([db.exercises.clear(), db.routines.clear(), db.workouts.clear(), db.measurements.clear(), db.settings.clear()]);
    });
  });

  it('seeds the exercise library and default settings only once', async () => {
    await initialize();
    const count = await db.exercises.count();
    await initialize();
    expect(count).toBeGreaterThanOrEqual(18);
    expect(await db.exercises.count()).toBe(count);
    expect((await db.settings.get('main'))?.value.unit).toBe('kg');
  });

  it('persists and retrieves an active workout from IndexedDB', async () => {
    await initialize();
    const workout: Workout = { id: 'active', name: 'Push', startedAt: Date.now(), exercises: [], note: '' };
    await db.workouts.put(workout);
    const reopened = new Dexie('goonfitness');
    reopened.version(1).stores({ exercises: 'id, name, muscle, type', routines: 'id, name, updatedAt', workouts: 'id, startedAt, endedAt, name', measurements: 'id, date', settings: 'id' });
    try {
      await reopened.open();
      expect(await reopened.table('workouts').get('active')).toEqual(workout);
    } finally { reopened.close(); }
  });
});

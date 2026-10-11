import Dexie, { type Table } from 'dexie';
import type { Exercise, Routine, Workout, Measurement, Settings } from './types';
class FitnessDatabase extends Dexie {
  exercises!: Table<Exercise, string>; routines!: Table<Routine, string>; workouts!: Table<Workout, string>; measurements!: Table<Measurement, string>; settings!: Table<{ id: string; value: Settings }, string>;
  constructor() { super('goonfitness'); this.version(1).stores({ exercises: 'id, name, muscle, type', routines: 'id, name, updatedAt', workouts: 'id, startedAt, endedAt, name', measurements: 'id, date', settings: 'id' }); }
}
export const db = new FitnessDatabase();
export const defaultSettings: Settings = { unit: 'kg', restSeconds: 90, theme: 'dark', trackBodyweight: true };
const starter: Exercise[] = [
 ['Bench press','Borst','Barbell','weighted'],['Incline dumbbell press','Borst','Dumbbells','weighted'],['Overhead press','Schouders','Barbell','weighted'],['Lat pulldown','Rug','Cable','weighted'],['Pull-ups','Rug','Bodyweight','bodyweight'],['Barbell row','Rug','Barbell','weighted'],['Seated cable row','Rug','Cable','weighted'],['Dumbbell lateral raise','Schouders','Dumbbells','weighted'],['Biceps curl','Biceps','Dumbbells','weighted'],['Incline dumbbell curl','Biceps','Dumbbells','weighted'],['Triceps pushdown','Triceps','Cable','weighted'],['Squat','Benen','Barbell','weighted'],['Romanian deadlift','Benen','Barbell','weighted'],['Leg press','Benen','Machine','weighted'],['Leg curl','Benen','Machine','weighted'],['Leg extension','Benen','Machine','weighted'],['Calf raise','Benen','Machine','weighted'],['Plank','Core','Bodyweight','duration']
].map(([name,muscle,equipment,type])=>({id:crypto.randomUUID(),name,muscle,equipment,type:type as Exercise['type'],instructions:''}));
export async function initialize() { if (await db.exercises.count()===0) await db.exercises.bulkAdd(starter); if (!(await db.settings.get('main'))) await db.settings.put({id:'main',value:defaultSettings}); }
export const uid = () => crypto.randomUUID();

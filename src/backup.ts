import type { Exercise, Measurement, Routine, Settings, Workout } from './types';

export interface Backup {
  version: 1;
  exercises: Exercise[];
  routines: Routine[];
  workouts: Workout[];
  measurements: Measurement[];
  settings?: Settings;
}

const object = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null && !Array.isArray(value);
const string = (value: unknown): value is string => typeof value === 'string';
const finite = (value: unknown): value is number => typeof value === 'number' && Number.isFinite(value);
const optionalFinite = (value: unknown): boolean => value === undefined || finite(value);

function isExercise(value: unknown): value is Exercise {
  return object(value) && string(value.id) && string(value.name) && string(value.muscle) && string(value.equipment) && string(value.instructions) && ['weighted', 'bodyweight', 'assisted', 'duration'].includes(String(value.type)) && (value.custom === undefined || typeof value.custom === 'boolean');
}

function isRoutine(value: unknown): value is Routine {
  return object(value) && string(value.id) && string(value.name) && finite(value.updatedAt) && Array.isArray(value.exercises) && value.exercises.every((item) => object(item) && string(item.exerciseId) && Number.isInteger(item.sets) && Number(item.sets) >= 0 && string(item.reps) && finite(item.weight) && Number(item.weight) >= 0 && string(item.note));
}

function isWorkout(value: unknown): value is Workout {
  return object(value) && string(value.id) && string(value.name) && finite(value.startedAt) && optionalFinite(value.endedAt) && string(value.note) && Array.isArray(value.exercises) && value.exercises.every((item) => object(item) && string(item.exerciseId) && string(item.name) && Array.isArray(item.sets) && item.sets.every((set) => object(set) && finite(set.weight) && Number(set.weight) >= 0 && finite(set.reps) && Number(set.reps) >= 0 && typeof set.done === 'boolean' && optionalFinite(set.rpe) && (set.warmup === undefined || typeof set.warmup === 'boolean')));
}

function isMeasurement(value: unknown): value is Measurement {
  return object(value) && string(value.id) && typeof value.date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value.date) && optionalFinite(value.weight) && optionalFinite(value.waist) && optionalFinite(value.chest) && optionalFinite(value.arm) && (value.note === undefined || string(value.note));
}

function isSettings(value: unknown): value is Settings {
  return object(value) && ['kg', 'lb'].includes(String(value.unit)) && finite(value.restSeconds) && Number(value.restSeconds) >= 30 && Number(value.restSeconds) <= 300 && Number(value.restSeconds) % 30 === 0 && ['dark', 'light'].includes(String(value.theme)) && typeof value.trackBodyweight === 'boolean';
}

export function isValidBackup(value: unknown): value is Backup {
  return object(value) && value.version === 1 && Array.isArray(value.exercises) && value.exercises.every(isExercise) && Array.isArray(value.routines) && value.routines.every(isRoutine) && Array.isArray(value.workouts) && value.workouts.every(isWorkout) && Array.isArray(value.measurements) && value.measurements.every(isMeasurement) && (value.settings === undefined || isSettings(value.settings));
}

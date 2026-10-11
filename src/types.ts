export type ExerciseType = 'weighted' | 'bodyweight' | 'assisted' | 'duration';
export interface Exercise { id: string; name: string; muscle: string; equipment: string; type: ExerciseType; instructions: string; custom?: boolean }
export interface RoutineExercise { exerciseId: string; sets: number; reps: string; weight: number; note: string }
export interface Routine { id: string; name: string; exercises: RoutineExercise[]; updatedAt: number }
export interface WorkoutSet { weight: number; reps: number; rpe?: number; done: boolean; warmup?: boolean }
export interface PerformedExercise { exerciseId: string; name: string; sets: WorkoutSet[] }
export interface Workout { id: string; name: string; startedAt: number; endedAt?: number; exercises: PerformedExercise[]; note: string }
export interface Measurement { id: string; date: string; weight?: number; waist?: number; chest?: number; arm?: number; note?: string }
export interface Settings { unit: 'kg' | 'lb'; restSeconds: number; theme: 'dark' | 'light'; trackBodyweight: boolean }

import type { Workout } from './types';
export const volume = (workouts: Workout[]) => workouts.flatMap(w=>w.exercises).flatMap(e=>e.sets).filter(s=>s.done).reduce((sum,s)=>sum+s.weight*s.reps,0);
export const epley = (weight: number, reps: number) => reps > 0 && weight > 0 ? Math.round(weight*(1+reps/30)*10)/10 : 0;
export function records(workouts: Workout[]) { const best = new Map<string, {name:string; weight:number; reps:number; e1rm:number; date:number}>(); for(const w of workouts) for(const e of w.exercises) for(const s of e.sets) if(s.done && s.weight>0) { const prior=best.get(e.exerciseId); if(!prior || s.weight>prior.weight) best.set(e.exerciseId,{name:e.name,weight:s.weight,reps:s.reps,e1rm:epley(s.weight,s.reps),date:w.startedAt}); } return [...best.values()].sort((a,b)=>b.date-a.date); }
export function exerciseProgress(workouts: Workout[], exerciseId: string) {
  return workouts.flatMap(workout => {
    const exercise = workout.exercises.find(item => item.exerciseId === exerciseId);
    const sets = exercise?.sets.filter(set => set.done) ?? [];
    if (!sets.length) return [];
    const weight = Math.max(...sets.map(set => set.weight));
    const e1rm = Math.max(...sets.filter(set => set.weight > 0).map(set => set.weight * (1 + set.reps / 30)), 0);
    return [{ date: workout.startedAt, label: new Intl.DateTimeFormat('nl-NL', { day: 'numeric', month: 'short' }).format(workout.startedAt), weight, e1rm: Math.round(e1rm * 10) / 10, volume: Math.round(sets.reduce((sum, set) => sum + set.weight * set.reps, 0)) }];
  }).sort((a, b) => a.date - b.date);
}

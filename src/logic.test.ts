import { describe, expect, it } from 'vitest';
import { epley, records, volume } from './logic';
import type { Workout } from './types';
const workout: Workout = { id:'w', name:'Test', startedAt:1, endedAt:2, note:'', exercises:[{exerciseId:'e',name:'Squat',sets:[{weight:100,reps:5,done:true},{weight:80,reps:8,done:false}]}] };
describe('training calculations',()=>{
 it('calculates volume from completed sets only',()=>expect(volume([workout])).toBe(500));
 it('calculates estimated 1RM using Epley',()=>expect(epley(100,5)).toBe(116.7));
 it('finds the heaviest completed set as a record',()=>expect(records([workout])).toEqual([{name:'Squat',weight:100,reps:5,e1rm:116.7,date:1}]));
});

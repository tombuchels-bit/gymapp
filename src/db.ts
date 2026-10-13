import Dexie, { type Table } from 'dexie';
import type { Exercise, Routine, Workout, Measurement, Settings } from './types';

class FitnessDatabase extends Dexie {
  exercises!: Table<Exercise, string>;
  routines!: Table<Routine, string>;
  workouts!: Table<Workout, string>;
  measurements!: Table<Measurement, string>;
  settings!: Table<{ id: string; value: Settings }, string>;

  constructor() {
    super('goonfitness');
    this.version(1).stores({
      exercises: 'id, name, muscle, type',
      routines: 'id, name, updatedAt',
      workouts: 'id, startedAt, endedAt, name',
      measurements: 'id, date',
      settings: 'id',
    });
  }
}

export const db = new FitnessDatabase();
export const defaultSettings: Settings = { unit: 'kg', restSeconds: 90, theme: 'dark', trackBodyweight: true };

type ExerciseGroup = [names: string, muscle: string, equipment: string, type?: Exercise['type']];
const groups: ExerciseGroup[] = [
  // Chest
  ['Incline Barbell Bench Press|Decline Barbell Bench Press|Close-Grip Bench Press|Reverse-Grip Bench Press', 'Borst', 'Barbell'],
  ['Dumbbell Floor Press|Incline Dumbbell Fly|Decline Dumbbell Press|Neutral-Grip Dumbbell Press|Single-Arm Dumbbell Bench Press|Dumbbell Squeeze Press', 'Borst', 'Dumbbells'],
  ['Low-to-High Cable Fly|High-to-Low Cable Fly|Single-Arm Cable Chest Press|Standing Cable Fly|Cable Crossover|Incline Cable Fly|Decline Cable Fly', 'Borst', 'Cable'],
  ['Pec Deck Fly|Plate-Loaded Chest Press|Iso-Lateral Chest Press', 'Borst', 'Machine'],

  // Back
  ['Close-Grip Lat Pulldown|Reverse-Grip Lat Pulldown|Neutral-Grip Lat Pulldown|Single-Arm Lat Pulldown|Kneeling Lat Pulldown|Straight-Arm Pulldown|Cable Pullover|Single-Arm Cable Row|Wide-Grip Seated Cable Row|Close-Grip Seated Cable Row', 'Rug', 'Cable'],
  ['Machine Pullover|Machine High Row', 'Rug', 'Machine'],
  ['Assisted Chin-Up', 'Rug', 'Assisted', 'assisted'],
  ['Wide-Grip Pull-Up', 'Rug', 'Bodyweight', 'bodyweight'],
  ['Chest-Supported Dumbbell Row|Incline Bench Dumbbell Row', 'Rug', 'Dumbbells'],
  ['Meadows Row|Landmine Row|Seal Row|T-Bar Row', 'Rug', 'Barbell'],

  // Shoulders and rear delts
  ['Arnold Press|Seated Dumbbell Shoulder Press|Dumbbell Front Raise|Bent-Over Dumbbell Rear Delt Raise|Dumbbell External Rotation', 'Schouders', 'Dumbbells'],
  ['Single-Arm Landmine Press', 'Schouders', 'Barbell'],
  ['Machine Shoulder Press|Reverse Pec Deck', 'Schouders', 'Machine'],
  ['Cable Lateral Raise|Leaning Cable Lateral Raise|Behind-the-Back Cable Lateral Raise|Cable Front Raise|Cable Rear Delt Fly|Face Pull|Rope Face Pull to External Rotation|Cable External Rotation|Cable Upright Row', 'Schouders', 'Cable'],
  ['Plate Front Raise', 'Schouders', 'Weight Plate'],
  ['Prone Y Raise|Prone T Raise', 'Schouders', 'Bodyweight', 'bodyweight'],

  // Biceps
  ['Bayesian Cable Curl|Behind-the-Body Cable Curl|Rope Hammer Curl|Cable Preacher Curl|High Cable Curl', 'Biceps', 'Cable'],
  ['Spider Curl|Incline Hammer Curl|Cross-Body Hammer Curl', 'Biceps', 'Dumbbells'],
  ['Reverse EZ-Bar Curl', 'Biceps', 'EZ-Bar'],
  ['Machine Preacher Curl', 'Biceps', 'Machine'],

  // Triceps
  ['Overhead Rope Triceps Extension|Single-Arm Overhead Cable Extension|Cross-Body Cable Triceps Extension|Reverse-Grip Triceps Pushdown|Single-Arm Reverse-Grip Pushdown|Cable Kickback', 'Triceps', 'Cable'],
  ['Dumbbell Tate Press', 'Triceps', 'Dumbbells'],
  ['JM Press', 'Triceps', 'Barbell'],
  ['Machine Triceps Extension', 'Triceps', 'Machine'],
  ['Close-Grip Push-Up|Decline Push-Up|Incline Push-Up|Diamond Push-Up|Archer Push-Up|Deficit Push-Up|Ring Push-Up|Ring Dip|Straight-Bar Dip|Pseudo Planche Push-Up|Plyometric Push-Up', 'Borst', 'Bodyweight', 'bodyweight'],

  // Forearms and grip
  ['Wrist Curl|Reverse Wrist Curl|Behind-the-Back Wrist Curl|Dumbbell Pronation|Dumbbell Supination', 'Onderarmen', 'Dumbbells'],
  ['Cable Wrist Curl', 'Onderarmen', 'Cable'],
  ['Wrist Roller|Plate Pinch Hold', 'Onderarmen', 'Weight Plate'],
  ['Farmer\'s Walk', 'Grip', 'Dumbbells'],
  ['Dead Hang', 'Grip', 'Bodyweight', 'duration'],

  // Quads
  ['Hack Squat|Pendulum Squat', 'Benen', 'Machine'],
  ['Belt Squat', 'Benen', 'Belt Squat Machine'],
  ['Smith Machine Front Squat|Smith Machine Reverse Lunge', 'Benen', 'Smith Machine'],
  ['Heel-Elevated Goblet Squat|Bulgarian Split Squat|Walking Dumbbell Lunge|Reverse Dumbbell Lunge|Lateral Lunge|Cossack Squat|Step-Up|Single-Leg Box Squat', 'Benen', 'Dumbbells'],
  ['Cyclist Squat|Front-Foot-Elevated Split Squat|Rear-Foot-Elevated Split Squat|Deficit Reverse Lunge', 'Benen', 'Bodyweight', 'bodyweight'],
  ['Leg Press — High Foot Placement|Single-Leg Leg Press', 'Benen', 'Machine'],
  ['Leg Extension — Single Leg', 'Benen', 'Machine'],
  ['Spanish Squat', 'Benen', 'Resistance Band'],

  // Hamstrings and glutes
  ['Seated Leg Curl|Lying Single-Leg Curl|Standing Leg Curl|Glute-Ham Raise|Slider Leg Curl', 'Benen', 'Machine'],
  ['Nordic Hamstring Curl', 'Benen', 'Bodyweight', 'bodyweight'],
  ['Stability Ball Leg Curl', 'Benen', 'Stability Ball', 'bodyweight'],
  ['Single-Leg Romanian Deadlift|Dumbbell Stiff-Leg Deadlift', 'Benen', 'Dumbbells'],
  ['Cable Pull-Through|Cable Glute Kickback|Cable Hip Abduction', 'Bilspieren', 'Cable'],
  ['Barbell Glute Bridge', 'Bilspieren', 'Barbell'],
  ['Smith Machine Hip Thrust', 'Bilspieren', 'Smith Machine'],
  ['Single-Leg Hip Thrust|Frog Pump', 'Bilspieren', 'Bodyweight', 'bodyweight'],
  ['Machine Glute Kickback', 'Bilspieren', 'Machine'],
  ['45-Degree Hip Extension — Glute Focus|45-Degree Back Extension|Reverse Hyperextension|Prone Bench Back Extension', 'Rug', 'Machine'],
  ['Banded Glute Bridge', 'Bilspieren', 'Resistance Band'],

  // Calves and shins
  ['Seated Calf Raise|Leg Press Calf Raise|Bent-Knee Calf Raise|Single-Leg Seated Calf Raise', 'Benen', 'Machine'],
  ['Donkey Calf Raise', 'Benen', 'Machine'],
  ['Single-Leg Standing Calf Raise|Tibialis Raise|Wall Tibialis Raise', 'Benen', 'Bodyweight', 'bodyweight'],
  ['Smith Machine Calf Raise', 'Benen', 'Smith Machine'],
  ['Reverse Sled Drag', 'Benen', 'Sled'],

  // Core
  ['Cable Crunch|Kneeling Rope Crunch|Cable Woodchop|Cable Lift', 'Core', 'Cable'],
  ['Decline Sit-Up|Weighted Sit-Up|GHD Sit-Up', 'Core', 'Bodyweight', 'bodyweight'],
  ['Machine Ab Crunch', 'Core', 'Machine'],
  ['Stability Ball Crunch', 'Core', 'Stability Ball', 'bodyweight'],
  ['Reverse Crunch|Hanging Knee Raise|Hanging Leg Raise|Ab Wheel Rollout|Dead Bug|Bird Dog', 'Core', 'Bodyweight', 'bodyweight'],
  ['Pallof Press', 'Core', 'Cable'],
  ['Side Plank|Copenhagen Plank', 'Core', 'Bodyweight', 'duration'],
  ['Barbell Rollout', 'Core', 'Barbell'],
  ['Suitcase Carry', 'Core', 'Dumbbell'],

  // Olympic and full-body lifts
  ['Barbell Clean|Hang Power Clean|Barbell Thruster|Barbell Push Press|Snatch-Grip Deadlift|Rack Pull|Block Pull|Trap Bar Deadlift', 'Full body', 'Barbell'],
  ['Dumbbell Thruster|Turkish Get-Up|Dumbbell Snatch|Dumbbell Man Maker', 'Full body', 'Dumbbells'],
  ['Kettlebell Swing', 'Full body', 'Kettlebell'],
  ['Dumbbell Shrug', 'Schouders', 'Dumbbells'],
  ['Barbell Shrug|Behind-the-Back Barbell Shrug', 'Schouders', 'Barbell'],
  ['Cable Shrug', 'Schouders', 'Cable'],

  // Cardio and conditioning
  ['Air Bike|Assault Bike Sprint', 'Cardio', 'Air Bike', 'duration'],
  ['Rowing Machine', 'Cardio', 'Roeimachine', 'duration'],
  ['Ski Erg', 'Cardio', 'Ski Erg', 'duration'],
  ['Stair Climber', 'Cardio', 'Stair Climber', 'duration'],
  ['Incline Treadmill Walk|Treadmill Sprint', 'Cardio', 'Loopband', 'duration'],
  ['Elliptical Trainer', 'Cardio', 'Crosstrainer', 'duration'],
  ['Sled Push|Sled Pull', 'Conditioning', 'Sled', 'duration'],
];

const starter: Exercise[] = [
  ['Bench press', 'Borst', 'Barbell', 'weighted'],
  ['Incline dumbbell press', 'Borst', 'Dumbbells', 'weighted'],
  ['Overhead press', 'Schouders', 'Barbell', 'weighted'],
  ['Lat pulldown', 'Rug', 'Cable', 'weighted'],
  ['Pull-ups', 'Rug', 'Bodyweight', 'bodyweight'],
  ['Barbell row', 'Rug', 'Barbell', 'weighted'],
  ['Seated cable row', 'Rug', 'Cable', 'weighted'],
  ['Dumbbell lateral raise', 'Schouders', 'Dumbbells', 'weighted'],
  ['Biceps curl', 'Biceps', 'Dumbbells', 'weighted'],
  ['Incline dumbbell curl', 'Biceps', 'Dumbbells', 'weighted'],
  ['Triceps pushdown', 'Triceps', 'Cable', 'weighted'],
  ['Squat', 'Benen', 'Barbell', 'weighted'],
  ['Romanian deadlift', 'Benen', 'Barbell', 'weighted'],
  ['Leg press', 'Benen', 'Machine', 'weighted'],
  ['Leg curl', 'Benen', 'Machine', 'weighted'],
  ['Leg extension', 'Benen', 'Machine', 'weighted'],
  ['Calf raise', 'Benen', 'Machine', 'weighted'],
  ['Plank', 'Core', 'Bodyweight', 'duration'],
].map(([name, muscle, equipment, type]) => ({
  id: crypto.randomUUID(),
  name,
  muscle,
  equipment,
  type: type as Exercise['type'],
  instructions: '',
}));

const expandedLibrary: Exercise[] = groups.flatMap(([names, muscle, equipment, type = 'weighted']) =>
  names.split('|').map(name => ({
    id: crypto.randomUUID(),
    name,
    muscle,
    equipment,
    type,
    instructions: '',
  })),
);

export async function initialize() {
  const existingNames = new Set((await db.exercises.toArray()).map(exercise => exercise.name.trim().toLocaleLowerCase()));
  const missingExercises = [...starter, ...expandedLibrary].filter(exercise => {
    const name = exercise.name.trim().toLocaleLowerCase();
    if (existingNames.has(name)) return false;
    existingNames.add(name);
    return true;
  });
  if (missingExercises.length) await db.exercises.bulkAdd(missingExercises);
  if (!(await db.settings.get('main'))) await db.settings.put({ id: 'main', value: defaultSettings });
}

export const uid = () => crypto.randomUUID();

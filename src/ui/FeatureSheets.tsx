import { useMemo, useState, type ReactNode } from 'react';
import { Check, Minus, Plus, Search, X } from 'lucide-react';
import type { Exercise, Measurement, RoutineExercise } from '../types';

function Sheet({ children, onClose }: { children: ReactNode; onClose: () => void }) {
  return <div className="overlay" onClick={onClose}><section className="sheet feature-sheet" onClick={event => event.stopPropagation()}>{children}</section></div>;
}

export function RoutineEditor({ exercises, onClose, onSave }: { exercises: Exercise[]; onClose: () => void; onSave: (name: string, items: RoutineExercise[]) => void }) {
  const [name, setName] = useState('');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<RoutineExercise[]>([]);
  const filtered = useMemo(() => exercises.filter(item => `${item.name} ${item.muscle}`.toLowerCase().includes(search.toLowerCase())), [exercises, search]);
  const toggle = (exercise: Exercise) => setSelected(items => items.some(item => item.exerciseId === exercise.id)
    ? items.filter(item => item.exerciseId !== exercise.id)
    : [...items, { exerciseId: exercise.id, sets: 3, reps: '8-12', weight: 0, note: '' }]);
  const update = (id: string, changes: Partial<RoutineExercise>) => setSelected(items => items.map(item => item.exerciseId === id ? { ...item, ...changes } : item));
  return <Sheet onClose={onClose}>
    <div className="sheet-head"><div><small>NIEUWE ROUTINE</small><h2>Routine samenstellen</h2></div><button className="icon-button" onClick={onClose} aria-label="Sluiten"><X/></button></div>
    <label className="field-label">Naam<input autoFocus value={name} onChange={event => setName(event.target.value)} placeholder="Bijvoorbeeld Push A" maxLength={50}/></label>
    <div className="search"><Search size={16}/><input placeholder="Zoek oefening of spiergroep" value={search} onChange={event => setSearch(event.target.value)}/></div>
    <p className="editor-caption">Selecteer oefeningen om toe te voegen. Pas daarna sets, herhalingen en streefgewicht aan.</p>
    <div className="routine-picker">{filtered.map(exercise => { const checked = selected.some(item => item.exerciseId === exercise.id); return <button type="button" className={`library-item picker-item ${checked ? 'selected' : ''}`} key={exercise.id} onClick={() => toggle(exercise)}><span><b>{exercise.name}</b><small>{exercise.muscle} · {exercise.equipment}</small></span>{checked ? <Check size={18}/> : <Plus size={18}/>}</button> })}</div>
    {selected.length > 0 && <div className="selected-routine"><h3>Routine-oefeningen <span>{selected.length}</span></h3>{selected.map(item => { const exercise = exercises.find(candidate => candidate.id === item.exerciseId); return <div className="routine-config" key={item.exerciseId}><div className="config-title"><b>{exercise?.name ?? 'Oefening'}</b><button type="button" className="ghost-icon" onClick={() => toggle(exercise!)} aria-label="Verwijderen"><Minus size={15}/></button></div><div className="config-fields"><label>Sets<input type="number" min="1" max="20" value={item.sets} onChange={event => update(item.exerciseId, { sets: Number(event.target.value) })}/></label><label>Reps<input value={item.reps} onChange={event => update(item.exerciseId, { reps: event.target.value })}/></label><label>Kg<input type="number" min="0" step="0.5" value={item.weight} onChange={event => update(item.exerciseId, { weight: Number(event.target.value) })}/></label></div></div> })}</div>}
    <div className="sheet-actions"><button className="cancel-button" onClick={onClose}>Annuleren</button><button className="finish-button" disabled={!name.trim()} onClick={() => onSave(name.trim(), selected)}><Check size={17}/> Routine opslaan</button></div>
  </Sheet>;
}

export function MeasurementEditor({ initialDate, onClose, onSave }: { initialDate: string; onClose: () => void; onSave: (measurement: Omit<Measurement, 'id'>) => void }) {
  const [date, setDate] = useState(initialDate);
  const [values, setValues] = useState({ weight: '', waist: '', chest: '', arm: '', note: '' });
  const [error, setError] = useState('');
  const fields: Array<{ key: 'weight'|'waist'|'chest'|'arm'; label: string; unit: string }> = [
    { key: 'weight', label: 'Lichaamsgewicht', unit: 'kg' }, { key: 'waist', label: 'Taille', unit: 'cm' }, { key: 'chest', label: 'Borst', unit: 'cm' }, { key: 'arm', label: 'Bovenarm', unit: 'cm' },
  ];
  const save = () => {
    const entries = fields.map(field => [field.key, values[field.key] === '' ? undefined : Number(values[field.key])] as const);
    if (entries.every(([, value]) => value === undefined)) { setError('Vul ten minste één meting in.'); return; }
    if (entries.some(([, value]) => value !== undefined && (!Number.isFinite(value) || value <= 0))) { setError('Vul positieve getallen in bij je metingen.'); return; }
    if (!date) { setError('Kies een datum.'); return; }
    onSave({ date, ...Object.fromEntries(entries), note: values.note.trim() || undefined });
  };
  return <Sheet onClose={onClose}>
    <div className="sheet-head"><div><small>LICHAAMSMETINGEN</small><h2>Meting toevoegen</h2></div><button className="icon-button" onClick={onClose} aria-label="Sluiten"><X/></button></div>
    <label className="field-label">Datum<input type="date" value={date} onChange={event => setDate(event.target.value)}/></label>
    <div className="measurement-grid">{fields.map(field => <label className="field-label" key={field.key}>{field.label} <span>({field.unit})</span><input type="number" min="0" step={field.key === 'weight' ? '0.1' : '0.5'} value={values[field.key]} onChange={event => setValues(current => ({ ...current, [field.key]: event.target.value }))} placeholder="Optioneel"/></label>)}</div>
    <label className="field-label">Notitie<textarea value={values.note} onChange={event => setValues(current => ({ ...current, note: event.target.value }))} placeholder="Bijvoorbeeld ochtendmeting"/></label>
    {error && <p className="form-error">{error}</p>}
    <div className="sheet-actions"><button className="cancel-button" onClick={onClose}>Annuleren</button><button className="finish-button" onClick={save}><Check size={17}/> Meting opslaan</button></div>
  </Sheet>;
}

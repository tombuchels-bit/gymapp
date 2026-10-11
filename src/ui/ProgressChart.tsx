import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export interface ExerciseOption { id: string; name: string }
export interface ProgressPoint { date: number; label: string; weight: number; e1rm: number; volume: number }
type Metric = 'weight' | 'e1rm' | 'volume';

export default function ProgressChart({ options, data, exerciseId, onExerciseChange, metric, onMetricChange }: {
  options: ExerciseOption[]; data: ProgressPoint[]; exerciseId: string; onExerciseChange: (id: string) => void; metric: Metric; onMetricChange: (metric: Metric) => void;
}) {
  const metricLabels: Record<Metric, string> = { weight: 'Zwaarste set (kg)', e1rm: 'Geschatte 1RM (kg)', volume: 'Volume per training (kg)' };
  return <div className="progress-chart card-pad">
    {!options.length ? <div className="empty"><div className="empty-icon">—</div><b>Nog geen oefendata</b><p>Rond een training af met voltooide sets. Daarna kun je per oefening je ontwikkeling bekijken.</p></div> : <>
      <div className="chart-controls"><label>Oefening<select value={exerciseId} onChange={event => onExerciseChange(event.target.value)}>{options.map(option => <option key={option.id} value={option.id}>{option.name}</option>)}</select></label><label>Toon<select value={metric} onChange={event => onMetricChange(event.target.value as Metric)}><option value="weight">Zwaarste gewicht</option><option value="e1rm">Geschatte 1RM</option><option value="volume">Trainingsvolume</option></select></label></div>
      {data.length === 0 ? <div className="chart-empty"><b>Log nog een training voor deze oefening</b><p>Er is {data.length ? 'één training' : 'nog geen training'} met afgeronde sets. Twee of meer trainingen laten een trend zien.</p></div> : <ResponsiveContainer width="100%" height={230}><LineChart data={data} margin={{ top: 12, right: 10, left: -16, bottom: 0 }}><CartesianGrid stroke="#29302b" strokeDasharray="3 3"/><XAxis dataKey="label" tick={{ fill: '#858c86', fontSize: 10 }} axisLine={{ stroke: '#343a35' }} tickLine={false}/><YAxis width={48} tick={{ fill: '#858c86', fontSize: 10 }} axisLine={false} tickLine={false} domain={['auto','auto']}/><Tooltip contentStyle={{ background: '#171c19', border: '1px solid #343a35', borderRadius: 10, color: '#f2f4ef', fontSize: 12 }} formatter={(value: number) => [`${value} kg`, metricLabels[metric]]}/><Line type="monotone" dataKey={metric} name={metricLabels[metric]} stroke="#b9f36a" strokeWidth={2.5} dot={{ r: 4, fill: '#b9f36a', stroke: '#101410', strokeWidth: 2 }} activeDot={{ r: 6 }}/></LineChart></ResponsiveContainer>}
      {data.length > 0 && <p className="chart-caption">Per sessie: {metric === 'volume' ? 'totaal volume van afgeronde sets' : metric === 'e1rm' ? 'schatting op basis van je zwaarste set (Epley)' : 'zwaarste afgeronde set'}.</p>}
    </>}
  </div>;
}

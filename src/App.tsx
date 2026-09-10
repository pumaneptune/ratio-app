import { useEffect, useMemo, useRef, useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import {
  ArrowDown,
  Bean,
  Check,
  Coffee,
  Droplets,
  FlaskConical,
  Info,
  Leaf,
  Pause,
  Play,
  Plus,
  RotateCcw,
  Sparkles,
  Thermometer,
  Timer,
  Trash2,
  Waves,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { loadSession, saveSession } from '@/lib/storage';
import { hapticLight, hapticSuccess } from '@/lib/haptics';

type BrewStep = { instruction: string; time?: string };
type BrewMethod = {
  name: string;
  icon: LucideIcon;
  ratio: number;
  time: string;
  description: string;
  grindSize: string;
  waterTemp: string;
  steps: BrewStep[];
};

const parseTimeRange = (time?: string): { start: number; end: number } | null => {
  if (!time) return null;
  const parts = time.split(/[–-]/).map((part) => part.trim());
  if (parts.length !== 2) return null;
  const toSeconds = (chunk: string) => {
    const match = chunk.match(/^(\d+):(\d{2})$/);
    if (!match) return null;
    return Number(match[1]) * 60 + Number(match[2]);
  };
  const start = toSeconds(parts[0]);
  const end = toSeconds(parts[1]);
  if (start === null || end === null) return null;
  return { start, end };
};

const formatClock = (totalSeconds: number) => {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
};
type Favorite = { id: string; method: string; ratio: number; coffee_grams: number };
type InputMode = 'coffee' | 'water';

const brewMethods: BrewMethod[] = [
  { name: 'V60', icon: Waves, ratio: 16, time: '~3 min', description: 'Bright, layered clarity', grindSize: 'Medium-fine', waterTemp: '94–96°C', steps: [
    { instruction: 'Rinse the paper filter with hot water and discard the rinse water.' },
    { instruction: 'Add your ground coffee and gently level the bed.' },
    { instruction: 'Bloom with 2× the coffee weight in water.', time: '0:00–0:30' },
    { instruction: 'Pour to 60% of total water in slow, steady circles.', time: '0:30–1:45' },
    { instruction: 'Make the final pour to reach your total water weight.', time: '1:45–2:15' },
    { instruction: 'Let the drawdown finish, then remove the brewer.', time: '2:15–3:00' },
  ] },
  { name: 'Chemex', icon: FlaskConical, ratio: 17, time: '~4 min', description: 'Clean, delicate sweetness', grindSize: 'Medium-coarse', waterTemp: '94–96°C', steps: [
    { instruction: 'Rinse the thick filter thoroughly with hot water.' },
    { instruction: 'Add coffee and settle the grounds into an even bed.' },
    { instruction: 'Bloom with 3× the coffee weight in water.', time: '0:00–0:45' },
    { instruction: 'Pour in 3 stages, keeping the bed level.', time: '0:45–3:00' },
    { instruction: 'Let the drawdown finish before removing the filter.', time: '3:00–4:00' },
  ] },
  { name: 'AeroPress', icon: Coffee, ratio: 14, time: '~2 min', description: 'Rounded, lively and smooth', grindSize: 'Medium-fine', waterTemp: '85–92°C', steps: [
    { instruction: 'Add coffee to the chamber.' },
    { instruction: 'Pour all water and stir gently.', time: '0:00–0:10' },
    { instruction: 'Attach the cap, flip, and steep.', time: '0:10–1:25' },
    { instruction: 'Press slowly and evenly over your cup.', time: '1:25–1:55' },
  ] },
  { name: 'French Press', icon: Bean, ratio: 15, time: '~4 min', description: 'Full-bodied and comforting', grindSize: 'Coarse', waterTemp: '93–96°C', steps: [
    { instruction: 'Add coarse grounds to the warm press.' },
    { instruction: 'Pour all water and stir to fully saturate.' },
    { instruction: 'Steep with the plunger raised.', time: '0:00–4:00' },
    { instruction: 'Press down slowly and pour immediately.', time: '4:00–4:30' },
  ] },
  { name: 'Cold Brew', icon: Droplets, ratio: 8, time: '~16 hr', description: 'Silky, deep and refreshing', grindSize: 'Extra coarse', waterTemp: 'Room temp', steps: [
    { instruction: 'Combine coarse grounds and room-temperature water.' },
    { instruction: 'Stir gently to saturate every ground.' },
    { instruction: 'Steep at room temperature or in the fridge.', time: '12–18 hr' },
    { instruction: 'Strain, then dilute the concentrate to taste.' },
  ] },
  { name: 'Espresso', icon: Sparkles, ratio: 2, time: '~28 sec', description: 'Concentrated and intense', grindSize: 'Fine', waterTemp: '90–94°C', steps: [
    { instruction: 'Dose and distribute the grounds evenly.' },
    { instruction: 'Tamp level and firm.' },
    { instruction: 'Start the shot; watch for first drips.', time: '0:00–0:06' },
    { instruction: 'Stop at your target yield.', time: '0:06–0:28' },
  ] },
];

const ratioDescription = (ratio: number) => {
  if (ratio <= 13) return { title: 'Bold', copy: 'Thick body, strong flavor' };
  if (ratio <= 15) return { title: 'Balanced', copy: 'Sweet, rounded, and comforting' };
  if (ratio <= 17) return { title: 'Bright', copy: 'Clear flavor with a silky body' };
  return { title: 'Light', copy: 'Tea-like clarity and gentle notes' };
};

const formatGrams = (value: number) => Number.isInteger(value) ? String(value) : value.toFixed(1);

function App() {
  const [selectedMethod, setSelectedMethod] = useState(() => loadSession()?.methodIndex ?? 0);
  const [ratio, setRatio] = useState(() => loadSession()?.ratio ?? brewMethods[0].ratio);
  const [inputMode, setInputMode] = useState<InputMode>(() => loadSession()?.inputMode ?? 'coffee');
  const [coffee, setCoffee] = useState(() => loadSession()?.coffee ?? 20);
  const [water, setWater] = useState(() => loadSession()?.water ?? 320);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [saving, setSaving] = useState(false);
  const [savedNotice, setSavedNotice] = useState(false);
  const [isBrewing, setIsBrewing] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastActiveStepRef = useRef<number | null>(null);

  const method = brewMethods[selectedMethod];
  const ratioInfo = ratioDescription(ratio);

  const timedSteps = useMemo(
    () => method.steps.map((step) => ({ ...step, range: parseTimeRange(step.time) })),
    [method]
  );
  const isTimerCapable = timedSteps.some((step) => step.range !== null);
  const totalSeconds = useMemo(
    () => timedSteps.reduce((max, step) => (step.range ? Math.max(max, step.range.end) : max), 0),
    [timedSteps]
  );
  const activeStepIndex = useMemo(() => {
    if (!isBrewing && elapsed === 0) return -1;
    const idx = timedSteps.findIndex((step) => step.range && elapsed >= step.range.start && elapsed < step.range.end);
    if (idx !== -1) return idx;
    return elapsed >= totalSeconds && totalSeconds > 0 ? timedSteps.length : -1;
  }, [timedSteps, elapsed, isBrewing, totalSeconds]);
  const isBrewComplete = totalSeconds > 0 && elapsed >= totalSeconds;

  useEffect(() => {
    setIsBrewing(false);
    setElapsed(0);
    lastActiveStepRef.current = null;
  }, [selectedMethod]);

  useEffect(() => {
    if (isBrewing) {
      intervalRef.current = setInterval(() => {
        setElapsed((current) => {
          const next = current + 1;
          if (totalSeconds > 0 && next >= totalSeconds) {
            setIsBrewing(false);
            hapticSuccess();
            return totalSeconds;
          }
          return next;
        });
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isBrewing, totalSeconds]);

  useEffect(() => {
    if (activeStepIndex !== lastActiveStepRef.current && activeStepIndex >= 0 && activeStepIndex < timedSteps.length) {
      hapticLight();
    }
    lastActiveStepRef.current = activeStepIndex;
  }, [activeStepIndex, timedSteps.length]);

  const toggleBrewing = () => {
    if (isBrewComplete) {
      setElapsed(0);
      setIsBrewing(true);
      return;
    }
    setIsBrewing((current) => !current);
  };
  const resetBrewing = () => {
    setIsBrewing(false);
    setElapsed(0);
  };

  useEffect(() => {
    const loadFavorites = async () => {
      const { data } = await supabase.from('brew_ratio_favorites').select('id, method, ratio, coffee_grams').order('created_at', { ascending: false });
      if (data) setFavorites(data as Favorite[]);
    };
    void loadFavorites();
  }, []);

  useEffect(() => {
    saveSession({ methodIndex: selectedMethod, ratio, coffee, water, inputMode });
  }, [selectedMethod, ratio, coffee, water, inputMode]);

  const calculatedWater = useMemo(() => Number((coffee * ratio).toFixed(1)), [coffee, ratio]);
  const calculatedCoffee = useMemo(() => Number((water / ratio).toFixed(1)), [water, ratio]);

  const selectMethod = (index: number) => {
    if (index === selectedMethod) return;
    hapticLight();
    const next = brewMethods[index];
    setSelectedMethod(index);
    setRatio(next.ratio);
    if (inputMode === 'coffee') setWater(Number((coffee * next.ratio).toFixed(1)));
    else setCoffee(Number((water / next.ratio).toFixed(1)));
  };

  const updateRatio = (nextRatio: number) => {
    setRatio(nextRatio);
    if (inputMode === 'coffee') setWater(Number((coffee * nextRatio).toFixed(1)));
    else setCoffee(Number((water / nextRatio).toFixed(1)));
  };

  const updateCoffee = (value: string) => {
    const next = Math.max(0, Number(value) || 0);
    setCoffee(next);
    if (inputMode === 'coffee') setWater(Number((next * ratio).toFixed(1)));
  };

  const updateWater = (value: string) => {
    const next = Math.max(0, Number(value) || 0);
    setWater(next);
    if (inputMode === 'water') setCoffee(Number((next / ratio).toFixed(1)));
  };

  const toggleInputMode = (nextMode: InputMode) => {
    setInputMode(nextMode);
    if (nextMode === 'coffee') setWater(calculatedWater);
    else setCoffee(calculatedCoffee);
  };

  const saveFavorite = async () => {
    if (saving || coffee <= 0) return;
    setSaving(true);
    const { data } = await supabase.from('brew_ratio_favorites').insert({ method: method.name, ratio, coffee_grams: coffee }).select('id, method, ratio, coffee_grams').maybeSingle();
    if (data) {
      hapticSuccess();
      setFavorites((current) => [data as Favorite, ...current]);
      setSavedNotice(true);
      window.setTimeout(() => setSavedNotice(false), 2200);
    }
    setSaving(false);
  };

  const removeFavorite = async (id: string) => {
    setFavorites((current) => current.filter((favorite) => favorite.id !== id));
    await supabase.from('brew_ratio_favorites').delete().eq('id', id);
  };

  const loadFavorite = (favorite: Favorite) => {
    const index = brewMethods.findIndex((item) => item.name === favorite.method);
    if (index >= 0) setSelectedMethod(index);
    setRatio(favorite.ratio);
    setCoffee(favorite.coffee_grams);
    setWater(Number((favorite.coffee_grams * favorite.ratio).toFixed(1)));
    setInputMode('coffee');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main className="app-shell">
      <div className="grain" />
      <header className="topbar">
        <div className="brand-lockup"><div className="brand-mark"><Coffee size={22} strokeWidth={1.7} /></div><div><h1>Ratio</h1><p>Dial in the brew, every time</p></div></div>
        <div className="topbar-note"><Leaf size={15} /><span>Made for slow mornings</span></div>
      </header>

      <div className="content-wrap">
        <section className="intro-row">
          <div><p className="eyebrow">Your daily brew companion</p><h2>Find the sweet spot.</h2><p className="intro-copy">A little precision makes room for a lot more flavor.</p></div>
          <div className="intro-badge"><Timer size={17} /><span>{method.time} brew time</span></div>
        </section>

        <section className="method-section">
          <div className="section-heading"><div><p className="eyebrow">Choose your ritual</p><h3>Brew method</h3></div><span className="method-count">{String(selectedMethod + 1).padStart(2, '0')} / 06</span></div>
          <div className="method-scroller">
            {brewMethods.map((brew, index) => { const Icon = brew.icon; return <button key={brew.name} className={`method-card ${selectedMethod === index ? 'selected' : ''}`} onClick={() => selectMethod(index)}><Icon size={23} strokeWidth={1.6} /><span className="method-name">{brew.name}</span><span className="method-time">{brew.time}</span></button>; })}
          </div>
        </section>

        <section className="ratio-card">
          <div className="ratio-card-top"><div><p className="eyebrow copper-text">The golden ratio</p><div className="ratio-display"><span>1</span><span className="ratio-colon">:</span><span>{ratio % 1 === 0 ? ratio : ratio.toFixed(1)}</span></div><p className="ratio-description"><strong>{ratioInfo.title}</strong><span>—</span>{ratioInfo.copy}</p></div><div className="ratio-method-label"><div className="selected-dot" /><span>{method.name} recipe</span></div></div>
          <div className="slider-block"><div className="slider-labels"><span>Bold</span><span>Light</span></div><input aria-label="Brew ratio" type="range" min="12" max="18" step="0.5" value={ratio} onChange={(event) => updateRatio(Number(event.target.value))} style={{ '--progress': `${((ratio - 12) / 6) * 100}%` } as React.CSSProperties} /><div className="slider-ticks"><span>1:12</span><span>1:14</span><span>1:16</span><span>1:18</span></div></div>
        </section>

        <section className="calculator-section"><div className="section-heading"><div><p className="eyebrow">Build your cup</p><h3>Dial in your dose</h3></div><Info size={17} className="muted-icon" /></div>
          <div className="toggle-control"><button className={inputMode === 'coffee' ? 'active' : ''} onClick={() => toggleInputMode('coffee')}><Bean size={16} /> I know my coffee</button><button className={inputMode === 'water' ? 'active' : ''} onClick={() => toggleInputMode('water')}><Droplets size={16} /> I know my water</button></div>
          <div className="input-grid"><label className={inputMode === 'coffee' ? 'editable' : ''}><span>Coffee dose <em>{inputMode === 'coffee' ? 'editable' : 'calculated'}</em></span><div className="number-input"><input type="number" min="0" step="0.5" value={formatGrams(coffee)} onChange={(event) => updateCoffee(event.target.value)} /><b>g</b></div></label><div className="math-connector"><ArrowDown size={16} /></div><label className={inputMode === 'water' ? 'editable' : ''}><span>Water target <em>{inputMode === 'water' ? 'editable' : 'calculated'}</em></span><div className="number-input"><input type="number" min="0" step="1" value={formatGrams(water)} onChange={(event) => updateWater(event.target.value)} /><b>g</b></div></label></div>
          <div className="results-grid"><div className="result-box coffee-result"><span className="result-label"><Bean size={15} /> Final coffee</span><strong key={`c-${formatGrams(inputMode === 'water' ? calculatedCoffee : coffee)}`} className="result-value">{formatGrams(inputMode === 'water' ? calculatedCoffee : coffee)}<small>g</small></strong><span className="result-hint">ground coffee</span></div><div className="result-box water-result"><span className="result-label"><Droplets size={15} /> Final water</span><strong key={`w-${formatGrams(inputMode === 'coffee' ? calculatedWater : water)}`} className="result-value">{formatGrams(inputMode === 'coffee' ? calculatedWater : water)}<small>g</small></strong><span className="result-hint">total brew water</span></div></div>
          <button className="save-button" onClick={() => void saveFavorite()} disabled={saving}><span>{savedNotice ? <Check size={18} /> : <Plus size={18} />}</span>{savedNotice ? 'Saved to your favorites' : saving ? 'Saving…' : 'Save this ratio'}</button>
        </section>

        <section className="steps-section">
          <div className="section-heading">
            <div><p className="eyebrow">A considered process</p><h3>{method.name} steps</h3></div>
            <span className="step-total">{method.steps.length} steps</span>
          </div>

          <div className="brew-stats-row">
            <div className="brew-stat"><Timer size={14} /><span>{method.time}</span></div>
            <div className="brew-stat"><Sparkles size={14} /><span>{method.grindSize} grind</span></div>
            <div className="brew-stat"><Thermometer size={14} /><span>{method.waterTemp}</span></div>
          </div>

          {isTimerCapable ? (
            <div className={`timer-card ${isBrewing ? 'is-active' : ''} ${isBrewComplete ? 'is-complete' : ''}`}>
              <div className="timer-readout">
                <span className="timer-clock">{formatClock(Math.min(elapsed, totalSeconds))}</span>
                <span className="timer-total">/ {formatClock(totalSeconds)}</span>
              </div>
              <div className="timer-progress"><div className="timer-progress-fill" style={{ width: `${totalSeconds ? Math.min(100, (elapsed / totalSeconds) * 100) : 0}%` }} /></div>
              <div className="timer-controls">
                <button className="timer-btn primary" onClick={toggleBrewing}>
                  {isBrewComplete ? <RotateCcw size={16} /> : isBrewing ? <Pause size={16} /> : <Play size={16} />}
                  {isBrewComplete ? 'Brew again' : isBrewing ? 'Pause' : elapsed > 0 ? 'Resume' : 'Start brewing'}
                </button>
                {elapsed > 0 && !isBrewComplete && (
                  <button className="timer-btn" onClick={resetBrewing}><RotateCcw size={15} />Reset</button>
                )}
              </div>
              {isBrewComplete && <p className="timer-complete-note"><Check size={14} /> Brew complete — enjoy.</p>}
            </div>
          ) : (
            <div className="timer-card timer-card-static">
              <p><Info size={15} /> This one steeps for hours, not minutes — no need to babysit it. Set a reminder instead.</p>
            </div>
          )}

          <div className="steps-list">
            {timedSteps.map((step, index) => {
              const isActive = index === activeStepIndex;
              const isDone = activeStepIndex > index || (isBrewComplete && activeStepIndex >= timedSteps.length);
              return (
                <div className={`step-row ${isActive ? 'is-active' : ''} ${isDone ? 'is-done' : ''}`} key={`${method.name}-${step.instruction}`}>
                  <div className="step-rail">
                    <div className="step-number">{isDone ? <Check size={13} /> : String(index + 1).padStart(2, '0')}</div>
                    {index < timedSteps.length - 1 && <div className="step-line" />}
                  </div>
                  <div className="step-copy">
                    <p>{step.instruction}</p>
                    {step.time && <span className="step-time-pill"><Timer size={12} /> {step.time}</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {favorites.length > 0 && <section className="favorites-section"><div className="section-heading"><div><p className="eyebrow">Your saved recipes</p><h3>Favorites</h3></div><span className="step-total">{favorites.length} saved</span></div><div className="favorites-list">{favorites.map((favorite) => <div className="favorite-chip" key={favorite.id}><button onClick={() => loadFavorite(favorite)}><span className="favorite-icon"><Coffee size={15} /></span><span><strong>{favorite.method}</strong><small>1:{favorite.ratio} · {formatGrams(favorite.coffee_grams)}g</small></span></button><button className="delete-favorite" aria-label={`Remove ${favorite.method} favorite`} onClick={() => void removeFavorite(favorite.id)}><Trash2 size={15} /></button></div>)}</div></section>}
      </div>
      <footer><span>Ratio</span><span>small adjustments, better coffee</span></footer>
    </main>
  );
}

export default App;

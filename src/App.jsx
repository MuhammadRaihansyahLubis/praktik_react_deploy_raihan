import { useState } from 'react'
import './App.css'

const ACTIVITIES = [
  { value: 'Kuliah', after: 'Setelah kuliah' },
  { value: 'Sekolah', after: 'Setelah sekolah' },
  { value: 'Kerja', after: 'Setelah kerja' },
  { value: 'Belajar di rumah', after: 'Setelah belajar di rumah' },
  { value: 'Libur', after: 'Hari libur' },
]

const TIMES = [
  { value: 'Pagi', hint: '05.00 – 10.00' },
  { value: 'Siang', hint: '11.00 – 14.00' },
  { value: 'Sore', hint: '15.00 – 18.00' },
  { value: 'Malam', hint: '19.00 – 24.00' },
]

const DURATIONS = ['30 menit', '1 jam', '2 jam', '3 jam atau lebih']
const MODES = ['Battle Royale', 'Zero Build', 'Creative', 'Ranked']
const SQUADS = [
  { value: 'Solo', hint: '1 pemain' },
  { value: 'Duo', hint: '2 pemain' },
  { value: 'Squad', hint: '4 pemain' },
]
const GOALS = [
  'Santai',
  'Push Rank',
  'Bermain bersama teman',
  'Menyelesaikan Quest',
  'Mencari Victory Royale',
]

const INITIAL = {
  name: '',
  activity: '',
  time: '',
  duration: '',
  mode: '',
  squad: '',
  goal: '',
  notes: '',
}

const REQUIRED_MESSAGES = {
  name: 'Isi nama pemain dulu ya.',
  activity: 'Pilih aktivitasmu hari ini.',
  time: 'Pilih waktu bermain.',
  duration: 'Pilih durasi bermain.',
  mode: 'Pilih mode permainan.',
  squad: 'Pilih teman bermain.',
  goal: 'Pilih tujuan bermain hari ini.',
}

function ChoiceGroup({ name, legend, options, value, onChange, error, columns = 2 }) {
  return (
    <fieldset className={`field ${error ? 'has-error' : ''}`}>
      <legend>{legend}</legend>
      <div className="choices" style={{ '--cols': columns }}>
        {options.map((opt) => {
          const item = typeof opt === 'string' ? { value: opt } : opt
          const checked = value === item.value
          return (
            <label key={item.value} className={`choice ${checked ? 'is-checked' : ''}`}>
              <input
                type="radio"
                name={name}
                value={item.value}
                checked={checked}
                onChange={() => onChange(name, item.value)}
              />
              <span className="choice-label">{item.value}</span>
              {item.hint && <span className="choice-hint">{item.hint}</span>}
            </label>
          )
        })}
      </div>
      {error && <p className="error">{error}</p>}
    </fieldset>
  )
}

function SummaryRow({ label, value }) {
  return (
    <li className={value ? 'filled' : ''}>
      <span className="row-label">{label}</span>
      <span className="row-value">{value || 'Belum dipilih'}</span>
    </li>
  )
}

export default function App() {
  const [form, setForm] = useState(INITIAL)
  const [errors, setErrors] = useState({})
  const [saved, setSaved] = useState(false)

  const update = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev))
    setSaved(false)
  }

  const validate = () => {
    const next = {}
    Object.keys(REQUIRED_MESSAGES).forEach((key) => {
      if (!String(form[key]).trim()) next[key] = REQUIRED_MESSAGES[key]
    })
    return next
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const found = validate()
    setErrors(found)
    if (Object.keys(found).length > 0) {
      const first = document.querySelector('.has-error')
      first?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }
    try {
      localStorage.setItem('my-daily-fortnite', JSON.stringify(form))
    } catch {
      /* penyimpanan lokal tidak tersedia, abaikan */
    }
    setSaved(true)
  }

  const handleReset = () => {
    setForm(INITIAL)
    setErrors({})
    setSaved(false)
  }

  const activityText = ACTIVITIES.find((a) => a.value === form.activity)?.after
  const filledCount = ['name', 'activity', 'time', 'duration', 'mode', 'squad', 'goal'].filter(
    (k) => form[k].trim(),
  ).length
  const progress = Math.round((filledCount / 7) * 100)

  return (
    <div className="page">
      <div className="shape shape-a" aria-hidden="true" />
      <div className="shape shape-b" aria-hidden="true" />

      <main className="layout">
        <section className="form-side">
          <header className="head">
            <h1>My Daily Fortnite</h1>
            <p>Atur waktu bermainmu setelah menyelesaikan aktivitas hari ini.</p>
          </header>

          <form className="form" onSubmit={handleSubmit} noValidate>
            <div className={`field ${errors.name ? 'has-error' : ''}`}>
              <label htmlFor="name">Nama pemain</label>
              <input
                id="name"
                type="text"
                placeholder="Contoh: Raihan"
                value={form.name}
                onChange={(e) => update('name', e.target.value)}
                autoComplete="nickname"
              />
              {errors.name && <p className="error">{errors.name}</p>}
            </div>

            <ChoiceGroup
              name="activity"
              legend="Aktivitas hari ini"
              options={ACTIVITIES.map((a) => a.value)}
              value={form.activity}
              onChange={update}
              error={errors.activity}
              columns={3}
            />

            <ChoiceGroup
              name="time"
              legend="Waktu bermain Fortnite"
              options={TIMES}
              value={form.time}
              onChange={update}
              error={errors.time}
              columns={4}
            />

            <ChoiceGroup
              name="duration"
              legend="Berapa lama ingin bermain?"
              options={DURATIONS}
              value={form.duration}
              onChange={update}
              error={errors.duration}
              columns={4}
            />

            <ChoiceGroup
              name="mode"
              legend="Mode permainan"
              options={MODES}
              value={form.mode}
              onChange={update}
              error={errors.mode}
              columns={4}
            />

            <ChoiceGroup
              name="squad"
              legend="Teman bermain"
              options={SQUADS}
              value={form.squad}
              onChange={update}
              error={errors.squad}
              columns={3}
            />

            <ChoiceGroup
              name="goal"
              legend="Tujuan bermain hari ini"
              options={GOALS}
              value={form.goal}
              onChange={update}
              error={errors.goal}
              columns={3}
            />

            <div className="field">
              <label htmlFor="notes">
                Catatan <span className="optional">(opsional)</span>
              </label>
              <textarea
                id="notes"
                rows={4}
                maxLength={240}
                placeholder="Contoh: Setelah selesai belajar, saya ingin bermain sekitar 1 jam bersama teman."
                value={form.notes}
                onChange={(e) => update('notes', e.target.value)}
              />
              <span className="counter">{form.notes.length}/240</span>
            </div>

            <button type="submit" className="primary">
              Simpan Rencana Bermain
            </button>
          </form>
        </section>

        <aside className="summary-side">
          <div className="summary">
            <div className="summary-top">
              <h2>Rencana Bermain Hari Ini</h2>
              <p className="greeting">
                {form.name.trim() ? `Pemain: ${form.name.trim()}` : 'Isi formulir untuk melihat ringkasan.'}
              </p>
              <div className="progress" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
                <span style={{ width: `${progress}%` }} />
              </div>
              <p className="progress-text">{filledCount} dari 7 bagian terisi</p>
            </div>

            <ul className="rows">
              <SummaryRow label="Aktivitas" value={activityText} />
              <SummaryRow label="Waktu" value={form.time && `Waktu ${form.time.toLowerCase()}`} />
              <SummaryRow label="Durasi" value={form.duration} />
              <SummaryRow label="Mode" value={form.mode} />
              <SummaryRow label="Teman bermain" value={form.squad} />
              <SummaryRow label="Tujuan" value={form.goal} />
            </ul>

            {form.notes.trim() && (
              <blockquote className="note">{form.notes.trim()}</blockquote>
            )}

            {saved && (
              <div className="success" role="status">
                <p>
                  Rencana bermainmu sudah disimpan. Selesaikan aktivitas hari ini dulu, lalu waktunya
                  Fortnite!
                </p>
                <button type="button" className="link" onClick={handleReset}>
                  Buat rencana baru
                </button>
              </div>
            )}
          </div>
        </aside>
      </main>
    </div>
  )
}

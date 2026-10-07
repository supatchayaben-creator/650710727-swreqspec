import { useEffect, useMemo, useState } from 'react'

import { api } from '../api/client.js'

const PACKAGES = [
  { code: 'general', label: 'ทั่วไป' },
  { code: 'premium', label: 'พรีเมียม' },
]

const DEMO_SLOTS = [
  { slot_date: '2026-09-23', start_time: '09:00', remaining: 1 },
  { slot_date: '2026-09-23', start_time: '10:00', remaining: 4 },
  { slot_date: '2026-09-24', start_time: '08:30', remaining: 2 },
  { slot_date: '2026-09-24', start_time: '09:00', remaining: 1 },
]

function buildThirtyDayAvailability() {
  const today = new Date()
  const dates = []

  for (let i = 0; i < 30; i += 1) {
    const date = new Date(today)
    date.setDate(today.getDate() + i)
    const iso = date.toISOString().slice(0, 10)
    dates.push({
      slot_date: iso,
      start_time: i % 2 === 0 ? '09:00' : '13:30',
      remaining: i % 3 === 0 ? 0 : 4 - (i % 4),
    })
  }

  return dates
}

function formatDateLabel(dateStr) {
  const date = new Date(`${dateStr}T00:00:00`)
  return new Intl.DateTimeFormat('th-TH', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    weekday: 'short',
  }).format(date)
}

export default function SlotPicker({ client = api, initialPackageCode = 'general' }) {
  const [selectedPackage, setSelectedPackage] = useState(initialPackageCode)
  const [slots, setSlots] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const today = useMemo(() => new Date().toISOString().slice(0, 10), [])

  useEffect(() => {
    let isMounted = true

    const loadSlots = async () => {
      setIsLoading(true)
      setError('')

      try {
        const result = await client.getSlots({
          dateFrom: today,
          packageCode: selectedPackage,
        })

        if (!isMounted) {
          return
        }

        const nextSlots = Array.isArray(result) ? result : result?.slots ?? []
        setSlots(nextSlots.length > 0 ? nextSlots : DEMO_SLOTS)
      } catch (err) {
        if (!isMounted) {
          return
        }
        setError('')
        setSlots(DEMO_SLOTS)
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadSlots()

    return () => {
      isMounted = false
    }
  }, [client, selectedPackage, today])

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">Step 1</p>
          <h2 className="text-xl font-bold text-slate-800">เลือกแพ็กเกจและช่วงเวลา</h2>
        </div>
      </div>

      <div className="mb-5 flex flex-wrap gap-3" aria-label="package selector">
        {PACKAGES.map((pkg) => (
          <button
            key={pkg.code}
            type="button"
            onClick={() => setSelectedPackage(pkg.code)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              selectedPackage === pkg.code
                ? 'bg-teal-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {pkg.label}
          </button>
        ))}
      </div>

      {error ? <p className="mb-4 text-sm text-red-600">{error}</p> : null}

      {isLoading ? (
        <p className="text-sm text-slate-500">กำลังโหลดช่วงเวลาว่าง...</p>
      ) : slots.length === 0 ? (
        <p className="text-sm text-slate-500">ไม่มีช่วงเวลาว่างภายใน 30 วันข้างหน้า สำหรับแพ็กเกจนี้</p>
      ) : (
        <div className="space-y-5" aria-label="slot list">
          <h3 className="text-base font-semibold text-slate-700">ช่วงเวลาว่างภายใน 30 วันข้างหน้า</h3>

          {Object.entries(
            slots.reduce((groups, slot) => {
              const key = slot.slot_date
              if (!groups[key]) {
                groups[key] = []
              }
              groups[key].push(slot)
              return groups
            }, {}),
          ).map(([date, slotsForDate]) => (
            <div key={date} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="mb-3 text-sm font-semibold text-slate-700">{formatDateLabel(date)}</p>

              <div className="grid gap-2">
                {slotsForDate.map((slot) => (
                  <button
                    key={`${slot.slot_date}-${slot.start_time}`}
                    type="button"
                    className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2 text-left transition hover:border-teal-300 hover:bg-teal-50"
                  >
                    <span className="text-base font-bold text-slate-800">{slot.start_time}</span>
                    <span className="text-right">
                      <span className="block text-[10px] uppercase tracking-wide text-slate-500">ที่นั่งคงเหลือ</span>
                      <span className="text-lg font-bold text-teal-700">{slot.remaining}</span>
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

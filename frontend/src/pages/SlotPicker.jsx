import { useEffect, useMemo, useState } from 'react'

import { api } from '../api/client.js'

const PACKAGES = [
  { code: 'general', label: 'ทั่วไป' },
  { code: 'premium', label: 'พรีเมียม' },
]

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
        setSlots(nextSlots)
      } catch (err) {
        if (!isMounted) {
          return
        }
        setError('ไม่สามารถโหลดช่วงเวลาว่างได้ในขณะนี้')
        setSlots([])
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
        <p className="text-sm text-slate-500">ไม่มีช่วงเวลาว่างสำหรับแพ็กเกจนี้</p>
      ) : (
        <div className="grid gap-3" aria-label="slot list">
          {slots.map((slot) => (
            <button
              key={`${slot.slot_date}-${slot.start_time}`}
              type="button"
              className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-4 text-left transition hover:border-teal-300 hover:bg-teal-50"
            >
              <div>
                <p className="text-sm text-slate-500">{formatDateLabel(slot.slot_date)}</p>
                <p className="text-lg font-bold text-slate-800">{slot.start_time}</p>
              </div>
              <div className="text-right">
                <p className="text-xs uppercase tracking-wide text-slate-500">ที่นั่งคงเหลือ</p>
                <p className="text-xl font-bold text-teal-700">{slot.remaining}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </section>
  )
}

"use client"

import { useEffect, useMemo, useState } from "react"
import Calendar from "react-calendar"
import "react-calendar/dist/Calendar.css"

export default function CalendarPage() {
  const [patients, setPatients] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)
  const [value, setValue] = useState<Date | Date[]>(new Date())
  const [selectedDay, setSelectedDay] = useState<string | null>(null)

  useEffect(() => {
    fetch("/api/patients")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setPatients(data)
        else setError(data?.error ? String(data.error) : "Failed to load appointments")
      })
      .catch((e) => setError(String(e)))
  }, [])

  function toLocalKey(d: Date) {
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, "0")
    const day = String(d.getDate()).padStart(2, "0")
    return `${y}-${m}-${day}`
  }

  const grouped = useMemo(() => {
    const map: Record<string, any[]> = {}
    for (const p of patients) {
      if (!p.appointmentDate) continue
      const d = new Date(p.appointmentDate)
      const key = toLocalKey(d)
      map[key] = map[key] || []
      map[key].push(p)
    }
    return map
  }, [patients])

  function tileContent({ date, view }: { date: Date; view: string }) {
    if (view !== "month") return null
    const key = toLocalKey(date)
    const appts = grouped[key] || []
    if (appts.length === 0) return null

    // render up to 3 dots for appointments
    return (
      <div className="mt-1 flex justify-center gap-1">
        {Array.from({ length: Math.min(3, appts.length) }).map((_, i) => (
          <span key={i} className="h-2 w-2 rounded-full bg-blue-600 block" />
        ))}
      </div>
    )
  }

  function onClickDay(date: Date) {
    const key = toLocalKey(date)
    setSelectedDay(key)
    setValue(date)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Calendar</h1>
      </div>

      {error && <div className="text-red-600 mb-4">{error}</div>}

      <div className="max-w-md">
        <Calendar onChange={setValue} value={value} tileContent={tileContent} onClickDay={onClickDay} />
      </div>

      <div className="mt-6">
        {selectedDay ? (
          <div>
            <h2 className="text-lg font-semibold mb-2">Appointments on {selectedDay}</h2>
            <ul className="space-y-2">
              {(grouped[selectedDay] || []).map((a: any) => (
                <li key={a.id} className="p-3 border rounded">
                  <div className="font-semibold">{a.firstName} {a.lastName}</div>
                  <div className="text-sm text-gray-600">{new Date(a.appointmentDate).toLocaleString()}</div>
                  <div className="text-sm">Doctor: {a.doctor ? `${a.doctor.firstName} ${a.doctor.lastName}` : "-"}</div>
                  <div className="text-sm">Phone: {a.phone ?? "-"}</div>
                </li>
              ))}
              {(!grouped[selectedDay] || grouped[selectedDay].length === 0) && <div>No appointments.</div>}
            </ul>
          </div>
        ) : (
          <div className="text-sm text-gray-600 mt-4">Select a day to view appointments.</div>
        )}
      </div>
    </div>
  )
}

"use client"

import Link from "next/link"

export default function Sidebar() {
  return (
    <aside className="w-64 p-4 border-r h-screen sticky top-0">
      <nav>
        <h2 className="text-lg font-semibold mb-4">Dashboard</h2>
        <ul className="space-y-2 text-sm">
          <li>
            <Link href="/dashboard/clinics" className="text-blue-600 hover:underline">All Clinics</Link>
          </li>
          <li>
            <Link href="/dashboard/doctors" className="text-blue-600 hover:underline">All Doctors</Link>
          </li>
        </ul>
      </nav>
    </aside>
  )
}

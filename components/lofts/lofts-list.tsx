"use client"

import type { LoftWithRelations, LoftOwner, ZoneArea } from "@/lib/types"

interface LoftsListProps {
  lofts: LoftWithRelations[]
  owners: LoftOwner[]
  zoneAreas: ZoneArea[]
  isAdmin: boolean
  canManage: boolean
}

export function LoftsList({
  lofts,
  owners,
  zoneAreas,
  isAdmin,
  canManage
}: LoftsListProps) {
  return (
    <div className="space-y-4">
      {lofts.map((loft) => (
        <div key={loft.id} className="p-4 border rounded-lg">
          <h3 className="font-semibold">{loft.name}</h3>
          <p className="text-gray-600">{loft.address}</p>
        </div>
      ))}
    </div>
  )
}
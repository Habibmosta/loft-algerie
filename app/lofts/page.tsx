import { requireRole } from "@/lib/auth"
import type { Database, LoftWithRelations } from "@/lib/types"
import { LoftsWrapper } from "@/components/lofts/lofts-wrapper"
import { createClient } from '@/utils/supabase/server'

type Loft = Database['public']['Tables']['lofts']['Row']
type LoftOwner = Database['public']['Tables']['loft_owners']['Row']
type ZoneArea = Database['public']['Tables']['zone_areas']['Row']

export default async function LoftsPage() {
  const session = await requireRole(["admin", "manager"]);
  const supabase = await createClient()

  try {
    // Requête simplifiée pour tester
    const { data: loftsData, error: loftsError } = await supabase
      .from("lofts")
      .select("*")
      .order("created_at", { ascending: false })

    if (loftsError) {
      console.error("Lofts data error:", loftsError);
      return (
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-red-600">Erreur</h1>
            <p className="text-muted-foreground">
              Erreur lors de la récupération des lofts: {loftsError.message}
            </p>
          </div>
        </div>
      )
    }

    const lofts = loftsData || []

    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Lofts</h1>
          <p className="text-muted-foreground">
            {lofts.length} loft(s) trouvé(s)
          </p>
        </div>
        
        <div className="grid gap-4">
          {lofts.map((loft) => (
            <div key={loft.id} className="border rounded-lg p-4">
              <h3 className="text-lg font-semibold">{loft.name}</h3>
              <p className="text-sm text-gray-600">{loft.address}</p>
              <p className="text-sm">Prix: {loft.price_per_month} DA</p>
              <p className="text-sm">Statut: {loft.status}</p>
              {loft.description && (
                <p className="text-sm mt-2">{loft.description}</p>
              )}
              <a 
                href={`/lofts/${loft.id}`}
                className="inline-block mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Voir détails
              </a>
            </div>
          ))}
        </div>
      </div>
    )
  } catch (error) {
    console.error("Error fetching lofts page data:", error)
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-red-600">Erreur système</h1>
          <p className="text-muted-foreground">
            Une erreur inattendue s'est produite
          </p>
          <pre className="text-xs bg-gray-100 p-2 rounded mt-2">
            {error instanceof Error ? error.message : String(error)}
          </pre>
        </div>
      </div>
    )
  }
}

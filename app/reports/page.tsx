'use client'

import { ReportGenerator } from '@/components/reports/report-generator'
import { ReportsWrapper } from '@/components/reports/reports-wrapper'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { FileText, BarChart3 } from 'lucide-react'
import { useTranslation } from '@/lib/i18n/context'

// Mock data - replace with real data from your API
const mockLoftRevenue = [
  { name: "Loft Artistique Hydra", revenue: 45000, expenses: 12000, net_profit: 33000 },
  { name: "Loft Moderne Centre-Ville", revenue: 38000, expenses: 15000, net_profit: 23000 },
  { name: "Loft Industriel Kouba", revenue: 42000, expenses: 18000, net_profit: 24000 },
  { name: "Loft Luxueux Alger", revenue: 55000, expenses: 20000, net_profit: 35000 },
  { name: "Loft Cosy Bab Ezzouar", revenue: 35000, expenses: 10000, net_profit: 25000 }
]

const mockMonthlyRevenue = [
  { month: "Jan", revenue: 215000, expenses: 75000 },
  { month: "Fév", revenue: 198000, expenses: 68000 },
  { month: "Mar", revenue: 225000, expenses: 82000 },
  { month: "Avr", revenue: 242000, expenses: 89000 },
  { month: "Mai", revenue: 258000, expenses: 95000 },
  { month: "Jun", revenue: 235000, expenses: 78000 }
]

export default function ReportsPage() {
  const { t } = useTranslation(['reports', 'common'])

  return (
    <div className="container mx-auto py-6">
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Rapports & Analytics</h1>
          <p className="text-muted-foreground">
            Générez des rapports PDF détaillés et visualisez vos données avec des graphiques interactifs
          </p>
        </div>

        <Tabs defaultValue="analytics" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Analytics & Graphiques
            </TabsTrigger>
            <TabsTrigger value="generator" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Générateur PDF
            </TabsTrigger>
          </TabsList>

          <TabsContent value="analytics" className="space-y-6">
            <ReportsWrapper 
              loftRevenue={mockLoftRevenue} 
              monthlyRevenue={mockMonthlyRevenue} 
            />
          </TabsContent>

          <TabsContent value="generator" className="space-y-6">
            <ReportGenerator />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}


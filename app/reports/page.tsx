import { ReportGenerator } from '@/components/reports/report-generator'
import { ReportsWrapper } from '@/components/reports/reports-wrapper'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { FileText, BarChart3, TrendingUp, Sparkles } from 'lucide-react'
import { getMonthlyRevenueData, getLoftRevenueData } from '@/app/actions/reports'
import { ReportsPageClient } from './reports-page-client'

export default async function ReportsPage() {
  // Récupérer les vraies données depuis la base de données
  const [monthlyRevenueData, loftRevenueData] = await Promise.all([
    getMonthlyRevenueData(),
    getLoftRevenueData()
  ])

  return (
    <ReportsPageClient 
      monthlyRevenueData={monthlyRevenueData}
      loftRevenueData={loftRevenueData}
    />
  )
}


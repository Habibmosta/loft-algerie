'use client'

/**
 * COMPOSANT DE GÉNÉRATION DE RAPPORTS
 * ===================================
 * 
 * Interface utilisateur pour générer des rapports PDF
 * Supporte les rapports par loft, par propriétaire, et globaux
 */

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
// Temporarily removing Select components to fix Radix errors
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CalendarIcon, FileText, Download, TrendingUp, TrendingDown, DollarSign, Hash } from 'lucide-react'
import { format, subDays, startOfMonth, endOfMonth } from 'date-fns'
import { fr } from 'date-fns/locale'
import { useReports, type ReportFilters } from '@/hooks/use-reports'
import { toast } from 'sonner'

interface QuickStats {
  totalIncome: number
  totalExpenses: number
  netResult: number
  transactionCount: number
}

export function ReportGenerator() {
  const {
    isLoading,
    error,
    generateLoftReport,
    generateOwnerReport,
    generateGlobalReport,
    getQuickStats,
    fetchLofts,
    fetchOwners
  } = useReports()

  // États pour les données
  const [lofts, setLofts] = useState<any[]>([])
  const [owners, setOwners] = useState<any[]>([])
  const [quickStats, setQuickStats] = useState<QuickStats | null>(null)

  // États pour les filtres
  const [filters, setFilters] = useState<ReportFilters>({
    startDate: startOfMonth(new Date()),
    endDate: endOfMonth(new Date()),
    transactionType: 'all'
  })

  // États pour les options de rapport
  const [reportOptions, setReportOptions] = useState({
    includeDetails: true,
    includeSummary: true,
    groupBy: 'category'
  })

  // Charger les données initiales
  useEffect(() => {
    const loadData = async () => {
      try {
        const [loftsData, ownersData] = await Promise.all([
          fetchLofts(),
          fetchOwners()
        ])
        setLofts(loftsData)
        setOwners(ownersData)
      } catch (err) {
        console.error('Erreur lors du chargement des données:', err)
        toast.error('Erreur lors du chargement des données')
      }
    }

    loadData()
  }, [fetchLofts, fetchOwners])

  // Mettre à jour les statistiques quand les filtres changent
  useEffect(() => {
    const updateStats = async () => {
      try {
        const stats = await getQuickStats(filters)
        setQuickStats(stats)
      } catch (err) {
        console.error('Erreur lors du calcul des statistiques:', err)
      }
    }

    updateStats()
  }, [filters, getQuickStats])

  // Gestionnaires d'événements
  const handleFilterChange = (key: keyof ReportFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const handleQuickDateRange = (range: string) => {
    const now = new Date()
    let startDate: Date
    let endDate: Date = now

    switch (range) {
      case 'today':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59)
        break
      case 'week':
        startDate = subDays(now, 7)
        break
      case 'month':
        startDate = startOfMonth(now)
        endDate = endOfMonth(now)
        break
      case 'quarter':
        const quarterStart = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1)
        startDate = quarterStart
        endDate = new Date(quarterStart.getFullYear(), quarterStart.getMonth() + 3, 0)
        break
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1)
        endDate = new Date(now.getFullYear(), 11, 31)
        break
      default:
        return
    }

    setFilters(prev => ({ ...prev, startDate, endDate }))
  }

  const handleGenerateReport = async (type: 'loft' | 'owner' | 'global', id?: string) => {
    try {
      switch (type) {
        case 'loft':
          if (!id) {
            toast.error('Veuillez sélectionner un loft')
            return
          }
          await generateLoftReport(id, filters, reportOptions)
          break
        case 'owner':
          if (!id) {
            toast.error('Veuillez sélectionner un propriétaire')
            return
          }
          await generateOwnerReport(id, filters, reportOptions)
          break
        case 'global':
          await generateGlobalReport(filters, reportOptions)
          break
      }
    } catch (err) {
      console.error('Erreur lors de la génération du rapport:', err)
    }
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Rapports Financiers</h1>
          <p className="text-muted-foreground">
            Générez des rapports PDF détaillés de vos mouvements financiers
          </p>
        </div>
        <Badge variant="outline" className="text-sm">
          <FileText className="w-4 h-4 mr-1" />
          Génération PDF
        </Badge>
      </div>

      {/* Statistiques rapides */}
      {quickStats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Revenus</p>
                  <p className="text-lg font-semibold text-green-600">
                    {quickStats.totalIncome.toLocaleString()} DA
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <TrendingDown className="w-4 h-4 text-red-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Dépenses</p>
                  <p className="text-lg font-semibold text-red-600">
                    {quickStats.totalExpenses.toLocaleString()} DA
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <DollarSign className="w-4 h-4 text-blue-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Résultat Net</p>
                  <p className={`text-lg font-semibold ${quickStats.netResult >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {quickStats.netResult.toLocaleString()} DA
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Hash className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Transactions</p>
                  <p className="text-lg font-semibold">
                    {quickStats.transactionCount}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Filtres */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Filtres du Rapport</CardTitle>
            <CardDescription>
              Configurez la période et les critères de votre rapport
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Période rapide */}
            <div>
              <Label className="text-sm font-medium">Période rapide</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {[
                  { key: 'today', label: 'Aujourd\'hui' },
                  { key: 'week', label: '7 jours' },
                  { key: 'month', label: 'Ce mois' },
                  { key: 'quarter', label: 'Trimestre' },
                  { key: 'year', label: 'Cette année' }
                ].map(({ key, label }) => (
                  <Button
                    key={key}
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickDateRange(key)}
                  >
                    {label}
                  </Button>
                ))}
              </div>
            </div>

            <Separator />

            {/* Dates personnalisées */}
            <div className="space-y-3">
              <div>
                <Label htmlFor="startDate">Date de début</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={format(filters.startDate, 'yyyy-MM-dd')}
                  onChange={(e) => handleFilterChange('startDate', new Date(e.target.value))}
                />
              </div>

              <div>
                <Label htmlFor="endDate">Date de fin</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={format(filters.endDate, 'yyyy-MM-dd')}
                  onChange={(e) => handleFilterChange('endDate', new Date(e.target.value))}
                />
              </div>
            </div>

            <Separator />

            {/* Type de transaction */}
            <div>
              <Label>Type de transaction</Label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={filters.transactionType}
                onChange={(e) => handleFilterChange('transactionType', e.target.value)}
              >
                <option value="all">Toutes</option>
                <option value="income">Revenus uniquement</option>
                <option value="expense">Dépenses uniquement</option>
              </select>
            </div>

            {/* Catégorie */}
            <div>
              <Label>Catégorie (optionnel)</Label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={filters.category || ''}
                onChange={(e) => handleFilterChange('category', e.target.value || undefined)}
              >
                <option value="">Toutes les catégories</option>
                <option value="rent">Loyer</option>
                <option value="maintenance">Maintenance</option>
                <option value="utilities">Factures</option>
                <option value="insurance">Assurance</option>
                <option value="taxes">Taxes</option>
                <option value="other">Autres</option>
              </select>
            </div>

            <Separator />

            {/* Options du rapport */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Options du rapport</Label>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="includeDetails"
                  checked={reportOptions.includeDetails}
                  onCheckedChange={(checked) => 
                    setReportOptions(prev => ({ ...prev, includeDetails: !!checked }))
                  }
                />
                <Label htmlFor="includeDetails" className="text-sm">
                  Inclure les détails des transactions
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="includeSummary"
                  checked={reportOptions.includeSummary}
                  onCheckedChange={(checked) => 
                    setReportOptions(prev => ({ ...prev, includeSummary: !!checked }))
                  }
                />
                <Label htmlFor="includeSummary" className="text-sm">
                  Inclure la synthèse
                </Label>
              </div>

              <div>
                <Label className="text-sm">Grouper par</Label>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={reportOptions.groupBy}
                  onChange={(e) => 
                    setReportOptions(prev => ({ ...prev, groupBy: e.target.value }))
                  }
                >
                  <option value="category">Catégorie</option>
                  <option value="loft">Loft</option>
                  <option value="month">Mois</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Génération de rapports */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Génération de Rapports</CardTitle>
            <CardDescription>
              Choisissez le type de rapport à générer
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="loft" className="space-y-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="loft">Par Loft</TabsTrigger>
                <TabsTrigger value="owner">Par Propriétaire</TabsTrigger>
                <TabsTrigger value="global">Rapport Global</TabsTrigger>
              </TabsList>

              {/* Rapport par loft */}
              <TabsContent value="loft" className="space-y-4">
                <div>
                  <Label>Sélectionner un loft</Label>
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    onChange={(e) => setFilters(prev => ({ ...prev, loftId: e.target.value }))}
                    defaultValue=""
                  >
                    <option value="">Choisir un loft...</option>
                    {lofts.map((loft) => (
                      <option key={loft.id} value={loft.id}>
                        {loft.name} - {loft.owner_name}
                      </option>
                    ))}
                  </select>
                </div>

                <Button
                  onClick={() => handleGenerateReport('loft', filters.loftId)}
                  disabled={isLoading || !filters.loftId}
                  className="w-full"
                >
                  <Download className="w-4 h-4 mr-2" />
                  {isLoading ? 'Génération en cours...' : 'Générer le rapport du loft'}
                </Button>
              </TabsContent>

              {/* Rapport par propriétaire */}
              <TabsContent value="owner" className="space-y-4">
                <div>
                  <Label>Sélectionner un propriétaire</Label>
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    onChange={(e) => setFilters(prev => ({ ...prev, ownerId: e.target.value }))}
                    defaultValue=""
                  >
                    <option value="">Choisir un propriétaire...</option>
                    {owners.map((owner) => (
                      <option key={owner.id} value={owner.id}>
                        {owner.name} ({owner.lofts_count} loft{owner.lofts_count > 1 ? 's' : ''})
                      </option>
                    ))}
                  </select>
                </div>

                <Button
                  onClick={() => handleGenerateReport('owner', filters.ownerId)}
                  disabled={isLoading || !filters.ownerId}
                  className="w-full"
                >
                  <Download className="w-4 h-4 mr-2" />
                  {isLoading ? 'Génération en cours...' : 'Générer le rapport du propriétaire'}
                </Button>
              </TabsContent>

              {/* Rapport global */}
              <TabsContent value="global" className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Rapport Global</h4>
                  <p className="text-sm text-muted-foreground">
                    Ce rapport inclut tous les lofts et toutes les transactions pour la période sélectionnée.
                    Il fournit une vue d'ensemble complète de votre activité immobilière.
                  </p>
                </div>

                <Button
                  onClick={() => handleGenerateReport('global')}
                  disabled={isLoading}
                  className="w-full"
                >
                  <Download className="w-4 h-4 mr-2" />
                  {isLoading ? 'Génération en cours...' : 'Générer le rapport global'}
                </Button>
              </TabsContent>
            </Tabs>

            {/* Affichage des erreurs */}
            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Informations sur les rapports */}
      <Card>
        <CardHeader>
          <CardTitle>À propos des Rapports PDF</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <h4 className="font-medium mb-2">Rapport par Loft</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Informations détaillées du loft</li>
                <li>• Toutes les transactions du loft</li>
                <li>• Synthèse financière</li>
                <li>• Analyse par catégorie</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Rapport par Propriétaire</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Informations du propriétaire</li>
                <li>• Liste de tous ses lofts</li>
                <li>• Performance par loft</li>
                <li>• Synthèse globale</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Rapport Global</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Vue d'ensemble complète</li>
                <li>• Performance de tous les lofts</li>
                <li>• Statistiques générales</li>
                <li>• Analyses multiples</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
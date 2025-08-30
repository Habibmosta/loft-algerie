"use client"

import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"
import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, DollarSign, Star, Globe } from "lucide-react"
import { useRouter } from "next/navigation"
import { getColumns } from "../columns"
import { Currency } from "@/lib/types"
import { useTranslation } from "react-i18next"

interface CurrencyClientProps {
  data: Currency[]
  onSetDefault: (id: string) => Promise<void>
  onDelete: (id: string) => Promise<void>
}

export const CurrencyClient = ({ data, onSetDefault, onDelete }: CurrencyClientProps) => {
  const { t } = useTranslation();
  const router = useRouter()

  const defaultCurrency = data.find(currency => currency.is_default)
  const otherCurrencies = data.filter(currency => !currency.is_default)

  return (
    <div className="space-y-8 animate-in fade-in-0 duration-700">
      {/* Header avec design amélioré */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-8 border border-primary/20">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-50"></div>
        <div className="absolute top-4 right-4 opacity-10">
          <Globe className="h-32 w-32 text-primary" />
        </div>
        <div className="relative flex justify-between items-center">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 shadow-lg">
                <DollarSign className="h-8 w-8 text-primary" />
              </div>
              {t('nav.currencies')}
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl">{t('settings.currencies.subtitle')}</p>
            <div className="flex items-center gap-4 pt-2">
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary">
                <Globe className="h-4 w-4" />
                <span className="text-sm font-medium">{data.length} devises configurées</span>
              </div>
              {defaultCurrency && (
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400">
                  <Star className="h-4 w-4" />
                  <span className="text-sm font-medium">{defaultCurrency.code} par défaut</span>
                </div>
              )}
            </div>
          </div>
          <Button onClick={() => router.push("/settings/currencies/new")} className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all duration-300 px-6 py-3 h-auto">
            <Plus className="mr-2 h-5 w-5" />
            {t('settings.currencies.addNew')}
          </Button>
        </div>
      </div>

      {/* Default Currency Card avec design premium */}
      {defaultCurrency && (
        <Card className="group border-0 bg-gradient-to-br from-yellow-50 via-amber-50/80 to-orange-50/60 dark:from-yellow-950/30 dark:via-amber-900/20 dark:to-orange-900/10 hover:shadow-2xl hover:scale-[1.02] transition-all duration-500 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 to-orange-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="absolute top-4 right-4 opacity-5 group-hover:opacity-15 transition-opacity duration-500">
            <Star className="h-32 w-32 text-yellow-500" />
          </div>
          <CardHeader className="relative pb-6">
            <CardTitle className="flex items-center gap-4 text-yellow-700 dark:text-yellow-400 text-xl">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-yellow-200 to-amber-100 dark:from-yellow-800 dark:to-amber-900 shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                <Star className="h-6 w-6 animate-pulse" />
              </div>
              {t('settings.currencies.defaultCurrency')}
            </CardTitle>
            <CardDescription className="text-yellow-600/80 dark:text-yellow-400/80 text-base">
              {t('settings.currencies.defaultCurrencyDesc')}
            </CardDescription>
          </CardHeader>
          <CardContent className="relative">
            <div className="flex items-center justify-between p-6 rounded-2xl bg-gradient-to-r from-white via-yellow-50/50 to-amber-50/30 dark:from-gray-800 dark:via-yellow-900/20 dark:to-amber-900/10 border border-yellow-200/50 dark:border-yellow-800/30 hover:border-yellow-300 dark:hover:border-yellow-700 transition-all duration-300 hover:shadow-lg">
              <div className="flex items-center gap-6">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-yellow-400/20 to-amber-400/10 text-yellow-600 dark:text-yellow-400 shadow-lg">
                  <DollarSign className="h-10 w-10" />
                </div>
                <div>
                  <h3 className="font-bold text-2xl text-gray-900 dark:text-gray-100 mb-1">{defaultCurrency.name}</h3>
                  <p className="text-base text-muted-foreground font-medium">
                    {defaultCurrency.code} • {defaultCurrency.symbol}
                  </p>
                </div>
              </div>
              <Badge variant="default" className="bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-white border-0 px-6 py-3 text-base shadow-lg">
                <Star className="h-4 w-4 mr-2" />
                {t('settings.currencies.default')}
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Table des devises avec design moderne */}
      <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-800 dark:to-gray-900/50 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-primary/5 via-primary/3 to-transparent border-b border-primary/10">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10">
              <Globe className="h-5 w-5 text-primary" />
            </div>
            {t('settings.currencies.allCurrencies')}
          </CardTitle>
          <CardDescription className="text-base">
            {t('settings.currencies.totalCurrencies', { count: data.length })}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {data.length === 0 ? (
            <div className="text-center py-16 px-8">
              <div className="p-6 rounded-full bg-gradient-to-br from-primary/10 to-primary/5 w-fit mx-auto mb-6">
                <DollarSign className="h-16 w-16 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Aucune devise configurée
              </h3>
              <p className="text-muted-foreground text-base mb-6 max-w-md mx-auto">
                Commencez par ajouter votre première devise pour gérer les taux de change et les transactions.
              </p>
              <Button onClick={() => router.push("/settings/currencies/new")} className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all duration-300">
                <Plus className="mr-2 h-5 w-5" />
                {t('settings.currencies.addNew')}
              </Button>
            </div>
          ) : (
            <div className="overflow-hidden">
              <DataTable 
                key={data.length} 
                columns={getColumns(onSetDefault, onDelete, router, t)} 
                data={data} 
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

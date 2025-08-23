'use client'

import { useState } from 'react'
import { useTranslation } from '@/lib/i18n/context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Calendar, MapPin, User, Users, DollarSign, Filter, RotateCcw } from 'lucide-react'
import { format } from 'date-fns'

interface FilterPanelProps {
  filters: any
  onFiltersChange: (filters: any) => void
  isLoading: boolean
}

export function FilterPanel({ filters, onFiltersChange, isLoading }: FilterPanelProps) {
  const { t } = useTranslation(['availability', 'common'])

  const regions = [
    { value: 'all', label: t('availability:allRegions') },
    { value: 'hydra', label: 'Hydra' },
    { value: 'centre-ville', label: 'Centre-Ville' },
    { value: 'kouba', label: 'Kouba' },
    { value: 'bab-ezzouar', label: 'Bab Ezzouar' }
  ]

  const owners = [
    { value: 'all', label: t('availability:allOwners') },
    { value: 'ahmed-benali', label: 'Ahmed Benali' },
    { value: 'fatima-khelil', label: 'Fatima Khelil' },
    { value: 'mohamed-salem', label: 'Mohamed Salem' }
  ]

  const handleFilterChange = (key: string, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value
    })
  }

  const resetFilters = () => {
    onFiltersChange({
      startDate: new Date(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      region: 'all',
      owner: 'all',
      loft: 'all',
      guests: 2,
      minPrice: 0,
      maxPrice: 50000
    })
  }

  const activeFiltersCount = Object.entries(filters).filter(([key, value]) => {
    if (key === 'region' || key === 'owner' || key === 'loft') return value !== 'all'
    if (key === 'guests') return value !== 2
    if (key === 'minPrice') return value !== 0
    if (key === 'maxPrice') return value !== 50000
    return false
  }).length

  return (
    <Card className="bg-gradient-to-br from-gray-50/50 to-slate-50/50 dark:from-gray-800/50 dark:to-slate-800/50 border-0 shadow-xl backdrop-blur-sm sticky top-8">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-green-500 to-blue-500"></div>
            <CardTitle className="text-lg font-semibold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              {t('availability:filters')}
            </CardTitle>
          </div>
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">
              {activeFiltersCount}
            </Badge>
          )}
        </div>
        <CardDescription className="text-sm text-muted-foreground">
          {t('availability:filtersDescription')}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Date Range */}
        <div className="space-y-3">
          <Label className="text-sm font-medium flex items-center gap-2">
            <Calendar className="h-4 w-4 text-green-600" />
            {t('availability:dateRange')}
          </Label>
          <div className="space-y-2">
            <div>
              <Label htmlFor="startDate" className="text-xs text-muted-foreground">
                {t('availability:startDate')}
              </Label>
              <Input
                id="startDate"
                type="date"
                value={format(filters.startDate, 'yyyy-MM-dd')}
                onChange={(e) => handleFilterChange('startDate', new Date(e.target.value))}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="endDate" className="text-xs text-muted-foreground">
                {t('availability:endDate')}
              </Label>
              <Input
                id="endDate"
                type="date"
                value={format(filters.endDate, 'yyyy-MM-dd')}
                onChange={(e) => handleFilterChange('endDate', new Date(e.target.value))}
                className="mt-1"
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Region Filter */}
        <div className="space-y-3">
          <Label className="text-sm font-medium flex items-center gap-2">
            <MapPin className="h-4 w-4 text-blue-600" />
            {t('availability:region')}
          </Label>
          <select
            value={filters.region}
            onChange={(e) => handleFilterChange('region', e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            {regions.map((region) => (
              <option key={region.value} value={region.value}>
                {region.label}
              </option>
            ))}
          </select>
        </div>

        {/* Owner Filter */}
        <div className="space-y-3">
          <Label className="text-sm font-medium flex items-center gap-2">
            <User className="h-4 w-4 text-purple-600" />
            {t('availability:owner')}
          </Label>
          <select
            value={filters.owner}
            onChange={(e) => handleFilterChange('owner', e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            {owners.map((owner) => (
              <option key={owner.value} value={owner.value}>
                {owner.label}
              </option>
            ))}
          </select>
        </div>

        <Separator />

        {/* Guests */}
        <div className="space-y-3">
          <Label className="text-sm font-medium flex items-center gap-2">
            <Users className="h-4 w-4 text-orange-600" />
            {t('availability:guests')}
          </Label>
          <Input
            type="number"
            min="1"
            max="10"
            value={filters.guests}
            onChange={(e) => handleFilterChange('guests', parseInt(e.target.value))}
            className="w-full"
          />
        </div>

        {/* Price Range */}
        <div className="space-y-3">
          <Label className="text-sm font-medium flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-green-600" />
            {t('availability:priceRange')}
          </Label>
          <div className="space-y-2">
            <div>
              <Label htmlFor="minPrice" className="text-xs text-muted-foreground">
                {t('availability:minPrice')}
              </Label>
              <Input
                id="minPrice"
                type="number"
                min="0"
                step="1000"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange('minPrice', parseInt(e.target.value))}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="maxPrice" className="text-xs text-muted-foreground">
                {t('availability:maxPrice')}
              </Label>
              <Input
                id="maxPrice"
                type="number"
                min="0"
                step="1000"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange('maxPrice', parseInt(e.target.value))}
                className="mt-1"
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Action Buttons */}
        <div className="space-y-2">
          <Button 
            onClick={resetFilters}
            variant="outline" 
            className="w-full flex items-center gap-2 hover:bg-gradient-to-r hover:from-gray-500 hover:to-slate-500 hover:text-white hover:border-transparent transition-all duration-300"
          >
            <RotateCcw className="h-4 w-4" />
            {t('availability:resetFilters')}
          </Button>
        </div>

        {/* Active Filters Summary */}
        {activeFiltersCount > 0 && (
          <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700/50">
            <p className="text-xs text-green-700 dark:text-green-300 font-medium">
              {t('availability:activeFilters', { count: activeFiltersCount })}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
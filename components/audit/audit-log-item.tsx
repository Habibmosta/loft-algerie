"use client"

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Separator } from '@/components/ui/separator'
import { 
  ChevronDown, 
  ChevronRight, 
  Plus, 
  Edit, 
  Trash2, 
  User, 
  Clock,
  Eye
} from 'lucide-react'
import { AuditLog } from '@/lib/types'
import { cn } from '@/lib/utils'

interface AuditLogItemProps {
  log: AuditLog
  className?: string
  showDetails?: boolean
}

export function AuditLogItem({ log, className, showDetails = false }: AuditLogItemProps) {
  const t = useTranslations('audit')
  const [isExpanded, setIsExpanded] = useState(showDetails)

  // Get action icon and color
  const getActionConfig = (action: string) => {
    switch (action) {
      case 'INSERT':
        return {
          icon: Plus,
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          variant: 'default' as const,
          label: t('actions.created')
        }
      case 'UPDATE':
        return {
          icon: Edit,
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          variant: 'secondary' as const,
          label: t('actions.updated')
        }
      case 'DELETE':
        return {
          icon: Trash2,
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          variant: 'destructive' as const,
          label: t('actions.deleted')
        }
      default:
        return {
          icon: Eye,
          color: 'text-gray-600',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          variant: 'outline' as const,
          label: action
        }
    }
  }

  const actionConfig = getActionConfig(log.action)
  const ActionIcon = actionConfig.icon

  // Format timestamp
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString()
    }
  }

  const { date, time } = formatTimestamp(log.timestamp)

  // Get table display name
  const getTableDisplayName = (tableName: string) => {
    const tableNames: Record<string, string> = {
      transactions: t('tables.transactions'),
      tasks: t('tables.tasks'),
      reservations: t('tables.reservations'),
      lofts: t('tables.lofts')
    }
    return tableNames[tableName] || tableName
  }

  // Format field changes for display
  const formatFieldChanges = () => {
    if (!log.changedFields || log.changedFields.length === 0) {
      return null
    }

    return log.changedFields.map(field => {
      const oldValue = log.oldValues?.[field]
      const newValue = log.newValues?.[field]
      
      return {
        field,
        oldValue: oldValue !== undefined ? String(oldValue) : null,
        newValue: newValue !== undefined ? String(newValue) : null
      }
    })
  }

  const fieldChanges = formatFieldChanges()

  return (
    <Card className={cn("transition-all duration-200 hover:shadow-md", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={cn(
              "flex items-center justify-center w-8 h-8 rounded-full",
              actionConfig.bgColor,
              actionConfig.borderColor,
              "border"
            )}>
              <ActionIcon className={cn("h-4 w-4", actionConfig.color)} />
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Badge variant={actionConfig.variant} className="text-xs">
                  {actionConfig.label}
                </Badge>
                <span className="text-sm font-medium">
                  {getTableDisplayName(log.tableName)}
                </span>
              </div>
              
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  <span>{log.userEmail || t('unknownUser')}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{date} {time}</span>
                </div>
              </div>
            </div>
          </div>

          {(fieldChanges || log.oldValues || log.newValues) && (
            <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </Button>
              </CollapsibleTrigger>
            </Collapsible>
          )}
        </div>
      </CardHeader>

      {(fieldChanges || log.oldValues || log.newValues) && (
        <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
          <CollapsibleContent>
            <CardContent className="pt-0">
              <Separator className="mb-4" />
              
              {/* Field Changes for UPDATE operations */}
              {log.action === 'UPDATE' && fieldChanges && fieldChanges.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-muted-foreground">
                    {t('changedFields')}
                  </h4>
                  <div className="space-y-2">
                    {fieldChanges.map(({ field, oldValue, newValue }) => (
                      <div key={field} className="grid grid-cols-3 gap-4 text-sm">
                        <div className="font-medium text-muted-foreground">
                          {field}
                        </div>
                        <div className="space-y-1">
                          <div className="text-xs text-muted-foreground">
                            {t('oldValue')}
                          </div>
                          <div className="p-2 bg-red-50 border border-red-200 rounded text-red-800 font-mono text-xs">
                            {oldValue || t('empty')}
                          </div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-xs text-muted-foreground">
                            {t('newValue')}
                          </div>
                          <div className="p-2 bg-green-50 border border-green-200 rounded text-green-800 font-mono text-xs">
                            {newValue || t('empty')}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Full data for INSERT operations */}
              {log.action === 'INSERT' && log.newValues && (
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-muted-foreground">
                    {t('createdData')}
                  </h4>
                  <div className="p-3 bg-green-50 border border-green-200 rounded">
                    <pre className="text-xs font-mono text-green-800 whitespace-pre-wrap">
                      {JSON.stringify(log.newValues, null, 2)}
                    </pre>
                  </div>
                </div>
              )}

              {/* Full data for DELETE operations */}
              {log.action === 'DELETE' && log.oldValues && (
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-muted-foreground">
                    {t('deletedData')}
                  </h4>
                  <div className="p-3 bg-red-50 border border-red-200 rounded">
                    <pre className="text-xs font-mono text-red-800 whitespace-pre-wrap">
                      {JSON.stringify(log.oldValues, null, 2)}
                    </pre>
                  </div>
                </div>
              )}

              {/* Additional metadata */}
              {(log.ipAddress || log.userAgent) && (
                <div className="mt-4 pt-3 border-t space-y-2">
                  <h4 className="text-sm font-medium text-muted-foreground">
                    {t('metadata')}
                  </h4>
                  <div className="text-xs text-muted-foreground space-y-1">
                    {log.ipAddress && (
                      <div>
                        <span className="font-medium">{t('ipAddress')}:</span> {log.ipAddress}
                      </div>
                    )}
                    {log.userAgent && (
                      <div>
                        <span className="font-medium">{t('userAgent')}:</span> {log.userAgent}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      )}
    </Card>
  )
}
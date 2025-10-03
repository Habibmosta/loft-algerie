import { requireRole } from "@/lib/auth"
import { AuditHistory } from "@/components/audit/audit-history"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default async function AuditDemoPage() {
  // Require admin role to access this demo page
  const session = await requireRole(['admin', 'manager'])

  // Use one of the test record IDs from our audit data
  // TODO: Remplacez par un vrai ID de transaction après avoir créé les triggers
  const testRecordId = '123e4567-e89b-12d3-a456-426614174000'

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 dark:from-gray-950 dark:via-slate-900 dark:to-indigo-950/20 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Démo du Système d'Audit
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Test de l'interface d'audit avec des données réelles.
          </p>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Test 1 : Historique d'Audit pour Transactions</CardTitle>
              <CardDescription>
                Test avec un UUID fictif (devrait être vide)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AuditHistory 
                tableName="transactions" 
                recordId={testRecordId}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Test 2 : Historique d'Audit pour Tasks</CardTitle>
              <CardDescription>
                Test avec un UUID fictif (devrait être vide)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AuditHistory 
                tableName="tasks" 
                recordId={testRecordId}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Test 3 : Historique d'Audit pour Reservations</CardTitle>
              <CardDescription>
                Test avec un UUID fictif (devrait être vide)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AuditHistory 
                tableName="reservations" 
                recordId={testRecordId}
              />
            </CardContent>
          </Card>
        </div>

        <div className="bg-muted p-4 rounded-lg">
          <h3 className="font-medium mb-2">Informations de Test</h3>
          <div className="text-sm space-y-1">
            <p><strong>Utilisateur:</strong> {session.user.email}</p>
            <p><strong>Rôle:</strong> {session.user.role}</p>
            <p><strong>Test Record ID:</strong> {testRecordId}</p>
            <p><strong>Note:</strong> Ces tests utilisent un UUID fictif, donc l'historique devrait être vide. Pour tester avec de vraies données, créez/modifiez des entités et utilisez leurs vrais IDs.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
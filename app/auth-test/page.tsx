import { createClient } from "@/utils/supabase/server"

export default async function AuthTestPage() {
  const supabase = await createClient()

  try {
    // Test de l'authentification
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError) {
      return (
        <div className="p-8">
          <h1 className="text-2xl font-bold text-red-600">Erreur d'authentification</h1>
          <pre className="mt-4 p-4 bg-red-100 rounded text-sm">
            {JSON.stringify(userError, null, 2)}
          </pre>
        </div>
      )
    }

    if (!user) {
      return (
        <div className="p-8">
          <h1 className="text-2xl font-bold text-yellow-600">Utilisateur non connecté</h1>
          <p className="mt-4">Aucun utilisateur authentifié trouvé.</p>
          <a href="/login" className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded">
            Se connecter
          </a>
        </div>
      )
    }

    // Test de récupération du profil
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold text-green-600">✅ Authentification OK</h1>
        
        <div className="mt-6 space-y-4">
          <div className="p-4 bg-green-100 rounded">
            <h2 className="font-bold">Utilisateur :</h2>
            <p><strong>ID :</strong> {user.id}</p>
            <p><strong>Email :</strong> {user.email}</p>
            <p><strong>Créé le :</strong> {user.created_at}</p>
          </div>

          {profileError ? (
            <div className="p-4 bg-red-100 rounded">
              <h2 className="font-bold text-red-800">Erreur profil :</h2>
              <pre className="text-sm">{JSON.stringify(profileError, null, 2)}</pre>
            </div>
          ) : profile ? (
            <div className="p-4 bg-blue-100 rounded">
              <h2 className="font-bold">Profil :</h2>
              <p><strong>Nom :</strong> {profile.full_name}</p>
              <p><strong>Rôle :</strong> {profile.role}</p>
              <p><strong>Email :</strong> {profile.email}</p>
            </div>
          ) : (
            <div className="p-4 bg-yellow-100 rounded">
              <h2 className="font-bold">Aucun profil trouvé</h2>
            </div>
          )}
        </div>

        <div className="mt-6">
          <h2 className="font-bold mb-2">Tests de navigation :</h2>
          <div className="space-x-4">
            <a href="/lofts" className="bg-blue-500 text-white px-4 py-2 rounded">
              Liste des lofts
            </a>
            <a href="/lofts/1fdc1a07-db05-423a-bdbe-efafe4fadf04" className="bg-green-500 text-white px-4 py-2 rounded">
              Voir loft
            </a>
            <a href="/lofts/1fdc1a07-db05-423a-bdbe-efafe4fadf04/edit" className="bg-red-500 text-white px-4 py-2 rounded">
              Éditer loft
            </a>
          </div>
        </div>
      </div>
    )

  } catch (error) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold text-red-600">Erreur générale</h1>
        <pre className="mt-4 p-4 bg-red-100 rounded text-sm">
          {error instanceof Error ? error.message : String(error)}
        </pre>
      </div>
    )
  }
}
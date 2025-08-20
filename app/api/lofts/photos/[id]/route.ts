import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { createClient } from '@/utils/supabase/server'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth()
    const { id } = await params
    const supabase = await createClient()

    // Récupérer les infos de la photo
    const { data: photo, error: fetchError } = await supabase
      .from('loft_photos')
      .select('file_path')
      .eq('id', id)
      .single()

    if (fetchError || !photo) {
      return NextResponse.json(
        { error: 'Photo non trouvée' },
        { status: 404 }
      )
    }

    // Supprimer le fichier du storage
    const { error: storageError } = await supabase.storage
      .from('loft-photos')
      .remove([photo.file_path])

    if (storageError) {
      console.error('Erreur suppression storage:', storageError)
    }

    // Supprimer l'enregistrement de la base
    const { error: deleteError } = await supabase
      .from('loft_photos')
      .delete()
      .eq('id', id)

    if (deleteError) {
      console.error('Erreur suppression DB:', deleteError)
      return NextResponse.json(
        { error: 'Erreur lors de la suppression' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Erreur suppression photo:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}
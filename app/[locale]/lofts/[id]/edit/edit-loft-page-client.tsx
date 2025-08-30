"use client"

<<<<<<< HEAD
import { useTranslation } from 'react-i18next';
=======
import { useTranslations } from 'next-intl';
>>>>>>> 0181c663fd95b9542a53fdc8606aef496de0bbce
import { EditLoftFormWrapper } from "./edit-loft-form-wrapper"

interface EditLoftPageClientProps {
  loft: any
  owners: any[]
  zoneAreas: any[]
  internetConnectionTypes: any[]
}

export function EditLoftPageClient({ loft, owners, zoneAreas, internetConnectionTypes }: EditLoftPageClientProps) {
  const t = useTranslations();

  return (
    <div className="space-y-6 p-6">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold">{t('editLoft')}</h1>
        <p className="text-muted-foreground mt-2">{t('updatePropertyDetails')}</p>
      </div>
      <EditLoftFormWrapper 
        loft={loft}
        owners={owners} 
        zoneAreas={zoneAreas} 
        internetConnectionTypes={internetConnectionTypes} 
      />
    </div>
  )
}
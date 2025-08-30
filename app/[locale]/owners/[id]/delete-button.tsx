"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { deleteOwner } from "@/app/actions/owners"
import { useToast } from "@/components/ui/use-toast"
<<<<<<< HEAD
import { useTranslation } from 'react-i18next';
=======
import { useTranslations } from 'next-intl';
>>>>>>> 0181c663fd95b9542a53fdc8606aef496de0bbce

export function DeleteOwnerButton({ id }: { id: string }) {
  const router = useRouter()
  const { toast } = useToast()
  const t = useTranslations();

  const handleDelete = async () => {
    if (confirm(t('owners.deleteConfirm'))) {
      try {
        await deleteOwner(id)
        toast({
          title: t('owners.deleteSuccessTitle'),
          description: t('owners.deleteSuccessDescription'),
        })
        router.push("/owners")
      } catch (error) {
        toast({
          title: t('common.error'),
          description: error instanceof Error ? error.message : t('owners.deleteError'),
          variant: "destructive"
        })
      }
    }
  }

  return (
    <Button
      variant="destructive"
      size="sm"
      onClick={handleDelete}
    >
      {t('owners.deleteOwner')}
    </Button>
  )
}

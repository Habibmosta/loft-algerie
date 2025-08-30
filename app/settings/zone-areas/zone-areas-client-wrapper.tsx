"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ZoneAreaList } from "@/components/zone-areas/zone-areas-list";
import { ZoneAreaForm } from "@/components/forms/zone-area-form";
import { getZoneAreas, ZoneArea } from "@/app/actions/zone-areas";
import { toast } from "@/components/ui/use-toast";
import { MapPin, Plus, Edit } from "lucide-react";

type Translations = {
  pageTitle: string;
  subtitle: string;
  addNew: string;
  updateZoneArea: string;
  createZoneArea: string;
  updateZoneAreaInfo: string;
  createNewZoneArea: string;
  existingZoneAreas: string;
  totalZoneAreas: string;
  noZoneAreasFound: string;
  addFirstZoneArea: string;
  success: string;
  error: string;
  updateSuccess: string;
  createSuccess: string;
  refreshError: string;
};

interface ZoneAreasClientWrapperProps {
  initialZoneAreas: ZoneArea[];
  translations: Translations;
}

export default function ZoneAreasClientWrapper({ initialZoneAreas, translations: tStrings }: ZoneAreasClientWrapperProps) {
  const [editingZoneArea, setEditingZoneArea] = useState<ZoneArea | undefined>(undefined);
  const [zoneAreas, setZoneAreas] = useState<ZoneArea[]>(initialZoneAreas);
  const [showForm, setShowForm] = useState(false);

  const handleEdit = (zoneArea: ZoneArea) => {
    setEditingZoneArea(zoneArea);
    setShowForm(true);
  };

  const handleFormSuccess = async () => {
    setEditingZoneArea(undefined);
    setShowForm(false);
    // Re-fetch zone areas to update the list
    try {
      const updatedZoneAreas = await getZoneAreas();
      setZoneAreas(updatedZoneAreas);
      toast({
        title: "✅ " + tStrings.success,
        description: editingZoneArea
          ? tStrings.updateSuccess
          : tStrings.createSuccess,
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: "❌ " + tStrings.error,
        description: tStrings.refreshError,
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    setEditingZoneArea(undefined);
    setShowForm(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in-0 duration-700">
      {/* Header avec design premium */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-8 border border-primary/20">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-50"></div>
        <div className="absolute top-4 right-4 opacity-10">
          <MapPin className="h-32 w-32 text-primary" />
        </div>
        <div className="relative flex justify-between items-center">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 shadow-lg">
                <MapPin className="h-8 w-8 text-primary" />
              </div>
              {tStrings.pageTitle}
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl">{tStrings.subtitle}</p>
            <div className="flex items-center gap-4 pt-2">
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary">
                <MapPin className="h-4 w-4" />
                <span className="text-sm font-medium">{zoneAreas.length} zones configurées</span>
              </div>
            </div>
          </div>
          {!showForm && (
            <Button
              onClick={() => setShowForm(true)}
              className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all duration-300 px-6 py-3 h-auto"
            >
              <Plus className="mr-2 h-5 w-5" />
              {tStrings.addNew}
            </Button>
          )}
        </div>
      </div>

      {/* Formulaire avec animation et design amélioré */}
      {showForm && (
        <Card className="border-0 shadow-2xl bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/20 dark:from-gray-800 dark:via-blue-900/10 dark:to-indigo-900/5 overflow-hidden animate-in slide-in-from-top-4 duration-500">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-50"></div>
          <CardHeader className="bg-gradient-to-r from-primary/8 via-primary/5 to-transparent border-b border-primary/10 relative">
            <CardTitle className="flex items-center gap-4 text-xl">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 shadow-lg">
                {editingZoneArea ? <Edit className="h-6 w-6 text-primary" /> : <Plus className="h-6 w-6 text-primary" />}
              </div>
              {editingZoneArea ? tStrings.updateZoneArea : tStrings.createZoneArea}
            </CardTitle>
            <CardDescription className="text-base text-muted-foreground">
              {editingZoneArea
                ? tStrings.updateZoneAreaInfo
                : tStrings.createNewZoneArea}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8 relative">
            <ZoneAreaForm
              zoneArea={editingZoneArea}
              onSuccess={handleFormSuccess}
              onCancel={handleCancel}
            />
          </CardContent>
        </Card>
      )}

      {/* Liste des zones avec design moderne */}
      <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-800 dark:to-gray-900/50 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-primary/5 via-primary/3 to-transparent border-b border-primary/10">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10">
              <MapPin className="h-5 w-5 text-primary" />
            </div>
            {tStrings.existingZoneAreas}
          </CardTitle>
          <CardDescription className="text-base">
            {tStrings.totalZoneAreas.replace('{count}', zoneAreas.length.toString())}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {zoneAreas.length === 0 ? (
            <div className="text-center py-16 px-8">
              <div className="p-6 rounded-full bg-gradient-to-br from-primary/10 to-primary/5 w-fit mx-auto mb-6">
                <MapPin className="h-16 w-16 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                {tStrings.noZoneAreasFound}
              </h3>
              <p className="text-muted-foreground text-base mb-6 max-w-md mx-auto">
                {tStrings.addFirstZoneArea}
              </p>
              <Button onClick={() => setShowForm(true)} className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all duration-300">
                <Plus className="mr-2 h-5 w-5" />
                {tStrings.addNew}
              </Button>
            </div>
          ) : (
            <div className="overflow-hidden">
              <ZoneAreaList
                zoneAreas={zoneAreas}
                onEdit={handleEdit}
                onRefresh={handleFormSuccess}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { Cloud, Plus } from "lucide-react";

export function AddStationForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    altitude: "",
    stationType: "",
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit && onSubmit(formData);
    setFormData({ name: "", location: "", altitude: "", stationType: "" });
  };

  const isFormValid =
    formData.name && formData.location && formData.altitude && formData.stationType;

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center space-x-1.5 sm:space-x-2 text-sm sm:text-base md:text-lg">
          <Cloud className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
          <span>Tambah Weather Station Baru</span>
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          Daftarkan weather station baru ke sistem monitoring cuaca
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="name" className="text-xs sm:text-sm">Nama Station</Label>
              <Input
                id="name"
                placeholder="Contoh: SkyVera Station #1"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className="h-8 sm:h-10 text-xs sm:text-sm"
              />
            </div>
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="location" className="text-xs sm:text-sm">Lokasi</Label>
              <Input
                id="location"
                placeholder="Contoh: Area Utara - Sektor A"
                value={formData.location}
                onChange={(e) => handleChange("location", e.target.value)}
                className="h-8 sm:h-10 text-xs sm:text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="altitude" className="text-xs sm:text-sm">Ketinggian (mdpl)</Label>
              <Input
                id="altitude"
                type="number"
                placeholder="Contoh: 125"
                value={formData.altitude}
                onChange={(e) => handleChange("altitude", e.target.value)}
                className="h-8 sm:h-10 text-xs sm:text-sm"
              />
            </div>
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="stationType" className="text-xs sm:text-sm">Tipe Station</Label>
              <Select
                value={formData.stationType}
                onValueChange={(value) => handleChange("stationType", value)}
              >
                <SelectTrigger id="stationType" className="h-8 sm:h-10 text-xs sm:text-sm">
                  <SelectValue placeholder="Pilih tipe station" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="compact">Compact</SelectItem>
                  <SelectItem value="mobile">Mobile</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end pt-2 sm:pt-4">
            <Button
              type="submit"
              disabled={!isFormValid}
              className="bg-blue-600 hover:bg-blue-700 h-8 sm:h-10 text-xs sm:text-sm"
            >
              <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
              Tambah Station
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

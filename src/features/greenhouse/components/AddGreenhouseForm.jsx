import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { Home, Plus } from "lucide-react";

export function AddGreenhouseForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    area: "",
    type: "",
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit && onSubmit(formData);
    setFormData({ name: "", location: "", area: "", type: "" });
  };

  const isFormValid =
    formData.name && formData.location && formData.area && formData.type;

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center space-x-1.5 sm:space-x-2 text-sm sm:text-base md:text-lg">
          <Home className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
          <span>Tambah Greenhouse Baru</span>
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          Daftarkan greenhouse baru ke sistem monitoring
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="name" className="text-xs sm:text-sm">Nama Greenhouse</Label>
              <Input
                id="name"
                placeholder="Contoh: Greenhouse #1"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className="h-8 sm:h-10 text-xs sm:text-sm"
              />
            </div>
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="location" className="text-xs sm:text-sm">Lokasi</Label>
              <Input
                id="location"
                placeholder="Contoh: Blok A - Baris 1"
                value={formData.location}
                onChange={(e) => handleChange("location", e.target.value)}
                className="h-8 sm:h-10 text-xs sm:text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="area" className="text-xs sm:text-sm">Luas Area (m²)</Label>
              <Input
                id="area"
                type="number"
                placeholder="Contoh: 200"
                value={formData.area}
                onChange={(e) => handleChange("area", e.target.value)}
                className="h-8 sm:h-10 text-xs sm:text-sm"
              />
            </div>
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="type" className="text-xs sm:text-sm">Jenis Greenhouse</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => handleChange("type", value)}
              >
                <SelectTrigger id="type" className="h-8 sm:h-10 text-xs sm:text-sm">
                  <SelectValue placeholder="Pilih jenis" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hydroponic">Hidroponik</SelectItem>
                  <SelectItem value="soil">Tanah Konvensional</SelectItem>
                  <SelectItem value="aeroponic">Aeroponik</SelectItem>
                  <SelectItem value="aquaponic">Aquaponik</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end pt-2 sm:pt-4">
            <Button
              type="submit"
              disabled={!isFormValid}
              className="bg-green-600 hover:bg-green-700 h-8 sm:h-10 text-xs sm:text-sm"
            >
              <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
              Tambah Greenhouse
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

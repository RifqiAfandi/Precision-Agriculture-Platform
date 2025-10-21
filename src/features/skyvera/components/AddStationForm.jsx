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
        <CardTitle className="flex items-center space-x-2">
          <Cloud className="w-5 h-5 text-blue-600" />
          <span>Tambah Weather Station Baru</span>
        </CardTitle>
        <CardDescription>
          Daftarkan weather station baru ke sistem monitoring cuaca
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nama Station</Label>
              <Input
                id="name"
                placeholder="Contoh: SkyVera Station #1"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Lokasi</Label>
              <Input
                id="location"
                placeholder="Contoh: Area Utara - Sektor A"
                value={formData.location}
                onChange={(e) => handleChange("location", e.target.value)}
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="altitude">Ketinggian (mdpl)</Label>
              <Input
                id="altitude"
                type="number"
                placeholder="Contoh: 125"
                value={formData.altitude}
                onChange={(e) => handleChange("altitude", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stationType">Tipe Station</Label>
              <Select
                value={formData.stationType}
                onValueChange={(value) => handleChange("stationType", value)}
              >
                <SelectTrigger id="stationType">
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

          <div className="flex justify-end pt-4">
            <Button
              type="submit"
              disabled={!isFormValid}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Tambah Station
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

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
        <CardTitle className="flex items-center space-x-2">
          <Home className="w-5 h-5 text-green-600" />
          <span>Tambah Greenhouse Baru</span>
        </CardTitle>
        <CardDescription>
          Daftarkan greenhouse baru ke sistem monitoring
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nama Greenhouse</Label>
              <Input
                id="name"
                placeholder="Contoh: Greenhouse #1"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Lokasi</Label>
              <Input
                id="location"
                placeholder="Contoh: Blok A - Baris 1"
                value={formData.location}
                onChange={(e) => handleChange("location", e.target.value)}
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="area">Luas Area (m²)</Label>
              <Input
                id="area"
                type="number"
                placeholder="Contoh: 200"
                value={formData.area}
                onChange={(e) => handleChange("area", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Jenis Greenhouse</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => handleChange("type", value)}
              >
                <SelectTrigger id="type">
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

          <div className="flex justify-end pt-4">
            <Button
              type="submit"
              disabled={!isFormValid}
              className="bg-green-600 hover:bg-green-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Tambah Greenhouse
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Label } from "../../../components/ui/Label";
import { Plus, MapPin } from "lucide-react";
import { toast } from "sonner";
import { validatePlantForm } from "../utils/agriinoHelpers";

/**
 * AddPlantForm component for registering new plants
 * Includes form validation and GPS location info
 * 
 * @component
 * @param {Object} props - Component props
 * @param {Function} props.onSubmit - Submit handler receiving plant data
 * 
 * @example
 * <AddPlantForm onSubmit={(data) => handleAddPlant(data)} />
 */
export function AddPlantForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    location: "",
  });

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = () => {
    const validation = validatePlantForm(formData);

    if (!validation.isValid) {
      // Show first error
      const firstError = Object.values(validation.errors)[0];
      toast.error(firstError);
      return;
    }

    // Call parent handler
    if (onSubmit) {
      onSubmit(formData);
    }

    // Reset form
    setFormData({ name: "", description: "", location: "" });
    toast.success("Tanaman berhasil ditambahkan");
  };

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Plus className="w-5 h-5 text-green-600" />
          <span>Tambah Lokasi Tanaman Baru</span>
        </CardTitle>
        <CardDescription>
          Daftarkan tanaman baru untuk monitoring klorofil dan nitrogen
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="plantName">Nama Tanaman</Label>
            <Input
              id="plantName"
              placeholder="Contoh: Tomat Hidroponik A"
              value={formData.name}
              onChange={handleChange("name")}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Lokasi</Label>
            <Input
              id="location"
              placeholder="Contoh: Blok A - Lahan 1"
              value={formData.location}
              onChange={handleChange("location")}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Deskripsi (Opsional)</Label>
          <Input
            id="description"
            placeholder="Contoh: Varietas Cherry, umur 45 hari"
            value={formData.description}
            onChange={handleChange("description")}
          />
        </div>

        <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg">
          <MapPin className="w-5 h-5 text-blue-600" />
          <div>
            <p className="font-medium text-blue-900">GPS Otomatis</p>
            <p className="text-sm text-blue-700">
              Lokasi akan dideteksi otomatis saat menyimpan
            </p>
          </div>
        </div>

        <Button
          onClick={handleSubmit}
          className="w-full bg-green-600 hover:bg-green-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Simpan Lokasi Tanaman
        </Button>
      </CardContent>
    </Card>
  );
}

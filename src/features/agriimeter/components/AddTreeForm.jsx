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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/Select";
import { Plus, MapPin, TreePine } from "lucide-react";
import { toast } from "sonner";
import { speciesOptions } from "../data/agriimeterData";
import { validateTreeForm } from "../utils/agriimeterHelpers";

/**
 * AddTreeForm component untuk form pendaftaran pohon baru
 * Includes validation dan GPS auto-detection info
 * 
 * @param {Object} props
 * @param {Function} props.onSubmit - Handler ketika form disubmit
 */
export function AddTreeForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    name: "",
    species: "",
    age: "",
    location: "",
  });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    // Validate form
    const validation = validateTreeForm(formData);

    if (!validation.isValid) {
      toast.error(validation.errors[0]);
      return;
    }

    // Call parent submit handler
    onSubmit(formData);

    // Success feedback
    toast.success("Pohon berhasil ditambahkan");

    // Reset form
    setFormData({ name: "", species: "", age: "", location: "" });
  };

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Plus className="w-5 h-5 text-green-600" />
          <span>Daftarkan Pohon Baru</span>
        </CardTitle>
        <CardDescription>
          Tambahkan pohon baru untuk monitoring pertumbuhan DBH
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="treeName">Nama/ID Pohon *</Label>
            <Input
              id="treeName"
              placeholder="Contoh: Jati Unggul A1"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="treeSpecies">Jenis Tanaman *</Label>
            <Select
              value={formData.species}
              onValueChange={(value) => handleInputChange("species", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih jenis pohon" />
              </SelectTrigger>
              <SelectContent>
                {speciesOptions.map((species) => (
                  <SelectItem key={species} value={species}>
                    {species}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="treeAge">Umur Pohon (bulan)</Label>
            <Input
              id="treeAge"
              type="number"
              placeholder="Contoh: 24"
              value={formData.age}
              onChange={(e) => handleInputChange("age", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="treeLocation">Lokasi Pohon *</Label>
            <Input
              id="treeLocation"
              placeholder="Contoh: Blok A - Baris 1"
              value={formData.location}
              onChange={(e) => handleInputChange("location", e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg">
          <MapPin className="w-5 h-5 text-blue-600 flex-shrink-0" />
          <div>
            <p className="font-medium text-blue-900">GPS Otomatis</p>
            <p className="text-sm text-blue-700">
              Koordinat GPS akan direkam otomatis saat menyimpan
            </p>
          </div>
        </div>

        <Button
          onClick={handleSubmit}
          className="w-full bg-green-600 hover:bg-green-700"
        >
          <TreePine className="w-4 h-4 mr-2" />
          Tambah Pohon ke Monitoring
        </Button>
      </CardContent>
    </Card>
  );
}

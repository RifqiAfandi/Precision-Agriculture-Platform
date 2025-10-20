import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../ui/Card";
import { Button } from "../../ui/Button";
import { Input } from "../../ui/Input";
import { Label } from "../../ui/Label";
import { Badge } from "../../ui/Badge";
import {
  User,
  Mail,
  Key,
  Shield,
  Bell,
  Eye,
  EyeOff,
  CheckCircle,
} from "lucide-react";
import { toast } from "sonner";

export function ProfilePage({ user }) {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    smsAlerts: false,
    pushNotifications: true,
    weeklyReports: true,
  });

  const handlePasswordChange = (field) => (e) => {
    setPasswordForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();

    if (
      !passwordForm.currentPassword ||
      !passwordForm.newPassword ||
      !passwordForm.confirmPassword
    ) {
      toast.error("Mohon lengkapi semua field");
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("Konfirmasi password tidak cocok");
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      toast.error("Password baru minimal 6 karakter");
      return;
    }

    toast.success("Password berhasil diubah");
    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const toggleNotification = (key) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
    toast.success("Pengaturan notifikasi diperbarui");
  };

  if (!user) {
    return (
      <div className="text-center py-12">
        <User className="w-16 h-16 mx-auto mb-4 text-gray-400" />
        <p className="text-gray-500">Data pengguna tidak ditemukan</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-6">
      {/* Header */}
      <Card className="glass-card">
        <CardContent className="p-6">
          <div className="flex items-center space-x-6">
            <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center">
              <User className="w-10 h-10 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
              <p className="text-gray-600 flex items-center space-x-2 mt-1">
                <Mail className="w-4 h-4" />
                <span>{user.email}</span>
              </p>
              <div className="flex items-center space-x-4 mt-3">
                <Badge className="bg-green-100 text-green-700">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Akun Terverifikasi
                </Badge>
                <Badge variant="outline">Member sejak Januari 2024</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Account Information */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="w-5 h-5 text-blue-600" />
              <span>Informasi Akun</span>
            </CardTitle>
            <CardDescription>Data personal dan kontak</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Nama Lengkap</Label>
              <Input
                id="fullName"
                value={user.name}
                disabled
                className="bg-gray-50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={user.email}
                disabled
                className="bg-gray-50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="userId">User ID</Label>
              <Input
                id="userId"
                value={user.id}
                disabled
                className="bg-gray-50"
              />
            </div>
            <div className="pt-4">
              <p className="text-sm text-gray-500">
                Untuk mengubah informasi akun, hubungi administrator sistem.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Change Password */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Key className="w-5 h-5 text-orange-600" />
              <span>Ganti Password</span>
            </CardTitle>
            <CardDescription>Ubah password untuk keamanan akun</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Password Saat Ini</Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    type={showCurrentPassword ? "text" : "password"}
                    value={passwordForm.currentPassword}
                    onChange={handlePasswordChange("currentPassword")}
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">Password Baru</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    value={passwordForm.newPassword}
                    onChange={handlePasswordChange("newPassword")}
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">
                  Konfirmasi Password Baru
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={passwordForm.confirmPassword}
                    onChange={handlePasswordChange("confirmPassword")}
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-orange-600 hover:bg-orange-700"
              >
                Ubah Password
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Notification Setting */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bell className="w-5 h-5 text-green-600" />
            <span>Pengaturan Notifikasi</span>
          </CardTitle>
          <CardDescription>
            Kelola preferensi pemberitahuan Anda
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              {Object.entries({
                emailAlerts: "Email Alert",
                smsAlerts: "SMS Alert",
                pushNotifications: "Push Notification",
                weeklyReports: "Laporan Mingguan",
              }).map(([key, label]) => (
                <div
                  key={key}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium">{label}</p>
                    <p className="text-sm text-gray-500">
                      {key === "emailAlerts" && "Notifikasi melalui email"}
                      {key === "smsAlerts" && "Notifikasi melalui SMS"}
                      {key === "pushNotifications" && "Notifikasi push browser"}
                      {key === "weeklyReports" && "Ringkasan mingguan data"}
                    </p>
                  </div>
                  <Button
                    variant={notifications[key] ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleNotification(key)}
                  >
                    {notifications[key] ? "Aktif" : "Nonaktif"}
                  </Button>
                </div>
              ))}
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2 flex items-center space-x-2">
                <Shield className="w-4 h-4" />
                <span>Informasi Keamanan</span>
              </h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Password terakhir diubah: 15 Juli 2024</li>
                <li>• Login terakhir: 02 Agustus 2024, 14:35</li>
                <li>• Device aktif: Browser Desktop</li>
                <li>• Status keamanan: Aman</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

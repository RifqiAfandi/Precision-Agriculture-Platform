import React, { useState } from "react";
import PropTypes from "prop-types";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Alert, AlertDescription } from "@/components/ui/Alert";
import { ArrowLeft, Mail, Lock, AlertCircle } from "lucide-react";
import { Logo } from "@/components/common/Logo";
import { useAuth } from "@/contexts/AuthContext";

export function LoginPage({ onNavigate, onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!email || !password) {
      setError("Email dan password harus diisi");
      setIsLoading(false);
      return;
    }

    try {
      const result = await login(email, password);
      
      if (result.success) {
        onLogin(result.user);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError("Terjadi kesalahan yang tidak terduga");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <Logo size="xl" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Masuk ke Akun Anda
          </h1>
          <p className="text-gray-600">
            Akses dashboard monitoring IoT pertanian
          </p>
        </div>

        <Card className="glass-card">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl">Masuk</CardTitle>
            <CardDescription>
              Masukkan email dan password untuk mengakses dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="nama@perusahaan.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Masukkan password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                disabled={isLoading}
              >
                {isLoading ? "Memproses..." : "Masuk"}
              </Button>
            </form>

            <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm text-blue-800">
              <p className="font-medium mb-1">Info:</p>
              <p className="text-xs text-blue-600">
                Silakan login dengan email dan password yang telah terdaftar di database
              </p>
            </div>

            <div className="mt-6 text-center space-y-2">
              <p className="text-sm text-gray-600">
                Belum punya akun?{" "}
                <button
                  onClick={() => onNavigate("register")}
                  className="text-green-600 hover:text-green-700 font-medium"
                >
                  Daftar sekarang
                </button>
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <Button
            variant="ghost"
            onClick={() => onNavigate("landing")}
            className="text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali ke Beranda
          </Button>
        </div>
      </div>
    </div>
  );
}

LoginPage.propTypes = {
  onNavigate: PropTypes.func.isRequired,
  onLogin: PropTypes.func.isRequired,
};

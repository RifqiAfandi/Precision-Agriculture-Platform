import React, { useState } from "react";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Label } from "../../components/ui/Label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/Card";
import { Alert, AlertDescription } from "../../components/ui/Alert";
import { ArrowLeft, Mail, Lock, AlertCircle } from "lucide-react";
import { Logo } from "../../components/common/Logo";

export function LoginPage({ onNavigate, onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (!email || !password) {
      setError("Email dan password harus diisi");
      setIsLoading(false);
      return;
    }

    if (email === "demo@agriiweb.com" && password === "demo123") {
      onLogin({ name: "Demo User", email: email });
    } else if (email && password) {
      const name =
        email.split("@")[0].charAt(0).toUpperCase() +
        email.split("@")[0].slice(1);
      onLogin({ name: name, email: email });
    } else {
      setError("Email atau password salah");
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {}
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

        {}
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

            {}
            <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm text-blue-800">
              <p className="font-medium mb-1">Demo Login:</p>
              <p>Email: demo@agriiweb.com</p>
              <p>Password: demo123</p>
              <p className="text-xs mt-1 text-blue-600">
                Atau gunakan email/password apa saja untuk demo
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

        {}
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

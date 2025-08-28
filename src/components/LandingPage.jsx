import React from "react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Cloud, Home, ArrowRight, Leaf } from "lucide-react";
import { Logo } from "./Logo";

export function LandingPage({ onNavigate }) {
  const products = [
    {
      name: "Agriino",
      description: "Monitoring Klorofil & Nitrogen",
      icon: Leaf,
      features: [
        "SPAD Meter Low-cost",
        "Analisis Real-time",
        "Rekomendasi Pemupukan AI",
      ],
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      name: "Agriimeter",
      description: "Pengukur DBH Pohon",
      icon: Cloud,
      features: [
        "Monitoring DBH Real-time",
        "Prediksi Pertumbuhan",
        "Analisis Biomassa",
      ],
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      name: "Greenhouse Compax",
      description: "Monitoring Rumah Kaca",
      icon: Home,
      features: [
        "Kontrol Otomatis",
        "Monitoring CO₂",
        "Sistem Ventilasi Pintar",
      ],
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <Logo size="lg" variant="default" />

        <div className="space-x-4">
          <Button variant="ghost" onClick={() => onNavigate("login")}>
            Masuk
          </Button>
          <Button onClick={() => onNavigate("register")}>Daftar</Button>
        </div>
      </header>

      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Precision Agriculture Platform
          </h1>
          <p className="text-2xl text-gray-600 mb-8 leading-relaxed">
            Smart Farming Made Simple
          </p>
          <p className="text-lg text-gray-500 mb-12 max-w-2xl mx-auto">
            Platform monitoring IoT pertanian berbasis AI yang membantu petani
            modern mengoptimalkan hasil panen dengan teknologi sensor canggih
            dan analisis data real-time.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              className="px-8 py-6 text-lg bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
              onClick={() => onNavigate("register")}
            >
              Mulai Sekarang
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="px-8 py-6 text-lg border-green-200 text-green-700 hover:bg-green-50"
            >
              Pelajari Lebih Lanjut
            </Button>
          </div>
        </div>

        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-20 h-20 bg-green-100 rounded-full animate-float opacity-60"></div>
          <div
            className="absolute top-40 right-20 w-16 h-16 bg-blue-100 rounded-full animate-float opacity-60"
            style={{ animationDelay: "1s" }}
          ></div>
          <div
            className="absolute bottom-40 left-20 w-12 h-12 bg-purple-100 rounded-full animate-float opacity-60"
            style={{ animationDelay: "2s" }}
          ></div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Solusi IoT Pertanian Terdepan
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Produk unggulan yang dirancang khusus untuk membantu petani modern
            meningkatkan produktivitas dan efisiensi melalui teknologi AI dan
            IoT.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {products.map((product, index) => (
            <Card
              key={product.name}
              className="glass-card hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-0"
            >
              <CardHeader className="text-center">
                <div
                  className={`w-16 h-16 mx-auto ${product.bgColor} rounded-2xl flex items-center justify-center mb-4`}
                >
                  <product.icon className={`w-8 h-8 ${product.color}`} />
                </div>
                <CardTitle className="text-2xl text-gray-900">
                  {product.name}
                </CardTitle>
                <CardDescription className="text-lg text-gray-600">
                  {product.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {product.features.map((feature, featureIndex) => (
                    <li
                      key={featureIndex}
                      className="flex items-center space-x-3"
                    >
                      <div
                        className={`w-2 h-2 ${product.bgColor} rounded-full`}
                      ></div>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="bg-gradient-to-r from-green-500 to-green-600 py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center text-white">
            <div>
              <div className="text-4xl font-bold mb-2">1000+</div>
              <div className="text-green-100">Petani Terdaftar</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">5000+</div>
              <div className="text-green-100">Perangkat Aktif</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">25%</div>
              <div className="text-green-100">Peningkatan Hasil Panen</div>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Siap Memulai Revolusi Pertanian Digital?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Bergabunglah dengan ribuan petani yang telah merasakan manfaat
            teknologi AI untuk pertanian modern.
          </p>
          <Button
            size="lg"
            className="px-8 py-6 text-lg bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
            onClick={() => onNavigate("register")}
          >
            Mulai Gratis Sekarang
          </Button>
        </div>
      </section>

      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <Logo size="md" variant="white" className="mb-4" />
              <p className="text-gray-400">
                Platform IoT pertanian terdepan untuk petani modern Indonesia.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Produk</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Agriino</li>
                <li>Agriimeter</li>
                <li>Greenhouse Compax</li>
                <li>SkyVera</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Perusahaan</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Tentang Kami</li>
                <li>Kontak</li>
                <li>Karir</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Kontak</h4>
              <div className="text-gray-400 space-y-2">
                <p>PT Precision Agriculture Indonesia</p>
                <p>Jakarta, Indonesia</p>
                <p>info@agriiweb.com</p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>
              &copy; 2024 PT Precision Agriculture Indonesia. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

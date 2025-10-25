import React from "react";
import PropTypes from "prop-types";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Cloud, Home, ArrowRight, Leaf } from "lucide-react";
import { Logo } from "@/components/common/Logo";

/**
 * LandingPage Component - Main landing page for the application
 * @param {Object} props - Component props
 * @param {Function} props.onNavigate - Navigation handler function
 */
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 relative">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/75 backdrop-blur-md border-b border-green-100">
        <div className="container mx-auto flex justify-between items-center px-6 py-4">
          <Logo size="lg" variant="default" textClassName="black" />
          <div className="space-x-4">
            <Button
              className={"px-5 py-4 text-md bg-gradient-to-r"}
              variant="ghost"
              onClick={() => onNavigate("login")}
            >
              Masuk
            </Button>
            <Button
              className="px-5 py-4 text-md bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
              onClick={() => onNavigate("register")}
            >
              Daftar
            </Button>
          </div>
        </div>
      </header>

      <section className="container mx-auto px-4 pt-24 sm:pt-32 pb-12 sm:pb-16 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-3 sm:mb-4 leading-tight">
            Precision Agriculture Platform
          </h1>
          <p className="text-xl sm:text-2xl text-gray-600 mb-3 sm:mb-4 leading-relaxed font-medium">
            Smart Farming Made Simple
          </p>
          <p className="text-sm sm:text-base md:text-lg text-gray-500 mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed">
            Platform monitoring IoT pertanian berbasis AI yang membantu petani
            modern mengoptimalkan hasil panen dengan teknologi sensor canggih
            dan analisis data real-time.
          </p>

          <div className="flex flex-row gap-3 sm:gap-4 justify-center items-center">
            <Button
              size="lg"
              className="px-4 py-3 sm:px-8 sm:py-6 text-sm sm:text-lg bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
              onClick={() => onNavigate("register")}
            >
              Mulai Sekarang
              <ArrowRight className="ml-1 sm:ml-2 w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="px-4 py-3 sm:px-8 sm:py-6 text-sm sm:text-lg border-green-200 text-green-700 hover:bg-green-50"
            >
              Pelajari Lebih Lanjut
            </Button>
          </div>
        </div>

        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="hidden md:block absolute top-20 left-10 w-20 h-20 bg-green-100 rounded-full animate-float opacity-60"></div>
          <div
            className="hidden md:block absolute top-40 right-20 w-16 h-16 bg-blue-100 rounded-full animate-float opacity-60"
            style={{ animationDelay: "1s" }}
          ></div>
          <div
            className="hidden md:block absolute bottom-40 left-20 w-12 h-12 bg-purple-100 rounded-full animate-float opacity-60"
            style={{ animationDelay: "2s" }}
          ></div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12 sm:py-16">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
            Solusi IoT Pertanian Terdepan
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Produk unggulan yang dirancang khusus untuk membantu petani modern
            meningkatkan produktivitas dan efisiensi melalui teknologi AI dan
            IoT.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto mb-8 sm:mb-12">
          {products.map((product) => (
            <Card
              key={product.name}
              className="glass-card hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-0"
            >
              <CardHeader className="text-center">
                <div
                  className={`w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 mx-auto ${product.bgColor} rounded-2xl flex items-center justify-center mb-3 sm:mb-4`}
                >
                  <product.icon className={`w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 ${product.color}`} />
                </div>
                <CardTitle className="text-xl sm:text-2xl text-gray-900">
                  {product.name}
                </CardTitle>
                <CardDescription className="text-base sm:text-lg text-gray-600">
                  {product.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 sm:space-y-3">
                  {product.features.map((feature, featureIndex) => (
                    <li
                      key={featureIndex}
                      className="flex items-center space-x-2 sm:space-x-3"
                    >
                      <div
                        className={`w-2 h-2 ${product.bgColor} rounded-full flex-shrink-0`}
                      ></div>
                      <span className="text-sm sm:text-base text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="bg-gradient-to-r from-green-500 to-green-600 py-12 sm:py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-3 gap-3 sm:gap-6 md:gap-8 text-center text-white">
            <div>
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2">1000+</div>
              <div className="text-[10px] sm:text-sm md:text-base text-green-100">Petani Terdaftar</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2">5000+</div>
              <div className="text-[10px] sm:text-sm md:text-base text-green-100">Perangkat Aktif</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2">25%</div>
              <div className="text-[10px] sm:text-sm md:text-base text-green-100">Peningkatan Hasil Panen</div>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12 sm:py-16 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
            Siap Memulai Revolusi Pertanian Digital?
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 mb-6 sm:mb-8 leading-relaxed">
            Bergabunglah dengan ribuan petani yang telah merasakan manfaat
            teknologi AI untuk pertanian modern.
          </p>
          <Button
            size="lg"
            className="px-6 py-4 sm:px-8 sm:py-6 text-sm sm:text-lg bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
            onClick={() => onNavigate("register")}
          >
            Mulai Gratis Sekarang
          </Button>
        </div>
      </section>

      <footer className="bg-gray-900 text-white py-10 sm:py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            <div className="col-span-2 md:col-span-1">
              <Logo size="md" variant="white" className="mb-3 sm:mb-4" />
              <p className="text-sm sm:text-base text-gray-400">
                Platform IoT pertanian terdepan untuk petani modern Indonesia.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Produk</h4>
              <ul className="space-y-2 text-sm sm:text-base text-gray-400">
                <li>Agriino</li>
                <li>Agriimeter</li>
                <li>Greenhouse Compax</li>
                <li>SkyVera</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Perusahaan</h4>
              <ul className="space-y-2 text-sm sm:text-base text-gray-400">
                <li>Tentang Kami</li>
                <li>Kontak</li>
                <li>Karir</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Kontak</h4>
              <div className="text-sm sm:text-base text-gray-400 space-y-2">
                <p>PT Precision Agriculture Indonesia</p>
                <p>Jakarta, Indonesia</p>
                <p>info@agriiweb.com</p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center text-xs sm:text-sm text-gray-400">
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

LandingPage.propTypes = {
  onNavigate: PropTypes.func.isRequired,
};

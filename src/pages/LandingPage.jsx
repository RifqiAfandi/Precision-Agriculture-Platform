import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Cloud, Home, ArrowRight, Leaf, ChevronDown, ArrowUp } from "lucide-react";
import { Logo } from "@/components/common/Logo";

export function LandingPage({ onNavigate }) {
  const [showBackToTop, setShowBackToTop] = useState(false);

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

  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";

    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      document.documentElement.style.scrollBehavior = "";
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 relative scroll-smooth">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/75 dark:bg-slate-800/75 backdrop-blur-md border-b border-green-100 dark:border-slate-700">
        <div className="container mx-auto flex justify-between items-center px-6 py-4">
          <Logo size="lg" variant="default" textClassName="black" />
          <div className="space-x-4">
            <Button
              className={"px-5 py-4 text-md bg-gradient-to-r"}
              variant="ghost"
              onClick={() => onNavigate("login")}
            >
              Login
            </Button>
            <Button
              className="px-5 py-4 text-md bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
              onClick={() => onNavigate("register")}
            >
              Register
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="hero" className="min-h-screen flex flex-col justify-center items-center relative px-4 sm:px-6 lg:px-8 pt-20">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-gray-100 mb-4 sm:mb-6 leading-tight animate-fade-in">
              Precision Agriculture Platform
            </h1>
            <p className="text-xl sm:text-2xl md:text-3xl text-gray-600 dark:text-gray-300 mb-4 sm:mb-6 leading-relaxed font-medium animate-fade-in-delay-1">
              Smart Farming Made Simple
            </p>
            <p className="text-base sm:text-lg md:text-xl text-gray-500 dark:text-gray-400 mb-8 sm:mb-12 max-w-3xl mx-auto leading-relaxed animate-fade-in-delay-2">
              Platform monitoring IoT pertanian berbasis AI yang membantu petani
              modern mengoptimalkan hasil panen dengan teknologi sensor canggih
              dan analisis data real-time.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-delay-3">
              <Button
                size="lg"
                className="w-full sm:w-auto px-8 py-6 text-lg bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={() => onNavigate("register")}
              >
                Mulai Sekarang
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto px-8 py-6 text-lg border-2 border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 hover:bg-green-50 dark:hover:bg-slate-700 shadow hover:shadow-lg transition-all duration-300"
                onClick={() => scrollToSection("solutions")}
              >
                Pelajari Lebih Lanjut
              </Button>
            </div>
          </div>
        </div>

        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
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

        {/* Scroll indicator */}
        <button
          onClick={() => scrollToSection("solutions")}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce cursor-pointer bg-white/50 dark:bg-slate-700/50 hover:bg-white/80 dark:hover:bg-slate-600/80 rounded-full p-3 transition-all duration-300 shadow-md"
          aria-label="Scroll to next section"
        >
          <ChevronDown className="w-6 h-6 text-gray-600" />
        </button>
      </section>

      {/* Solutions Section */}
      <section id="solutions" className="min-h-screen flex flex-col justify-center items-center relative px-4 sm:px-6 lg:px-8 py-20 bg-white dark:bg-slate-900">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16 sm:mb-20">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-6">
              Solusi IoT Pertanian Terdepan
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Produk unggulan yang dirancang khusus untuk membantu petani modern
              meningkatkan produktivitas dan efisiensi melalui teknologi AI dan
              IoT.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-10">
            {products.map((product, index) => (
              <Card
                key={product.name}
                className="glass-card hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-0 animate-slide-up"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <CardHeader className="text-center pb-4">
                  <div
                    className={`w-16 h-16 mx-auto ${product.bgColor} rounded-2xl flex items-center justify-center mb-4 transition-transform hover:scale-110 duration-300`}
                  >
                    <product.icon className={`w-8 h-8 ${product.color}`} />
                  </div>
                  <CardTitle className="text-2xl text-gray-900 dark:text-gray-100 mb-2">
                    {product.name}
                  </CardTitle>
                  <CardDescription className="text-lg text-gray-600 dark:text-gray-300">
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
                          className={`w-2 h-2 ${product.bgColor} rounded-full flex-shrink-0`}
                        ></div>
                        <span className="text-base text-gray-700 dark:text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <button
          onClick={() => scrollToSection("cta")}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce cursor-pointer bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 rounded-full p-3 transition-all duration-300 shadow-md"
          aria-label="Scroll to next section"
        >
          <ChevronDown className="w-6 h-6 text-gray-600" />
        </button>
      </section>

      {/* Statistics Section */}
      <section id="statistics" className="bg-gradient-to-r from-green-500 to-green-600 py-12 sm:py-16 mt-16 sm:mt-20">
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

      {/* CTA Section */}
      <section id="cta" className="min-h-screen flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-20 bg-gradient-to-br from-green-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 relative">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl p-8 sm:p-12 lg:p-16 border border-gray-100 dark:border-slate-700">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-6">
              Siap Memulai Revolusi Pertanian Digital?
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-10 leading-relaxed max-w-2xl mx-auto">
              Bergabunglah dengan ribuan petani yang telah merasakan manfaat
              teknologi AI untuk pertanian modern.
            </p>
            <Button
              size="lg"
              className="px-10 py-6 text-lg bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={() => onNavigate("register")}
            >
              Mulai Gratis Sekarang
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
          <div className="absolute top-20 left-10 w-32 h-32 bg-green-100 rounded-full opacity-50 blur-2xl"></div>
          <div className="absolute bottom-20 right-10 w-32 h-32 bg-blue-100 rounded-full opacity-50 blur-2xl"></div>
        </div>
      </section>

      <footer className="bg-gray-900 text-white py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10 mb-12">
            <div className="col-span-2 md:col-span-1">
              <Logo size="md" variant="white" className="mb-4" />
              <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
                Platform IoT pertanian terdepan untuk petani modern Indonesia.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-base sm:text-lg">Produk</h4>
              <ul className="space-y-3 text-sm sm:text-base text-gray-400">
                <li className="hover:text-white transition-colors cursor-pointer">Agriino</li>
                <li className="hover:text-white transition-colors cursor-pointer">Agriimeter</li>
                <li className="hover:text-white transition-colors cursor-pointer">Greenhouse Compax</li>
                <li className="hover:text-white transition-colors cursor-pointer">SkyVera</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-base sm:text-lg">Perusahaan</h4>
              <ul className="space-y-3 text-sm sm:text-base text-gray-400">
                <li className="hover:text-white transition-colors cursor-pointer">Tentang Kami</li>
                <li className="hover:text-white transition-colors cursor-pointer">Kontak</li>
                <li className="hover:text-white transition-colors cursor-pointer">Karir</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-base sm:text-lg">Kontak</h4>
              <div className="text-sm sm:text-base text-gray-400 space-y-3">
                <p>PT Precision Agriculture Indonesia</p>
                <p>Jakarta, Indonesia</p>
                <p className="hover:text-white transition-colors cursor-pointer">info@agriiweb.com</p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
            <p>
              &copy; 2024 PT Precision Agriculture Indonesia. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 bg-green-600 hover:bg-green-700 text-white p-4 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 animate-fade-in"
          aria-label="Back to top"
        >
          <ArrowUp className="w-6 h-6" />
        </button>
      )}
    </div>
  );
}

LandingPage.propTypes = {
  onNavigate: PropTypes.func.isRequired,
};

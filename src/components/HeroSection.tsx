"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

interface HeroSectionProps {
  onAppointmentClick?: () => void;
}

export default function HeroSection({ onAppointmentClick }: HeroSectionProps) {
  const { t } = useTranslation("home");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  const slides = [
    {
      image: "/hero-1.jpg",
      titleKey: "hero.slide1.title",
      subtitleKey: "hero.slide1.subtitle",
      categoryKey: "hero.slide1.category"
    },
    {
      image: "/hero-2.jpg", 
      titleKey: "hero.slide2.title",
      subtitleKey: "hero.slide2.subtitle",
      categoryKey: "hero.slide2.category"
    },
    {
      image: "/hero-3.jpg",
      titleKey: "hero.slide3.title", 
      subtitleKey: "hero.slide3.subtitle",
      categoryKey: "hero.slide3.category"
    }
  ];

  const currentSlideData = slides[currentSlide];
  const title = t(currentSlideData.titleKey);
  const subtitle = t(currentSlideData.subtitleKey);
  const category = t(currentSlideData.categoryKey);

  useEffect(() => {
    setIsLoaded(true);
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length, t]);

  return (
    <section id="home" className="relative h-screen overflow-hidden">
      {/* Background Slideshow */}
      <div className="absolute inset-0">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="absolute inset-0 bg-black/40 z-10" />
            <img
              src={slide.image}
              alt={t(slide.titleKey)}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = `data:image/svg+xml,%3Csvg width='1920' height='1080' xmlns='http://www.w3.org/2000/svg'%3E%3Crect fill='%23f3f4f6' width='1920' height='1080'/%3E%3Ctext fill='%239ca3af' font-family='Arial' font-size='24' x='50%25' y='50%25' text-anchor='middle' dy='.3em'%3E${category}%3C/text%3E%3C/svg%3E`;
              }}
            />
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-20 h-full flex items-center justify-center">
        <div className="text-center text-white px-4 sm:px-6 lg:px-8">
          <div className={`transform transition-all duration-1000 delay-300 ${
            isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            <div className="mb-6">
              <span className="inline-block px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-sm font-medium tracking-wide uppercase">
                {category}
              </span>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              <span className="block">{title.split(' ').slice(0, 2).join(' ')}</span>
              <span className="block text-blue-300">{title.split(' ').slice(2).join(' ')}</span>
            </h1>
            
            <p className="text-xl md:text-2xl lg:text-3xl mb-8 max-w-4xl mx-auto font-light leading-relaxed">
              {subtitle}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button 
                onClick={onAppointmentClick}
                className="group relative px-10 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white text-lg font-bold rounded-full hover:shadow-2xl transition-all duration-500 transform hover:scale-110 overflow-hidden"
              >
                <span className="relative z-10 flex items-center space-x-3">
                  <span>{t("cta.appointment")}</span>
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 transform translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
                <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              </button>
              
              <button className="group relative px-10 py-4 bg-transparent border-2 border-white text-white text-lg font-bold rounded-full hover:bg-white hover:text-gray-900 transition-all duration-500 transform hover:scale-110 overflow-hidden">
                <span className="relative z-10 flex items-center space-x-3">
                  <span>{t("cta.portfolio")}</span>
                  <svg className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </span>
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30">
        <div className="flex space-x-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`relative h-3 transition-all duration-500 ${
                index === currentSlide 
                  ? 'w-12' 
                  : 'w-3'
              }`}
            >
              <div className={`absolute inset-0 rounded-full transition-all duration-500 ${
                index === currentSlide 
                  ? 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 shadow-lg shadow-blue-500/50' 
                  : 'bg-white/40 hover:bg-white/60'
              }`}></div>
              {index === currentSlide && (
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-ping opacity-75"></div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 right-8 z-30 animate-bounce">
        <svg className="w-6 h-6 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
}

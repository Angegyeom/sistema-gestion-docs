import React from 'react';
import AppHeader from "@/components/layout/app-header";

export default function PresentacionesPage() {
  const presentation = {
    icon: '🎯',
    title: 'Presentación Ejecutiva CPV 2025',
    description: 'Presentación integral del proyecto CPV 2025 con avances, metodología, cronograma y resultados preliminares para directivos y stakeholders.',
    updated: '14 Sep 2025',
    views: 127,
    slides: 45,
    url: 'https://docs.google.com/presentation/d/1QtJZBfiZseNSYNgRVbhBd21aR0XObPS8PMOW7x1nBaA/edit?usp=sharing',
    embedUrl: 'https://docs.google.com/presentation/d/1QtJZBfiZseNSYNgRVbhBd21aR0XObPS8PMOW7x1nBaA/embed?start=false&loop=false&delayms=3000',
    presentUrl: 'https://docs.google.com/presentation/d/1QtJZBfiZseNSYNgRVbhBd21aR0XObPS8PMOW7x1nBaA/present?usp=sharing'
  };

  return (
    <>
      <AppHeader />
      <div className="max-w-7xl mx-auto p-5 md:p-10">
        <div className="text-center text-white mb-10">
          <h1 className="text-4xl font-bold mb-2">CENTRO DE PRESENTACIONES</h1>
        </div>

        <div className="bg-white/95 rounded-2xl p-7 md:p-10 shadow-lg backdrop-blur-md">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            
            <div className="order-2 md:order-1">
              <div className="text-5xl mb-5">{presentation.icon}</div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-5">{presentation.title}</h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">{presentation.description}</p>
              
              <div className="space-y-2 text-gray-700 mb-8">
                <div className="flex items-center gap-3">
                  <span className="text-lg">📅</span>
                  <span>Actualizada: <strong>{presentation.updated}</strong></span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-lg">👁️</span>
                  <span><strong>{presentation.views}</strong> visualizaciones</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-lg">📊</span>
                  <span><strong>{presentation.slides}</strong> diapositivas</span>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <a href={presentation.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-green-500 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                  <span>🔗</span>
                  Abrir en Google Slides
                </a>
                <a href={presentation.presentUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#7AADCF] to-[#4A7BA7] text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                  <span>📱</span>
                  Modo Presentación
                </a>
              </div>
            </div>

            <div className="order-1 md:order-2 h-64 md:h-full min-h-[300px] bg-gray-100 rounded-lg overflow-hidden shadow-inner border">
              <iframe
                src={presentation.embedUrl}
                frameBorder="0"
                width="100%"
                height="100%"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

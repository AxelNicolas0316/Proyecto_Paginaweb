"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Zap } from "lucide-react";

const ofertas = [
  {
    id: 1,
    titulo: "Taladros Industriales",
    descuento: "30% OFF",
    imagen: "🔨",
    color: "from-blue-600 to-indigo-600"
  },
  {
    id: 2,
    titulo: "Cascos de Seguridad",
    descuento: "2x1",
    imagen: "⛑️",
    color: "from-yellow-500 to-orange-500"
  },
  {
    id: 3,
    titulo: "Guantes Profesionales",
    descuento: "40% OFF",
    imagen: "🧤",
    color: "from-green-500 to-emerald-500"
  },
  {
    id: 4,
    titulo: "Kit de Herramientas",
    descuento: "35% OFF",
    imagen: "🧰",
    color: "from-purple-500 to-pink-500"
  },
];

export default function CarruselOfertas() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % ofertas.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % ofertas.length);
  };

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + ofertas.length) % ofertas.length);
  };

  return (
    <div className="relative w-full overflow-hidden rounded-3xl shadow-2xl">
      <div
        className="flex transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {ofertas.map((oferta) => (
          <div
            key={oferta.id}
            className={`w-full flex-shrink-0 bg-gradient-to-r ${oferta.color} p-12 text-white`}
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="text-6xl mb-4 block animate-bounce-slow">{oferta.imagen}</span>
                <h3 className="text-3xl font-bold mb-2">{oferta.titulo}</h3>
                <p className="text-5xl font-black text-yellow-300 mb-4">{oferta.descuento}</p>
                <button className="bg-white text-gray-900 px-6 py-3 rounded-full font-bold hover:bg-gray-100 transition-colors flex items-center space-x-2">
                  <Zap size={20} />
                  <span>Aprovechar oferta</span>
                </button>
              </div>
              <div className="text-9xl opacity-20">{oferta.imagen}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Botones de navegación */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full backdrop-blur-sm transition-all"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full backdrop-blur-sm transition-all"
      >
        <ChevronRight size={24} />
      </button>

      {/* Indicadores */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
        {ofertas.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`w-2 h-2 rounded-full transition-all ${
              idx === currentIndex
                ? 'w-8 bg-white'
                : 'bg-white/50 hover:bg-white/80'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
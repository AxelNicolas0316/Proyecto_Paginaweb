"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User, Zap, Wrench, Shield, Clock, Package } from "lucide-react";

type Mensaje = {
  id: number;
  texto: string;
  emisor: "bot" | "usuario";
  opciones?: string[];
};

export default function ChatBot() {
  const [abierto, setAbierto] = useState(false);
  const [mensajes, setMensajes] = useState<Mensaje[]>([
    {
      id: 1,
      texto: "¡Hola! Soy el asistente virtual de Suministros y Suministros Ecuador 🛠️",
      emisor: "bot",
    },
    {
      id: 2,
      texto: "¿En qué puedo ayudarte hoy?",
      emisor: "bot",
      opciones: ["Ver productos", "Precios", "Envíos", "Horarios", "WhatsApp"]
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [escribiendo, setEscribiendo] = useState(false);
  const mensajesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    mensajesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [mensajes]);

  useEffect(() => {
    if (abierto) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    }
  }, [abierto]);

  const procesarRespuesta = (texto: string) => {
    const mensajeLower = texto.toLowerCase();
    
    setEscribiendo(true);
    
    setTimeout(() => {
      let respuesta = "";
      let opciones: string[] | undefined = [];

      if (mensajeLower.includes("producto") || mensajeLower.includes("comprar") || mensajeLower.includes("catálogo")) {
        respuesta = "🔧 Tenemos una amplia gama de productos:\n\n• Herramientas Industriales\n• Seguridad Ocupacional\n• Productos de Aseo\n• Ferretería en General\n• Equipos Especializados\n\n¿Qué categoría te interesa?";
        opciones = ["Herramientas", "Seguridad", "Aseo", "Ferretería", "Equipos"];
      }
      else if (mensajeLower.includes("precio") || mensajeLower.includes("costo") || mensajeLower.includes("valor")) {
        respuesta = "💰 Los precios varían según el producto. Por ejemplo:\n\n• Taladros: desde $120\n• Cascos de seguridad: desde $35\n• Guantes industriales: desde $8\n\n¿Quieres una cotización específica?";
        opciones = ["Cotizar herramienta", "Cotizar seguridad", "Hablar con asesor"];
      }
      else if (mensajeLower.includes("envío") || mensajeLower.includes("entrega") || mensajeLower.includes("domicilio")) {
        respuesta = "🚚 Realizamos envíos a TODO ECUADOR:\n\n• Quito: 24 horas\n• Guayaquil: 24-48 horas\n• Cuenca: 48 horas\n• Resto del país: 2-3 días\n\n📦 Envío gratis en compras > $200";
        opciones = ["Cotizar envío", "Ver promociones", "WhatsApp"];
      }
      else if (mensajeLower.includes("horario") || mensajeLower.includes("atención") || mensajeLower.includes("abren")) {
        respuesta = "⏰ Nuestro horario de atención:\n\n• Lunes a Viernes: 8:00 - 18:00\n• Sábados: 8:00 - 13:00\n• Domingos: Cerrado\n\n🛒 La tienda online está abierta 24/7";
        opciones = ["Productos", "WhatsApp", "Ubicación"];
      }
      else if (mensajeLower.includes("whatsapp") || mensajeLower.includes("asesor") || mensajeLower.includes("contactar")) {
        respuesta = "📱 Puedes contactarnos directamente:\n\n• WhatsApp: +593 99 999 9999\n• Teléfono: 02 2555-789\n• Email: ventas@suministros.com.ec\n\n¿Quieres que te comunique ahora?";
        opciones = ["Abrir WhatsApp", "Llamar ahora", "Volver al inicio"];
      }
      else if (mensajeLower.includes("gracias") || mensajeLower.includes("graciela")) {
        respuesta = "😊 ¡Con gusto! Para eso estamos. ¿Hay algo más en lo que pueda ayudarte?";
        opciones = ["Productos", "Precios", "Envíos", "WhatsApp"];
      }
      else if (mensajeLower.includes("hola") || mensajeLower.includes("buenos") || mensajeLower.includes("saludos")) {
        respuesta = "👋 ¡Hola! Encantado de saludarte. ¿En qué puedo asistirte hoy?";
        opciones = ["Ver catálogo", "Precios", "Envíos", "Horarios"];
      }
      else if (mensajeLower.includes("herramienta")) {
        respuesta = "🔨 Contamos con herramientas de las mejores marcas:\n\n• Taladros y rotomartillos\n• Esmeriles y pulidoras\n• Llaves y dados\n• Destornilladores profesionales\n\n¿Buscas algo específico?";
        opciones = ["Ver taladros", "Ver esmeriles", "Ver todo"];
      }
      else if (mensajeLower.includes("seguridad")) {
        respuesta = "⛑️ Protegemos a tus colaboradores con:\n\n• Cascos de seguridad\n• Gafas protectoras\n• Guantes industriales\n• Arneses y líneas de vida\n• Señalización";
        opciones = ["Ver cascos", "Ver guantes", "Cotizar lote"];
      }
      else if (mensajeLower.includes("aseo")) {
        respuesta = "🧹 Productos de aseo profesional:\n\n• Dispensadores de jabón\n• Papel higiénico industrial\n• Químicos de limpieza\n• Escobas y traperos\n• Recogedores";
        opciones = ["Ver dispensadores", "Ver químicos", "Cotizar"];
      }
      else if (mensajeLower.includes("ferretería")) {
        respuesta = "🔩 Todo en ferretería:\n\n• Tornillería en acero\n• Anclajes y expansiones\n• Abrasivos y discos\n• Adhesivos y selladores\n• Pintura industrial";
        opciones = ["Ver tornillos", "Ver anclajes", "Ver discos"];
      }
      else {
        respuesta = "🤔 No estoy seguro de entenderte. ¿Podrías ser más específico?\n\nPuedo ayudarte con:\n• Información de productos\n• Precios y cotizaciones\n• Envíos a todo Ecuador\n• Horarios de atención\n• Contacto con asesores";
        opciones = ["Ver productos", "Precios", "Envíos", "Horarios", "WhatsApp"];
      }

      setMensajes(prev => [...prev, {
        id: prev.length + 1,
        texto: respuesta,
        emisor: "bot",
        opciones: opciones
      }]);
      setEscribiendo(false);
    }, 1000);
  };

  const enviarMensaje = (texto?: string) => {
    const mensajeTexto = texto || inputValue;
    if (!mensajeTexto.trim()) return;

    setMensajes(prev => [...prev, {
      id: prev.length + 1,
      texto: mensajeTexto,
      emisor: "usuario"
    }]);

    setInputValue("");
    procesarRespuesta(mensajeTexto);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      enviarMensaje();
    }
  };

  const handleOpcionClick = (opcion: string) => {
    setMensajes(prev => [...prev, {
      id: prev.length + 1,
      texto: opcion,
      emisor: "usuario"
    }]);
    procesarRespuesta(opcion);
  };

  const handleWhatsAppClick = () => {
    window.open("https://wa.me/593999999999", "_blank");
  };

  return (
    <>
      {/* Botón flotante del chat */}
      <button
        onClick={() => setAbierto(!abierto)}
        className={`fixed bottom-6 left-6 z-50 p-4 rounded-full shadow-2xl transition-all transform hover:scale-110 ${
          abierto ? 'bg-red-500 rotate-90' : 'bg-gradient-to-r from-blue-600 to-indigo-600 animate-bounce-slow'
        }`}
      >
        {abierto ? <X size={28} className="text-white" /> : <MessageCircle size={28} className="text-white" />}
      </button>

      {/* Ventana del chat */}
      {abierto && (
        <div className="fixed bottom-24 left-6 z-50 w-96 bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200 animate-scale-in">
          {/* Header del chat */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center">
                  <Bot size={28} className="text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
              </div>
              <div>
                <h3 className="font-bold">Asistente Virtual</h3>
                <p className="text-xs text-blue-100">Online · Responde al instante</p>
              </div>
            </div>
          </div>

          {/* Mensajes */}
          <div className="h-96 overflow-y-auto p-4 bg-gray-50">
            {mensajes.map((msg) => (
              <div
                key={msg.id}
                className={`mb-4 flex ${msg.emisor === 'usuario' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl p-3 ${
                    msg.emisor === 'usuario'
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-br-none'
                      : 'bg-white text-gray-800 rounded-bl-none shadow-md'
                  }`}
                >
                  <p className="text-sm whitespace-pre-line">{msg.texto}</p>
                  
                  {/* Opciones del bot */}
                  {msg.opciones && msg.emisor === 'bot' && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {msg.opciones.map((opcion, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleOpcionClick(opcion)}
                          className="text-xs px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors"
                        >
                          {opcion}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {escribiendo && (
              <div className="flex justify-start mb-4">
                <div className="bg-white rounded-2xl p-3 shadow-md">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={mensajesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 bg-white border-t">
            <div className="flex space-x-2">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Escribe tu mensaje..."
                className="flex-1 px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-600 transition-colors"
              />
              <button
                onClick={() => enviarMensaje()}
                disabled={!inputValue.trim()}
                className="p-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={20} />
              </button>
            </div>
            
            {/* Botón rápido de WhatsApp */}
            <button
              onClick={handleWhatsAppClick}
              className="mt-2 w-full flex items-center justify-center space-x-2 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors text-sm"
            >
              <Zap size={16} />
              <span>Contactar por WhatsApp</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
"use client";

import { X, ShoppingCart, Trash2, Minus, Plus } from "lucide-react";
import { useCarrito } from "../context/CarritoContext";
import { useState } from "react";

export default function CarritoLateral({ 
  isOpen, 
  onClose 
}: { 
  isOpen: boolean; 
  onClose: () => void;
}) {
  const { carrito, quitarDelCarrito, vaciarCarrito, totalItems, totalPrecio } = useCarrito();
  const [procesando, setProcesando] = useState(false);

  const handleCheckout = () => {
    setProcesando(true);
    // Aquí iría la integración con pasarela de pagos
    setTimeout(() => {
      alert("¡Gracias por tu compra! Pronto te contactaremos para confirmar el pedido.");
      vaciarCarrito();
      setProcesando(false);
      onClose();
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity"
        onClick={onClose}
      />

      {/* Carrito Lateral */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 transform transition-transform duration-500 ease-out animate-slide-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <div className="flex items-center space-x-2">
            <ShoppingCart size={24} />
            <h2 className="text-xl font-bold">Tu Carrito</h2>
            {totalItems > 0 && (
              <span className="bg-yellow-400 text-gray-900 px-2 py-1 rounded-full text-sm font-bold">
                {totalItems} items
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Contenido */}
        <div className="p-6 h-[calc(100vh-180px)] overflow-y-auto">
          {carrito.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-500">
              <ShoppingCart size={64} className="mb-4 opacity-30" />
              <p className="text-lg">Tu carrito está vacío</p>
              <p className="text-sm">¡Agrega productos para comenzar!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {carrito.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl hover:shadow-md transition-shadow"
                >
                  {/* Imagen */}
                  <div className="w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg overflow-hidden">
                    {item.imagenUrl ? (
                      <img
                        src={item.imagenUrl}
                        alt={item.nombre}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-gray-500">📦</span>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <h3 className="font-semibold">{item.nombre}</h3>
                    <p className="text-blue-600 font-bold">
                      ${(item.precio * item.cantidad).toLocaleString()}
                    </p>
                    <div className="flex items-center space-x-2 mt-2">
                      <button
                        onClick={() => quitarDelCarrito(item.id)}
                        className="p-1 hover:bg-gray-200 rounded transition-colors"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="w-8 text-center font-semibold">
                        {item.cantidad}
                      </span>
                      <button
                        onClick={() => quitarDelCarrito(item.id)}
                        disabled={item.cantidad >= item.stock}
                        className="p-1 hover:bg-gray-200 rounded transition-colors disabled:opacity-30"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Precio unitario */}
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Unitario</p>
                    <p className="font-semibold">${item.precio.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {carrito.length > 0 && (
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-white border-t">
            <div className="space-y-4">
              <div className="flex justify-between items-center text-lg">
                <span className="font-semibold">Total:</span>
                <span className="font-bold text-2xl text-blue-600">
                  ${totalPrecio.toLocaleString()}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={vaciarCarrito}
                  className="px-4 py-3 border-2 border-red-500 text-red-500 rounded-xl hover:bg-red-50 transition-colors font-semibold flex items-center justify-center space-x-2"
                >
                  <Trash2 size={20} />
                  <span>Vaciar</span>
                </button>
                <button
                  onClick={handleCheckout}
                  disabled={procesando}
                  className={`px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold text-lg transition-all transform hover:scale-105 ${
                    procesando ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {procesando ? "Procesando..." : "Comprar"}
                </button>
              </div>
              <p className="text-xs text-center text-gray-500">
                🚚 Envío gratis a toda Colombia en compras mayores a $200.000
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
"use client";

import React, { createContext, useState, useContext, useEffect } from "react";

type Producto = {
  id: number;
  nombre: string;
  precio: number;
  stock: number;
  imagenUrl: string | null;
};

type CarritoItem = Producto & { cantidad: number };

type CarritoContextType = {
  carrito: CarritoItem[];
  agregarAlCarrito: (producto: Producto) => void;
  quitarDelCarrito: (id: number) => void;
  vaciarCarrito: () => void;
  totalItems: number;
  totalPrecio: number;
};

const CarritoContext = createContext<CarritoContextType | undefined>(undefined);

export const CarritoProvider = ({ children }: { children: React.ReactNode }) => {
  const [carrito, setCarrito] = useState<CarritoItem[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPrecio, setTotalPrecio] = useState(0);

  // Cargar carrito desde localStorage al iniciar
  useEffect(() => {
    const carritoGuardado = localStorage.getItem("carrito");
    if (carritoGuardado) {
      setCarrito(JSON.parse(carritoGuardado));
    }
  }, []);

  // Guardar carrito en localStorage cuando cambie
  useEffect(() => {
    localStorage.setItem("carrito", JSON.stringify(carrito));
    
    // Calcular totales
    const items = carrito.reduce((acc, item) => acc + item.cantidad, 0);
    const precio = carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
    
    setTotalItems(items);
    setTotalPrecio(precio);
  }, [carrito]);

  const agregarAlCarrito = (producto: Producto) => {
    setCarrito((prev) => {
      const existente = prev.find((item) => item.id === producto.id);
      
      if (existente) {
        return prev.map((item) =>
          item.id === producto.id
            ? { ...item, cantidad: Math.min(item.cantidad + 1, producto.stock) }
            : item
        );
      } else {
        return [...prev, { ...producto, cantidad: 1 }];
      }
    });

    // Animación de confirmación (se puede implementar después)
  };

  const quitarDelCarrito = (id: number) => {
    setCarrito((prev) => {
      const existente = prev.find((item) => item.id === id);
      
      if (existente && existente.cantidad > 1) {
        return prev.map((item) =>
          item.id === id ? { ...item, cantidad: item.cantidad - 1 } : item
        );
      } else {
        return prev.filter((item) => item.id !== id);
      }
    });
  };

  const vaciarCarrito = () => setCarrito([]);

  return (
    <CarritoContext.Provider
      value={{
        carrito,
        agregarAlCarrito,
        quitarDelCarrito,
        vaciarCarrito,
        totalItems,
        totalPrecio,
      }}
    >
      {children}
    </CarritoContext.Provider>
  );
};

export const useCarrito = () => {
  const context = useContext(CarritoContext);
  if (!context) {
    throw new Error("useCarrito debe usarse dentro de CarritoProvider");
  }
  return context;
};
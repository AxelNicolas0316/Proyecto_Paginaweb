"use client";
import { useAuth } from "./context/AuthContext";
import AuthModal from "./components/AuthModal";
import { User, LogOut } from "lucide-react";
import CarruselOfertas from "./components/CarruselOfertas";
import { useState, useEffect, useRef } from "react";
import { 
  ShoppingCart, 
  Search, 
  Menu, 
  X, 
  Truck, 
  Shield, 
  Clock,
  Star,
  ChevronRight,
  Wrench,
  HardHat,
  Droplet,
  Hammer,
  Settings,
  Phone,
  MapPin,
  Award,
  Zap,
  Heart,
  Eye,
  ArrowUp,
  Sparkles,
  Users,
  Package,
  ThumbsUp
} from "lucide-react";
import { useCarrito } from "./context/CarritoContext";
import CarritoLateral from "./components/CarritoLateral";

type Producto = {
  id: number;
  nombre: string;
  descripcion: string | null;
  precio: number;
  stock: number;
  categoria: string;
  imagenUrl: string | null;
};

export default function Home() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [cargando, setCargando] = useState(true);
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [carritoAbierto, setCarritoAbierto] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [activeCategory, setActiveCategory] = useState("todos");
  const [hoveredProduct, setHoveredProduct] = useState<number | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Producto | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [notificacion, setNotificacion] = useState({ show: false, mensaje: "" });
  
  // Auth state
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { usuario, logout } = useAuth();
  
  const heroRef = useRef<HTMLDivElement>(null);
  const productosRef = useRef<HTMLDivElement>(null);
  
  const { agregarAlCarrito, totalItems } = useCarrito();

  // Efecto para scroll
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    fetch("http://localhost:3001/api/productos")
      .then((res) => res.json())
      .then((data) => {
        setProductos(data);
        setCargando(false);
      })
      .catch(() => setCargando(false));
  }, []);

  const categorias = [
    { id: "todos", nombre: "Todos", icon: Sparkles, color: "from-blue-600 to-indigo-600" },
    { id: "herramientas", nombre: "Herramientas", icon: Wrench, color: "from-blue-500 to-blue-600" },
    { id: "seguridad", nombre: "Seguridad", icon: HardHat, color: "from-yellow-500 to-yellow-600" },
    { id: "aseo", nombre: "Aseo", icon: Droplet, color: "from-green-500 to-green-600" },
    { id: "ferreteria", nombre: "Ferretería", icon: Hammer, color: "from-orange-500 to-orange-600" },
    { id: "equipos", nombre: "Equipos", icon: Settings, color: "from-purple-500 to-purple-600" },
  ];

  const productosFiltrados = productos.filter((p) => {
    const matchesSearch = p.nombre.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === "todos" || 
      p.categoria.toLowerCase().includes(activeCategory.toLowerCase());
    return matchesSearch && matchesCategory;
  });

  const contactInfo = {
    telefono: "02 2555-789",
    whatsapp: "099 999 9999",
    direccion: "Av. 10 de Agosto N35-100, Quito - Ecuador",
    horario: "Lun-Vie: 8:00 - 18:00 | Sáb: 8:00 - 13:00"
  };

  const mostrarNotificacion = (mensaje: string) => {
    setNotificacion({ show: true, mensaje });
    setTimeout(() => setNotificacion({ show: false, mensaje: "" }), 3000);
  };

  const handleAgregarAlCarrito = (producto: Producto) => {
    if (!usuario) {
      mostrarNotificacion("⚠️ Debes iniciar sesión para añadir productos");
      setShowAuthModal(true);
      return;
    }

    agregarAlCarrito(producto);
    mostrarNotificacion(`✅ ${producto.nombre} agregado al carrito`);
    
    // Animación del botón
    const btn = document.getElementById(`btn-${producto.id}`);
    if (btn) {
      btn.classList.add("scale-110", "bg-green-600");
      setTimeout(() => {
        btn.classList.remove("scale-110", "bg-green-600");
      }, 200);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToProductos = () => {
    productosRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  if (cargando) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 flex items-center justify-center">
        <div className="text-center">
          {/* Animación de carga avanzada */}
          <div className="relative">
            <div className="w-24 h-24 border-4 border-white/20 border-t-yellow-400 rounded-full animate-spin mx-auto mb-4"></div>
            <div className="w-16 h-16 border-4 border-white/20 border-b-blue-400 rounded-full animate-spin mx-auto absolute inset-0 animate-ping opacity-50"></div>
          </div>
          <div className="space-y-2">
            <p className="text-white text-2xl font-light animate-pulse">Cargando experiencia</p>
            <p className="text-yellow-400 text-sm">Suministros y Suministros Ecuador</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Notificación flotante */}
      <div className={`fixed top-24 right-6 z-50 transform transition-all duration-500 ${notificacion.show ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}>
        <div className="bg-green-500 text-white px-6 py-3 rounded-xl shadow-2xl flex items-center space-x-2">
          <Sparkles className="animate-spin" size={20} />
          <span>{notificacion.mensaje}</span>
        </div>
      </div>

      {/* Barra superior animada */}
      <div className="relative bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className={`absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M30 5L55 30L30 55L5 30L30 5Z" stroke=\"white\" fill=\"none\" stroke-width=\"1\"/%3E%3C/svg%3E')] bg-repeat animate-pulse`}></div>
        </div>
        <div className="container mx-auto px-4 py-2 relative">
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center space-x-6">
              <a href={`tel:${contactInfo.telefono}`} className="flex items-center space-x-2 group">
                <Phone size={14} className="text-yellow-400 group-hover:rotate-12 transition-transform" />
                <span className="group-hover:text-yellow-300 transition-colors">{contactInfo.telefono}</span>
              </a>
              <span className="flex items-center space-x-2">
                <MapPin size={14} className="text-yellow-400 animate-bounce" />
                <span>{contactInfo.direccion}</span>
              </span>
            </div>
            <span className="flex items-center space-x-2">
              <Clock size={14} className="text-yellow-400 animate-pulse" />
              <span>{contactInfo.horario}</span>
            </span>
          </div>
        </div>
      </div>

      {/* HEADER CON EFECTO GLASS */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl shadow-lg border-b border-white/20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo con animación */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setMenuAbierto(!menuAbierto)}
                className="lg:hidden p-2 hover:bg-gray-100/50 rounded-xl transition-all"
              >
                {menuAbierto ? <X size={24} /> : <Menu size={24} />}
              </button>
              <div className="flex items-center space-x-3 group cursor-pointer" onClick={scrollToTop}>
                <div className="relative">
                  <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 via-blue-600 to-red-600 rounded-2xl flex items-center justify-center shadow-xl transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                    <span className="text-white font-bold text-2xl drop-shadow-lg">S&S</span>
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
                </div>
                <div>
                  <span className="font-bold text-2xl bg-gradient-to-r from-blue-800 to-indigo-800 bg-clip-text text-transparent hidden sm:block">
                    Suministros y Suministros
                  </span>
                  <span className="text-sm text-gray-500 hidden sm:block">Ecuador · Desde 1998</span>
                </div>
              </div>
            </div>

            {/* Buscador avanzado */}
            <div className="hidden md:block flex-1 max-w-xl mx-8">
              <div className="relative group">
                <input
                  type="text"
                  placeholder="🔍 Busca herramientas, seguridad, aseo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl border-2 border-gray-200 focus:border-blue-600 focus:outline-none transition-all bg-gray-50/50 focus:bg-white shadow-sm group-hover:shadow-md"
                />
                <Search className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-blue-600 transition-all group-hover:scale-110" size={20} />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-4 top-3.5 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>
            </div>

            {/* Acciones */}
            <div className="flex items-center space-x-3">
              {usuario ? (
                <>
                  <div className="hidden md:flex items-center space-x-2 px-3 py-2 bg-gray-100 rounded-xl">
                    <User size={18} className="text-blue-600" />
                    <span className="text-sm font-medium">{usuario?.nombre}</span>
                  </div>
                  <button
                    onClick={logout}
                    className="hidden md:flex items-center space-x-2 px-3 py-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all"
                    title="Cerrar sesión"
                  >
                    <LogOut size={18} />
                    <span className="text-sm">Salir</span>
                  </button>
                  {/* Versión móvil */}
                  <button
                    onClick={logout}
                    className="md:hidden p-2 hover:bg-gray-100 rounded-xl"
                    title="Cerrar sesión"
                  >
                    <LogOut size={20} />
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="hidden md:flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-105 shadow-md"
                >
                  <User size={18} />
                  <span>Iniciar Sesión</span>
                </button>
              )}

              {/* WhatsApp - Siempre visible */}
              <a
                href={`https://wa.me/593${contactInfo.whatsapp.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden lg:flex items-center space-x-2 px-4 py-2.5 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-all transform hover:scale-105 shadow-md"
              >
                <Zap size={18} className="animate-pulse" />
                <span>WhatsApp</span>
              </a>

              {/* Carrito */}
              <button
                onClick={() => setCarritoAbierto(true)}
                className="relative p-3 hover:bg-gray-100 rounded-2xl transition-all group"
              >
                <ShoppingCart size={24} className="group-hover:text-blue-600 transition-colors" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full animate-bounce shadow-lg">
                    {totalItems}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Menú móvil mejorado */}
          {menuAbierto && (
            <div className="lg:hidden py-4 border-t border-gray-100 bg-white/50 backdrop-blur-xl">
              {categorias.slice(1).map((cat) => {
                const Icon = cat.icon;
                return (
                  <a
                    key={cat.id}
                    href="#"
                    className="flex items-center justify-between py-3 px-4 hover:bg-gray-50 rounded-xl transition-all group"
                  >
                    <div className="flex items-center space-x-3">
                      <Icon size={20} className="text-gray-400 group-hover:text-blue-600 group-hover:rotate-12 transition-all" />
                      <span className="group-hover:text-blue-600 font-medium">{cat.nombre}</span>
                    </div>
                    <ChevronRight size={16} className="text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                  </a>
                );
              })}
            </div>
          )}
        </div>
      </header>

      {/* Carrusel de Ofertas */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <CarruselOfertas />
        </div>
      </section>

      {/* HERO SECTION INTERACTIVO */}
      <section ref={heroRef} className="relative bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900 text-white overflow-hidden">
        {/* Partículas animadas */}
        <div className="absolute inset-0 opacity-20">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white rounded-full animate-ping"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${3 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>

        <div className="container mx-auto px-4 py-24 md:py-32 relative">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge animado */}
            <div className="inline-block mb-8 animate-bounce-slow">
              <span className="bg-yellow-400/20 backdrop-blur-sm text-yellow-300 px-4 py-2 rounded-full text-sm border border-yellow-400/30">
                ⚡ OFERTAS ESPECIALES ⚡
              </span>
            </div>

            {/* Título con efecto máquina de escribir */}
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="block text-yellow-400 animate-pulse-slow">Soluciones Industriales</span>
              <span className="bg-gradient-to-r from-white via-yellow-200 to-white bg-clip-text text-transparent animate-gradient">
                para el Ecuador que trabaja
              </span>
            </h1>

            <p className="text-xl md:text-2xl mb-10 text-gray-200 max-w-2xl mx-auto animate-fade-in-up">
              Más de 25 años sirviendo a la industria ecuatoriana con los mejores estándares de calidad
            </p>

            {/* Botones interactivos */}
            <div className="flex flex-wrap gap-4 justify-center">
              <button
                onClick={scrollToProductos}
                className="group relative px-8 py-4 bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 rounded-2xl font-bold text-lg transition-all transform hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/30 overflow-hidden"
              >
                <span className="relative z-10 flex items-center space-x-2">
                  <Sparkles className="group-hover:animate-spin" size={20} />
                  <span>Explorar Productos</span>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </button>
              
              <a
                href={`https://wa.me/593${contactInfo.whatsapp.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative px-8 py-4 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white rounded-2xl font-bold text-lg transition-all border-2 border-white/50 hover:border-white overflow-hidden"
              >
                <span className="relative z-10 flex items-center space-x-2">
                  <Zap className="group-hover:animate-pulse" size={20} />
                  <span>Contactar Asesor</span>
                </span>
              </a>
            </div>

            {/* Estadísticas flotantes */}
            <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto mt-16">
              {[
                { icon: Users, value: "+5000", label: "Clientes" },
                { icon: Package, value: "+15000", label: "Envíos" },
                { icon: ThumbsUp, value: "98%", label: "Satisfacción" },
              ].map((stat, idx) => (
                <div key={idx} className="text-center group hover:scale-110 transition-transform">
                  <div className="w-12 h-12 mx-auto mb-2 bg-white/10 rounded-xl flex items-center justify-center group-hover:bg-white/20 group-hover:rotate-6 transition-all">
                    <stat.icon className="text-yellow-400" size={24} />
                  </div>
                  <div className="font-bold text-xl">{stat.value}</div>
                  <div className="text-xs text-gray-300">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FILTROS INTERACTIVOS */}
      <section className="py-12 bg-white sticky top-20 z-40 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-3">
            {categorias.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`group relative px-6 py-3 rounded-xl font-medium transition-all transform hover:scale-105 ${
                    isActive
                      ? `bg-gradient-to-r ${cat.color || 'from-blue-600 to-indigo-600'} text-white shadow-lg`
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <span className="flex items-center space-x-2">
                    <Icon size={18} className={isActive ? 'animate-bounce' : 'group-hover:rotate-12 transition-transform'} />
                    <span>{cat.nombre}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* PRODUCTOS CON EFECTOS 3D */}
      <section ref={productosRef} className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-blue-600 uppercase tracking-wider animate-pulse">Descubre</span>
            <h2 className="text-4xl font-bold mt-2 mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Productos Destacados
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {productosFiltrados.length} productos disponibles para tu negocio
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {productosFiltrados.slice(0, 8).map((producto, index) => (
              <div
                key={producto.id}
                className="group relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-transparent"
                style={{ animationDelay: `${index * 0.1}s` }}
                onMouseEnter={() => setHoveredProduct(producto.id)}
                onMouseLeave={() => setHoveredProduct(null)}
              >
                {/* Efecto de brillo */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 translate-x-[-200%] group-hover:translate-x-[200%] transition-all duration-1000"></div>

                {/* Badges animados */}
                <div className="absolute top-4 left-4 z-10 space-y-2">
                  <span className="inline-block bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg animate-pulse">
                    -20% OFF
                  </span>
                  {hoveredProduct === producto.id && (
                    <span className="inline-block bg-purple-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg animate-bounce">
                      ¡Oferta!
                    </span>
                  )}
                </div>

                <div className="absolute top-4 right-4 z-10">
                  <span className="bg-green-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center space-x-1 animate-pulse-slow">
                    <Truck size={12} />
                    <span>Envío gratis</span>
                  </span>
                </div>

                {/* Imagen con zoom y overlay */}
                <div className="relative h-64 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                  {producto.imagenUrl ? (
                    <img
                      src={producto.imagenUrl}
                      alt={producto.nombre}
                      className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-6xl animate-bounce-slow">🛠️</span>
                    </div>
                  )}

                  {/* Overlay con acciones */}
                  <div className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent transition-opacity duration-300 ${
                    hoveredProduct === producto.id ? 'opacity-100' : 'opacity-0'
                  }`}>
                    <div className="absolute bottom-4 left-4 right-4 space-y-2">
                      <button
                        onClick={() => {
                          setSelectedProduct(producto);
                          setShowModal(true);
                        }}
                        className="w-full bg-white/20 backdrop-blur-sm text-white py-3 rounded-xl font-semibold hover:bg-white/30 transition-all transform hover:scale-105 flex items-center justify-center space-x-2"
                      >
                        <Eye size={18} />
                        <span>Vista Rápida</span>
                      </button>
                      <button
                        onClick={() => handleAgregarAlCarrito(producto)}
                        disabled={producto.stock === 0}
                        id={`btn-${producto.id}`}
                        className={`w-full py-3 rounded-xl font-semibold transition-all transform hover:scale-105 flex items-center justify-center space-x-2 ${
                          producto.stock > 0
                            ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700"
                            : "bg-gray-400 text-gray-200 cursor-not-allowed"
                        }`}
                      >
                        <ShoppingCart size={18} />
                        <span>{producto.stock > 0 ? "Añadir" : "Agotado"}</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Información del producto */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                      {producto.categoria}
                    </span>
                    <div className="flex items-center space-x-1">
                      <Star size={14} className="text-yellow-400 fill-current animate-pulse-slow" />
                      <span className="text-sm font-semibold">4.8</span>
                      <span className="text-xs text-gray-400">(32)</span>
                    </div>
                  </div>

                  <h3 className="font-bold text-lg mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">
                    {producto.nombre}
                  </h3>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {producto.descripcion || "Producto de alta calidad para uso industrial"}
                  </p>

                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        ${producto.precio.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-400 line-through">${(producto.precio * 1.2).toFixed(0)}</p>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Heart
                        size={20}
                        className="text-gray-300 hover:text-red-500 cursor-pointer transition-colors hover:scale-110"
                      />
                    </div>
                  </div>

                  {/* Barra de stock */}
                  <div className="mt-4">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-500">Stock disponible</span>
                      <span className={`font-semibold ${
                        producto.stock > 5 ? 'text-green-600' : 'text-orange-600'
                      }`}>
                        {producto.stock} unidades
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          producto.stock > 5 ? 'bg-green-500' : 'bg-orange-500'
                        }`}
                        style={{ width: `${Math.min((producto.stock / 20) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Botón ver más */}
          {productosFiltrados.length > 8 && (
            <div className="text-center mt-12">
              <button className="group inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-bold hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-105 shadow-xl">
                <span>Ver {productosFiltrados.length - 8} productos más</span>
                <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* SECCIÓN DE CONFIANZA INTERACTIVA */}
      <section className="py-20 bg-gradient-to-br from-blue-900 to-indigo-900 text-white overflow-hidden relative">
        <div className="absolute inset-0 opacity-10">
          <div className={`absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M30 5L55 30L30 55L5 30L30 5Z" stroke=\"white\" fill=\"none\" stroke-width=\"1\"/%3E%3C/svg%3E')] bg-repeat animate-pulse-slow`}></div>
        </div>

        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Confían en nosotros</h2>
            <p className="text-xl text-blue-200">Más de 5000 empresas ecuatorianas nos eligen</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="text-center group hover:scale-110 transition-transform">
                <div className="w-24 h-24 mx-auto mb-4 bg-white/10 rounded-2xl flex items-center justify-center group-hover:bg-white/20 group-hover:rotate-6 transition-all">
                  <span className="text-4xl">🏭</span>
                </div>
                <p className="font-semibold">Empresa {i}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NEWSLETTER INTERACTIVO */}
      <section className="py-20 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-block mb-6 p-3 bg-blue-100 rounded-full animate-bounce-slow">
              <Sparkles className="text-blue-600" size={24} />
            </div>
            <h2 className="text-4xl font-bold mb-4">¿Listo para equipar tu negocio?</h2>
            <p className="text-xl text-gray-600 mb-8">
              Suscríbete y recibe ofertas exclusivas directamente en tu correo
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Tu correo electrónico"
                className="flex-1 px-6 py-4 rounded-2xl border-2 border-gray-200 focus:border-blue-600 focus:outline-none transition-all"
              />
              <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-bold hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-105 shadow-xl group">
                <span className="flex items-center space-x-2">
                  <span>Suscribirme</span>
                  <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER MODERNO */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 via-blue-600 to-red-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-xl">S&S</span>
                </div>
                <span className="font-bold text-xl">Ecuador</span>
              </div>
              <p className="text-gray-400 mb-4">
                Tu aliado en soluciones industriales desde 1998
              </p>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-6">Contacto</h3>
              <ul className="space-y-3 text-gray-400">
                <li className="flex items-center space-x-2">
                  <Phone size={16} className="text-yellow-400" />
                  <span>{contactInfo.telefono}</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Zap size={16} className="text-yellow-400" />
                  <span>{contactInfo.whatsapp}</span>
                </li>
                <li className="flex items-center space-x-2">
                  <MapPin size={16} className="text-yellow-400" />
                  <span className="text-sm">{contactInfo.direccion}</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-6">Enlaces</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white hover:translate-x-1 inline-block transition-all">Productos</a></li>
                <li><a href="#" className="hover:text-white hover:translate-x-1 inline-block transition-all">Ofertas</a></li>
                <li><a href="#" className="hover:text-white hover:translate-x-1 inline-block transition-all">Contacto</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-6">Síguenos</h3>
              <div className="flex space-x-3">
                {['F', 'T', 'I', 'L'].map((letter, idx) => (
                  <a key={idx} href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 hover:scale-110 transition-all">
                    <span>{letter}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-gray-400 text-sm">
            <p>© 2026 Suministros y Suministros Ecuador. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>

      {/* Botón scroll to top */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-6 left-6 bg-blue-600 text-white p-3 rounded-full shadow-2xl hover:bg-blue-700 transition-all transform hover:scale-110 z-50 ${
          showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
        }`}
      >
        <ArrowUp size={24} />
      </button>

      {/* Botón WhatsApp flotante */}
      <a
        href={`https://wa.me/593${contactInfo.whatsapp.replace(/\D/g, '')}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-green-500 text-white p-4 rounded-full shadow-2xl hover:bg-green-600 transition-all transform hover:scale-110 z-50 group animate-bounce-slow"
      >
        <Zap size={28} />
        <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
          ¡Chatea con nosotros!
        </span>
      </a>

      {/* Modal de autenticación */}
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />

      {/* Modal de vista rápida */}
      {showModal && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scale-in">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-2xl font-bold">{selectedProduct.nombre}</h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-100 rounded-xl h-64 flex items-center justify-center">
                  {selectedProduct.imagenUrl ? (
                    <img src={selectedProduct.imagenUrl} alt={selectedProduct.nombre} className="max-h-full object-contain" />
                  ) : (
                    <span className="text-6xl">🛠️</span>
                  )}
                </div>
                <div>
                  <p className="text-gray-600 mb-4">{selectedProduct.descripcion}</p>
                  <p className="text-3xl font-bold text-blue-600 mb-4">
                    ${selectedProduct.precio.toLocaleString()}
                  </p>
                  <p className="mb-4">
                    <span className="font-semibold">Stock:</span>{' '}
                    <span className={selectedProduct.stock > 0 ? 'text-green-600' : 'text-red-600'}>
                      {selectedProduct.stock} unidades
                    </span>
                  </p>
                  <button
                    onClick={() => {
                      handleAgregarAlCarrito(selectedProduct);
                      setShowModal(false);
                    }}
                    disabled={selectedProduct.stock === 0}
                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-105"
                  >
                    Añadir al carrito
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Carrito lateral */}
      <CarritoLateral isOpen={carritoAbierto} onClose={() => setCarritoAbierto(false)} />
    </div>
  );
}
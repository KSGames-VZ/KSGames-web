"use client";

import { useState } from "react";
import { ShoppingBag } from "lucide-react";
import ConsoleSelector from "@/components/ConsoleSelector";
import GameSearch from "@/components/GameSearch";
import ConditionSelect, { Condition } from "@/components/ConditionSelect";
import TradeCart from "@/components/TradeCart";
import CheckoutForm from "@/components/CheckoutForm";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Hero from "@/components/sections/Hero";
import AboutUs from "@/components/sections/AboutUs";
import HowItWorks from "@/components/sections/HowItWorks";
import ParticlesBackground from "@/components/ui/Particles";

// Valuation logic moved to ConditionSelect component 50% margin rule.

const consoleSlugMap: Record<number, string> = {
  18: "nintendo-entertainment-system",
  19: "super-nintendo-entertainment-system",
  4: "nintendo-64",
  21: "gamecube",
  5: "wii",
  41: "wii-u",
  33: "game-boy",
  24: "game-boy-advance",
  20: "nintendo-ds",
  137: "nintendo-3ds",
  7: "playstation",
  8: "playstation-2",
  9: "playstation-3",
};

import { DeviceProvider } from "@/context/DeviceContext";

export default function Home() {
  const [selectedConsole, setSelectedConsole] = useState<number | null>(null);
  const [selectedGame, setSelectedGame] = useState<any>(null);
  const [isConditionOpen, setIsConditionOpen] = useState(false);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const handleGameSelect = (game: any) => {
    setSelectedGame(game);
    setIsConditionOpen(true);
  };

  const handleAddToCart = (condition: Condition, price: number) => {
    if (!selectedGame) return;

    const newItem = {
      ...selectedGame,
      condition,
      price: price || 0,
      cover: selectedGame.cover?.url?.replace("t_thumb", "t_cover_big"),
      platform: selectedGame.platforms?.find((p: any) => p.id === selectedConsole)?.name || "Consola",
    };

    setCartItems([...cartItems, newItem]);
    setIsConditionOpen(false);
    setSelectedGame(null);
    setIsCartOpen(true);
  };

  const handleRemoveItem = (index: number) => {
    const newItems = [...cartItems];
    newItems.splice(index, 1);
    setCartItems(newItems);
  };

  return (
    <DeviceProvider>
      <div className="min-h-screen bg-black text-slate-200 font-sans selection:bg-amber-500/30">
        <ParticlesBackground />
        <Header />

        <main className="relative z-10 bg-transparent">
          <Hero />
          <HowItWorks />
          <AboutUs />

          {/* Catalog Section */}
          <section id="catalog" className="py-24 container mx-auto px-4 relative">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                Cotizador Inteligente
              </h2>
              <p className="text-slate-400">Sigue los pasos para vender tus juegos al mejor precio.</p>
            </div>

            <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800 rounded-3xl p-6 md:p-12 shadow-2xl relative overflow-hidden">

              {/* Decorative Background Effects */}
              <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-yellow-400/10 blur-[120px] rounded-full pointer-events-none animate-pulse" />
              <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-pink-600/5 blur-[100px] rounded-full pointer-events-none" />

              {/* Step 1: Console */}
              <div className="mb-16 relative">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-yellow-400 shadow-lg">1</div>
                  <h3 className="text-2xl font-bold text-white">Selecciona la Plataforma</h3>
                </div>
                <ConsoleSelector selectedConsole={selectedConsole} onSelect={setSelectedConsole} />
              </div>

              {/* Step 2: Search */}
              <div className="min-h-[400px] relative transition-all duration-500">
                <div className="flex flex-col lg:flex-row gap-12">
                  {/* Left Column: Advisory Note */}
                  <div className="lg:w-1/3 space-y-6">
                    <div className="flex items-center gap-4 mb-2">
                      <div className={`w-10 h-10 rounded-xl border flex items-center justify-center font-bold shadow-lg transition-colors ${selectedConsole ? 'bg-slate-800 border-slate-700 text-yellow-400' : 'bg-slate-900 border-slate-800 text-slate-600'}`}>2</div>
                      <h3 className={`text-2xl font-bold transition-colors ${selectedConsole ? 'text-white' : 'text-slate-600'}`}>
                        Busca el Título {selectedConsole ? '' : '(Bloqueado)'}
                      </h3>
                    </div>

                    <div className="p-6 bg-yellow-400/5 border border-yellow-400/10 rounded-2xl space-y-4">
                      <div className="flex items-center gap-2 text-yellow-400">
                        <ShoppingBag className="w-5 h-5" />
                        <span className="text-xs font-black uppercase tracking-widest">¿No ves tu juego?</span>
                      </div>
                      <p className="text-slate-400 text-sm leading-relaxed">
                        Si tu título no aparece en la lista o no visualizas un precio aproximado, <strong>contáctanos de inmediato.</strong>
                      </p>
                      <p className="text-slate-400 text-sm leading-relaxed">
                        Nuestro equipo está listo para brindarte una valoración personalizada para cualquier juego o consola.
                      </p>
                      <a
                        href="https://api.whatsapp.com/send/?phone=584242580291&text=Hola%2C%20no%20encuentro%20un%20juego%20en%20el%20cotizador%20y%20me%20gustar%C3%ADa%20una%20valoraci%C3%B3n."
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full bg-green-500/20 hover:bg-green-500/30 text-green-400 py-3 rounded-xl border border-green-500/20 font-bold text-sm transition-all hover:scale-[1.02] active:scale-95 uppercase tracking-wider"
                      >
                        Contactar vía WhatsApp
                      </a>
                    </div>
                  </div>

                  {/* Right Column: Game Search */}
                  <div className="lg:w-2/3">
                    {selectedConsole ? (
                      <div className="animate-fade-in">
                        <GameSearch platformId={selectedConsole} onSelectGame={handleGameSelect} />
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full min-h-[250px] border-2 border-dashed border-slate-800 rounded-2xl bg-slate-900/50 text-slate-500 p-8 text-center">
                        <p className="max-w-xs">Por favor selecciona una consola arriba para activar el buscador inteligente.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Checkout Section */}
          {cartItems.length > 0 && (
            <section id="checkout" className="py-12 container mx-auto px-4 animate-fade-in-up">
              <div className="bg-slate-900/60 backdrop-blur-md border border-slate-700 rounded-3xl p-8 shadow-2xl">
                <h2 className="text-3xl font-bold text-white mb-8 border-b border-slate-700 pb-4">Resumen de Venta</h2>
                <div className="grid lg:grid-cols-2 gap-12">
                  {/* Summary List */}
                  <div className="space-y-4">
                    {cartItems.map((item, idx) => (
                      <div key={idx} className="flex gap-4 p-4 bg-slate-950/50 rounded-xl border border-slate-800 hover:border-green-500/30 transition-colors group">
                        <img src={item.cover} className="w-20 h-24 object-cover rounded-lg shadow-lg" alt="" />
                        <div className="flex-1">
                          <h4 className="font-bold text-white text-lg">{item.name}</h4>
                          <div className="flex gap-2 text-sm text-slate-400 mt-1">
                            <span className="bg-slate-800 px-2 py-0.5 rounded text-xs uppercase tracking-wider">{item.platform}</span>
                            <span className="bg-slate-800 px-2 py-0.5 rounded text-green-300 text-xs uppercase tracking-wider">{item.condition}</span>
                          </div>
                          <p className="text-2xl font-bold text-yellow-400 mt-2 font-mono">${item.price}</p>
                        </div>
                        <button onClick={() => handleRemoveItem(idx)} className="self-start text-slate-600 hover:text-red-400 p-2">
                          x
                        </button>
                      </div>
                    ))}
                    <div className="flex justify-between items-center pt-6 border-t border-slate-700 mt-4">
                      <span className="text-slate-400 text-lg">Total Estimado</span>
                      <span className="text-4xl font-bold text-yellow-400 font-mono tracking-tight">${cartItems.reduce((acc, item) => acc + item.price, 0)}</span>
                    </div>
                  </div>

                  {/* Form */}
                  <div className="lg:pl-8 lg:border-l border-slate-700">
                    <CheckoutForm cartItems={cartItems} />
                  </div>
                </div>
              </div>
            </section>
          )}
        </main>

        <Footer />

        {/* Floating Cart (Mobile) */}
        <button
          onClick={() => setIsCartOpen(true)}
          className="fixed bottom-6 right-6 z-40 bg-green-500 hover:bg-green-400 text-slate-900 p-4 rounded-full shadow-[0_0_20px_rgba(74,222,128,0.4)] transition-transform hover:scale-110 active:scale-95 md:hidden"
        >
          <ShoppingBag className="w-6 h-6" />
          {cartItems.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-slate-900">
              {cartItems.length}
            </span>
          )}
        </button>

        {/* Modals & Drawers */}
        <ConditionSelect
          isOpen={isConditionOpen}
          onClose={() => setIsConditionOpen(false)}
          game={selectedGame}
          platformSlug={selectedConsole ? consoleSlugMap[selectedConsole] : ""}
          onConfirm={handleAddToCart}
        />

        <TradeCart
          items={cartItems}
          onRemove={handleRemoveItem}
          isOpen={isCartOpen}
          setIsOpen={setIsCartOpen}
          onCheckout={() => {
            setIsCartOpen(false);
            const element = document.getElementById('checkout');
            if (element) {
              element.scrollIntoView({ behavior: 'smooth' });
            } else {
              window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
            }
          }}
        />
      </div>
    </DeviceProvider>
  );
}

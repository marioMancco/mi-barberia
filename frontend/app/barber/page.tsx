"use client";

import { useEffect, useState } from 'react';
import { GlassCard } from '@/components/GlassCard';
import { Corte, obtenerCortes, registrarCorte } from '@/lib/api';

export default function BarberView() {
  const [cortes, setCortes] = useState<Corte[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [rating, setRating] = useState(50);
  const [areaMejora, setAreaMejora] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [tipoServicio, setTipoServicio] = useState('corte');

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessCode, setAccessCode] = useState('');
  const [authError, setAuthError] = useState(false);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (accessCode === '001001') {
      setIsAuthenticated(true);
      setAuthError(false);
    } else {
      setAuthError(true);
      setAccessCode('');
    }
  };
  const fetchCortes = async () => {
    try {
      const data = await obtenerCortes();
      setCortes(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCortes();
  }, []);

  const totalCortes = cortes.length;
  // Based on the given rules: Barber gets 10,000 and Boss gets 5,000 per cut
  const barberGananciaAcumulada = cortes.reduce((sum, c) => sum + (c.gananciaBarbero || 10000), 0);
  const deudaJefeAcumulada = cortes.reduce((sum, c) => sum + (c.comisionJefe || 5000), 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await registrarCorte({ tipoServicio, rating, areaMejora });
      setShowModal(false);
      setRating(50);
      setAreaMejora('');
      setTipoServicio('corte');
      await fetchCortes();
    } catch (err) {
      console.error(err);
      alert('Error al registrar corte');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6 text-foreground relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-accent/5 blur-[120px] rounded-full pointer-events-none" />
        <GlassCard className="w-full max-w-sm flex flex-col items-center text-center p-8 bg-zinc-900/80 z-10">
          <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          </div>
          <h2 className="text-2xl font-bold mb-2">Acceso Restringido</h2>
          <p className="text-zinc-400 text-sm mb-6">Introduce tu código de empleado para entrar.</p>
          
          <form onSubmit={handleAuth} className="w-full flex flex-col gap-4">
            <div>
              <input
                type="password"
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value)}
                placeholder="Código"
                className={`w-full bg-zinc-950/50 border ${authError ? 'border-red-500/50 focus:border-red-500' : 'border-zinc-800 focus:border-accent'} rounded-xl p-3 text-center tracking-[0.3em] text-lg font-mono focus:outline-none transition-colors`}
                autoFocus
                maxLength={6}
              />
              {authError && <p className="text-red-400 text-xs mt-2 text-center font-medium animate-pulse">Código incorrecto</p>}
            </div>
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-accent hover:bg-accent-light text-white font-medium transition-colors cursor-pointer shadow-lg shadow-accent/20"
            >
              Desbloquear
            </button>
          </form>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6 lg:p-12 text-foreground">
      <header className="flex flex-col sm:flex-row gap-6 justify-between items-center mb-8 md:mb-10 text-center sm:text-left">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-accent to-accent-light">
            Portal del Barbero
          </h1>
          <p className="text-zinc-400 mt-1 text-sm md:text-base">Gestión de servicios y ganancias</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="w-full sm:w-auto bg-accent hover:bg-accent-light text-white px-6 py-3 rounded-xl font-medium transition-colors shadow-lg shadow-accent/20 cursor-pointer"
        >
          + Anotar Nuevo Corte
        </button>
      </header>

      {/* Metrics Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-10">
        <GlassCard className="border-accent/30 p-5 md:p-6">
          <h3 className="text-zinc-400 text-sm md:text-base font-medium mb-1">Total de Trabajos</h3>
          <p className="text-3xl md:text-4xl font-bold text-accent">{totalCortes}</p>
        </GlassCard>
        
        <GlassCard className="border-emerald-500/30 p-5 md:p-6">
          <h3 className="text-zinc-400 text-sm md:text-base font-medium mb-1">Mi Ganancia</h3>
          <p className="text-3xl md:text-4xl font-bold text-emerald-400">${barberGananciaAcumulada.toLocaleString()}</p>
        </GlassCard>
        
        <GlassCard className="border-red-500/30 p-5 md:p-6 sm:col-span-2 md:col-span-1">
          <h3 className="text-zinc-400 text-sm md:text-base font-medium mb-1">Deuda al Jefe</h3>
          <p className="text-3xl md:text-4xl font-bold text-red-400">${deudaJefeAcumulada.toLocaleString()}</p>
        </GlassCard>
      </div>

      {/* Resume Table */}
      <GlassCard>
        <h2 className="text-xl font-semibold mb-6">Historial de Cortes (Mi Resumen)</h2>
        {loading ? (
          <p className="text-zinc-500">Cargando cortes...</p>
        ) : cortes.length === 0 ? (
          <p className="text-zinc-500">No hay cortes registrados aún.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-800 text-zinc-400 text-sm">
                  <th className="py-4 px-4 font-medium">ID</th>
                  <th className="py-4 px-4 font-medium md:min-w-[150px]">Servicio</th>
                  <th className="py-4 px-4 font-medium">Fecha/Hora</th>
                  <th className="py-4 px-4 font-medium">Rating</th>
                  <th className="py-4 px-4 font-medium">Notas de Mejora</th>
                  <th className="py-4 px-4 font-medium">Mi Ganancia</th>
                  <th className="py-4 px-4 font-medium">A Pagar al Jefe</th>
                </tr>
              </thead>
              <tbody>
                {cortes.map((c) => (
                  <tr key={c._id} className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors">
                    <td className="py-4 px-4 font-mono text-xs text-zinc-500">{c._id.slice(-6).toUpperCase()}</td>
                    <td className="py-4 px-4 text-zinc-300 font-medium whitespace-nowrap">
                      {c.tipoServicio === 'corte' ? 'Corte Sencillo' : 
                       c.tipoServicio === 'cerquillos' ? 'Cerquillos' : 
                       c.tipoServicio === 'barba' ? 'Barba' : 
                       c.tipoServicio === 'corte_barba' ? 'Corte con Barba' : 'Corte Sencillo'}
                    </td>
                    <td className="py-4 px-4 text-sm">{new Date(c.fecha).toLocaleString()}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden min-w-[60px]">
                          <div 
                            className="bg-accent h-full" 
                            style={{width: `${c.rating}%`, backgroundColor: c.rating < 50 ? '#ef4444' : c.rating < 80 ? '#f59e0b' : '#10b981'}}
                          />
                        </div>
                        <span className="text-sm font-medium">{c.rating}%</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-sm max-w-[200px] truncate" title={c.areaMejora}>{c.areaMejora || '-'}</td>
                    <td className="py-4 px-4 font-medium text-emerald-400">${c.gananciaBarbero.toLocaleString()}</td>
                    <td className="py-4 px-4 font-medium text-red-400">${c.comisionJefe.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </GlassCard>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <GlassCard className="w-full max-w-md bg-zinc-900 shadow-2xl">
            <h2 className="text-2xl font-bold mb-6">Anotar Nuevo Corte</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">
                  Tipo de Trabajo
                </label>
                <select 
                  value={tipoServicio}
                  onChange={(e) => setTipoServicio(e.target.value)}
                  className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl p-3 text-sm focus:outline-none focus:border-accent transition-colors appearance-none text-zinc-200"
                >
                  <option value="corte">Corte Sencillo - $15,000</option>
                  <option value="cerquillos">Cerquillos - $5,000</option>
                  <option value="barba">Barba Sola - $5,000</option>
                  <option value="corte_barba">Corte con Barba - $18,000</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">
                  Calificación del Servicio ({rating}/100)
                </label>
                <input 
                  type="range" 
                  min="1" 
                  max="100" 
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  className="w-full accent-accent h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">
                  Área de Mejora para Próximo Servicio
                </label>
                <textarea 
                  className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl p-3 text-sm focus:outline-none focus:border-accent transition-colors"
                  rows={4}
                  placeholder="Ej. Mejorar el degradado..."
                  value={areaMejora}
                  onChange={(e) => setAreaMejora(e.target.value)}
                  required
                />
              </div>

              <div className="flex gap-4 mt-4">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 rounded-xl border border-zinc-700 hover:bg-zinc-800 font-medium transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  disabled={submitting}
                  className="flex-1 py-3 rounded-xl bg-accent hover:bg-accent-light text-white font-medium transition-colors cursor-pointer disabled:opacity-50"
                >
                  {submitting ? 'Guardando...' : 'Guardar Corte'}
                </button>
              </div>
            </form>
          </GlassCard>
        </div>
      )}
    </div>
  );
}

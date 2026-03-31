"use client";

import { useEffect, useState } from 'react';
import { GlassCard } from '@/components/GlassCard';
import { Corte, obtenerCortes, pagarDeuda } from '@/lib/api';

export default function BossView() {
  const [cortes, setCortes] = useState<Corte[]>([]);
  const [loading, setLoading] = useState(true);
  const [isResetting, setIsResetting] = useState(false);

  useEffect(() => {
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
    fetchCortes();
    
    // Simulate real-time polling every 10 seconds
    const interval = setInterval(fetchCortes, 10000);
    return () => clearInterval(interval);
  }, []);

  const handlePagarDeuda = async () => {
    if (!window.confirm('¿Estás seguro de que el barbero ya pagó y quieres reiniciar la deuda?')) return;
    
    setIsResetting(true);
    try {
      const response = await pagarDeuda();
      if (!response.success && response.message) {
          throw new Error(response.message);
      }
      const updatedCortes = await obtenerCortes();
      setCortes(updatedCortes);
    } catch (err) {
      console.error(err);
      alert('Hubo un error al reiniciar la deuda');
    } finally {
      setIsResetting(false);
    }
  };

  const totalCortes = cortes.length;
  const sumatoriaDeuda = cortes.reduce((sum, c) => sum + (c.comisionJefe ?? 5000), 0);

  return (
    <div className="min-h-screen bg-background p-6 lg:p-12 text-foreground">
      <header className="mb-8 md:mb-10 text-center">
        <h1 className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-fuchsia-400">
          Dashboard de Monitoreo
        </h1>
        <p className="text-zinc-400 mt-1 text-sm md:text-base">Control financiero de la barbería</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 mb-8 md:mb-10 w-full max-w-5xl mx-auto">
        <GlassCard className="flex flex-col items-center py-8 md:py-10 border-purple-500/20">
          <h3 className="text-zinc-400 text-base md:text-lg font-medium mb-2 md:mb-3">Total de Servicios</h3>
          <div className="text-5xl md:text-6xl font-bold text-zinc-100">{totalCortes}</div>
        </GlassCard>
        
        <GlassCard className="flex flex-col items-center py-8 md:py-10 border-accent/20 bg-accent/5">
          <h3 className="text-zinc-400 text-base md:text-lg font-medium mb-2 md:mb-3">Sumatoria a Cobrar</h3>
          <div className="text-4xl sm:text-5xl md:text-6xl font-bold text-accent">${sumatoriaDeuda.toLocaleString()}</div>
          <p className="text-zinc-500 text-xs md:text-sm mt-3 mb-6">Total Deuda Acumulada</p>
          
          <button
            onClick={handlePagarDeuda}
            disabled={isResetting || sumatoriaDeuda === 0}
            className="flex items-center gap-2 px-6 py-3 bg-purple-500/10 backdrop-blur-md border border-purple-500/30 hover:bg-purple-500/20 text-purple-400 hover:text-purple-300 font-bold rounded-xl shadow-lg shadow-purple-500/10 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            {isResetting ? 'Reiniciando...' : 'Barbero Pagó'}
          </button>
        </GlassCard>
      </div>

      <div className="w-full max-w-5xl mx-auto">
        <GlassCard>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Tabla de Recaudación</h2>
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 py-1 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              <span className="text-xs text-zinc-500 font-medium">En vivo</span>
            </div>
          </div>
          
          {loading ? (
             <p className="text-zinc-500">Cargando datos de recaudación...</p>
          ) : cortes.length === 0 ? (
            <p className="text-zinc-500">No hay registros para mostrar.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-zinc-800 text-zinc-400 mt-2 text-sm uppercase tracking-wider">
                    <th className="py-4 px-4 font-medium">ID de Transacción</th>
                    <th className="py-4 px-4 font-medium">Trabajo</th>
                    <th className="py-4 px-4 font-medium">Fecha/Hora</th>
                    <th className="py-4 px-4 font-medium text-right">Comisión a Cobrar</th>
                  </tr>
                </thead>
                <tbody>
                  {cortes.map((c) => (
                    <tr key={c._id} className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors">
                      <td className="py-4 px-4 font-mono text-xs text-zinc-500">{c._id.slice(-8).toUpperCase()}</td>
                      <td className="py-4 px-4 text-zinc-300 font-medium whitespace-nowrap">
                        {c.tipoServicio === 'corte' ? 'Corte Sencillo' : 
                         c.tipoServicio === 'cerquillos' ? 'Cerquillos' : 
                         c.tipoServicio === 'barba' ? 'Barba' : 
                         c.tipoServicio === 'corte_barba' ? 'Corte con Barba' : 'Corte Sencillo'}
                      </td>
                      <td className="py-4 px-4 text-sm text-zinc-300">{new Date(c.fecha).toLocaleString()}</td>
                      <td className="py-4 px-4 font-bold text-right text-accent">${c.comisionJefe.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </GlassCard>
      </div>
    </div>
  );
}

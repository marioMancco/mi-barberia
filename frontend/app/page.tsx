import Link from 'next/link';
import { GlassCard } from '@/components/GlassCard';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-background relative overflow-hidden">
      {/* Decorative background gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/20 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="z-10 text-center px-4 mb-10 md:mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-3 md:mb-4 tracking-tight">
          Barber<span className="text-accent">Manager</span>
        </h1>
        <p className="text-zinc-400 text-base md:text-lg">Sistema de Gestión de Cortes y Contabilidad</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 z-10 w-full max-w-4xl">
        <Link href="/barber" className="group">
          <GlassCard className="h-full flex flex-col items-center justify-center text-center p-8 md:p-10 transition-all hover:border-accent/50 hover:bg-zinc-800/40 cursor-pointer">
            <h2 className="text-2xl md:text-3xl font-semibold mb-3 group-hover:text-accent transition-colors">Portal del Barbero</h2>
            <p className="text-zinc-400 text-sm md:text-base">Registrar cortes, ver mi resumen y progreso diario.</p>
          </GlassCard>
        </Link>
        
        <Link href="/boss" className="group">
          <GlassCard className="h-full flex flex-col items-center justify-center text-center p-8 md:p-10 transition-all hover:border-purple-500/50 hover:bg-zinc-800/40 cursor-pointer">
            <h2 className="text-2xl md:text-3xl font-semibold mb-3 group-hover:text-purple-400 transition-colors">Dashboard del Jefe</h2>
            <p className="text-zinc-400 text-sm md:text-base">Monitorear recaudación y estadísticas generales.</p>
          </GlassCard>
        </Link>
      </div>
    </main>
  );
}

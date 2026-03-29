const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface Corte {
  _id: string;
  tipoServicio: string;
  fecha: string;
  precio: number;
  gananciaBarbero: number;
  comisionJefe: number;
  rating: number;
  areaMejora: string;
}

export async function registrarCorte(data: { tipoServicio: string, rating: number, areaMejora: string }) {
  const res = await fetch(`${API_URL}/cortes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  if (!res.ok) {
    throw new Error('Error al registrar corte');
  }
  
  return res.json();
}

export async function obtenerCortes(): Promise<Corte[]> {
  const res = await fetch(`${API_URL}/cortes`, {
    // Next.js App Router cache disable
    cache: 'no-store'
  });
  
  if (!res.ok) {
    throw new Error('Error al obtener cortes');
  }
  
  const data = await res.json();
  return data.data;
}

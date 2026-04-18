'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import api from '@/lib/api';
import { getToken, getUser } from '@/lib/auth';

export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);
  const [upcoming, setUpcoming] = useState<any[]>([]);
  const user = getUser();

  useEffect(() => {
    if (!getToken()) {
      router.push('/login');
      return;
    }
    api.get('/dashboard/me').then(r => setStats(r.data)).catch(() => {});
    api.get('/matches/upcoming').then(r => setUpcoming(r.data)).catch(() => {});
  }, [router]);

  return (
    <>
      <Navbar />
      <div style={{ maxWidth: 700, margin: '0 auto', padding: 16 }}>

        <div style={{ background: '#1a1a1a', borderRadius: 12, padding: 20, marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ color: 'white', fontSize: 20, fontWeight: 700, margin: 0 }}>
              Hola, {user?.nombre?.split(' ')[0]}!
            </h2>
            <p style={{ color: '#aaa', fontSize: 13, margin: '4px 0 0' }}>Temporada 2025 · Primera Nacional</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 32, fontWeight: 700, color: '#C8102E' }}>
              {stats?.puntosAcumulados ?? 0}
            </div>
            <div style={{ fontSize: 12, color: '#aaa' }}>pts · Pos #{stats?.posicionGlobal ?? '-'}</div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 16 }}>
          {[
            { label: 'Predicciones', value: stats?.totalPredicciones ?? 0, sub: 'jugadas', color: '#1a1a1a' },
            { label: 'Aciertos', value: (stats?.porcentajeAciertos ?? 0) + '%', sub: (stats?.totalExactos ?? 0) + ' exactos', color: '#1a7a3c' },
            { label: 'Mejor fecha', value: stats?.mejorFecha ? stats.mejorFecha.pts + ' pts' : '-', sub: stats?.mejorFecha ? 'Fecha ' + stats.mejorFecha.numero : 'Sin datos', color: '#C8102E' },
          ].map((c, i) => (
            <div key={i} style={{ background: 'white', borderRadius: 10, padding: '14px 16px', border: '1px solid #eee' }}>
              <div style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>{c.label}</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: c.color }}>{c.value}</div>
              <div style={{ fontSize: 11, color: '#999', marginTop: 2 }}>{c.sub}</div>
            </div>
          ))}
        </div>

        <div style={{ background: 'white', borderRadius: 10, border: '1px solid #eee' }}>
          <div style={{ padding: '12px 16px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 600, fontSize: 14 }}>Próximos partidos</span>
            <span style={{ fontSize: 12, background: '#fff8e1', color: '#92400e', padding: '2px 8px', borderRadius: 4 }}>Pendientes</span>
          </div>
          <div style={{ padding: '0 16px' }}>
            {upcoming.length === 0 && (
              <p style={{ color: '#999', fontSize: 14, padding: '16px 0' }}>No hay partidos próximos cargados</p>
            )}
            {upcoming.map((m: any) => (
              <div key={m.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f4f4f4' }}>
                <span style={{ fontSize: 14, fontWeight: 500 }}>
                  {m.equipoLocal} <span style={{ color: '#999', fontWeight: 400 }}>vs</span> {m.equipoVisitante}
                </span>
                <span style={{ fontSize: 12, color: '#666' }}>
                  {new Date(m.inicio).toLocaleDateString('es-AR', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import api from '@/lib/api';
import { getToken, getUser } from '@/lib/auth';

export default function RankingPage() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [tabFecha, setTabFecha] = useState(false);
  const [matchdays, setMatchdays] = useState<any[]>([]);
  const [selectedMd, setSelectedMd] = useState<number | null>(null);
  const [rankingFecha, setRankingFecha] = useState<any[]>([]);

  useEffect(() => {
    if (!getToken()) { router.push('/login'); return; }
    api.get('/ranking/global').then(r => setData(r.data));
    api.get('/matches/matchdays').then(r => {
      setMatchdays(r.data);
      if (r.data.length > 0) setSelectedMd(r.data[0].id);
    });
  }, [router]);

  useEffect(() => {
    if (selectedMd && tabFecha) {
      api.get('/ranking/matchday/' + selectedMd).then(r => setRankingFecha(r.data));
    }
  }, [selectedMd, tabFecha]);

  const medals = ['🥇', '🥈', '🥉'];

  function compartirWhatsApp() {
    if (!data) return;
    const yo = data.ranking.find((r: any) => r.esYo);
    const top3 = data.ranking.slice(0, 3).map((r: any, i: number) =>
      (i + 1) + '. ' + r.nombre + ' - ' + r.puntosAcumulados + ' pts'
    ).join('\n');
    const texto = '🏆 Prode Defensores de Belgrano\n\nTop 3:\n' + top3 + (yo ? '\n\nMi posición: #' + data.miPosicion + ' con ' + yo.puntosAcumulados + ' pts' : '') + '\n\n¡Sumate al prode! 👉 https://prode.yellowgreen-chough-806525.hostingersite.com';
    window.open('https://wa.me/?text=' + encodeURIComponent(texto), '_blank');
  }

  return (
    <>
      <Navbar />
      <div style={{ maxWidth: 700, margin: '0 auto', padding: 16 }}>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => setTabFecha(false)} style={{ padding: '7px 16px', borderRadius: 6, fontSize: 13, cursor: 'pointer', background: !tabFecha ? '#C8102E' : 'white', color: !tabFecha ? 'white' : '#666', border: '1px solid ' + (!tabFecha ? '#C8102E' : '#ddd'), fontWeight: !tabFecha ? 700 : 400 }}>
              General
            </button>
            <button onClick={() => setTabFecha(true)} style={{ padding: '7px 16px', borderRadius: 6, fontSize: 13, cursor: 'pointer', background: tabFecha ? '#C8102E' : 'white', color: tabFecha ? 'white' : '#666', border: '1px solid ' + (tabFecha ? '#C8102E' : '#ddd'), fontWeight: tabFecha ? 700 : 400 }}>
              Por fecha
            </button>
          </div>
          <button onClick={compartirWhatsApp}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', background: '#25D366', color: 'white', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
            📲 Compartir
          </button>
        </div>

        {!tabFecha && (
          <div style={{ background: 'white', borderRadius: 10, border: '1px solid #eee' }}>
            <div style={{ padding: '12px 16px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 700, fontSize: 14 }}>Tabla general — Temporada 2026</span>
              <span style={{ fontSize: 12, color: '#666', background: '#f4f4f4', padding: '2px 8px', borderRadius: 4 }}>{data?.totalJugadores ?? 0} socios</span>
            </div>
            {!data && <p style={{ padding: 16, color: '#999' }}>Cargando...</p>}
            {data?.ranking.map((r: any, i: number) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 16px', borderBottom: '1px solid #f4f4f4', background: r.esYo ? '#fef2f2' : 'transparent' }}>
                <span style={{ width: 28, fontSize: 15, textAlign: 'center' }}>
                  {i < 3 ? medals[i] : <span style={{ fontSize: 13, color: '#999' }}>{r.posicion}</span>}
                </span>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#C8102E20', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#C8102E' }}>
                  {r.nombre.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
                </div>
                <span style={{ flex: 1, fontSize: 14, fontWeight: r.esYo ? 700 : 400 }}>
                  {r.nombre} {r.esYo && <span style={{ fontSize: 12, color: '#C8102E' }}>(vos)</span>}
                </span>
                <span style={{ fontSize: 15, fontWeight: 700 }}>{r.puntosAcumulados} pts</span>
              </div>
            ))}
          </div>
        )}

        {tabFecha && (
          <div style={{ background: 'white', borderRadius: 10, border: '1px solid #eee' }}>
            <div style={{ padding: '12px 16px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 700, fontSize: 14 }}>Ranking por fecha</span>
              <select value={selectedMd ?? ''} onChange={e => setSelectedMd(+e.target.value)}
                style={{ fontSize: 13, border: '1px solid #ddd', borderRadius: 6, padding: '4px 10px', outline: 'none' }}>
                {matchdays.map((md: any) => <option key={md.id} value={md.id}>Fecha {md.numero}</option>)}
              </select>
            </div>
            {rankingFecha.length === 0 && <p style={{ padding: 16, color: '#999', fontSize: 14 }}>Sin resultados cargados en esta fecha</p>}
            {rankingFecha.map((r: any, i: number) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 16px', borderBottom: '1px solid #f4f4f4', background: r.esYo ? '#fef2f2' : 'transparent' }}>
                <span style={{ width: 28, fontSize: 15, textAlign: 'center' }}>
                  {i < 3 ? medals[i] : <span style={{ fontSize: 13, color: '#999' }}>{r.posicion}</span>}
                </span>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#C8102E20', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#C8102E' }}>
                  {r.nombre.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
                </div>
                <span style={{ flex: 1, fontSize: 14, fontWeight: r.esYo ? 700 : 400 }}>
                  {r.nombre} {r.esYo && <span style={{ fontSize: 12, color: '#C8102E' }}>(vos)</span>}
                </span>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 15, fontWeight: 700 }}>{r.puntosFecha} pts</div>
                  <div style={{ fontSize: 11, color: '#999' }}>{r.puntosAcumulados} total</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {data?.miPosicion && !tabFecha && (
          <p style={{ textAlign: 'center', fontSize: 13, color: '#666', marginTop: 12 }}>
            Tu posición: <strong style={{ color: '#C8102E' }}>#{data.miPosicion}</strong> de {data.totalJugadores} socios
          </p>
        )}
      </div>
    </>
  );
}

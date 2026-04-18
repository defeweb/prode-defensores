'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import api from '@/lib/api';
import { getToken } from '@/lib/auth';

export default function RankingPage() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    if (!getToken()) { router.push('/login'); return; }
    api.get('/ranking/global').then(r => setData(r.data));
  }, [router]);

  const medals = ['🥇','🥈','🥉'];

  return (
    <>
      <Navbar/>
      <div style={{ maxWidth:700, margin:'0 auto', padding:16 }}>
        <div style={{ background:'white', borderRadius:10, border:'1px solid #eee' }}>
          <div style={{ padding:'12px 16px', borderBottom:'1px solid #eee', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <span style={{ fontWeight:500, fontSize:14 }}>Tabla general — Temporada 2025</span>
            <span style={{ fontSize:12, color:'#666', background:'#f4f4f4', padding:'2px 8px', borderRadius:4 }}>{data?.totalJugadores ?? 0} socios</span>
          </div>
          {!data && <p style={{ padding:16, color:'#999' }}>Cargando...</p>}
          {data?.ranking.map((r: any, i: number) => (
            <div key={i} style={{
              display:'flex', alignItems:'center', gap:12, padding:'10px 16px',
              borderBottom:'1px solid #f4f4f4',
              background: r.esYo ? '#fef2f2' : 'transparent'
            }}>
              <span style={{ width:28, fontSize:15, textAlign:'center' }}>
                {i < 3 ? medals[i] : <span style={{ fontSize:13, color:'#999' }}>{r.posicion}</span>}
              </span>
              <div style={{ width:32, height:32, borderRadius:'50%', background:'#C8102E20', display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:600, color:'#C8102E' }}>
                {r.nombre.split(' ').map((n: string) => n[0]).join('').slice(0,2).toUpperCase()}
              </div>
              <span style={{ flex:1, fontSize:14, fontWeight: r.esYo ? 600 : 400 }}>
                {r.nombre} {r.esYo && <span style={{ fontSize:12, color:'#C8102E' }}>(vos)</span>}
              </span>
              <span style={{ fontSize:15, fontWeight:600, color:'#1a1a1a' }}>{r.puntosAcumulados} pts</span>
            </div>
          ))}
        </div>
        {data?.miPosicion && (
          <p style={{ textAlign:'center', fontSize:13, color:'#666', marginTop:12 }}>
            Tu posición: <strong style={{ color:'#C8102E' }}>#{data.miPosicion}</strong> de {data.totalJugadores} socios
          </p>
        )}
      </div>
    </>
  );
}

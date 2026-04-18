'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import api from '@/lib/api';
import { getToken } from '@/lib/auth';

export default function ProdePage() {
  const router = useRouter();
  const [matchdays, setMatchdays] = useState<any[]>([]);
  const [selectedMd, setSelectedMd] = useState<number | null>(null);
  const [matches, setMatches] = useState<any[]>([]);
  const [preds, setPreds] = useState<Record<number, any>>({});
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!getToken()) { router.push('/login'); return; }
    api.get('/matches/matchdays').then(r => {
      setMatchdays(r.data);
      if (r.data.length > 0) setSelectedMd(r.data[0].id);
    });
  }, [router]);

  useEffect(() => {
    if (!selectedMd) return;
    api.get(`/matches?matchdayId=${selectedMd}`).then(r => setMatches(r.data));
    api.get(`/predictions/me?matchdayId=${selectedMd}`).then(r => {
      const map: Record<number, any> = {};
      r.data.forEach((p: any) => { map[p.matchId] = p; });
      setPreds(map);
    });
  }, [selectedMd]);

  const setPred = (matchId: number, resultado: string) => {
    setPreds(prev => ({ ...prev, [matchId]: { ...prev[matchId], matchId, resultado } }));
  };

  const guardar = async () => {
    for (const matchId of Object.keys(preds)) {
      const p = preds[+matchId];
      if (!p.resultado) continue;
      try {
        await api.post('/predictions', { matchId: +matchId, resultado: p.resultado });
      } catch {}
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const btnStyle = (matchId: number, val: string) => {
    const selected = preds[matchId]?.resultado === val;
    const colors: Record<string, string> = { L:'#C8102E', E:'#1a1a1a', V:'#C8102E' };
    return {
      padding:'6px 12px', borderRadius:6, fontSize:12, cursor:'pointer', border:'1px solid #ddd',
      background: selected ? colors[val] : 'white',
      color: selected ? 'white' : '#666', fontWeight: selected ? 600 : 400,
    };
  };

  const isClosed = (inicio: string) => new Date() >= new Date(inicio);

  return (
    <>
      <Navbar/>
      <div style={{ maxWidth:700, margin:'0 auto', padding:16 }}>
        <div style={{ display:'flex', gap:8, marginBottom:16, flexWrap:'wrap' }}>
          {matchdays.map((md: any) => (
            <button key={md.id} onClick={() => setSelectedMd(md.id)}
              style={{ padding:'6px 14px', borderRadius:6, fontSize:13, cursor:'pointer', border:'1px solid #ddd',
                background: selectedMd===md.id ? '#C8102E' : 'white',
                color: selectedMd===md.id ? 'white' : '#666' }}>
              Fecha {md.numero}
            </button>
          ))}
        </div>

        <div style={{ background:'white', borderRadius:10, border:'1px solid #eee' }}>
          <div style={{ padding:'12px 16px', borderBottom:'1px solid #eee', display:'flex', justifyContent:'space-between' }}>
            <span style={{ fontWeight:500, fontSize:14 }}>Pronosticá los partidos</span>
            {saved && <span style={{ fontSize:13, color:'#1a7a3c' }}>✓ Guardado</span>}
          </div>
          {matches.length === 0 && <p style={{ padding:16, color:'#999', fontSize:14 }}>No hay partidos en esta fecha</p>}
          {matches.map((m: any) => (
            <div key={m.id} style={{ padding:'14px 16px', borderBottom:'1px solid #f4f4f4' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', gap:12 }}>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:14, fontWeight:500 }}>{m.equipoLocal} <span style={{ color:'#999', fontWeight:400 }}>vs</span> {m.equipoVisitante}</div>
                  <div style={{ fontSize:11, color:'#999', marginTop:2 }}>
                    {new Date(m.inicio).toLocaleDateString('es-AR', { weekday:'short', day:'numeric', month:'short', hour:'2-digit', minute:'2-digit' })}
                    {m.estado === 'finalizado' && <span style={{ marginLeft:8, color:'#1a7a3c' }}>· {m.golesLocal}-{m.golesVisitante}</span>}
                  </div>
                </div>
                {isClosed(m.inicio) ? (
                  <span style={{ fontSize:12, color:'#999', background:'#f4f4f4', padding:'4px 10px', borderRadius:6 }}>
                    {preds[m.id]?.resultado ? `Tu pred: ${preds[m.id].resultado}` : 'Cerrado'}
                  </span>
                ) : (
                  <div style={{ display:'flex', gap:4 }}>
                    {['L','E','V'].map(v => (
                      <button key={v} onClick={() => setPred(m.id, v)} style={btnStyle(m.id, v)}>
                        {v === 'L' ? 'Local' : v === 'E' ? 'Empate' : 'Visita'}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          {matches.some((m: any) => !isClosed(m.inicio)) && (
            <div style={{ padding:'12px 16px' }}>
              <button onClick={guardar}
                style={{ background:'#C8102E', color:'white', border:'none', borderRadius:8, padding:'9px 20px', fontSize:14, fontWeight:600, cursor:'pointer' }}>
                Guardar predicciones
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

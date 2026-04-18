'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import api from '@/lib/api';
import { getToken, isAdmin } from '@/lib/auth';

export default function AdminPage() {
  const router = useRouter();
  const [tab, setTab] = useState<'partidos'|'resultados'|'reglas'>('partidos');

  // Matchdays
  const [matchdays, setMatchdays] = useState<any[]>([]);
  const [selectedMd, setSelectedMd] = useState<number | null>(null);
  const [newMd, setNewMd] = useState('');

  // Nuevo partido
  const [local, setLocal] = useState('Defensores de Belgrano');
  const [visita, setVisita] = useState('');
  const [inicio, setInicio] = useState('');
  const [matchMsg, setMatchMsg] = useState('');

  // Resultados
  const [matches, setMatches] = useState<any[]>([]);
  const [results, setResults] = useState<Record<number, { gl: string; gv: string }>>({});
  const [resMsg, setResMsg] = useState<Record<number, string>>({});

  // Reglas
  const [ptsRes, setPtsRes] = useState(1);
  const [ptsExacto, setPtsExacto] = useState(3);
  const [rulesMsg, setRulesMsg] = useState('');

  useEffect(() => {
    if (!getToken() || !isAdmin()) { router.push('/dashboard'); return; }
    loadMatchdays();
    loadRules();
  }, [router]);

  useEffect(() => {
    if (selectedMd) loadMatches(selectedMd);
  }, [selectedMd]);

  async function loadMatchdays() {
    const { data } = await api.get('/matches/matchdays');
    setMatchdays(data);
    if (data.length > 0) setSelectedMd(data[0].id);
  }

  async function loadMatches(mdId: number) {
    const { data } = await api.get('/matches?matchdayId=' + mdId);
    setMatches(data);
  }

  async function loadRules() {
    try {
      const { data } = await api.get('/scoring/rules');
      setPtsRes(data.ptsResultado);
      setPtsExacto(data.ptsExacto);
    } catch {}
  }

  async function crearFecha() {
    if (!newMd) return;
    await api.post('/matches/matchdays', { seasonId: 1, numero: +newMd });
    setNewMd('');
    loadMatchdays();
  }

  async function crearPartido() {
    if (!selectedMd || !visita || !inicio) return;
    try {
      await api.post('/matches', { matchdayId: selectedMd, equipoLocal: local, equipoVisitante: visita, inicio });
      setVisita(''); setInicio('');
      setMatchMsg('✓ Partido creado');
      loadMatches(selectedMd);
      setTimeout(() => setMatchMsg(''), 2500);
    } catch (e: any) {
      setMatchMsg('Error: ' + (e.response?.data?.message || 'Error'));
    }
  }

  async function cargarResultado(matchId: number) {
    const r = results[matchId];
    if (!r || r.gl === '' || r.gv === '') return;
    try {
      await api.put('/matches/' + matchId + '/result', { golesLocal: +r.gl, golesVisitante: +r.gv });
      setResMsg(prev => ({ ...prev, [matchId]: '✓ Guardado' }));
      loadMatches(selectedMd!);
      setTimeout(() => setResMsg(prev => ({ ...prev, [matchId]: '' })), 2500);
    } catch (e: any) {
      setResMsg(prev => ({ ...prev, [matchId]: 'Error' }));
    }
  }

  async function guardarReglas() {
    try {
      await api.put('/scoring/rules', { ptsResultado: ptsRes, ptsExacto });
      setRulesMsg('✓ Reglas actualizadas');
      setTimeout(() => setRulesMsg(''), 2500);
    } catch {}
  }

  const inputStyle = { width: '100%', padding: '9px 12px', border: '1px solid #ddd', borderRadius: 8, fontSize: 14, outline: 'none', boxSizing: 'border-box' as const };
  const btnRojo = { background: '#C8102E', color: 'white', border: 'none', borderRadius: 8, padding: '9px 18px', fontSize: 14, fontWeight: 700, cursor: 'pointer' };
  const btnGris = { background: '#f4f4f4', color: '#444', border: '1px solid #ddd', borderRadius: 8, padding: '9px 18px', fontSize: 14, cursor: 'pointer' };

  return (
    <>
      <Navbar />
      <div style={{ maxWidth: 700, margin: '0 auto', padding: 16 }}>

        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16, color: '#1a1a1a' }}>Panel de administración</h2>

        <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
          {(['partidos', 'resultados', 'reglas'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding: '7px 16px', borderRadius: 6, fontSize: 13, cursor: 'pointer',
              background: tab === t ? '#C8102E' : 'white',
              color: tab === t ? 'white' : '#666',
              border: '1px solid ' + (tab === t ? '#C8102E' : '#ddd'),
              fontWeight: tab === t ? 600 : 400,
              textTransform: 'capitalize',
            }}>
              {t === 'partidos' ? 'Partidos' : t === 'resultados' ? 'Resultados' : 'Reglas'}
            </button>
          ))}
        </div>

        {/* TAB: PARTIDOS */}
        {tab === 'partidos' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Crear fecha */}
            <div style={{ background: 'white', borderRadius: 10, border: '1px solid #eee', padding: 20 }}>
              <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 14, marginTop: 0 }}>Nueva fecha</h3>
              <div style={{ display: 'flex', gap: 10 }}>
                <input type="number" placeholder="Número de fecha (ej: 15)" value={newMd}
                  onChange={e => setNewMd(e.target.value)} style={{ ...inputStyle, flex: 1 }} />
                <button onClick={crearFecha} style={btnRojo}>Crear</button>
              </div>
              {matchdays.length > 0 && (
                <div style={{ marginTop: 12, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {matchdays.map((md: any) => (
                    <span key={md.id} style={{ fontSize: 12, background: '#f4f4f4', padding: '3px 10px', borderRadius: 20, color: '#666' }}>
                      Fecha {md.numero}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Crear partido */}
            <div style={{ background: 'white', borderRadius: 10, border: '1px solid #eee', padding: 20 }}>
              <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 14, marginTop: 0 }}>Agregar partido</h3>

              <div style={{ marginBottom: 10 }}>
                <label style={{ fontSize: 12, color: '#666', display: 'block', marginBottom: 4 }}>Fecha</label>
                <select value={selectedMd ?? ''} onChange={e => setSelectedMd(+e.target.value)} style={inputStyle}>
                  {matchdays.map((md: any) => (
                    <option key={md.id} value={md.id}>Fecha {md.numero}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
                <div>
                  <label style={{ fontSize: 12, color: '#666', display: 'block', marginBottom: 4 }}>Equipo local</label>
                  <input value={local} onChange={e => setLocal(e.target.value)} style={inputStyle} />
                </div>
                <div>
                  <label style={{ fontSize: 12, color: '#666', display: 'block', marginBottom: 4 }}>Equipo visitante</label>
                  <input value={visita} onChange={e => setVisita(e.target.value)} placeholder="Nombre del rival" style={inputStyle} />
                </div>
              </div>

              <div style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 12, color: '#666', display: 'block', marginBottom: 4 }}>Fecha y hora de inicio</label>
                <input type="datetime-local" value={inicio} onChange={e => setInicio(e.target.value)} style={inputStyle} />
              </div>

              {matchMsg && (
                <div style={{ fontSize: 13, color: matchMsg.startsWith('✓') ? '#1a7a3c' : '#C8102E', marginBottom: 10 }}>
                  {matchMsg}
                </div>
              )}
              <button onClick={crearPartido} style={btnRojo}>Agregar partido</button>
            </div>
          </div>
        )}

        {/* TAB: RESULTADOS */}
        {tab === 'resultados' && (
          <div style={{ background: 'white', borderRadius: 10, border: '1px solid #eee' }}>
            <div style={{ padding: '12px 20px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 600, fontSize: 14 }}>Cargar resultados</span>
              <select value={selectedMd ?? ''} onChange={e => setSelectedMd(+e.target.value)}
                style={{ fontSize: 13, border: '1px solid #ddd', borderRadius: 6, padding: '4px 10px', outline: 'none' }}>
                {matchdays.map((md: any) => (
                  <option key={md.id} value={md.id}>Fecha {md.numero}</option>
                ))}
              </select>
            </div>

            {matches.length === 0 && (
              <p style={{ padding: 20, color: '#999', fontSize: 14 }}>No hay partidos en esta fecha</p>
            )}

            {matches.map((m: any) => (
              <div key={m.id} style={{ padding: '14px 20px', borderBottom: '1px solid #f4f4f4' }}>
                <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 10 }}>
                  {m.equipoLocal} vs {m.equipoVisitante}
                  <span style={{ marginLeft: 10, fontSize: 12, color: m.estado === 'finalizado' ? '#1a7a3c' : '#999', background: m.estado === 'finalizado' ? '#e8f5ee' : '#f4f4f4', padding: '2px 8px', borderRadius: 4 }}>
                    {m.estado === 'finalizado' ? 'Finalizado' : 'Pendiente'}
                  </span>
                </div>

                {m.estado === 'finalizado' ? (
                  <div style={{ fontSize: 14, color: '#1a7a3c', fontWeight: 600 }}>
                    Resultado: {m.golesLocal} - {m.golesVisitante}
                  </div>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <input type="number" min="0" max="20" placeholder="0"
                      value={results[m.id]?.gl ?? ''}
                      onChange={e => setResults(prev => ({ ...prev, [m.id]: { ...prev[m.id], gl: e.target.value } }))}
                      style={{ width: 60, padding: '7px 10px', border: '1px solid #ddd', borderRadius: 6, fontSize: 16, textAlign: 'center', outline: 'none' }} />
                    <span style={{ fontSize: 16, color: '#999', fontWeight: 700 }}>-</span>
                    <input type="number" min="0" max="20" placeholder="0"
                      value={results[m.id]?.gv ?? ''}
                      onChange={e => setResults(prev => ({ ...prev, [m.id]: { ...prev[m.id], gv: e.target.value } }))}
                      style={{ width: 60, padding: '7px 10px', border: '1px solid #ddd', borderRadius: 6, fontSize: 16, textAlign: 'center', outline: 'none' }} />
                    <button onClick={() => cargarResultado(m.id)} style={btnRojo}>
                      Guardar
                    </button>
                    {resMsg[m.id] && (
                      <span style={{ fontSize: 13, color: resMsg[m.id] === '✓ Guardado' ? '#1a7a3c' : '#C8102E' }}>
                        {resMsg[m.id]}
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* TAB: REGLAS */}
        {tab === 'reglas' && (
          <div style={{ background: 'white', borderRadius: 10, border: '1px solid #eee', padding: 20 }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 4, marginTop: 0 }}>Reglas de puntuación</h3>
            <p style={{ fontSize: 13, color: '#666', marginBottom: 20, marginTop: 0 }}>Configurá cuántos puntos vale cada tipo de acierto</p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
              <div>
                <label style={{ fontSize: 13, color: '#444', display: 'block', marginBottom: 6 }}>Puntos por resultado correcto</label>
                <input type="number" min="0" max="10" value={ptsRes}
                  onChange={e => setPtsRes(+e.target.value)} style={inputStyle} />
                <p style={{ fontSize: 11, color: '#999', marginTop: 4 }}>Acertás si predecís Local, Empate o Visita</p>
              </div>
              <div>
                <label style={{ fontSize: 13, color: '#444', display: 'block', marginBottom: 6 }}>Puntos por marcador exacto</label>
                <input type="number" min="0" max="10" value={ptsExacto}
                  onChange={e => setPtsExacto(+e.target.value)} style={inputStyle} />
                <p style={{ fontSize: 11, color: '#999', marginTop: 4 }}>Acertás el resultado exacto con goles</p>
              </div>
            </div>

            <div style={{ background: '#f8f8f8', borderRadius: 8, padding: '12px 16px', marginBottom: 20, fontSize: 13, color: '#444' }}>
              Con la configuración actual: resultado correcto vale <strong>{ptsRes} pt{ptsRes !== 1 ? 's' : ''}</strong> y marcador exacto vale <strong>{ptsExacto} pt{ptsExacto !== 1 ? 's' : ''}</strong>
            </div>

            {rulesMsg && (
              <div style={{ fontSize: 13, color: '#1a7a3c', marginBottom: 12 }}>{rulesMsg}</div>
            )}
            <button onClick={guardarReglas} style={btnRojo}>Guardar reglas</button>
          </div>
        )}
      </div>
    </>
  );
}

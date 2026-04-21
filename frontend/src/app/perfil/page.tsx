'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import api from '@/lib/api';
import { getToken, getUser, saveAuth } from '@/lib/auth';

export default function PerfilPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [nombre, setNombre] = useState('');
  const [nroSocio, setNroSocio] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    if (!getToken()) { router.push('/login'); return; }
    api.get('/users/me').then(r => {
      setUser(r.data);
      setNombre(r.data.nombre);
      setNroSocio(r.data.nroSocio);
    });
    api.get('/dashboard/me').then(r => setStats(r.data));
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setMsg(''); setError('');
    try {
      const body: any = { nombre, nroSocio };
      if (password) body.password = password;
      const { data } = await api.put('/users/me', body);
      const currentUser = getUser();
      if (currentUser) {
        saveAuth(getToken()!, { ...currentUser, nombre: data.nombre });
      }
      setMsg('✓ Perfil actualizado correctamente');
      setPassword('');
    } catch (e: any) {
      setError(e.response?.data?.message || 'Error al actualizar');
    } finally {
      setLoading(false);
    }
  }

  const inputStyle = { width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: 8, fontSize: 14, outline: 'none', boxSizing: 'border-box' as const };

  return (
    <>
      <Navbar />
      <div style={{ maxWidth: 500, margin: '0 auto', padding: 16 }}>

        {/* Stats card */}
        <div style={{ background: '#1a1a1a', borderRadius: 12, padding: 20, marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ color: 'white', fontSize: 18, fontWeight: 700 }}>{user?.nombre}</div>
            <div style={{ color: '#aaa', fontSize: 13, marginTop: 2 }}>Socio #{user?.nroSocio}</div>
            <div style={{ color: '#aaa', fontSize: 12, marginTop: 2 }}>
              Miembro desde {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('es-AR', { month: 'long', year: 'numeric' }) : ''}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 32, fontWeight: 700, color: '#C8102E' }}>{stats?.puntosAcumulados ?? 0}</div>
            <div style={{ fontSize: 12, color: '#aaa' }}>pts · Pos #{stats?.posicionGlobal ?? '-'}</div>
          </div>
        </div>

        {/* Mini stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 16 }}>
          {[
            { label: 'Predicciones', value: stats?.totalPredicciones ?? 0 },
            { label: 'Aciertos', value: (stats?.porcentajeAciertos ?? 0) + '%' },
            { label: 'Exactos', value: stats?.totalExactos ?? 0 },
          ].map((s, i) => (
            <div key={i} style={{ background: 'white', borderRadius: 10, padding: '12px 14px', border: '1px solid #eee', textAlign: 'center' }}>
              <div style={{ fontSize: 11, color: '#666', marginBottom: 4 }}>{s.label}</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: '#1a1a1a' }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Historial de fechas */}
        {stats?.historicoFechas?.length > 0 && (
          <div style={{ background: 'white', borderRadius: 10, border: '1px solid #eee', marginBottom: 16 }}>
            <div style={{ padding: '12px 16px', borderBottom: '1px solid #eee', fontWeight: 700, fontSize: 14 }}>Historial por fecha</div>
            <div style={{ padding: '0 16px' }}>
              {stats.historicoFechas.map((f: any, i: number) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #f4f4f4' }}>
                  <span style={{ fontSize: 14, color: '#444' }}>Fecha {f.fecha}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ height: 6, width: Math.max(f.pts * 8, 4), background: '#C8102E', borderRadius: 3 }}></div>
                    <span style={{ fontSize: 14, fontWeight: 700, color: '#1a1a1a', minWidth: 40, textAlign: 'right' }}>{f.pts} pts</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Editar perfil */}
        <div style={{ background: 'white', borderRadius: 10, border: '1px solid #eee', padding: 20 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16, marginTop: 0 }}>Editar perfil</h3>

          {msg && <div style={{ background: '#e8f5ee', border: '1px solid #a3d9b1', borderRadius: 8, padding: '10px 14px', color: '#1a7a3c', fontSize: 14, marginBottom: 14 }}>{msg}</div>}
          {error && <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: '10px 14px', color: '#991b1b', fontSize: 14, marginBottom: 14 }}>{error}</div>}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 13, color: '#444', display: 'block', marginBottom: 4 }}>Nombre completo</label>
              <input value={nombre} onChange={e => setNombre(e.target.value)} style={inputStyle} />
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 13, color: '#444', display: 'block', marginBottom: 4 }}>Número de socio</label>
              <input value={nroSocio} onChange={e => setNroSocio(e.target.value)} style={inputStyle} />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 13, color: '#444', display: 'block', marginBottom: 4 }}>Nueva contraseña <span style={{ color: '#999' }}>(dejar vacío para no cambiar)</span></label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Mínimo 6 caracteres" style={inputStyle} />
            </div>
            <button type="submit" disabled={loading}
              style={{ width: '100%', padding: 11, background: '#C8102E', color: 'white', border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>
              {loading ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

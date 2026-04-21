'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';

function ResetForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [ok, setOk] = useState(false);

  useEffect(() => {
    const t = searchParams.get('token');
    if (t) setToken(t);
    else setError('Token inválido o expirado');
  }, [searchParams]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) { setError('Las contraseñas no coinciden'); return; }
    if (password.length < 6) { setError('La contraseña debe tener al menos 6 caracteres'); return; }
    setLoading(true); setError('');
    try {
      await api.post('/auth/reset-password', { token, newPassword: password });
      setOk(true);
    } catch (e: any) {
      setError(e.response?.data?.message || 'Token inválido o expirado');
    } finally {
      setLoading(false);
    }
  }

  if (ok) {
    return (
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#e8f5ee', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: 28 }}>✓</div>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#1a7a3c', marginBottom: 12 }}>Contraseña actualizada</h2>
        <p style={{ fontSize: 14, color: '#444', marginBottom: 20 }}>Ya podés iniciar sesión con tu nueva contraseña.</p>
        <Link href="/login" style={{ display: 'inline-block', background: '#C8102E', color: 'white', padding: '10px 24px', borderRadius: 8, textDecoration: 'none', fontWeight: 700 }}>
          Ir al login
        </Link>
      </div>
    );
  }

  return (
    <>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#C8102E', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', fontSize: 18, color: 'white', fontWeight: 700 }}>DB</div>
        <h1 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>Nueva contraseña</h1>
        <p style={{ color: '#666', fontSize: 14, marginTop: 4 }}>Elegí una contraseña segura</p>
      </div>

      {error && (
        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: '10px 14px', color: '#991b1b', fontSize: 14, marginBottom: 16 }}>
          {error}
          {error.includes('inválido') && (
            <div style={{ marginTop: 8 }}>
              <Link href="/recuperar-password" style={{ color: '#C8102E', fontWeight: 600 }}>Solicitar nuevo link</Link>
            </div>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 14 }}>
          <label style={{ fontSize: 13, color: '#444', display: 'block', marginBottom: 4 }}>Nueva contraseña</label>
          <input type="password" required value={password} onChange={e => setPassword(e.target.value)}
            placeholder="Mínimo 6 caracteres"
            style={{ width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: 8, fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
        </div>
        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 13, color: '#444', display: 'block', marginBottom: 4 }}>Confirmar contraseña</label>
          <input type="password" required value={confirm} onChange={e => setConfirm(e.target.value)}
            placeholder="Repetí la contraseña"
            style={{ width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: 8, fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
        </div>
        <button type="submit" disabled={loading || !token}
          style={{ width: '100%', padding: 11, background: '#C8102E', color: 'white', border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>
          {loading ? 'Guardando...' : 'Cambiar contraseña'}
        </button>
      </form>
    </>
  );
}

export default function ResetPasswordPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f4f4f4' }}>
      <div style={{ background: 'white', borderRadius: 12, padding: 32, width: '100%', maxWidth: 400 }}>
        <Suspense fallback={<p style={{ textAlign: 'center', color: '#666' }}>Cargando...</p>}>
          <ResetForm />
        </Suspense>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { saveAuth } from '@/lib/auth';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post('/auth/login', { email, password });
      saveAuth(data.access_token, data.user);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f4f4f4' }}>
      <div style={{ background: 'white', borderRadius: 12, padding: 32, width: '100%', maxWidth: 400 }}>
        
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#C8102E', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', fontSize: 18, color: 'white', fontWeight: 700 }}>
            DB
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0, color: '#1a1a1a' }}>Prode Defensores</h1>
          <p style={{ color: '#666', fontSize: 14, marginTop: 4 }}>Iniciá sesión para jugar</p>
        </div>

        {error && (
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: '10px 14px', color: '#991b1b', fontSize: 14, marginBottom: 16 }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 13, color: '#444', display: 'block', marginBottom: 4 }}>Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="tu@email.com"
              style={{ width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: 8, fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
            />
          </div>
          <div style={{ marginBottom: 24 }}>
            <label style={{ fontSize: 13, color: '#444', display: 'block', marginBottom: 4 }}>Contraseña</label>
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••"
              style={{ width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: 8, fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            style={{ width: '100%', padding: 11, background: '#C8102E', color: 'white', border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 700, cursor: 'pointer' }}
          >
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 16, fontSize: 14, color: '#666' }}>
          ¿No tenés cuenta?{' '}
          <Link href="/registro" style={{ color: '#C8102E', fontWeight: 600 }}>
            Registrate
          </Link>
        </p>
      </div>
    </div>
  );
}

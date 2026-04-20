'use client';

import { useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';

export default function RegistroPage() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nroSocio, setNroSocio] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post('/auth/register', { nombre, email, password, nroSocio });
      setSuccess(data.message);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al registrarse');
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f4f4f4' }}>
        <div style={{ background: 'white', borderRadius: 12, padding: 32, width: '100%', maxWidth: 420, textAlign: 'center' }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#e8f5ee', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: 28 }}>
            ✓
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: '#1a7a3c', marginBottom: 12 }}>¡Registro exitoso!</h2>
          <p style={{ fontSize: 14, color: '#444', lineHeight: 1.6, marginBottom: 20 }}>
            {success}
          </p>
          <Link href="/login" style={{ display: 'inline-block', background: '#C8102E', color: 'white', padding: '10px 24px', borderRadius: 8, textDecoration: 'none', fontWeight: 700, fontSize: 14 }}>
            Ir al login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f4f4f4' }}>
      <div style={{ background: 'white', borderRadius: 12, padding: 32, width: '100%', maxWidth: 400 }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#C8102E', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', fontSize: 18, color: 'white', fontWeight: 700 }}>DB</div>
          <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0, color: '#1a1a1a' }}>Crear cuenta</h1>
          <p style={{ color: '#666', fontSize: 14, marginTop: 4 }}>Prode Defensores de Belgrano</p>
        </div>

        <div style={{ background: '#fff8e1', border: '1px solid #f59e0b', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#92400e', marginBottom: 16 }}>
          Tu cuenta será revisada y aprobada por el administrador antes de poder jugar.
        </div>

        {error && (
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: '10px 14px', color: '#991b1b', fontSize: 14, marginBottom: 16 }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 13, color: '#444', display: 'block', marginBottom: 4 }}>Nombre completo</label>
            <input type="text" required value={nombre} onChange={e => setNombre(e.target.value)}
              placeholder="Juan García"
              style={{ width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: 8, fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 13, color: '#444', display: 'block', marginBottom: 4 }}>Email</label>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
              placeholder="juan@email.com"
              style={{ width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: 8, fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 13, color: '#444', display: 'block', marginBottom: 4 }}>Contraseña</label>
            <input type="password" required value={password} onChange={e => setPassword(e.target.value)}
              placeholder="Mínimo 6 caracteres"
              style={{ width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: 8, fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 13, color: '#444', display: 'block', marginBottom: 4 }}>
              Número de socio <span style={{ color: '#C8102E' }}>*</span>
            </label>
            <input type="text" required value={nroSocio} onChange={e => setNroSocio(e.target.value)}
              placeholder="Ej: 4821"
              style={{ width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: 8, fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
            <p style={{ fontSize: 11, color: '#999', marginTop: 4 }}>Encontralo en tu carnet de socio</p>
          </div>
          <button type="submit" disabled={loading}
            style={{ width: '100%', padding: 11, background: '#C8102E', color: 'white', border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>
            {loading ? 'Enviando solicitud...' : 'Solicitar acceso'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 16, fontSize: 14, color: '#666' }}>
          ¿Ya tenés cuenta?{' '}
          <Link href="/login" style={{ color: '#C8102E', fontWeight: 600 }}>Iniciá sesión</Link>
        </p>
      </div>
    </div>
  );
}

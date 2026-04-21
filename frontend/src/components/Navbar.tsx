'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { clearAuth, getUser, isAdmin } from '@/lib/auth';

export default function Navbar() {
  const router = useRouter();
  const path = usePathname();
  const [user, setUser] = useState<any>(null);
  const [admin, setAdmin] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setUser(getUser());
    setAdmin(isAdmin());
  }, []);

  function logout() {
    clearAuth();
    router.push('/login');
  }

  const tabs = [
    { href: '/dashboard', label: 'Inicio' },
    { href: '/prode', label: 'Prode' },
    { href: '/ranking', label: 'Ranking' },
    { href: '/reglas', label: 'Reglas' },
    { href: '/perfil', label: 'Mi perfil' },
    ...(admin ? [{ href: '/admin', label: 'Admin' }] : []),
  ];

  return (
    <nav style={{ background: '#1a1a1a', padding: '0 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 52, position: 'sticky', top: 0, zIndex: 100 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#C8102E', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: 'white', fontWeight: 700 }}>
          DB
        </div>
        <span style={{ color: 'white', fontSize: 15, fontWeight: 500 }}>
          Prode <span style={{ color: '#C8102E' }}>Defensores</span>
        </span>
      </div>

      {/* Desktop tabs */}
      <div style={{ display: 'flex', gap: 2 }} className="desktop-nav">
        {tabs.map(t => (
          <Link key={t.href} href={t.href} style={{
            padding: '6px 10px',
            borderRadius: 6,
            fontSize: 12,
            color: path === t.href ? 'white' : '#aaa',
            background: path === t.href ? '#C8102E' : 'transparent',
            textDecoration: 'none',
            fontWeight: path === t.href ? 700 : 400,
          }}>
            {t.label}
          </Link>
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 12, color: '#aaa', display: 'none' }} className="username">{user?.nombre?.split(' ')[0]}</span>
        <button onClick={logout} style={{ fontSize: 12, color: '#aaa', background: 'transparent', border: '1px solid #444', borderRadius: 6, padding: '4px 10px', cursor: 'pointer' }}>
          Salir
        </button>
      </div>
    </nav>
  );
}

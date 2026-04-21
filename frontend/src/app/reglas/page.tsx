'use client';

import Navbar from '@/components/Navbar';
import Link from 'next/link';

export default function ReglasPage() {
  return (
    <>
      <Navbar />
      <div style={{ maxWidth: 600, margin: '0 auto', padding: 16 }}>

        <div style={{ background: '#1a1a1a', borderRadius: 12, padding: 20, marginBottom: 16, textAlign: 'center' }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#C8102E', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', fontSize: 22, color: 'white', fontWeight: 700 }}>DB</div>
          <h1 style={{ color: 'white', fontSize: 20, fontWeight: 700, margin: 0 }}>Prode Defensores</h1>
          <p style={{ color: '#aaa', fontSize: 13, marginTop: 4 }}>Cómo jugar</p>
        </div>

        {[
          {
            titulo: '¿Qué es el Prode?',
            texto: 'El Prode de Defensores de Belgrano es un juego de predicciones donde los socios pronostican los resultados de los partidos de la Zona A de la Primera Nacional temporada 2026.',
          },
          {
            titulo: '¿Cómo predecir?',
            texto: 'Antes de que empiece cada partido, entrá a la sección "Prode", elegí la fecha y seleccioná tu pronóstico: Local, Empate o Visita. También podés predecir el marcador exacto para sumar más puntos.',
          },
          {
            titulo: '¿Cuántos puntos se ganan?',
            items: [
              { label: 'Resultado correcto (L/E/V)', pts: '+1 punto' },
              { label: 'Marcador exacto', pts: '+3 puntos' },
              { label: 'Resultado incorrecto', pts: '0 puntos' },
            ],
          },
          {
            titulo: '¿Hasta cuándo puedo predecir?',
            texto: 'Podés modificar tus predicciones hasta que empiece el partido. Una vez que el árbitro da el pitazo inicial, el prode cierra automáticamente para ese partido.',
          },
          {
            titulo: 'Ranking',
            texto: 'Hay un ranking general con todos los puntos acumulados en la temporada. También podés ver el ranking de cada fecha. El socio con más puntos al final de la temporada gana.',
          },
          {
            titulo: '¿Cómo me registro?',
            texto: 'Completá el formulario de registro con tu nombre, email y número de socio. Un administrador revisará tu solicitud y te habilitará para jugar.',
          },
        ].map((s, i) => (
          <div key={i} style={{ background: 'white', borderRadius: 10, border: '1px solid #eee', padding: 20, marginBottom: 12 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: '#C8102E', marginTop: 0, marginBottom: 10 }}>{s.titulo}</h3>
            {s.texto && <p style={{ fontSize: 14, color: '#444', lineHeight: 1.6, margin: 0 }}>{s.texto}</p>}
            {s.items && (
              <div>
                {s.items.map((item: any, j: number) => (
                  <div key={j} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: j < s.items!.length - 1 ? '1px solid #f4f4f4' : 'none' }}>
                    <span style={{ fontSize: 14, color: '#444' }}>{item.label}</span>
                    <span style={{ fontSize: 14, fontWeight: 700, color: item.pts.startsWith('+3') ? '#C8102E' : item.pts.startsWith('+1') ? '#1a7a3c' : '#999' }}>{item.pts}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <Link href="/prode" style={{ display: 'inline-block', background: '#C8102E', color: 'white', padding: '12px 28px', borderRadius: 8, textDecoration: 'none', fontWeight: 700, fontSize: 15 }}>
            ¡Jugar ahora!
          </Link>
        </div>
      </div>
    </>
  );
}

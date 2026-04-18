import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Prode Defensores de Belgrano',
  description: 'Predicciones de la Primera Nacional',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}

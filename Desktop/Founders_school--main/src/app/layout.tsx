
import type {Metadata} from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import { ShootingStars } from '@/components/ui/shooting-stars';

export const metadata: Metadata = {
  title: 'Founders School | O\'zbekiston yetakchi startup asoschilari uchun',
  description: 'Ta\'lim, networking va investitsiya imkoniyatlari — endi telefoningizda. Founders School mobil ilovasini yuklab oling.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uz" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased bg-background text-foreground relative">
        <ThemeProvider>
          <ShootingStars />
          <div className="relative z-10">
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}

import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

// iOS San Francisco font fallback
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'UNDO - Reset Your Mind. Rebuild Your Life.',
    template: '%s | UNDO Recovery App'
  },
  description: 'A 100% free, web-based recovery app designed to help individuals break free from porn addiction through science-backed tools, community support, and AI-powered coaching.',
  keywords: [
    'recovery',
    'addiction recovery',
    'mental health',
    'porn addiction',
    'community support',
    'AI coaching',
    'anonymous support',
    'habit recovery',
    'streak tracking',
    'emergency support'
  ],
  authors: [{ name: 'UNDO Team' }],
  creator: 'UNDO Team',
  publisher: 'UNDO Recovery App',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://undo-app.com',
    title: 'UNDO - Reset Your Mind. Rebuild Your Life.',
    description: 'A 100% free recovery app with science-backed tools, anonymous community, and AI-powered coaching.',
    siteName: 'UNDO Recovery App',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'UNDO Recovery App - Anonymous Recovery Support',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'UNDO - Reset Your Mind. Rebuild Your Life.',
    description: 'Free recovery app with AI coaching, anonymous community, and science-backed tools.',
    images: ['/og-image.jpg'],
  },
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      { rel: 'mask-icon', url: '/safari-pinned-tab.svg', color: '#007AFF' },
    ],
  },
  manifest: '/manifest.json',
  category: 'health',
  classification: 'Health & Wellness',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F2F2F7' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
  colorScheme: 'light dark',
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full`}
      suppressHydrationWarning
    >
      <head>
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* DNS prefetch for API endpoints */}
        <link rel="dns-prefetch" href={process.env.NEXT_PUBLIC_API_URL} />

        {/* Meta tags for PWA */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="UNDO" />

        {/* Security meta tags */}
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="X-Frame-Options" content="DENY" />
        <meta httpEquiv="Referrer-Policy" content="strict-origin-when-cross-origin" />
        <meta name="format-detection" content="telephone=no" />

        {/* Performance and SEO */}
        <meta name="theme-color" content="#007AFF" />
        <meta name="application-name" content="UNDO Recovery App" />
        <meta name="apple-mobile-web-app-title" content="UNDO" />
        <meta name="msapplication-TileColor" content="#007AFF" />

        {/* Critical CSS for above-the-fold content */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
              /* Critical rendering path optimizations */
              body {
                opacity: 0;
                animation: fadeIn 0.3s ease-out forwards;
              }
              @keyframes fadeIn { to { opacity: 1; } }

              /* Prevent flash of unstyled content */
              .loading-fallback {
                background: rgb(var(--color-background));
                color: rgb(var(--color-text-primary));
              }

              /* Smooth entry animations */
              .page-enter {
                animation: pageEnter 0.4s var(--animation-spring-out);
              }
              @keyframes pageEnter {
                from {
                  opacity: 0;
                  transform: translateY(10px);
                }
                to {
                  opacity: 1;
                  transform: translateY(0);
                }
              }
            `,
          }}
        />
      </head>

      <body className="h-full antialiased">
        {/* Skip to main content for accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-[rgb(var(--color-system-blue))] text-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-white z-50"
        >
          Skip to main content
        </a>

        {/* Main content wrapper */}
        <div id="root" className="h-full">
          <div id="main-content" className="page-enter">
            {children}
          </div>
        </div>

        {/* Scripts for app functionality */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Service Worker registration
              if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/sw.js')
                    .then(registration => {
                      console.log('SW registered: ', registration);
                    })
                    .catch(registrationError => {
                      console.log('SW registration failed: ', registrationError);
                    });
                });
              }

              // Error tracking
              window.addEventListener('error', (event) => {
                console.error('Global error:', event.error);
                // Send to error tracking service
              });

              // Unhandled promise rejection tracking
              window.addEventListener('unhandledrejection', (event) => {
                console.error('Unhandled promise rejection:', event.reason);
                // Send to error tracking service
              });

              // Performance monitoring
              if ('performance' in window) {
                window.addEventListener('load', () => {
                  const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
                  const loadTime = perfData.loadEventEnd - perfData.loadEventStart;
                  console.log('Page load time:', loadTime);
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
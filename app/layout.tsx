import type { Metadata } from "next";
import { Noto_Sans_KR, Noto_Serif_KR } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthProvider";
import { PostHogProvider } from "@/lib/posthog/client";
import { ServiceWorkerRegister } from "@/components/notification/service-worker-register"
import { IosInstallBanner } from "@/components/notification/ios-install-banner";

const notoSans = Noto_Sans_KR({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700"],
});

const notoSerif = Noto_Serif_KR({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["400", "500", "600", "700"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://philoapp.kr'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: '오늘의철학',
    template: '%s | 오늘의철학',
  },
  description: '매일 1분, 철학과 친구되기. 나의 고민에 꼭 맞는 철학 처방을 받아보세요.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: '오늘의철학',
  },
  icons: {
    apple: '/apple-touch-icon.png',
    icon: [
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
  },
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    siteName: '오늘의철학',
    title: '오늘의철학',
    description: '매일 1분, 철학과 친구되기. 나의 고민에 꼭 맞는 철학 처방을 받아보세요.',
  },
  twitter: {
    card: 'summary_large_image',
    title: '오늘의철학',
    description: '매일 1분, 철학과 친구되기. 나의 고민에 꼭 맞는 철학 처방을 받아보세요.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${notoSans.variable} ${notoSerif.variable}`}>
      <body className="font-sans antialiased bg-background text-foreground">
        <PostHogProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </PostHogProvider>
        <ServiceWorkerRegister />
        <IosInstallBanner />
      </body>
    </html>
  );
}

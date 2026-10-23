import React from 'react';
import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { Shell } from '@/components/layout/Shell';
import '../globals.css';

export const metadata: Metadata = {
  title: 'DITS Online · Industrial Robots, Parts & Kits',
  description: 'Specialized B2B marketplace for humanoid robotics, quadruped platforms, joint actuators, and precision autonomous system components.',
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

interface RootLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function RootLayout({ children, params }: RootLayoutProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <html lang={locale} className="dark">
      <body className="antialiased bg-zinc-950 text-zinc-100">
        <NextIntlClientProvider messages={messages} locale={locale}>
          <Shell>{children}</Shell>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

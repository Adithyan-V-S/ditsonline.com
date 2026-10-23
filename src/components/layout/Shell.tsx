'use client';

import React, { useState } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { QuoteCartDrawer } from '@/components/cart/QuoteCartDrawer';
import { ContactWidgets } from '@/components/contact/ContactWidgets';

interface ShellProps {
  children: React.ReactNode;
}

export const Shell: React.FC<ShellProps> = ({ children }) => {
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isWeChatOpen, setIsWeChatOpen] = useState<boolean>(false);

  return (
    <div className="min-h-screen flex flex-col bg-zinc-950 text-zinc-100 selection:bg-cyan-500/30 selection:text-cyan-200">
      <Header onOpenCart={() => setIsCartOpen(true)} />
      <main className="flex-1">{children}</main>
      <Footer />

      <QuoteCartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onOpenWeChat={() => {
          setIsCartOpen(false);
          setIsWeChatOpen(true);
        }}
      />

      <ContactWidgets
        isWeChatOpen={isWeChatOpen}
        onCloseWeChat={() => setIsWeChatOpen(false)}
        onOpenWeChat={() => setIsWeChatOpen(true)}
      />
    </div>
  );
};

'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Phone, MessageSquare, Copy, Check, X, ExternalLink, Tv } from 'lucide-react';
import { getCartItems, formatWeChatMessage, formatWhatsAppUrl } from '@/lib/storage/cart-storage';

interface ContactWidgetsProps {
  isWeChatOpen: boolean;
  onCloseWeChat: () => void;
  onOpenWeChat: () => void;
}

export const ContactWidgets: React.FC<ContactWidgetsProps> = ({
  isWeChatOpen,
  onCloseWeChat,
  onOpenWeChat,
}) => {
  const t = useTranslations('contact');
  const [copied, setCopied] = useState<boolean>(false);
  const [channelsOpen, setChannelsOpen] = useState<boolean>(false);

  const cartItems = getCartItems();
  const wechatText = formatWeChatMessage(cartItems);
  const whatsAppUrl = formatWhatsAppUrl(cartItems);

  const handleCopy = () => {
    navigator.clipboard.writeText(wechatText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <>
      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 z-30 flex flex-col items-end gap-3">
        {/* WeChat Channels Trigger */}
        <button
          onClick={() => setChannelsOpen(true)}
          className="w-11 h-11 rounded-full bg-zinc-900 border border-white/10 hover:border-cyan-400 text-zinc-300 hover:text-cyan-400 flex items-center justify-center shadow-lg backdrop-blur-md transition-all hover:scale-105 group"
          title="WeChat Channels"
        >
          <Tv className="w-5 h-5" />
          <span className="sr-only">WeChat Channels</span>
        </button>

        {/* WeChat Direct Button */}
        <button
          id="wechat-floating-btn"
          onClick={onOpenWeChat}
          className="w-12 h-12 rounded-full bg-gradient-to-tr from-emerald-600 to-green-500 hover:from-emerald-500 hover:to-green-400 text-white flex items-center justify-center shadow-xl shadow-green-500/20 active:scale-95 transition-all"
          title="Chat on WeChat"
        >
          <MessageSquare className="w-6 h-6" />
          <span className="sr-only">WeChat</span>
        </button>

        {/* WhatsApp Direct Button */}
        <a
          id="whatsapp-floating-btn"
          href={whatsAppUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-12 h-12 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white flex items-center justify-center shadow-xl shadow-teal-500/20 active:scale-95 transition-all"
          title="WhatsApp Inquiry"
        >
          <Phone className="w-6 h-6" />
          <span className="sr-only">WhatsApp</span>
        </a>
      </div>

      {/* WeChat Modal Dialog */}
      {isWeChatOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-lg bg-zinc-900 border border-white/10 rounded-2xl p-6 shadow-2xl space-y-4 text-zinc-200">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-green-400" />
                <h3 className="font-bold text-base text-white">{t('wechatTitle')}</h3>
              </div>
              <button
                onClick={onCloseWeChat}
                className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-zinc-950/80 rounded-xl border border-white/5 space-y-1">
              <div className="text-xs font-mono text-zinc-400 uppercase">Official WeChat ID</div>
              <div className="text-base font-mono font-bold text-green-400 select-all">
                +86 135 1048 3282
              </div>
            </div>

            <p className="text-xs text-zinc-400 leading-relaxed">
              {t('wechatInstructions')}
            </p>

            <div className="space-y-1.5">
              <label className="text-[11px] font-mono text-zinc-400 uppercase">
                Generated Quote Message (Ready to paste)
              </label>
              <textarea
                readOnly
                rows={5}
                value={wechatText}
                className="w-full bg-zinc-950/90 text-zinc-300 font-mono text-xs p-3 rounded-xl border border-white/5 focus:outline-none select-all resize-none"
              />
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              <button
                onClick={handleCopy}
                className="flex-1 py-2 px-4 rounded-xl bg-green-600 hover:bg-green-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-green-600/20 transition-all"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? t('copied') : t('copyMessage')}</span>
              </button>

              <a
                href="weixin://"
                className="py-2 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>{t('openWechat')}</span>
              </a>

              <button
                onClick={onCloseWeChat}
                className="py-2 px-4 rounded-xl border border-white/10 hover:bg-white/5 text-zinc-400 text-xs transition-colors"
              >
                {t('close')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* WeChat Channels Modal */}
      {channelsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md bg-zinc-900 border border-white/10 rounded-2xl p-6 shadow-2xl space-y-4 text-zinc-200">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Tv className="w-5 h-5 text-cyan-400" />
                <h3 className="font-bold text-base text-white">{t('wechatChannel')}</h3>
              </div>
              <button
                onClick={() => setChannelsOpen(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-zinc-950/80 rounded-xl border border-white/5 text-center space-y-2">
              <div className="text-xs font-mono text-zinc-400">Search on WeChat Channels:</div>
              <div className="text-xl font-bold font-mono text-cyan-400 select-all">
                Rentobots
              </div>
            </div>

            <p className="text-xs text-zinc-400 leading-relaxed text-center">
              {t('channelInstructions')}
            </p>

            <button
              onClick={() => setChannelsOpen(false)}
              className="w-full py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold"
            >
              {t('close')}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

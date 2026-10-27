'use client';

import React, { useState } from 'react';
import {
  Wrench,
  GraduationCap,
  Globe2,
  Send,
  CheckCircle2,
  Mail,
  User,
  Building2,
  Clock,
  MessageCircle,
} from 'lucide-react';
import { submitServiceInquiry } from '@/lib/api/services';
import { ServiceInquiryResponse } from '../../../contracts/types';

interface ServiceInquiryFormProps {
  serviceType: 'repair' | 'education' | 'distribution' | 'general';
  title?: string;
  subtitle?: string;
  accentColor?: 'amber' | 'emerald' | 'cyan' | 'purple';
}

export const ServiceInquiryForm: React.FC<ServiceInquiryFormProps> = ({
  serviceType,
  title,
  subtitle,
  accentColor = 'cyan',
}) => {
  const [equipmentModel, setEquipmentModel] = useState<string>('');
  const [organizationName, setOrganizationName] = useState<string>('');
  const [contactName, setContactName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phoneOrSocial, setPhoneOrSocial] = useState<string>('');
  const [urgency, setUrgency] = useState<'immediate' | '1_month' | 'planning'>('immediate');
  const [details, setDetails] = useState<string>('');

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submittedResult, setSubmittedResult] = useState<ServiceInquiryResponse | null>(null);

  const colorStyles = {
    amber: {
      badgeBg: 'bg-amber-950/80 border-amber-800/40 text-amber-300',
      btnBg: 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 shadow-amber-600/25',
      focusBorder: 'focus:border-amber-500',
      icon: Wrench,
      defaultTitle: 'Request Maintenance & Calibration Intake',
      defaultSubtitle: 'Certified factory diagnostic, joint module harmonic actuator overhaul, or firmware calibration.',
    },
    emerald: {
      badgeBg: 'bg-emerald-950/80 border-emerald-800/40 text-emerald-300',
      btnBg: 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-emerald-600/25',
      focusBorder: 'focus:border-emerald-500',
      icon: GraduationCap,
      defaultTitle: 'Academic & Research Kit Inquiry',
      defaultSubtitle: 'Curriculum development packages, university research clusters, grant procurement support.',
    },
    cyan: {
      badgeBg: 'bg-cyan-950/80 border-cyan-800/40 text-cyan-300',
      btnBg: 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 shadow-cyan-600/25',
      focusBorder: 'focus:border-cyan-500',
      icon: Globe2,
      defaultTitle: 'Direct Factory Supply Chain Inquiry',
      defaultSubtitle: 'Volume freight logistics, customs export documentation, and direct factory distribution.',
    },
    purple: {
      badgeBg: 'bg-purple-950/80 border-purple-800/40 text-purple-300',
      btnBg: 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-purple-600/25',
      focusBorder: 'focus:border-purple-500',
      icon: Globe2,
      defaultTitle: 'General Service Inquiry',
      defaultSubtitle: 'Engineering consultation, system integration, and customized robotics solutions.',
    },
  }[accentColor];

  const IconComponent = colorStyles.icon;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !email || !details) return;

    setIsSubmitting(true);
    try {
      const res = await submitServiceInquiry({
        serviceType,
        equipmentModel,
        organizationName,
        contactName,
        email,
        phoneOrSocial,
        urgency,
        details,
      });
      setSubmittedResult(res);
    } catch (err) {
      console.error('Failed to submit service inquiry:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const whatsappMsg = encodeURIComponent(
    `Hello DITS Online! Inquiry regarding [${serviceType.toUpperCase()}]: ${details}. Equipment/Model: ${equipmentModel || 'N/A'}. Name: ${contactName || ''}`
  );
  const whatsappUrl = `https://wa.me/8613510483282?text=${whatsappMsg}`;

  if (submittedResult) {
    return (
      <div className="p-8 sm:p-10 rounded-3xl glass-card border border-emerald-500/40 text-center space-y-6 animate-fade-in shadow-2xl">
        <div className="w-16 h-16 mx-auto rounded-full bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <span className="px-3 py-1 rounded-full bg-emerald-950 text-emerald-300 font-mono text-xs font-bold border border-emerald-800">
            Case Ref #{submittedResult.inquiryId}
          </span>
          <h3 className="text-xl sm:text-2xl font-bold text-white">
            Inquiry Assigned to Application Engineering
          </h3>
          <p className="text-xs sm:text-sm text-zinc-300 max-w-lg mx-auto leading-relaxed">
            {submittedResult.message}
          </p>
        </div>

        <div className="pt-2 flex flex-wrap justify-center gap-3">
          <button
            onClick={() => setSubmittedResult(null)}
            className="px-6 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-white transition-colors"
          >
            Submit Another Request
          </button>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-2.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Connect on WhatsApp</span>
          </a>
        </div>
      </div>
    );
  }

  return (
    <form
      id={`service-inquiry-form-${serviceType}`}
      onSubmit={handleSubmit}
      className="p-6 sm:p-8 rounded-3xl glass-card border border-white/10 space-y-5 shadow-2xl"
    >
      <div className="border-b border-white/10 pb-4">
        <div
          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border font-mono text-xs font-bold mb-2 ${colorStyles.badgeBg}`}
        >
          <IconComponent className="w-3.5 h-3.5" />
          <span>Response SLA: Within 24h</span>
        </div>
        <h3 className="text-lg sm:text-xl font-bold text-white tracking-wide">
          {title || colorStyles.defaultTitle}
        </h3>
        <p className="text-xs text-zinc-400 mt-1">
          {subtitle || colorStyles.defaultSubtitle}
        </p>
      </div>

      <div className="space-y-3.5 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-mono text-zinc-400 mb-1">
              Target Hardware / Robot Model
            </label>
            <input
              id="service-model-input"
              type="text"
              value={equipmentModel}
              onChange={(e) => setEquipmentModel(e.target.value)}
              placeholder="e.g. Unitree Go2 Pro / Joint Motor 8118 / Jetson"
              className={`w-full bg-zinc-950 border border-white/10 rounded-xl px-3.5 py-2.5 text-zinc-100 placeholder-zinc-500 focus:outline-none ${colorStyles.focusBorder}`}
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono text-zinc-400 mb-1 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-zinc-400" />
              <span>Institution / Enterprise</span>
            </label>
            <input
              id="service-org-input"
              type="text"
              value={organizationName}
              onChange={(e) => setOrganizationName(e.target.value)}
              placeholder="e.g. Robotics Institute / Lab"
              className={`w-full bg-zinc-950 border border-white/10 rounded-xl px-3.5 py-2.5 text-zinc-100 placeholder-zinc-500 focus:outline-none ${colorStyles.focusBorder}`}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-[11px] font-mono text-zinc-400 mb-1 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-zinc-400" />
              <span>Contact Name *</span>
            </label>
            <input
              id="service-name-input"
              type="text"
              required
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              placeholder="e.g. Dr. Zhang / John"
              className={`w-full bg-zinc-950 border border-white/10 rounded-xl px-3.5 py-2.5 text-zinc-100 placeholder-zinc-500 focus:outline-none ${colorStyles.focusBorder}`}
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono text-zinc-400 mb-1 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-zinc-400" />
              <span>Work Email *</span>
            </label>
            <input
              id="service-email-input"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="contact@university.edu"
              className={`w-full bg-zinc-950 border border-white/10 rounded-xl px-3.5 py-2.5 text-zinc-100 placeholder-zinc-500 focus:outline-none ${colorStyles.focusBorder}`}
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono text-zinc-400 mb-1 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-zinc-400" />
              <span>Project Urgency</span>
            </label>
            <select
              id="service-urgency-select"
              value={urgency}
              onChange={(e) => setUrgency(e.target.value as any)}
              className={`w-full bg-zinc-950 border border-white/10 rounded-xl px-3.5 py-2.5 text-zinc-100 focus:outline-none ${colorStyles.focusBorder} cursor-pointer`}
            >
              <option value="immediate">Immediate / Urgent Need</option>
              <option value="1_month">Within 1 Month</option>
              <option value="planning">Long-Term Research Planning</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-mono text-zinc-400 mb-1">
            Requirement Specifications or Diagnostics *
          </label>
          <textarea
            id="service-details-input"
            rows={3}
            required
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            placeholder="Please detail your hardware symptoms, project objectives, required batch sizes, or laboratory specifications..."
            className={`w-full bg-zinc-950 border border-white/10 rounded-xl px-3.5 py-2.5 text-zinc-100 placeholder-zinc-500 focus:outline-none ${colorStyles.focusBorder} resize-none`}
          />
        </div>
      </div>

      <div className="pt-2 flex flex-col sm:flex-row gap-3">
        <button
          type="submit"
          id={`submit-service-btn-${serviceType}`}
          disabled={isSubmitting}
          className={`flex-1 py-3 rounded-xl ${colorStyles.btnBg} text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 transition-all cursor-pointer`}
        >
          <Send className="w-3.5 h-3.5" />
          <span>{isSubmitting ? 'Submitting Inquiry...' : 'Submit Engineering Service Inquiry'}</span>
        </button>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-3 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 text-emerald-300 font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-md shrink-0"
        >
          <MessageCircle className="w-4 h-4" />
          <span>WhatsApp Quick Inquire</span>
        </a>
      </div>
    </form>
  );
};

'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  Building2,
  Send,
  CheckCircle2,
  Globe,
  Briefcase,
  ShieldCheck,
  User,
  Mail,
  Phone,
  Layers,
  Sparkles,
} from 'lucide-react';
import { submitResellerApplication } from '@/lib/api/services';
import { ResellerApplicationResponse } from '../../../contracts/types';

const CHANNELS = [
  'Academic / University Research Labs',
  'Industrial & Enterprise Automation',
  'Commercial Robot Fleet Leasing',
  'System Integration & Turnkey Projects',
  'Regional Online & Retail Distribution',
];

const BRANDS = [
  'Unitree (Humanoid & Quadruped)',
  'AgiBot (Humanoid & Dexterous Hands)',
  'Booster Robotics (Humanoids & Kits)',
  'DITS Actuators & Harmonic Modules',
  'Dobot (Collaborative & Edu Arms)',
  'NVIDIA Jetson / Compute Carriers',
];

export const ResellerApplicationForm: React.FC = () => {
  const t = useTranslations('services');

  const [companyName, setCompanyName] = useState<string>('');
  const [taxRegistrationOrId, setTaxRegistrationOrId] = useState<string>('');
  const [website, setWebsite] = useState<string>('');
  const [targetRegion, setTargetRegion] = useState<string>('North America');
  const [distributionChannels, setDistributionChannels] = useState<string[]>([
    CHANNELS[0],
    CHANNELS[1],
  ]);
  const [brandsOfInterest, setBrandsOfInterest] = useState<string[]>([
    BRANDS[0],
    BRANDS[3],
  ]);
  const [annualProjectedVolume, setAnnualProjectedVolume] = useState<string>(
    '$50,000 – $200,000 USD'
  );
  const [applicantName, setApplicantName] = useState<string>('');
  const [applicantRole, setApplicantRole] = useState<string>('Managing Director / Procurement Lead');
  const [email, setEmail] = useState<string>('');
  const [phoneOrSocialHandle, setPhoneOrSocialHandle] = useState<string>('');
  const [companyBackground, setCompanyBackground] = useState<string>('');

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submittedResult, setSubmittedResult] = useState<ResellerApplicationResponse | null>(null);

  const toggleChannel = (item: string) => {
    setDistributionChannels((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const toggleBrand = (item: string) => {
    setBrandsOfInterest((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName || !applicantName || !email || !phoneOrSocialHandle) return;

    setIsSubmitting(true);
    try {
      const res = await submitResellerApplication({
        companyName,
        taxRegistrationOrId,
        website,
        targetRegion,
        distributionChannels,
        brandsOfInterest,
        annualProjectedVolume,
        applicantName,
        applicantRole,
        email,
        phoneOrSocialHandle,
        companyBackground,
      });
      setSubmittedResult(res);
    } catch (err) {
      console.error('Failed to submit reseller application:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submittedResult) {
    return (
      <div className="p-8 sm:p-10 rounded-3xl glass-card border border-rose-500/40 text-center space-y-6 animate-fade-in shadow-2xl">
        <div className="w-16 h-16 mx-auto rounded-full bg-rose-950/80 border border-rose-500/40 flex items-center justify-center text-rose-400">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <span className="px-3 py-1 rounded-full bg-rose-950 text-rose-300 font-mono text-xs font-bold border border-rose-800">
            Application Ref #{submittedResult.applicationId}
          </span>
          <h3 className="text-xl sm:text-2xl font-bold text-white">
            Reseller Partnership Application Dispatched
          </h3>
          <p className="text-xs sm:text-sm text-zinc-300 max-w-lg mx-auto leading-relaxed">
            {submittedResult.message}
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-zinc-950/80 border border-white/5 max-w-md mx-auto text-left space-y-2 text-xs font-mono text-zinc-300">
          <div className="flex justify-between">
            <span className="text-zinc-500">Applicant:</span>
            <span className="text-zinc-200">{applicantName} ({companyName})</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-500">Territory:</span>
            <span className="text-zinc-200">{targetRegion}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-500">Tier Review SLA:</span>
            <span className="text-rose-400 font-bold">{submittedResult.estimatedReviewDays} Business Days</span>
          </div>
        </div>

        <div className="pt-2">
          <button
            onClick={() => setSubmittedResult(null)}
            className="px-6 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-white transition-colors"
          >
            Submit Another Application
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      id="reseller-application-form"
      onSubmit={handleSubmit}
      className="p-6 sm:p-8 rounded-3xl glass-card border border-white/10 space-y-6 shadow-2xl"
    >
      <div className="border-b border-white/10 pb-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-950/80 border border-rose-800/40 text-rose-300 font-mono text-xs font-bold mb-2">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Global Channel Program</span>
        </div>
        <h3 className="text-lg sm:text-xl font-bold text-white tracking-wide">
          Authorized Trade Reseller Application
        </h3>
        <p className="text-xs text-zinc-400 mt-1">
          Access tiered B2B wholesale pricing, manufacturer direct warranties, demonstration hardware units, and technical field support.
        </p>
      </div>

      <div className="space-y-4 text-xs">
        {/* Company info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-mono text-zinc-400 mb-1.5 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-rose-400" />
              <span>Company / Entity Legal Name *</span>
            </label>
            <input
              id="reseller-company-name"
              type="text"
              required
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="e.g. Apex Robotics Dynamics Inc."
              className="w-full bg-zinc-950 border border-white/10 rounded-xl px-3.5 py-2.5 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-rose-500"
            />
          </div>
          <div>
            <label className="block text-[11px] font-mono text-zinc-400 mb-1.5 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-rose-400" />
              <span>Company Website / Portfolio</span>
            </label>
            <input
              id="reseller-website"
              type="url"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="https://apexrobotics.com"
              className="w-full bg-zinc-950 border border-white/10 rounded-xl px-3.5 py-2.5 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-rose-500"
            />
          </div>
        </div>

        {/* Region & Projected Volume */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-mono text-zinc-400 mb-1.5 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-rose-400" />
              <span>Primary Territory / Market *</span>
            </label>
            <select
              id="reseller-region-select"
              value={targetRegion}
              onChange={(e) => setTargetRegion(e.target.value)}
              className="w-full bg-zinc-950 border border-white/10 rounded-xl px-3.5 py-2.5 text-zinc-100 focus:outline-none focus:border-rose-500 cursor-pointer"
            >
              <option value="North America">North America (US & Canada)</option>
              <option value="European Union & UK">European Union & UK</option>
              <option value="East Asia & Japan / Korea">East Asia & Japan / Korea</option>
              <option value="Southeast Asia & India">Southeast Asia & India</option>
              <option value="Middle East & GCC">Middle East & GCC</option>
              <option value="Latin America & Oceania">Latin America & Oceania</option>
              <option value="Global / Multiregional">Global / Multiregional</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-mono text-zinc-400 mb-1.5 flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-rose-400" />
              <span>Estimated Annual Procurement Volume</span>
            </label>
            <select
              id="reseller-volume-select"
              value={annualProjectedVolume}
              onChange={(e) => setAnnualProjectedVolume(e.target.value)}
              className="w-full bg-zinc-950 border border-white/10 rounded-xl px-3.5 py-2.5 text-zinc-100 focus:outline-none focus:border-rose-500 cursor-pointer"
            >
              <option value="< $50,000 USD">&lt; $50,000 USD (Starter Partner)</option>
              <option value="$50,000 – $200,000 USD">$50,000 – $200,000 USD (Silver Tier)</option>
              <option value="$200,000 – $1,000,000 USD">$200,000 – $1,000,000 USD (Gold Tier)</option>
              <option value="> $1,000,000 USD">&gt; $1,000,000 USD (Platinum Regional Exclusive)</option>
            </select>
          </div>
        </div>

        {/* Channels Checkboxes */}
        <div>
          <label className="block text-[11px] font-mono text-zinc-400 mb-2 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-rose-400" />
            <span>Target Distribution Channels</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {CHANNELS.map((ch) => (
              <label
                key={ch}
                className={`flex items-center gap-2.5 p-2.5 rounded-xl border transition-colors cursor-pointer text-[11px] ${
                  distributionChannels.includes(ch)
                    ? 'bg-rose-950/40 border-rose-500/40 text-rose-200'
                    : 'bg-zinc-900/40 border-white/5 text-zinc-400 hover:border-white/10'
                }`}
              >
                <input
                  type="checkbox"
                  checked={distributionChannels.includes(ch)}
                  onChange={() => toggleChannel(ch)}
                  className="rounded bg-zinc-950 border-white/20 text-rose-600 focus:ring-rose-500 w-3.5 h-3.5"
                />
                <span>{ch}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Brands Checkboxes */}
        <div>
          <label className="block text-[11px] font-mono text-zinc-400 mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-rose-400" />
            <span>Robotics Hardware Brands of Interest</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {BRANDS.map((brand) => (
              <label
                key={brand}
                className={`flex items-center gap-2.5 p-2.5 rounded-xl border transition-colors cursor-pointer text-[11px] ${
                  brandsOfInterest.includes(brand)
                    ? 'bg-rose-950/40 border-rose-500/40 text-rose-200'
                    : 'bg-zinc-900/40 border-white/5 text-zinc-400 hover:border-white/10'
                }`}
              >
                <input
                  type="checkbox"
                  checked={brandsOfInterest.includes(brand)}
                  onChange={() => toggleBrand(brand)}
                  className="rounded bg-zinc-950 border-white/20 text-rose-600 focus:ring-rose-500 w-3.5 h-3.5"
                />
                <span>{brand}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Contact details */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div>
            <label className="block text-[11px] font-mono text-zinc-400 mb-1.5 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-zinc-400" />
              <span>Contact Officer Name *</span>
            </label>
            <input
              id="reseller-contact-name"
              type="text"
              required
              value={applicantName}
              onChange={(e) => setApplicantName(e.target.value)}
              placeholder="e.g. Jordan Lee"
              className="w-full bg-zinc-950 border border-white/10 rounded-xl px-3.5 py-2.5 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-rose-500"
            />
          </div>
          <div>
            <label className="block text-[11px] font-mono text-zinc-400 mb-1.5 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-zinc-400" />
              <span>Corporate Email *</span>
            </label>
            <input
              id="reseller-email-input"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="jordan.lee@apexrobotics.com"
              className="w-full bg-zinc-950 border border-white/10 rounded-xl px-3.5 py-2.5 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-rose-500"
            />
          </div>
          <div>
            <label className="block text-[11px] font-mono text-zinc-400 mb-1.5 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-zinc-400" />
              <span>Direct Phone / WhatsApp *</span>
            </label>
            <input
              id="reseller-phone-input"
              type="text"
              required
              value={phoneOrSocialHandle}
              onChange={(e) => setPhoneOrSocialHandle(e.target.value)}
              placeholder="+1 (555) 019-2834"
              className="w-full bg-zinc-950 border border-white/10 rounded-xl px-3.5 py-2.5 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-rose-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-mono text-zinc-400 mb-1.5">
            Company Background & Distribution Capabilities
          </label>
          <textarea
            id="reseller-background-input"
            rows={2}
            value={companyBackground}
            onChange={(e) => setCompanyBackground(e.target.value)}
            placeholder="Tell us about your technical sales force, local warehouse locations, demonstration showrooms, or existing client base."
            className="w-full bg-zinc-950 border border-white/10 rounded-xl px-3.5 py-2.5 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-rose-500 resize-none"
          />
        </div>
      </div>

      <div className="pt-2">
        <button
          type="submit"
          id="submit-reseller-btn"
          disabled={isSubmitting}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-rose-600/25 disabled:opacity-50 transition-all cursor-pointer"
        >
          <Send className="w-3.5 h-3.5" />
          <span>{isSubmitting ? 'Transmitting Credentials...' : 'Submit Reseller Partnership Application'}</span>
        </button>
      </div>
    </form>
  );
};

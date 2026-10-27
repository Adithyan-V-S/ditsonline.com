'use client';

import React, { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import {
  CalendarDays,
  Send,
  CheckCircle2,
  Bot,
  MapPin,
  Clock,
  User,
  Mail,
  Building2,
  ShieldCheck,
  MessageCircle,
} from 'lucide-react';
import { submitRentalInquiry } from '@/lib/api/services';
import { RentalInquiryResponse } from '../../../contracts/types';

interface RentalInquiryFormProps {
  defaultRobotModel?: string;
}

const ROBOT_OPTIONS = [
  'Unitree G1 Humanoid (Full-Size Biped)',
  'Unitree Go2 Quadruped Dog (With LiDAR)',
  'Unitree R1 Agile Humanoid Chassis',
  'AgiBot X2 Research Biped',
  'Booster T2 Industrial Humanoid',
  'Dobot Robotic Arm Educational Cluster',
  'Custom Mixed Fleet / Exhibition Cluster',
];

export const RentalInquiryForm: React.FC<RentalInquiryFormProps> = ({
  defaultRobotModel,
}) => {
  const t = useTranslations('services');
  const locale = useLocale();

  const [robotModel, setRobotModel] = useState<string>(
    defaultRobotModel || ROBOT_OPTIONS[0]
  );
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [needsTechnician, setNeedsTechnician] = useState<boolean>(true);
  const [customerName, setCustomerName] = useState<string>('');
  const [customerEmail, setCustomerEmail] = useState<string>('');
  const [company, setCompany] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submittedResult, setSubmittedResult] = useState<RentalInquiryResponse | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerEmail || !location) return;

    setIsSubmitting(true);
    try {
      const res = await submitRentalInquiry({
        robotModel,
        startDate: startDate || new Date().toISOString().split('T')[0],
        endDate: endDate || 'Flexible',
        location,
        needsTechnician,
        customerName,
        customerEmail,
        company,
        notes,
      });
      setSubmittedResult(res);
    } catch (err) {
      console.error('Failed to submit rental inquiry:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const whatsappMsg = encodeURIComponent(
    `Hello DITS Online! I want to inquire about renting: ${robotModel}. Location: ${location || 'TBD'}. Dates: ${startDate || 'ASAP'} to ${endDate || 'TBD'}. Technician needed: ${needsTechnician ? 'Yes' : 'No'}. Name: ${customerName || ''}`
  );
  const whatsappUrl = `https://wa.me/8613510483282?text=${whatsappMsg}`;

  if (submittedResult) {
    return (
      <div className="p-8 rounded-3xl glass-card border border-emerald-500/30 text-center space-y-5 animate-fade-in shadow-2xl">
        <div className="w-16 h-16 mx-auto rounded-full bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <div className="space-y-1">
          <span className="px-3 py-1 rounded-full bg-emerald-950 text-emerald-300 font-mono text-xs font-bold border border-emerald-800">
            Booking Ref #{submittedResult.rentalInquiryId}
          </span>
          <h3 className="text-xl font-bold text-white mt-2">
            Rental Fleet Inquiry Received
          </h3>
          <p className="text-xs text-zinc-300 max-w-md mx-auto leading-relaxed">
            {submittedResult.message}
          </p>
        </div>

        <div className="p-4 rounded-xl bg-zinc-950/80 border border-white/5 max-w-sm mx-auto text-left space-y-1.5 text-xs font-mono text-zinc-300">
          <div className="flex justify-between">
            <span className="text-zinc-500">Fleet Unit:</span>
            <span className="text-zinc-200 truncate max-w-[180px]">{robotModel}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-500">Deployment Location:</span>
            <span className="text-zinc-200">{location}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-500">On-site Support:</span>
            <span className="text-emerald-400 font-semibold">{needsTechnician ? 'Operator Dispatched' : 'Self-Piloted'}</span>
          </div>
        </div>

        <div className="pt-2 flex flex-wrap justify-center gap-3">
          <button
            onClick={() => setSubmittedResult(null)}
            className="px-6 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-white transition-colors"
          >
            Submit Another Rental Request
          </button>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-2.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Chat with Fleet Manager on WhatsApp</span>
          </a>
        </div>
      </div>
    );
  }

  return (
    <form
      id="rental-inquiry-form"
      onSubmit={handleSubmit}
      className="p-6 sm:p-8 rounded-3xl glass-card border border-white/10 space-y-6 shadow-2xl"
    >
      <div className="border-b border-white/10 pb-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/80 border border-purple-800/40 text-purple-300 font-mono text-xs font-bold mb-2">
          <CalendarDays className="w-3.5 h-3.5" />
          <span>Fleet Booking SLA: 24h</span>
        </div>
        <h3 className="text-lg sm:text-xl font-bold text-white tracking-wide">
          Request Robot Fleet Rental
        </h3>
        <p className="text-xs text-zinc-400 mt-1">
          Short-term exhibitions, academic research testing, TV commercials, and robotics pilot programs.
        </p>
      </div>

      <div className="space-y-4 text-xs">
        {/* Robot Choice */}
        <div>
          <label className="block text-[11px] font-mono text-zinc-400 mb-1.5 flex items-center gap-1.5">
            <Bot className="w-3.5 h-3.5 text-purple-400" />
            <span>Select Robot Model or Fleet *</span>
          </label>
          <select
            id="rental-model-select"
            value={robotModel}
            onChange={(e) => setRobotModel(e.target.value)}
            className="w-full bg-zinc-950 border border-white/10 rounded-xl px-3.5 py-2.5 text-zinc-100 focus:outline-none focus:border-purple-500 cursor-pointer"
          >
            {ROBOT_OPTIONS.map((opt) => (
              <option key={opt} value={opt} className="bg-zinc-900 text-zinc-100">
                {opt}
              </option>
            ))}
          </select>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-mono text-zinc-400 mb-1.5 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-purple-400" />
              <span>Rental Start Date</span>
            </label>
            <input
              id="rental-start-date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full bg-zinc-950 border border-white/10 rounded-xl px-3.5 py-2.5 text-zinc-100 focus:outline-none focus:border-purple-500"
            />
          </div>
          <div>
            <label className="block text-[11px] font-mono text-zinc-400 mb-1.5 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-purple-400" />
              <span>Rental End Date</span>
            </label>
            <input
              id="rental-end-date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full bg-zinc-950 border border-white/10 rounded-xl px-3.5 py-2.5 text-zinc-100 focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>

        {/* Location & Technician */}
        <div className="space-y-3">
          <div>
            <label className="block text-[11px] font-mono text-zinc-400 mb-1.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-purple-400" />
              <span>Deployment Location & City *</span>
            </label>
            <input
              id="rental-location-input"
              type="text"
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Shenzhen Exhibition Center / Berlin Tech Summit / Singapore"
              className="w-full bg-zinc-950 border border-white/10 rounded-xl px-3.5 py-2.5 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-purple-500"
            />
          </div>

          <label className="flex items-center gap-3 p-3 rounded-xl bg-zinc-900/60 border border-white/5 cursor-pointer hover:border-purple-500/40 transition-colors">
            <input
              id="rental-technician-checkbox"
              type="checkbox"
              checked={needsTechnician}
              onChange={(e) => setNeedsTechnician(e.target.checked)}
              className="rounded bg-zinc-950 border-white/20 text-purple-600 focus:ring-purple-500 w-4 h-4"
            />
            <div className="text-[11px]">
              <div className="font-semibold text-zinc-200">Include Certified Flight / Field Technician</div>
              <div className="text-zinc-400 text-[10px]">
                Recommended for live shows: professional on-site engineer handles calibration, live piloting, and battery swap logistics.
              </div>
            </div>
          </label>
        </div>

        {/* Contact details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div>
            <label className="block text-[11px] font-mono text-zinc-400 mb-1.5 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-zinc-400" />
              <span>Full Name *</span>
            </label>
            <input
              id="rental-name-input"
              type="text"
              required
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="e.g. Alex Morgan"
              className="w-full bg-zinc-950 border border-white/10 rounded-xl px-3.5 py-2.5 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-purple-500"
            />
          </div>
          <div>
            <label className="block text-[11px] font-mono text-zinc-400 mb-1.5 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-zinc-400" />
              <span>Work Email *</span>
            </label>
            <input
              id="rental-email-input"
              type="email"
              required
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              placeholder="alex@eventproduction.com"
              className="w-full bg-zinc-950 border border-white/10 rounded-xl px-3.5 py-2.5 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-mono text-zinc-400 mb-1.5 flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-zinc-400" />
            <span>Organization / Company</span>
          </label>
          <input
            id="rental-company-input"
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="e.g. Robotics Media Group Ltd."
            className="w-full bg-zinc-950 border border-white/10 rounded-xl px-3.5 py-2.5 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-purple-500"
          />
        </div>

        <div>
          <label className="block text-[11px] font-mono text-zinc-400 mb-1.5">
            Event Context or Specific Requirements
          </label>
          <textarea
            id="rental-notes-input"
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Describe stage setting, terrain (indoor carpet/outdoor grass), expected demo movements, or live stream schedules."
            className="w-full bg-zinc-950 border border-white/10 rounded-xl px-3.5 py-2.5 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-purple-500 resize-none"
          />
        </div>
      </div>

      <div className="pt-2 flex flex-col sm:flex-row gap-3">
        <button
          type="submit"
          id="submit-rental-btn"
          disabled={isSubmitting}
          className="flex-1 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-purple-600/25 disabled:opacity-50 transition-all cursor-pointer"
        >
          <Send className="w-3.5 h-3.5" />
          <span>{isSubmitting ? 'Checking Fleet Availability...' : 'Submit Rental Booking Request'}</span>
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

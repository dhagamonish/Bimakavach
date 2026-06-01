/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Home as HomeIcon, 
  Layers, 
  Activity as ActivityIcon, 
  BarChart3, 
  ArrowLeft, 
  MessageSquare, 
  Phone, 
  Check, 
  X, 
  ChevronRight, 
  Bell, 
  Zap, 
  Calendar, 
  TrendingUp, 
  Clock, 
  ChevronDown, 
  Sparkles, 
  Send, 
  AlertTriangle, 
  Shield, 
  User, 
  Search, 
  Filter,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { initialDeals, initialRMs, initialTimelineEvents } from './mockData';
import { Deal, RM, ScreenType, TimelineEvent } from './types';

export default function App() {
  // Navigation & State
  const [currentTab, setCurrentTab] = useState<'Home' | 'Pipeline' | 'Activity' | 'Reports'>('Home');
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('Home');
  const [selectedDealId, setSelectedDealId] = useState<number>(1);
  const [deals, setDeals] = useState<Deal[]>(initialDeals);
  const [timelineEvents, setTimelineEvents] = useState<Record<number, TimelineEvent[]>>(initialTimelineEvents);
  
  // Custom interactive triggers
  const [nudgeActive, setNudgeActive] = useState(true);
  const [vertexAutoConfirmActive, setVertexAutoConfirmActive] = useState(true);
  const [cloudBaseConfirmActive, setCloudBaseConfirmActive] = useState(true);
  const [showStageDropdownId, setShowStageDropdownId] = useState<number | null>(null);
  
  // Modals & Sheets
  const [showCallModal, setShowCallModal] = useState(false);
  const [callNotes, setCallNotes] = useState('');
  const [showUpsellModal, setShowUpsellModal] = useState(false);
  
  // Toast notifications
  const [toast, setToast] = useState<{ message: string; visible: boolean }>({ message: '', visible: false });
  
  // WhatsApp compose state
  const [whatsappDraft, setWhatsappDraft] = useState('');
  const [extraChatMessages, setExtraChatMessages] = useState<Array<{ sender: 'in' | 'out'; text: string; time: string; systemLabel?: string }>>([]);

  // Stats stats with animated count-up trigger
  const [stats, setStats] = useState({
    pipeline: 40,
    accuracy: 85,
    hoursSaved: 1.0,
    nudgesActed: 5
  });

  // Confirmed today list tracker
  const [confirmedToday, setConfirmedToday] = useState<Array<{ title: string; desc: string; icon: string }>>([
    { title: 'Razorpay FinTech → Discovery Done', desc: 'Confirmed by RM', icon: '✓' },
    { title: 'Mango Foods · Follow-up sent', desc: 'Client replied → now in Negotiation', icon: '🔔' },
    { title: 'TechPlex · Renewal flagged', desc: 'Calendar reminder set for next 28 days', icon: '✦' }
  ]);

  // Handle toast trigger helper
  const triggerToast = (message: string) => {
    setToast({ message, visible: true });
    setTimeout(() => {
      setToast(prev => ({ ...prev, visible: false }));
    }, 2500);
  };

  // Trigger count-up animation on screen enter/mount
  useEffect(() => {
    const timer1 = setTimeout(() => setStats(prev => ({ ...prev, pipeline: 48 })), 200);
    const timer2 = setTimeout(() => setStats(prev => ({ ...prev, accuracy: 94 })), 400);
    const timer3 = setTimeout(() => setStats(prev => ({ ...prev, hoursSaved: 1.8 })), 600);
    const timer4 = setTimeout(() => setStats(prev => ({ ...prev, nudgesActed: 7 })), 800);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [currentTab]);

  // Navigate forward with screen updates
  const handleDealSelection = (dealId: number) => {
    setSelectedDealId(dealId);
    setCurrentScreen('DealDetail');
  };

  // Confirm Vertex Auto-log
  const handleConfirmVertex = () => {
    setVertexAutoConfirmActive(false);
    triggerToast('Stage confirmed, saved to CRM');
    // Add to Confirmed Today feed
    setConfirmedToday(prev => [
      { title: 'Vertex Solutions → Stage Confirmed', desc: 'Auto-logged of Group Health cover approved', icon: '⚡' },
      ...prev
    ]);
    // Increase accuracy
    setStats(prev => ({ ...prev, accuracy: Math.min(prev.accuracy + 1, 100) }));
  };

  // Confirm Cloudbase Systems Lead Auto-log
  const handleConfirmCloudBase = () => {
    setCloudBaseConfirmActive(false);
    triggerToast('Lead Auto-creation verified, logged to CRM');
    setConfirmedToday(prev => [
      { title: 'CloudBase Systems → Lead Verified', desc: 'Lead confirmed from inbound WhatsApp query', icon: '⚡' },
      ...prev
    ]);
    setStats(prev => ({ ...prev, accuracy: Math.min(prev.accuracy + 1, 100) }));
  };

  // Snooze Techplex
  const handleSnoozeTechplex = () => {
    triggerToast('Nudge snoozed for 1 day');
  };

  // Handle manual stage edit from dropdown list
  const handleStageChange = (dealId: number, newStage: Deal['stage']) => {
    setDeals(prevDeals => 
      prevDeals.map(deal => deal.id === dealId ? { ...deal, stage: newStage, idle: 0 } : deal)
    );
    
    // Add timeline event
    const eventTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) + ', Today';
    const newEvent: TimelineEvent = {
      title: `Stage updated to ${newStage}`,
      sub: `RM manually changed deal stage in the CRM list.`,
      time: eventTime,
      type: 'system',
      isAuto: false
    };
    
    setTimelineEvents(prev => ({
      ...prev,
      [dealId]: [newEvent, ...(prev[dealId] || [])]
    }));

    setShowStageDropdownId(null);
    if (dealId === 2) setVertexAutoConfirmActive(false);
    if (dealId === 5) setCloudBaseConfirmActive(false);
    
    triggerToast(`Stage updated to ${newStage}`);
  };

  // WhatsApp Draft Click Fill
  const handleDraftFill = () => {
    setWhatsappDraft("Hi Rajeev, just checking in on the quote we shared. Happy to answer any questions!");
    triggerToast('Draft template applied to box');
  };

  // Handle WhatsApp Outgoing Send action
  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!whatsappDraft.trim()) return;

    const textToSend = whatsappDraft;
    const messageTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    
    // Append message
    setExtraChatMessages(prev => [
      ...prev,
      { sender: 'out', text: textToSend, time: messageTime }
    ]);
    
    setWhatsappDraft('');
    triggerToast('Message sent · Stage updated');

    // Update TechPlex Infra deal id #1 as being actively followed up!
    setDeals(prev => 
      prev.map(d => d.id === 1 ? { ...d, idle: 0, stage: 'Quote Shared' } : d)
    );

    // Save timeline log to TechPlex
    const newEvent: TimelineEvent = {
      title: 'Follow-up WhatsApp sent',
      sub: `RM sent text: "${textToSend.substring(0, 48)}..."`,
      time: 'Today, ' + messageTime,
      type: 'whatsapp',
      isAuto: false
    };
    setTimelineEvents(prev => ({
      ...prev,
      1: [newEvent, ...(prev[1] || [])]
    }));

    // Auto navigate back to previously focused screen after a slight delay
    setTimeout(() => {
      setCurrentScreen('DealDetail');
    }, 1500);
  };

  // Save logged call from modal
  const handleSaveCall = () => {
    if (!callNotes.trim()) {
      triggerToast('Please type brief call notes');
      return;
    }
    
    const timeStr = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const newEvent: TimelineEvent = {
      title: 'Call logged with client',
      sub: `Notes: "${callNotes}"`,
      time: 'Today, ' + timeStr,
      type: 'call',
      isAuto: false
    };

    setTimelineEvents(prev => ({
      ...prev,
      [selectedDealId]: [newEvent, ...(prev[selectedDealId] || [])]
    }));

    // Reset idle days to 0 upon call log
    setDeals(prev => 
      prev.map(d => d.id === selectedDealId ? { ...d, idle: 0 } : d)
    );

    setShowCallModal(false);
    setCallNotes('');
    triggerToast('Call logged, saved to CRM');
  };

  // Active deal details context helper
  const selectedDeal = deals.find(d => d.id === selectedDealId) || deals[0];

  // Pipeline Filter Chip selections
  const [pipelineFilter, setPipelineFilter] = useState<'All' | 'New Lead' | 'Discovery' | 'Quote' | 'Closed'>('All');

  // Filtered deals matching Pipeline settings
  const filteredDeals = deals.filter(d => {
    if (pipelineFilter === 'All') return true;
    if (pipelineFilter === 'Quote') return d.stage === 'Quote Shared';
    return d.stage === pipelineFilter;
  });

  // Reusable responsive Deal Card component
  const DealCard = ({ deal, onClick }: { deal: Deal; onClick: () => void }) => {
    const getStageBadge = (stage: Deal['stage']) => {
      switch(stage) {
        case 'New Lead': return { bg: 'bg-indigo-50 border-indigo-100 text-indigo-700', bullet: '#6366F1' };
        case 'Discovery': return { bg: 'bg-teal-50 border-teal-100 text-teal-700', bullet: '#0D9488' };
        case 'Quote Shared': return { bg: 'bg-amber-50 border-amber-100 text-amber-600', bullet: '#F59E0B' };
        case 'Negotiation': return { bg: 'bg-purple-50 border-purple-100 text-purple-700', bullet: '#8B5CF6' };
        case 'Closed': return { bg: 'bg-emerald-50 border-emerald-100 text-emerald-700', bullet: '#10B981' };
      }
    };
    const badgeStyle = getStageBadge(deal.stage);
    const isIdle = deal.idle > 2;

    return (
      <motion.div
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        className="bg-white rounded-xl overflow-hidden shadow-xs border border-slate-200/80 hover:border-blue-300 hover:shadow-md cursor-pointer p-3.5 transition-all text-left"
      >
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2.5 min-w-0">
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-[11px] text-slate-700 shrink-0"
              style={{ backgroundColor: deal.color + '20' }}
            >
              {deal.initials}
            </div>
            <div className="min-w-0">
              <h4 className="text-[13px] font-bold text-slate-900 leading-tight truncate">{deal.company}</h4>
              <p className="text-[10.5px] text-slate-500 mt-0.5 truncate">{deal.products.join(' + ')} · {deal.contact}</p>
            </div>
          </div>
          <div className="text-right shrink-0 ml-2">
            <p className="text-[12px] font-bold text-[#0F2044] leading-tight">{deal.value}</p>
            <p className={`text-[9.5px] mt-0.5 font-semibold ${isIdle ? 'text-red-500 font-bold' : 'text-slate-400'}`}>
              {deal.idle === 0 ? 'Today' : `${deal.idle}d idle`}
            </p>
          </div>
        </div>

        {/* Deal specific custom tags */}
        <div className="flex flex-wrap gap-1.5 mt-3 select-none">
          <span className={`text-[9px] px-1.5 py-0.5 rounded-full border ${badgeStyle.bg} font-medium`}>
            {deal.stage}
          </span>

          {deal.id === 1 && (
            <>
              {isIdle && (
                <span className="bg-red-50 text-red-600 text-[9px] font-bold px-1.5 py-0.5 rounded-full border border-red-100 flex items-center gap-1">
                  <AlertTriangle className="w-2.5 h-2.5 text-red-500" />
                  Idle
                </span>
              )}
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setShowUpsellModal(true);
                }}
                className="bg-[#0F2044]/5 hover:bg-[#0F2044]/10 text-[#0F2044] text-[9px] font-bold px-1.5 py-0.5 rounded-full border border-slate-200/70 flex items-center gap-1 animate-pulse"
              >
                Cyber upsell ↗
              </button>
            </>
          )}

          {deal.id === 2 && (
            <>
              {deal.autoLogged && (
                <span className="bg-teal-50 text-teal-700 text-[9px] font-bold px-1.5 py-0.5 rounded-full border border-teal-100">
                  ✦ Auto-logged
                </span>
              )}
              <span className="bg-orange-50 text-orange-600 text-[9px] font-bold px-1.5 py-0.5 rounded-full border border-orange-100">
                Warm
              </span>
            </>
          )}

          {deal.id === 4 && (
            <span className="bg-[#1A56A4]/10 text-[#1A56A4] text-[9px] font-bold px-1.5 py-0.5 rounded-full border border-blue-100">
              Discovery done AUTO
            </span>
          )}

          {deal.id === 5 && (
            <span className="bg-indigo-50 text-indigo-700 text-[9px] font-bold px-1.5 py-0.5 rounded-full border border-indigo-100">
              ✦ Auto-created from WhatsApp
            </span>
          )}
        </div>

        {deal.id === 3 && (
          <div className="mt-3">
            <div className="flex justify-between text-[9px] text-slate-400 font-medium mb-1">
              <span>82% likely to close</span>
              <span>3 days in negotiation</span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: '82%' }}
                transition={{ duration: 0.6 }}
                className="bg-purple-600 h-full"
              />
            </div>
          </div>
        )}
      </motion.div>
    );
  };

  // Helper to render stage columns dynamically
  const renderStageColumn = (stageName: Deal['stage'], colorClass: string, icon: string) => {
    const stageDeals = filteredDeals.filter(d => d.stage === stageName);
    const totalValue = stageDeals.reduce((sum, d) => {
      const val = parseFloat(d.value.replace(/[^0-9.]/g, '')) || 0;
      return sum + val;
    }, 0).toFixed(1);

    return (
      <div className="flex flex-col shrink-0 w-full md:w-72 bg-slate-100/50 md:bg-slate-50 border border-slate-200/60 rounded-xl p-3 md:h-full md:max-h-[calc(100vh-140px)] overflow-y-auto no-scrollbar">
        <div className="flex justify-between items-center mb-3 select-none">
          <span className={`text-[10px] font-bold tracking-wider uppercase ${colorClass}`}>
            {icon} {stageName} ({stageDeals.length})
          </span>
          <span className="text-[10.5px] font-bold text-slate-500 font-mono">₹{totalValue}L</span>
        </div>
        <div className="space-y-3">
          {stageDeals.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-400 border border-dashed border-slate-200 rounded-lg">
              No deals in this stage
            </div>
          ) : (
            stageDeals.map(deal => (
              <DealCard 
                key={deal.id} 
                deal={deal} 
                onClick={() => handleDealSelection(deal.id)} 
              />
            ))
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="h-screen h-svh w-full bg-slate-100 flex flex-col md:flex-row selection:bg-blue-600 selection:text-white font-sans text-slate-800 overflow-hidden">
      
      {/* Dynamic Toast Element */}
      <AnimatePresence>
        {toast.visible && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="fixed bottom-24 z-50 bg-slate-900 border border-slate-700/80 text-white text-xs px-5 py-3 rounded-full flex items-center gap-2 shadow-2xl"
          >
            <Sparkles className="w-4 h-4 text-teal-400 animate-pulse" />
            <span className="font-medium">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cyber recommendation Modal */}
      <AnimatePresence>
        {showUpsellModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white rounded-2xl p-6 max-w-xs w-full text-left shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-violet-600 to-blue-500" />
              <div className="flex items-start gap-3 mt-1">
                <div className="p-2 bg-violet-100 rounded-xl text-violet-600 shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 text-sm">Nagpur Expansion Lead AI</h4>
                  <p className="text-xs text-slate-500 mt-0.5">MCA Filing Intelligence Match</p>
                </div>
              </div>
              <p className="text-xs text-slate-700 mt-4 leading-relaxed">
                TechPlex Infra registered a new logistics facility in Nagpur last month. Since their current Fire Policy covers Pune only, they are crucially underinsured.
              </p>
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 mt-3 text-xs text-slate-600">
                <span className="font-bold text-violet-700 font-mono text-[10px]">PITCH DEALS:</span>
                <div className="mt-1 flex flex-col gap-1">
                  <div>• Asset expansion cover (₹2.1L Premium)</div>
                  <div>• Cyber Security Liability add-on (₹85k)</div>
                </div>
              </div>
              <div className="flex gap-2 mt-5">
                <button 
                  onClick={() => {
                    setShowUpsellModal(false);
                    setWhatsappDraft("Hi Rajeev, noticed your warehouse footprint expanding to Nagpur. Would you like to review an Asset + Cyber liability safety cover estimate for the new premises?");
                    setCurrentScreen('WhatsAppChat');
                    triggerToast('Created quote discussion flow');
                  }}
                  className="flex-1 py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold text-center transition-colors"
                >
                  Configure Pitch
                </button>
                <button 
                  onClick={() => setShowUpsellModal(false)}
                  className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Manual call logger Modal */}
      <AnimatePresence>
        {showCallModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-end justify-center"
            onClick={() => setShowCallModal(false)}
          >
            <motion.div 
              initial={{ y: 200 }}
              animate={{ y: 0 }}
              exit={{ y: 200 }}
              transition={{ type: 'spring', damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-t-2xl max-w-[390px] w-full p-5 text-left shadow-2xl border-t border-slate-200"
            >
              <div className="w-12 h-1 bg-slate-300 rounded-full mx-auto mb-4" />
              <div className="flex justify-between items-center mb-1">
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  <Phone className="w-4 h-4 text-emerald-600" />
                  Log Voice Call Info
                </h3>
                <button 
                  onClick={() => setShowCallModal(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-slate-500 mb-4">{selectedDeal.company} · {selectedDeal.contact}</p>
              
              <div className="space-y-3">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Quick Templates</label>
                <div className="flex flex-wrap gap-1.5">
                  <button 
                    onClick={() => setCallNotes("Spoke with client. Confirmed quote is reasonable. Scheduled final decision review email.")}
                    className="text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-700 py-1 px-2 rounded-md transition-colors"
                  >
                    “Agreed to Quote”
                  </button>
                  <button 
                    onClick={() => setCallNotes("Discussing deductibles reduction. ICICI Lombard rates preferred. Will update tomorrow.")}
                    className="text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-700 py-1 px-2 rounded-md transition-colors"
                  >
                    “Negotiating rates”
                  </button>
                  <button 
                    onClick={() => setCallNotes("Client requested callback on Friday next week to consult their CFO.")}
                    className="text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-700 py-1 px-2 rounded-md transition-colors"
                  >
                    “Busy, Call back”
                  </button>
                </div>

                <div className="mt-3">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Call Summary & Next Actions</label>
                  <textarea 
                    value={callNotes}
                    onChange={(e) => setCallNotes(e.target.value)}
                    placeholder="Provide details about what discussions happened..."
                    className="w-full h-24 border border-slate-200 rounded-lg p-2 text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-800"
                  />
                </div>
              </div>

              <div className="flex gap-2.5 mt-5">
                <button 
                  onClick={handleSaveCall}
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold text-center transition-colors"
                >
                  ✓ Confirm Call Note
                </button>
                <button 
                  onClick={() => setShowCallModal(false)}
                  className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sidebar for Desktop */}
      <div className="hidden md:flex w-64 bg-[#0F2044] text-white flex-col shrink-0 border-r border-slate-800">
        <div className="p-6 border-b border-slate-850 flex items-center gap-3">
          <div className="p-2 bg-blue-650 rounded-lg text-white">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-sm tracking-tight text-white leading-none">Bimakavach</h1>
            <span className="text-[9px] font-mono text-slate-400">AUTOPILOT CRM</span>
          </div>
        </div>
        
        <div className="p-4 border-b border-slate-850 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-amber-500 flex items-center justify-center font-bold text-xs text-slate-950 shadow-inner ring-2 ring-amber-400/30">
            AK
          </div>
          <div className="min-w-0">
            <h3 className="text-xs font-bold text-white truncate">Arjun Kumar</h3>
            <p className="text-[10px] text-slate-400">9 Active Deals</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <button 
            onClick={() => {
              setCurrentTab('Home');
              setCurrentScreen('Home');
            }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              currentTab === 'Home' && currentScreen === 'Home' 
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20' 
                : 'text-slate-350 hover:text-white hover:bg-slate-800/40'
            }`}
          >
            <HomeIcon className="w-4 h-4" />
            <span>Home</span>
          </button>

          <button 
            onClick={() => {
              setCurrentTab('Pipeline');
              setCurrentScreen('Home');
            }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              currentTab === 'Pipeline' && currentScreen === 'Home' 
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20' 
                : 'text-slate-350 hover:text-white hover:bg-slate-800/40'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Pipeline</span>
          </button>

          <button 
            onClick={() => {
              setCurrentTab('Activity');
              setCurrentScreen('Home');
            }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer relative ${
              currentTab === 'Activity' && currentScreen === 'Home' 
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20' 
                : 'text-slate-350 hover:text-white hover:bg-slate-800/40'
            }`}
          >
            <div className="relative">
              <ActivityIcon className="w-4 h-4" />
              {(vertexAutoConfirmActive || cloudBaseConfirmActive) && (
                <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-amber-500 rounded-full" />
              )}
            </div>
            <span>Activity</span>
          </button>

          <button 
            onClick={() => {
              setCurrentTab('Reports');
              setCurrentScreen('Home');
            }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              currentTab === 'Reports' && currentScreen === 'Home' 
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20' 
                : 'text-slate-355 hover:text-white hover:bg-slate-800/40'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Reports</span>
          </button>
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full bg-slate-50 overflow-hidden relative select-none">
        
        {/* Dynamic Notch / Status Bar */}
        <div className="hidden bg-[#0F2044] text-white pt-3 pb-1 px-6 justify-between items-center text-[11px] font-semibold shrink-0 z-40 relative">
          <span>9:41 AM</span>
          <div className="absolute top-1 left-1/2 -translate-x-1/2 w-28 h-4.5 bg-black rounded-full" />
          <div className="flex items-center gap-1.5 font-mono text-[10px]">
            <span>Bima-5G</span>
            <div className="flex gap-0.5 items-end h-2 w-3">
              <span className="w-0.5 h-1 bg-white" />
              <span className="w-0.5 h-1.5 bg-white" />
              <span className="w-0.5 h-2 bg-white" />
              <span className="w-0.5 h-2.5 bg-white" />
            </div>
            <span className="text-[10px]">98%</span>
            <div className="w-4 h-2 border border-white/60 rounded-[3px] p-[1px] flex items-center">
              <div className="h-full w-full bg-emerald-400 rounded-[1px]" />
            </div>
          </div>
        </div>

        {/* APP MAIN WRAPPER BODY */}
        <div className="flex-1 overflow-y-auto no-scrollbar relative flex flex-col">
          
          {/* ════════════════════════════════════════════════════════════════ */}
          {/* SCREEN 1 ─ HOME DASHBOARD */}
          {/* ════════════════════════════════════════════════════════════════ */}
          {currentScreen === 'Home' && currentTab === 'Home' && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col"
            >
              <div className="bg-[#0F2044] text-white px-4 pt-3 pb-5 shadow-sm tracking-tight relative overflow-hidden shrink-0">
                <div className="absolute inset-0 bg-radial-at-t from-[#1E3A8A]/30 to-transparent pointer-events-none" />
                <div className="flex justify-between items-center relative z-10">
                  <div>
                    <h1 className="text-[17px] font-semibold flex items-center gap-1.5">
                      Good morning, Arjun <span className="animate-bounce inline-block">👋</span>
                    </h1>
                    <p className="text-[11px] text-slate-300 font-medium mt-0.5">
                      Monday, 2 Jun 2025 · 9 active deals
                    </p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center font-bold text-xs text-slate-950 shadow-inner ring-2 ring-amber-400/30">
                    AK
                  </div>
                </div>
              </div>

              {/* Scrollable Area */}
              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 no-scrollbar">
                
                {/* 1. NUDGE CARD */}
                <AnimatePresence>
                  {nudgeActive && (
                    <motion.div
                      key="nudge"
                      initial={{ opacity: 1, scale: 1, height: 'auto' }}
                      exit={{ opacity: 0, scale: 0.9, height: 0, marginBottom: 0, overflow: 'hidden' }}
                      transition={{ duration: 0.3 }}
                      className="bg-gradient-to-br from-amber-500/10 to-amber-600/5 border border-amber-500/20 rounded-xl p-4 shadow-sm"
                    >
                      <div className="flex items-start gap-2.5">
                        <span className="text-base">🔔</span>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-[13px] font-semibold text-amber-800">Follow-up due · TechPlex Infra</h4>
                          <p className="text-[11.5px] text-slate-600 mt-1 leading-relaxed">
                            Quote shared 3 days ago — no response yet. Want to send a follow-up?
                          </p>
                          <div className="flex gap-2 mt-3">
                            <button 
                              onClick={() => {
                                setSelectedDealId(1);
                                setWhatsappDraft("Hi Rajeev, just checking in on the quote we shared. Happy to answer any questions!");
                                setCurrentScreen('WhatsAppChat');
                              }}
                              className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 text-[11px] font-bold rounded-lg transition-colors flex items-center gap-1"
                            >
                              Send follow-up →
                            </button>
                            <button 
                              onClick={() => {
                                setNudgeActive(false);
                                triggerToast('Follow-up nudge dismissed');
                              }}
                              className="px-3 py-1.5 bg-slate-200/80 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold rounded-lg transition-colors"
                            >
                              Dismiss
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* 2. AUTO-LOG CONFIRMATION CARD */}
                <AnimatePresence>
                  {vertexAutoConfirmActive && (
                    <motion.div
                      key="autolog"
                      initial={{ opacity: 1, scale: 1, height: 'auto' }}
                      exit={{ opacity: 0, scale: 0.9, height: 0, marginBottom: 0, overflow: 'hidden' }}
                      transition={{ duration: 0.3 }}
                      className="bg-gradient-to-br from-teal-500/10 to-teal-600/5 border border-teal-500/20 rounded-xl p-4 shadow-sm relative"
                    >
                      <div className="flex items-start gap-2.5">
                        <span className="text-teal-600 text-sm animate-pulse">⚡</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center">
                            <h4 className="text-[13px] font-semibold text-slate-900">Auto-logged · Vertex Solutions</h4>
                            <span className="bg-teal-500/20 text-teal-700 text-[9px] font-bold font-mono px-1.5 py-0.5 rounded-[4px]">⚡ AUTO</span>
                          </div>
                          <p className="text-[11.5px] text-slate-600 mt-1 leading-relaxed">
                            Stage moved to <span className="font-semibold text-teal-800">Quote Shared</span> — detected from your email. Correct?
                          </p>
                          
                          {/* Inline editable dropdown button */}
                          <div className="flex gap-2 mt-3 items-center">
                            <button 
                              onClick={handleConfirmVertex}
                              className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white text-[11px] font-bold rounded-lg transition-colors"
                            >
                              ✓ Confirm
                            </button>
                            
                            <div className="relative">
                              <button 
                                onClick={() => setShowStageDropdownId(showStageDropdownId === 2 ? null : 2)}
                                className="px-3 py-1.5 bg-slate-200/80 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold rounded-lg flex items-center gap-1 transition-all"
                              >
                                Edit 
                                <ChevronDown className="w-3 h-3 text-slate-500" />
                              </button>

                              {/* Stage selector dropdown popup */}
                              <AnimatePresence>
                                {showStageDropdownId === 2 && (
                                  <motion.div 
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="absolute right-0 bottom-full mb-1 z-20 bg-white border border-slate-200 rounded-xl shadow-xl p-1.5 w-36 text-xs text-slate-700"
                                  >
                                    <p className="text-[9px] font-bold text-slate-400 p-1 uppercase tracking-wider">Correct Stage</p>
                                    {(['New Lead', 'Discovery', 'Quote Shared', 'Negotiation', 'Closed'] as const).map((stg) => (
                                      <button
                                        key={stg}
                                        onClick={() => handleStageChange(2, stg)}
                                        className="w-full text-left p-2 rounded-md hover:bg-slate-100 transition-colors shrink-0 "
                                      >
                                        {stg}
                                      </button>
                                    ))}
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* 3. STATS GRID */}
                <div>
                  <label className="block text-[10px] font-bold font-mono text-slate-500 uppercase tracking-widest mb-2.5">
                    KEY VALUE METRICS
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                    <div className="bg-white p-3.5 rounded-xl border border-slate-200/85 shadow-xs flex flex-col justify-between">
                      <p className="text-[11px] font-semibold text-slate-500">Pipeline value</p>
                      <div className="mt-1 flex items-baseline gap-1.5">
                        <span className="text-[22px] font-bold text-[#0F2044]">₹{stats.pipeline}L</span>
                        <span className="text-[10px] text-emerald-600 font-bold flex items-center">
                          <TrendingUp className="w-3 h-3 inline mr-0.5" />12%
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 mt-1.5 font-medium">↑ this week</span>
                    </div>

                    <div className="bg-white p-3.5 rounded-xl border border-slate-200/85 shadow-xs flex flex-col justify-between">
                      <p className="text-[11px] font-semibold text-slate-500">CRM accuracy</p>
                      <div className="mt-1 flex items-baseline gap-1.5">
                        <span className="text-[22px] font-bold text-[#0F2044]">{stats.accuracy}%</span>
                        <span className="text-[10px] text-emerald-600 font-bold">↑ 40%</span>
                      </div>
                      <span className="text-[10px] text-slate-400 mt-1.5 font-medium">AI auto-saves</span>
                    </div>

                    <div className="bg-white p-3.5 rounded-xl border border-slate-200/85 shadow-xs flex flex-col justify-between">
                      <p className="text-[11px] font-semibold text-slate-500">Admin time saved</p>
                      <div className="mt-1 flex items-baseline gap-1">
                        <span className="text-[22px] font-bold text-[#0F2044]">{stats.hoursSaved}h</span>
                        <span className="text-[10px] text-slate-500">/day</span>
                      </div>
                      <span className="text-[10px] text-teal-600 font-semibold mt-1.5">Target 1.5h ✓</span>
                    </div>

                    <div className="bg-white p-3.5 rounded-xl border border-slate-200/85 shadow-xs flex flex-col justify-between">
                      <p className="text-[11px] font-semibold text-slate-500">Nudges acted on</p>
                      <div className="mt-1 flex items-baseline gap-1.5">
                        <span className="text-[22px] font-bold text-[#0F2044]">{stats.nudgesActed}/9</span>
                        <span className="text-[10px] text-amber-600 font-bold">78%</span>
                      </div>
                      <span className="text-[10px] text-slate-400 mt-1.5 font-medium">Nudge CTR</span>
                    </div>
                  </div>
                </div>

                {/* Grid for main sections */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                  
                  {/* Left Section (2/3 width on desktop) */}
                  <div className="md:col-span-2 space-y-6">
                    {/* Active Deals list */}
                    <div>
                      <div className="flex justify-between items-center mb-2.5">
                        <label className="block text-[10px] font-bold font-mono text-slate-500 uppercase tracking-widest">
                          ACTIVE DEALS (MILLER'S LIMIT)
                        </label>
                        <span className="text-[11px] text-[#1A56A4] font-semibold hover:underline cursor-pointer" onClick={() => setCurrentTab('Pipeline')}>
                          View all ({deals.length})
                        </span>
                      </div>

                      <div className="space-y-2">
                        {deals.slice(0, 4).map((deal) => {
                          const getStageBadge = (stage: Deal['stage']) => {
                            switch(stage) {
                              case 'New Lead': return { bg: 'bg-indigo-50 border-indigo-100 text-indigo-700', bullet: '#6366F1' };
                              case 'Discovery': return { bg: 'bg-teal-50 border-teal-100 text-teal-700', bullet: '#0D9488' };
                              case 'Quote Shared': return { bg: 'bg-amber-50 border-amber-100 text-amber-600', bullet: '#F59E0B' };
                              case 'Negotiation': return { bg: 'bg-purple-50 border-purple-100 text-purple-700', bullet: '#8B5CF6' };
                              case 'Closed': return { bg: 'bg-emerald-50 border-emerald-100 text-emerald-700', bullet: '#10B981' };
                            }
                          };
                          const badgeStyle = getStageBadge(deal.stage);
                          const isIdle = deal.idle > 2;

                          return (
                            <motion.div
                              whileTap={{ scale: 0.97 }}
                              key={deal.id}
                              onClick={() => handleDealSelection(deal.id)}
                              className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-xs flex items-center justify-between cursor-pointer hover:border-blue-300 transition-all hover:shadow-md"
                            >
                              <div className="flex items-center gap-3">
                                <div 
                                  className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-xs text-slate-700"
                                  style={{ backgroundColor: deal.color + '20' }}
                                >
                                  {deal.initials}
                                </div>
                                <div className="text-left">
                                  <h4 className="text-[13px] font-semibold text-slate-900 leading-tight">
                                    {deal.company}
                                  </h4>
                                  <div className="flex items-center gap-1.5 mt-1">
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full border ${badgeStyle.bg} font-medium`}>
                                      {deal.stage}
                                    </span>
                                    {deal.autoLogged && (
                                      <span className="bg-teal-500/10 text-teal-600 text-[8px] font-bold font-mono px-1 py-0.5 rounded-[4px] border border-teal-500/20">
                                        [AUTO]
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>

                              <div className="text-right">
                                <p className="text-[13px] font-bold text-[#0F2044] leading-tight">{deal.value}</p>
                                <p className={`text-[10px] mt-1 font-semibold ${isIdle ? 'text-red-500 font-bold' : 'text-slate-400'}`}>
                                  {deal.idle === 0 ? 'Today' : `${deal.idle}d idle`}
                                </p>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Right Section (1/3 width on desktop) */}
                  <div className="space-y-6">
                    {/* 5. UPCOMING RENEWALS */}
                    <div>
                      <label className="block text-[10px] font-bold font-mono text-slate-500 uppercase tracking-widest mb-2.5">
                        UPCOMING RENEWALS
                      </label>
                      
                      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs text-left">
                        <div className="flex justify-between items-start">
                          <div className="flex items-start gap-2.5">
                            <span className="text-lg">📅</span>
                            <div>
                              <h4 className="text-[13px] font-semibold text-slate-900 leading-tight">TechPlex Infra · Fire Policy</h4>
                              <p className="text-[11.5px] text-slate-500 mt-1">
                                Renews in 28 days · ₹2.1L premium
                              </p>
                            </div>
                          </div>
                          <span className="bg-red-50 text-red-600 text-[10px] font-bold px-2 py-0.5 rounded-full border border-red-100 text-right">
                            28d
                          </span>
                        </div>

                        {/* Progress Bar with animation simulation */}
                        <div className="mt-3.5">
                          <div className="flex justify-between text-[10px] text-slate-400 font-medium mb-1">
                            <span>Expiry Timeline</span>
                            <span className="text-red-500 font-bold">Urgent Action Required</span>
                          </div>
                          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              whileInView={{ width: '70%' }}
                              viewport={{ once: true }}
                              transition={{ duration: 0.8, ease: 'easeOut' }}
                              className="bg-red-500 h-full rounded-full"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>

              </div>
            </motion.div>
          )}

          {/* ════════════════════════════════════════════════════════════════ */}
          {/* SCREEN 2 ─ PIPELINE GRID */}
          {/* ════════════════════════════════════════════════════════════════ */}
          {currentScreen === 'Home' && currentTab === 'Pipeline' && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col"
            >
              <div className="bg-[#0F2044] text-white px-4 pt-3 pb-4 shrink-0 shadow-sm relative">
                <div className="flex justify-between items-center">
                  <div>
                    <h1 className="text-[17px] font-semibold">Deal Pipeline</h1>
                    <p className="text-[11px] text-slate-300 font-medium mt-0.5">
                      9 deals · ₹48L total value
                    </p>
                  </div>
                  <button className="p-1.5 bg-slate-800/80 hover:bg-slate-800 text-slate-200 rounded-lg flex items-center gap-1 text-[11px] font-medium border border-slate-700/55">
                    <Filter className="w-3.5 h-3.5" />
                    Filter
                  </button>
                </div>
              </div>

              {/* Horizontal Scroll Filter Chips */}
              <div className="bg-[#0F2044]/5 flex gap-2 overflow-x-auto py-3 px-4 shrink-0 no-scrollbar border-b border-slate-200/50">
                {(['All', 'New Lead', 'Discovery', 'Quote', 'Closed'] as const).map(chip => (
                  <button
                    key={chip}
                    onClick={() => setPipelineFilter(chip)}
                    className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold select-none border transition-all ${
                      pipelineFilter === chip 
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-500/20' 
                        : 'bg-white text-slate-600 border-slate-200 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    {chip === 'All' ? 'All Deals ✓' : chip}
                  </button>
                ))}
              </div>

              {/* GROUPED DEALS LISTING (Kanban board layout on desktop, stacked on mobile) */}
              <div className="flex-1 overflow-auto p-4 md:p-6 no-scrollbar">
                <div className="flex flex-col md:flex-row gap-6 md:h-full md:items-start min-w-0 overflow-x-auto no-scrollbar">
                  {(pipelineFilter === 'All' || pipelineFilter === 'New Lead') && renderStageColumn('New Lead', 'text-indigo-650', '🟦')}
                  {(pipelineFilter === 'All' || pipelineFilter === 'Discovery') && renderStageColumn('Discovery', 'text-teal-650', '🟩')}
                  {(pipelineFilter === 'All' || pipelineFilter === 'Quote') && renderStageColumn('Quote Shared', 'text-amber-500', '🟧')}
                  {(pipelineFilter === 'All' || pipelineFilter === 'Negotiation') && renderStageColumn('Negotiation', 'text-purple-650', '🟪')}
                  {(pipelineFilter === 'All' || pipelineFilter === 'Closed') && renderStageColumn('Closed', 'text-emerald-750', '🟢')}
                </div>
              </div>
            </motion.div>
          )}

          {/* ════════════════════════════════════════════════════════════════ */}
          {/* SCREEN 3 ─ DEAL DETAIL */}
          {/* ════════════════════════════════════════════════════════════════ */}
          {currentScreen === 'DealDetail' && (
            <motion.div 
              initial={{ x: 390 }}
              animate={{ x: 0 }}
              exit={{ x: 390 }}
              transition={{ type: 'spring', damping: 28, stiffness: 350 }}
              className="flex-1 flex flex-col bg-slate-50 absolute inset-0 z-30"
            >
              {/* Back Bar Header Section (Dark Navy) */}
              <div className="bg-[#0F2044] text-white px-4 md:px-8 pt-3 pb-5 rounded-b-2xl shadow-sm shrink-0 tracking-tight relative overflow-hidden text-left">
                <div className="absolute inset-0 bg-radial-at-t from-blue-900/30 to-transparent pointer-events-none" />
                
                <div className="flex justify-between items-center mb-3">
                  <button 
                    onClick={() => setCurrentScreen('Home')}
                    className="p-1.5 w-8 h-8 rounded-full bg-slate-800/80 hover:bg-slate-800 text-white flex items-center justify-center transition-colors border border-slate-700/60 cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>

                  {/* Desktop action buttons */}
                  <div className="hidden md:flex gap-2">
                    <button 
                      onClick={() => {
                        setWhatsappDraft(whatsappDraft || "Hi Rajeev, just checking in on the quote we shared. Happy to answer any questions!");
                        setCurrentScreen('WhatsAppChat');
                      }}
                      className="py-1.5 px-4 bg-[#075E54] hover:bg-[#075E54]/95 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      Message (WhatsApp)
                    </button>
                    <button 
                      onClick={() => setShowCallModal(true)}
                      className="py-1.5 px-4 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer border border-slate-700"
                    >
                      <Phone className="w-3.5 h-3.5 text-emerald-400" />
                      Log Voice Call
                    </button>
                  </div>

                  <span className="text-xs bg-slate-800 border border-slate-700/60 px-2 py-1 rounded-md text-slate-300 font-mono font-medium">Bimakavach Linked</span>
                </div>

                <h1 className="text-[19px] md:text-2xl font-semibold tracking-tight">{selectedDeal.company}</h1>
                <p className="text-[11px] md:text-xs text-slate-300 mt-1 leading-relaxed">
                  {selectedDeal.industry || 'SME Business'} · {selectedDeal.location} · Est. 2018 · ~200 employees
                </p>

                {/* Tags row */}
                <div className="flex gap-1.5 mt-3 flex-wrap">
                  <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                    {selectedDeal.stage}
                  </span>
                  <span className="bg-red-500/20 text-red-300 border border-red-500/30 text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <AlertTriangle className="w-2.5 h-2.5 text-red-400" />
                    {selectedDeal.idle === 0 ? 'Today' : `${selectedDeal.idle}d idle ⚠`}
                  </span>
                  <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                    {selectedDeal.value}
                  </span>
                </div>
              </div>

              {/* Deal Detail Content */}
              <div className="flex-1 overflow-y-auto px-4 md:px-8 py-4 md:py-6 no-scrollbar pb-24">
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                  
                  {/* Left Column (2/3 width) */}
                  <div className="md:col-span-2 space-y-6">
                    {/* Condition specific nudge card for Techplex id #1 */}
                    {selectedDeal.id === 1 && nudgeActive && (
                      <motion.div
                        initial={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9, height: 0, overflow: 'hidden' }}
                        className="bg-gradient-to-br from-amber-500/10 to-amber-600/5 border border-amber-500/20 rounded-xl p-4 shadow-sm text-left"
                      >
                        <div className="flex items-start gap-2.5">
                          <span className="text-base mt-0.5">💬</span>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-[13px] font-semibold text-amber-800 leading-tight">3 days no response — follow up now?</h4>
                            <p className="text-[11px] text-slate-600 mt-1 font-mono leading-relaxed">
                              Last message: 'Here is the quote for your review' (Jun 2). Draft message ready.
                            </p>
                            <div className="flex gap-2 mt-3">
                              <button
                                onClick={() => {
                                  setWhatsappDraft("Hi Rajeev, just checking in on the quote we shared. Happy to answer any questions!");
                                  setCurrentScreen('WhatsAppChat');
                                }}
                                className="px-2.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 text-[10px] font-bold rounded-lg transition-colors inline-flex items-center gap-1 cursor-pointer"
                              >
                                Open draft ↗
                              </button>
                              <button
                                onClick={() => {
                                  setNudgeActive(false);
                                  handleSnoozeTechplex();
                                }}
                                className="px-2.5 py-1.5 bg-slate-200/80 hover:bg-slate-200 text-slate-700 text-[10px] font-semibold rounded-lg transition-colors cursor-pointer"
                              >
                                Snooze 1d
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* AI INSIGHT CARD */}
                    <div className="bg-gradient-to-br from-blue-900 to-indigo-950 text-white rounded-xl p-4 shadow-md relative overflow-hidden border border-indigo-500/20 text-left">
                      <div className="absolute right-0 top-0 translate-x-3 -translate-y-3 opacity-15">
                        <Sparkles className="w-24 h-24 text-indigo-400" />
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="p-1 px-2 bg-gradient-to-r from-cyan-400 to-indigo-400 text-slate-950 font-bold font-mono text-[9px] rounded-full uppercase tracking-wider flex items-center gap-1 shadow-sm select-none">
                          <Sparkles className="w-3 h-3 text-emerald-950" />
                          AI Insight
                        </div>
                      </div>
                      <p className="text-xs text-indigo-100 mt-3 leading-relaxed font-sans font-medium">
                        {selectedDeal.id === 1 ? (
                          "TechPlex's warehouse expanded to Nagpur last month (MCA filing). Their current fire policy may be underinsured. Consider upselling asset coverage."
                        ) : selectedDeal.id === 2 ? (
                          "Vertex is onboarding 45 fresh hires in Bangalore next Monday. Leverage this growth to upsell Top-up hospitalization policies."
                        ) : selectedDeal.id === 3 ? (
                          "Marine transit route from Mumbai Port detected in draft import bills. Pitch Marine Cargo Insurance package to close negotiation gap ASAP."
                        ) : (
                          "Industry peers in financial technology experienced a 3x uptick in Ransomware attempts. Highlight Cyber D&O indemnity liability rates in quote."
                        )}
                      </p>
                    </div>

                    {/* CURRENT POLICIES */}
                    <div className="text-left">
                      <label className="block text-[10px] font-bold font-mono text-slate-500 uppercase tracking-widest mb-2 select-none">
                        CURRENT POLICIES
                      </label>
                      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs divide-y divide-slate-150">
                        <div className="p-3 flex justify-between items-center">
                          <div>
                            <h4 className="text-[13px] font-semibold text-slate-800">Fire & Allied Perils</h4>
                            <p className="text-[11px] text-slate-400 mt-0.5">HDFC Ergo · Annual Policy</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs font-bold text-slate-700">₹2.1L Premium</p>
                            <span className="inline-block mt-0.5 text-[9px] bg-red-50 text-red-600 border border-red-100 font-bold font-mono px-1.5 py-0.5 rounded-[4px] select-none">
                              Renews 30 Jun
                            </span>
                          </div>
                        </div>

                        <div className="p-3 flex justify-between items-center">
                          <div>
                            <h4 className="text-[13px] font-semibold text-slate-800">General Liability</h4>
                            <p className="text-[11px] text-slate-400 mt-0.5">Bajaj Allianz · Multi-hazard</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs font-bold text-slate-700">₹0.9L Premium</p>
                            <span className="inline-block mt-0.5 text-[9px] bg-emerald-50 text-emerald-600 border border-emerald-100 font-bold font-mono px-1.5 py-0.5 rounded-[4px] select-none">
                              Active
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column (1/3 width) */}
                  <div className="space-y-6 text-left">
                    {/* CONVERSATION TIMELINE */}
                    <div>
                      <label className="block text-[10px] font-bold font-mono text-slate-500 uppercase tracking-widest mb-3 select-none">
                        CONVERSATION TIMELINE
                      </label>
                      
                      <div className="relative pl-5 border-l border-slate-350 space-y-4">
                        {(timelineEvents[selectedDeal.id] || []).map((ev, index) => {
                          const dotColors = {
                            email: 'bg-red-500 ring-4 ring-red-100',
                            call: 'bg-emerald-500 ring-4 ring-emerald-100',
                            whatsapp: 'bg-green-500 ring-4 ring-green-100',
                            system: 'bg-violet-600 ring-4 ring-violet-100'
                          };

                          return (
                            <div key={index} className="relative text-left">
                              {/* Timeline colored dot */}
                              <div className={`absolute -left-[25px] top-[4px] w-2.5 h-2.5 rounded-full ${dotColors[ev.type]}`} />
                              
                              <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-xs">
                                <div className="flex justify-between items-start gap-1">
                                  <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1">
                                    {ev.title}
                                    {ev.isAuto && (
                                      <span className="text-[8px] bg-teal-500/10 text-teal-600 font-bold border border-teal-500/20 rounded-[4px] px-1 py-0.5 font-mono">
                                        AUTO
                                      </span>
                                    )}
                                  </h4>
                                  <span className="text-[9px] text-slate-400 font-medium whitespace-nowrap">{ev.time}</span>
                                </div>
                                <p className="text-[11.5px] text-slate-600 mt-1 leading-relaxed">{ev.sub}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                </div>

              </div>

              {/* Bottom Action Bar (hidden on desktop) */}
              <div className="absolute md:hidden bottom-0 left-0 right-0 p-3 bg-white border-t border-slate-200/90 flex gap-2 z-10 shadow-lg">
                <button 
                  onClick={() => {
                    setWhatsappDraft(whatsappDraft || "Hi Rajeev, just checking in on the quote we shared. Happy to answer any questions!");
                    setCurrentScreen('WhatsAppChat');
                  }}
                  className="flex-1 py-3 bg-[#075E54] hover:bg-[#075E54]/95 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4 shadow-sm" />
                  Message (WhatsApp)
                </button>
                <button 
                  onClick={() => setShowCallModal(true)}
                  className="flex-1 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
                >
                  <Phone className="w-4 h-4 text-emerald-400" />
                  Log Voice Call
                </button>
              </div>

            </motion.div>
          )}

          {/* ════════════════════════════════════════════════════════════════ */}
          {/* SCREEN 4 ─ ACTIVITY FEED */}
          {/* ════════════════════════════════════════════════════════════════ */}
          {currentScreen === 'Home' && currentTab === 'Activity' && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col"
            >
              <div className="bg-[#0F2044] text-white px-4 md:px-8 pt-3 pb-4 shadow-sm shrink-0 relative text-left">
                <div>
                  <h1 className="text-[17px] md:text-xl font-semibold">Activity Logs</h1>
                  <p className="text-[11px] md:text-xs text-slate-300 font-medium mt-0.5">
                    4 auto-logged today · 2 pending confirm
                  </p>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto px-4 md:px-8 py-4 md:py-6 space-y-4 no-scrollbar">
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                  
                  {/* Left Column (2/3 width) */}
                  <div className="md:col-span-2 space-y-6 text-left">
                    {/* A. PENDING YOUR CONFIRMATION */}
                    <div>
                      <label className="block text-[10px] font-bold font-mono text-slate-500 tracking-widest uppercase mb-2">
                        PENDING YOUR CONFIRMATION
                      </label>
                      
                      <div className="space-y-3">
                        {/* Item 1: Vertex Solutions */}
                        <AnimatePresence>
                          {vertexAutoConfirmActive && (
                            <motion.div
                              initial={{ opacity: 1, height: 'auto', scale: 1 }}
                              exit={{ opacity: 0, height: 0, scale: 0.9, marginBottom: 0, overflow: 'hidden' }}
                              className="bg-white border-l-[4px] border-teal-500 rounded-r-xl border-y border-r border-slate-200 p-3 shadow-xs"
                            >
                              <div className="flex gap-2.5 items-start">
                                <div className="p-1.5 bg-teal-100 rounded-lg text-teal-600 shrink-0 select-none">
                                  <Zap className="w-4 h-4 text-teal-600 animate-pulse" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex justify-between items-center mb-0.5">
                                    <h4 className="text-xs font-bold text-slate-900">Vertex Solutions → Quote Shared [AUTO]</h4>
                                    <span className="text-[9px] text-slate-400 font-medium">2m ago</span>
                                  </div>
                                  <p className="text-[11.5px] text-slate-500 leading-relaxed font-sans">
                                    Email subject "Quote for Group Health Cover" detected. Stage advanced automatically.
                                  </p>

                                  <div className="flex gap-2 mt-2.5">
                                    <button 
                                      onClick={handleConfirmVertex}
                                      className="px-2.5 py-1 bg-teal-600 hover:bg-teal-700 text-white text-[10px] font-bold rounded-md cursor-pointer"
                                    >
                                      ✓ Correct
                                    </button>
                                    
                                    <div className="relative">
                                      <button 
                                        onClick={() => setShowStageDropdownId(showStageDropdownId === 22 ? null : 22)}
                                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 text-[10px] font-semibold rounded-md flex items-center gap-1 cursor-pointer"
                                      >
                                        Edit stage
                                        <ChevronDown className="w-3 h-3 text-slate-400" />
                                      </button>

                                      {showStageDropdownId === 22 && (
                                        <div className="absolute left-0 bottom-full mb-1 z-20 bg-white border border-slate-200 rounded-lg shadow-xl p-1.5 w-36 text-xs text-slate-700">
                                          <p className="text-[9px] font-bold text-slate-400 p-1 uppercase tracking-wider">New Stage</p>
                                          {(['New Lead', 'Discovery', 'Quote Shared', 'Negotiation', 'Closed'] as const).map((stg) => (
                                            <button
                                              key={stg}
                                              onClick={() => handleStageChange(2, stg)}
                                              className="w-full text-left p-1.5 rounded-md hover:bg-slate-100 transition-colors cursor-pointer"
                                            >
                                              {stg}
                                            </button>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {/* Item 2: CloudBase Systems */}
                        <AnimatePresence>
                          {cloudBaseConfirmActive && (
                            <motion.div
                              initial={{ opacity: 1, height: 'auto', scale: 1 }}
                              exit={{ opacity: 0, height: 0, scale: 0.9, marginBottom: 0, overflow: 'hidden' }}
                              className="bg-white border-l-[4px] border-blue-600 rounded-r-xl border-y border-r border-slate-200 p-3 shadow-xs"
                            >
                              <div className="flex gap-2.5 items-start">
                                <div className="p-1.5 bg-blue-100 rounded-lg text-blue-600 shrink-0 select-none">
                                  <Zap className="w-4 h-4 text-blue-600 animate-pulse" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex justify-between items-center mb-0.5">
                                    <h4 className="text-xs font-bold text-slate-900">CloudBase Systems → New Lead [AUTO]</h4>
                                    <span className="text-[9px] text-slate-400 font-medium">1h ago</span>
                                  </div>
                                  <p className="text-[11.5px] text-slate-500 leading-relaxed font-sans">
                                    Inbound WhatsApp from +91 98334-12942: 'Looking for liability insurance.' Lead auto-created.
                                  </p>

                                  <div className="flex gap-2 mt-2.5">
                                    <button 
                                      onClick={handleConfirmCloudBase}
                                      className="px-2.5 py-1 bg-teal-600 hover:bg-teal-700 text-white text-[10px] font-bold rounded-md cursor-pointer"
                                    >
                                      ✓ Correct
                                    </button>

                                    <div className="relative">
                                      <button 
                                        onClick={() => setShowStageDropdownId(showStageDropdownId === 55 ? null : 55)}
                                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 text-[10px] font-semibold rounded-md flex items-center gap-1 cursor-pointer"
                                      >
                                        Edit
                                        <ChevronDown className="w-3 h-3 text-slate-400" />
                                      </button>

                                      {showStageDropdownId === 55 && (
                                        <div className="absolute left-0 bottom-full mb-1 z-20 bg-white border border-slate-200 rounded-lg shadow-xl p-1.5 w-36 text-xs text-slate-700">
                                          <p className="text-[9px] font-bold text-slate-400 p-1 uppercase tracking-wider">Correct Stage</p>
                                          {(['New Lead', 'Discovery', 'Quote Shared', 'Negotiation', 'Closed'] as const).map((stg) => (
                                            <button
                                              key={stg}
                                              onClick={() => handleStageChange(5, stg)}
                                              className="w-full text-left p-1.5 rounded-md hover:bg-slate-100 transition-colors cursor-pointer"
                                            >
                                              {stg}
                                            </button>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>

                    {/* B. CONFIRMED TODAY */}
                    <div>
                      <label className="block text-[10px] font-bold font-mono text-slate-500 tracking-widest uppercase mb-2 select-none">
                        CONFIRMED TODAY
                      </label>
                      
                      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs divide-y divide-slate-100">
                        {confirmedToday.map((act, index) => (
                          <div key={index} className="p-3 flex items-start gap-3">
                            <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center font-bold text-xs text-slate-500 shrink-0 select-none">
                              {act.icon}
                            </div>
                            <div>
                              <h4 className="text-[12px] font-bold text-slate-800 leading-tight">{act.title}</h4>
                              <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{act.desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Column (1/3 width) */}
                  <div className="space-y-6 text-left">
                    {/* C. AUTO LOG STATS */}
                    <div>
                      <label className="block text-[10px] font-bold font-mono text-slate-500 tracking-widest uppercase mb-2 select-none">
                        AUTO-LOG STATS THIS WEEK
                      </label>
                      
                      <div className="grid grid-cols-1 gap-3">
                        <div className="bg-white p-4 rounded-xl border border-slate-200/80 text-center flex items-center gap-3">
                          <span className="text-2xl">🤖</span>
                          <div className="text-left">
                            <span className="block text-lg font-bold text-[#0F2044]">14</span>
                            <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Auto-logged Deals</span>
                          </div>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-slate-200/80 text-center flex items-center gap-3">
                          <span className="text-2xl">✏️</span>
                          <div className="text-left">
                            <span className="block text-lg font-bold text-[#0F2044]">2</span>
                            <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Manually Corrected</span>
                          </div>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-slate-200/80 text-center flex items-center gap-3">
                          <span className="text-2xl">📈</span>
                          <div className="text-left">
                            <span className="block text-lg font-bold text-emerald-600">86%</span>
                            <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">CRM Auto-save Accuracy</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>

              </div>
            </motion.div>
          )}

          {/* ════════════════════════════════════════════════════════════════ */}
          {/* SCREEN 5 ─ WHATSAPP CHAT */}
          {/* ════════════════════════════════════════════════════════════════ */}
          {currentScreen === 'WhatsAppChat' && (
            <motion.div 
              initial={{ x: 390 }}
              animate={{ x: 0 }}
              exit={{ x: 390 }}
              transition={{ type: 'spring', damping: 28, stiffness: 350 }}
              className="flex-1 flex flex-col bg-[#E5DDD5] absolute inset-0 md:relative md:max-w-3xl md:mx-auto md:my-6 md:rounded-xl md:border md:border-slate-300 md:shadow-lg md:h-[calc(100vh-120px)] overflow-hidden z-45"
            >
              {/* WhatsApp Green Top Header (#075E54) */}
              <div className="bg-[#075E54] text-white px-3 pt-3 pb-3 flex items-center justify-between shadow-md shrink-0 select-none">
                <div className="flex items-center gap-1.5 min-w-0">
                  <button 
                    onClick={() => setCurrentScreen('DealDetail')}
                    className="p-1 rounded-full hover:bg-white/10 text-white shrink-0"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <div className="w-8 h-8 rounded-full bg-slate-300 text-slate-800 flex items-center justify-center font-bold text-xs shrink-0 ring-1 ring-white/20 select-none">
                    TP
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-xs font-bold tracking-tight truncate leading-tight">Rajeev Nair · TechPlex</h2>
                    <span className="text-[9px] text-emerald-100 opacity-90 block">last seen today at 9:42 AM</span>
                  </div>
                </div>

                <span className="bg-amber-400 text-slate-900 font-bold font-mono px-2 py-0.5 rounded-[4px] text-[8px] tracking-wide select-none">
                  CRM LINKED
                </span>
              </div>

              {/* Chat Frame Content scrollable */}
              <div className="flex-1 overflow-y-auto px-3 py-4 space-y-3 no-scrollbar pb-16">
                
                {/* Message 1 */}
                <div className="flex flex-col items-start max-w-[85%]">
                  <div className="bg-white text-[#0F172A] p-2.5 rounded-xl rounded-tl-none text-[12px] leading-relaxed shadow-xs relative">
                    Hi, I'm looking for fire and liability insurance for my manufacturing unit in Pune.
                    <span className="block text-[8px] text-slate-450 text-right mt-1">9:30 AM</span>
                  </div>
                </div>

                {/* System label 1 */}
                <div className="flex justify-center my-1 select-none">
                  <span className="bg-[#0F2044]/80 text-[#93C5FD] font-semibold text-[9.5px] px-3.5 py-1 rounded-full font-mono shadow-xs backdrop-blur-xs text-center border border-white/5">
                    Lead auto-created in CRM ✦
                  </span>
                </div>

                {/* Message 2 Outgoing */}
                <div className="flex flex-col items-end w-full">
                  <div className="max-w-[85%] bg-[#DCF8C6] text-[#0F172A] p-2.5 rounded-xl rounded-tr-none text-[12px] leading-relaxed shadow-xs relative">
                    Hello Rajeev! I'm Arjun from Bimakavach. I'd love to help. Can we do a quick call?
                    <span className="block text-[8px] text-slate-450 text-right mt-1">9:32 AM</span>
                  </div>
                </div>

                {/* Message 3 */}
                <div className="flex flex-col items-start max-w-[85%]">
                  <div className="bg-white text-[#0F172A] p-2.5 rounded-xl rounded-tl-none text-[12px] leading-relaxed shadow-xs relative">
                    Sure, let's connect tomorrow at 11am.
                    <span className="block text-[8px] text-slate-450 text-right mt-1">9:33 AM</span>
                  </div>
                </div>

                {/* System label 2 */}
                <div className="flex justify-center my-1 select-none">
                  <span className="bg-[#0F2044]/80 text-[#93C5FD] font-semibold text-[9.5px] px-3.5 py-1 rounded-full font-mono shadow-xs backdrop-blur-xs text-center border border-white/5">
                    Discovery scheduled — CRM updated ✦
                  </span>
                </div>

                {/* Message 4 */}
                <div className="flex flex-col items-start max-w-[85%]">
                  <div className="bg-white text-[#0F172A] p-2.5 rounded-xl rounded-tl-none text-[12px] leading-relaxed shadow-xs relative">
                    Will look at the quote and get back to you.
                    <span className="block text-[8px] text-slate-450 text-right mt-1">May 30, 11:00 AM</span>
                  </div>
                </div>

                {/* System label 3 */}
                <div className="flex justify-center my-1 select-none">
                  <span className="bg-[#0F2044]/80 text-[#93C5FD] font-semibold text-[9.5px] px-3.5 py-1 rounded-full font-mono shadow-xs backdrop-blur-xs text-center border border-white/5">
                    Stage → Discovery Done ✦ Auto-logged
                  </span>
                </div>

                {/* Message 5 Outgoing */}
                <div className="flex flex-col items-end w-full">
                  <div className="max-w-[85%] bg-[#DCF8C6] text-[#0F172A] p-2.5 rounded-xl rounded-tr-none text-[12px] leading-relaxed shadow-xs relative">
                    Please find the detailed quote attached. Fire + Liability, best rate from HDFC Ergo.
                    <span className="block text-[8px] text-slate-450 text-right mt-1">Jun 2, 2:12 PM</span>
                  </div>
                </div>

                {/* System label 4 */}
                <div className="flex justify-center my-1 select-none">
                  <span className="bg-[#0F2044]/80 text-[#93C5FD] font-semibold text-[9.5px] px-3.5 py-1 rounded-full font-mono shadow-xs backdrop-blur-xs text-center border border-white/5">
                    Stage → Quote Shared ✦ Auto-logged
                  </span>
                </div>

                {/* Interactive Dynamic Chat Messages */}
                {extraChatMessages.map((msg, index) => (
                  <React.Fragment key={index}>
                    {msg.systemLabel && (
                      <div className="flex justify-center my-1 select-none">
                        <span className="bg-[#0F2044]/85 text-[#93C5FD] font-semibold text-[9.5px] px-3.5 py-1 rounded-full font-mono shadow-xs backdrop-blur-xs text-center border border-white/5">
                          {msg.systemLabel}
                        </span>
                      </div>
                    )}
                    <div className={`flex flex-col ${msg.sender === 'out' ? 'items-end w-full' : 'items-start max-w-[85%]'}`}>
                      <div className={`p-2.5 rounded-xl text-[12px] leading-relaxed shadow-xs relative ${
                        msg.sender === 'out' ? 'bg-[#DCF8C6] text-[#0F172A] rounded-tr-none' : 'bg-white text-[#0F172A] rounded-tl-none'
                      }`}>
                        {msg.text}
                        <span className="block text-[8px] text-slate-450 text-right mt-1">{msg.time}</span>
                      </div>
                    </div>
                  </React.Fragment>
                ))}

              </div>

              {/* Compose bottom Area */}
              <div className="absolute bottom-0 left-0 right-0 p-2 bg-[#F0F0F0] border-t border-slate-300">
                {/* Suggestion Draft bubble */}
                <div 
                  onClick={handleDraftFill}
                  className="bg-amber-50 border border-amber-200 p-2 rounded-lg mb-2 cursor-pointer hover:bg-amber-100 transition-colors text-left"
                >
                  <p className="text-[10px] text-amber-700 font-bold uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-500 fill-amber-500 animate-pulse" />
                    Bimakavach AI Autopilot Suggestion
                  </p>
                  <p className="text-[11.5px] text-slate-700 mt-0.5 leading-relaxed font-sans">
                    "Hi Rajeev, just checking in on the quote we shared. Happy to answer any questions!"
                  </p>
                  <p className="text-[10px] text-amber-600 font-semibold mt-1 text-right italic font-mono">Tap to apply draft</p>
                </div>

                {/* Text bar Send */}
                <form onSubmit={handleSendMessage} className="flex gap-2 items-center">
                  <input 
                    type="text"
                    value={whatsappDraft}
                    onChange={(e) => setWhatsappDraft(e.target.value)}
                    placeholder="Use draft or type message..."
                    className="flex-1 bg-white border border-slate-300/80 rounded-full px-4 py-2 text-xs text-slate-800 outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                  <button 
                    type="submit" 
                    className="w-8 h-8 rounded-full bg-[#075E54] hover:bg-[#075E54]/95 text-white flex items-center justify-center shrink-0 shadow-sm"
                  >
                    <Send className="w-3.5 h-3.5 ml-[2px]" />
                  </button>
                </form>
              </div>

            </motion.div>
          )}

          {/* ════════════════════════════════════════════════════════════════ */}
          {/* SCREEN 6 ─ PIPELINE REPORTS */}
          {/* ════════════════════════════════════════════════════════════════ */}
          {currentScreen === 'Home' && currentTab === 'Reports' && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col"
            >
              <div className="bg-[#0F2044] text-white px-4 md:px-8 pt-3 pb-4 shadow-sm shrink-0 relative text-left">
                <div>
                  <h1 className="text-[17px] md:text-xl font-semibold">Pipeline Analytics</h1>
                  <p className="text-[11px] md:text-xs text-slate-300 font-medium mt-0.5">
                    Week of Jun 2, 2025 · Corporate Overview
                  </p>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto px-4 md:px-8 py-4 md:py-6 space-y-6 no-scrollbar">
                
                {/* 1. Team Performance Horizontal Scroll */}
                <div className="text-left">
                  <label className="block text-[10px] font-bold font-mono text-slate-500 tracking-widest uppercase mb-2 select-none">
                    TEAM PERFORMANCE (RM BENCHMARK)
                  </label>
                  
                  <div className="flex gap-3 overflow-x-auto pb-1.5 no-scrollbar">
                    {initialRMs.map((rmObj, rmIdx) => (
                      <div 
                        key={rmIdx}
                        className={`shrink-0 p-3.5 w-60 rounded-xl border bg-white shadow-xs ${
                          rmObj.name === 'Arjun Kumar' ? 'ring-1 ring-blue-500/40 border-blue-200' : 'border-slate-200'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-slate-900 text-amber-500 font-semibold font-mono text-xs flex items-center justify-center">
                              {rmObj.initials}
                            </div>
                            <h4 className="text-xs font-bold text-slate-800">{rmObj.name}</h4>
                          </div>
                          {rmObj.name === 'Arjun Kumar' && (
                            <span className="bg-emerald-50 text-emerald-600 font-mono text-[9px] font-bold px-1.5 py-0.5 border border-emerald-100 rounded-[4px]">
                              Top RM
                            </span>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-2.5 mt-3.5">
                          <div>
                            <span className="block text-[9px] font-semibold text-slate-400 uppercase">Pipeline</span>
                            <span className="text-sm font-bold text-slate-800">{rmObj.pipeline}</span>
                          </div>
                          <div>
                            <span className="block text-[9px] font-semibold text-slate-400 uppercase">Accuracy</span>
                            <span className="text-sm font-bold text-slate-800">{rmObj.accuracy}</span>
                          </div>
                          <div>
                            <span className="block text-[9px] font-semibold text-slate-400 uppercase">Deals Count</span>
                            <span className="text-sm font-bold text-slate-800">{rmObj.deals}</span>
                          </div>
                          <div>
                            <span className="block text-[9px] font-semibold text-slate-400 uppercase">Time Saved</span>
                            <span className="text-sm font-bold text-teal-600 font-mono">{rmObj.saved}/d</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                  
                  {/* Left Column (2/3 width) */}
                  <div className="md:col-span-2 space-y-6 text-left">
                    {/* 2. Pipeline by Stage custom Horizontal bar chart (no libraries strictly) */}
                    <div>
                      <label className="block text-[10px] font-bold font-mono text-slate-500 tracking-widest uppercase mb-2 select-none">
                        PIPELINE BY STAGE
                      </label>
                      
                      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs space-y-3">
                        
                        {/* New Lead */}
                        <div>
                          <div className="flex justify-between text-[11px] font-medium mb-1 select-none">
                            <span className="text-slate-700 font-bold">New Lead</span>
                            <span className="text-slate-500 text-[10px]">8 deals · ₹18L</span>
                          </div>
                          <div className="w-full bg-slate-150 h-2.5 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              whileInView={{ width: '40%' }}
                              viewport={{ once: true }}
                              transition={{ duration: 0.6 }}
                              className="bg-indigo-600 h-full rounded-full"
                            />
                          </div>
                        </div>

                        {/* Discovery */}
                        <div>
                          <div className="flex justify-between text-[11px] font-medium mb-1 select-none">
                            <span className="text-slate-700 font-bold">Discovery</span>
                            <span className="text-slate-500 text-[10px]">6 deals · ₹14L</span>
                          </div>
                          <div className="w-full bg-slate-150 h-2.5 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              whileInView={{ width: '60%' }}
                              viewport={{ once: true }}
                              transition={{ duration: 0.6 }}
                              className="bg-teal-600 h-full rounded-full"
                            />
                          </div>
                        </div>

                        {/* Quote */}
                        <div>
                          <div className="flex justify-between text-[11px] font-medium mb-1 select-none">
                            <span className="text-slate-700 font-bold">Quote Shared</span>
                            <span className="text-slate-500 text-[10px]">5 deals · ₹22L</span>
                          </div>
                          <div className="w-full bg-slate-150 h-2.5 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              whileInView={{ width: '80%' }}
                              viewport={{ once: true }}
                              transition={{ duration: 0.6 }}
                              className="bg-amber-500 h-full rounded-full"
                            />
                          </div>
                        </div>

                        {/* Negotiation */}
                        <div>
                          <div className="flex justify-between text-[11px] font-medium mb-1 select-none">
                            <span className="text-slate-700 font-bold">Negotiation</span>
                            <span className="text-slate-500 text-[10px]">3 deals · ₹28L</span>
                          </div>
                          <div className="w-full bg-slate-150 h-2.5 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              whileInView={{ width: '30%' }}
                              viewport={{ once: true }}
                              transition={{ duration: 0.6 }}
                              className="bg-purple-600 h-full rounded-full"
                            />
                          </div>
                        </div>

                        {/* Closed */}
                        <div>
                          <div className="flex justify-between text-[11px] font-medium mb-1 select-none">
                            <span className="text-slate-700 font-bold">Closed</span>
                            <span className="text-slate-500 text-[10px]">2 deals · ₹12L</span>
                          </div>
                          <div className="w-full bg-slate-150 h-2.5 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              whileInView={{ width: '20%' }}
                              viewport={{ once: true }}
                              transition={{ duration: 0.6 }}
                              className="bg-emerald-600 h-full rounded-full"
                            />
                          </div>
                        </div>

                      </div>
                    </div>
                  </div>

                  {/* Right Column (1/3 width) */}
                  <div className="space-y-6 text-left">
                    {/* 3. Deals At Risk (red-tinted warning card layout) */}
                    <div>
                      <label className="block text-[10px] font-bold font-mono text-slate-500 tracking-widest uppercase mb-2 select-none">
                        DEALS AT RISK (IDLE ACTIONS)
                      </label>
                      
                      <div className="bg-red-50 border border-red-200 rounded-xl p-3.5 space-y-2.5">
                        
                        <div className="flex justify-between items-center bg-white p-2.5 rounded-lg border border-red-150 shadow-xs">
                          <div>
                            <h4 className="text-xs font-bold text-slate-800">TechPlex Infra</h4>
                            <p className="text-[10px] text-slate-500">Quote Shared · Manu Facturing</p>
                          </div>
                          <span className="text-red-600 text-xs font-bold font-mono flex items-center gap-1 select-none">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            3d idle
                          </span>
                        </div>

                        <div className="flex justify-between items-center bg-white p-2.5 rounded-lg border border-red-150 shadow-xs">
                          <div>
                            <h4 className="text-xs font-bold text-slate-800">GlobalTech Ltd</h4>
                            <p className="text-[10px] text-slate-500">Discovery · SaaS Logistics</p>
                          </div>
                          <span className="text-red-600 text-xs font-bold font-mono flex items-center gap-1 select-none">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            6d idle
                          </span>
                        </div>

                        <div className="flex justify-between items-center bg-white p-2.5 rounded-lg border border-red-150 shadow-xs">
                          <div>
                            <h4 className="text-xs font-bold text-slate-800">Alpha Exports</h4>
                            <p className="text-[10px] text-slate-500">New Lead · Chemical Port</p>
                          </div>
                          <span className="text-red-600 text-xs font-bold font-mono flex items-center gap-1 select-none">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            8d idle
                          </span>
                        </div>

                      </div>
                    </div>

                    {/* 4. Nudge Effectiveness */}
                    <div>
                      <label className="block text-[10px] font-bold font-mono text-slate-500 tracking-widest uppercase mb-2 select-none">
                        NUDGE EFFECTIVENESS OVERVIEW
                      </label>
                      
                      <div className="grid grid-cols-2 gap-3.5 mb-2">
                        <div className="bg-white p-3.5 rounded-xl border border-slate-205/80 text-center shadow-xs">
                          <span className="block text-[10px] font-semibold text-slate-400 uppercase">Nudges Sent</span>
                          <span className="block text-xl font-bold text-[#0F2044] mt-1">24</span>
                        </div>
                        <div className="bg-white p-3.5 rounded-xl border border-slate-205/80 text-center shadow-xs">
                          <span className="block text-[10px] font-semibold text-slate-400 uppercase">Acted On</span>
                          <span className="block text-xl font-bold text-emerald-600 mt-1">19 (79%)</span>
                        </div>
                        <div className="bg-white p-3.5 rounded-xl border border-slate-205/80 text-center shadow-xs">
                          <span className="block text-[10px] font-semibold text-slate-400 uppercase">Avg Response</span>
                          <span className="block text-xl font-bold text-[#0F2044] mt-1">1.4h</span>
                        </div>
                        <div className="bg-white p-3.5 rounded-xl border border-slate-205/80 text-center shadow-xs">
                          <span className="block text-[10px] font-semibold text-slate-400 uppercase">Unblocked Deals</span>
                          <span className="block text-xl font-bold text-teal-600 mt-1">8</span>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>

              </div>
            </motion.div>
          )}

        </div>

        {/* ────────────────────────────────────────────────────────────────────── */}
        {/* TAB BAR SYSTEM (FITTS LAW: height >= 56px) */}
        {/* ────────────────────────────────────────────────────────────────────── */}
        <div className="h-[calc(4rem+env(safe-area-inset-bottom))] pb-[env(safe-area-inset-bottom)] shrink-0 bg-white border-t border-slate-200/95 flex md:hidden justify-around items-center px-4 relative z-40 select-none">
          <button 
            onClick={() => {
              setCurrentTab('Home');
              setCurrentScreen('Home');
            }}
            className={`flex flex-col items-center justify-center flex-1 h-full relative transition-all cursor-pointer ${
              currentTab === 'Home' && currentScreen === 'Home' ? 'text-[#1A56A4]' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <HomeIcon className="w-5 h-5 shadow-xs" />
            <span className="text-[10px] font-extrabold mt-1">Home</span>
            {currentTab === 'Home' && currentScreen === 'Home' && (
              <motion.div layoutId="activeTabIndicator" className="absolute bottom-0.5 w-6 h-[2px] bg-blue-600 rounded-full" />
            )}
          </button>

          <button 
            onClick={() => {
              setCurrentTab('Pipeline');
              setCurrentScreen('Home');
            }}
            className={`flex flex-col items-center justify-center flex-1 h-full relative transition-all cursor-pointer ${
              currentTab === 'Pipeline' && currentScreen === 'Home' ? 'text-[#1A56A4]' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Layers className="w-5 h-5 shadow-xs" />
            <span className="text-[10px] font-extrabold mt-1">Pipeline</span>
            {currentTab === 'Pipeline' && currentScreen === 'Home' && (
              <motion.div layoutId="activeTabIndicator" className="absolute bottom-0.5 w-6 h-[2px] bg-blue-600 rounded-full" />
            )}
          </button>

          <button 
            onClick={() => {
              setCurrentTab('Activity');
              setCurrentScreen('Home');
            }}
            className={`flex flex-col items-center justify-center flex-1 h-full relative transition-all cursor-pointer ${
              currentTab === 'Activity' && currentScreen === 'Home' ? 'text-[#1A56A4]' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <div className="relative">
              <ActivityIcon className="w-5 h-5 shadow-xs" />
              {(vertexAutoConfirmActive || cloudBaseConfirmActive) && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-amber-500 rounded-full border border-white animate-pulse" />
              )}
            </div>
            <span className="text-[10px] font-extrabold mt-1">Activity</span>
            {currentTab === 'Activity' && currentScreen === 'Home' && (
              <motion.div layoutId="activeTabIndicator" className="absolute bottom-0.5 w-6 h-[2px] bg-blue-600 rounded-full" />
            )}
          </button>

          <button 
            onClick={() => {
              setCurrentTab('Reports');
              setCurrentScreen('Home');
            }}
            className={`flex flex-col items-center justify-center flex-1 h-full relative transition-all cursor-pointer ${
              currentTab === 'Reports' && currentScreen === 'Home' ? 'text-[#1A56A4]' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <BarChart3 className="w-5 h-5 shadow-xs" />
            <span className="text-[10px] font-extrabold mt-1">Reports</span>
            {currentTab === 'Reports' && currentScreen === 'Home' && (
              <motion.div layoutId="activeTabIndicator" className="absolute bottom-0.5 w-6 h-[2px] bg-blue-600 rounded-full" />
            )}
          </button>
        </div>

        {/* Screen Bottom bar stroke simulating mobile */}
        <div className="hidden bg-white pb-2 justify-center w-full shrink-0">
          <div className="w-32 h-[4px] bg-slate-350 rounded-full" />
        </div>

      </div>
    </div>
  );
}

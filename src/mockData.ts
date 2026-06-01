/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { RM, Deal, TimelineEvent } from './types';

export const initialRMs: RM[] = [
  { name: 'Arjun Kumar', initials: 'AK', pipeline: '₹48L', deals: 9, accuracy: '94%', saved: '1.8H' },
  { name: 'Priya Sharma', initials: 'PS', pipeline: '₹31L', deals: 6, accuracy: '89%', saved: '1.4H' },
  { name: 'Ravi Menon', initials: 'RM', pipeline: '₹22L', deals: 5, accuracy: '76%', saved: '0.9H' }
];

export const initialDeals: Deal[] = [
  { 
    id: 1, 
    company: 'TechPlex Infra Pvt Ltd', 
    initials: 'TP', 
    color: '#3B82F6', // Blue border / icon bg
    stage: 'Quote Shared', 
    value: '₹8.4L', 
    idle: 3, 
    products: ['Fire', 'Liability'],
    contact: 'Rajeev Nair', 
    location: 'Pune', 
    industry: 'Manufacturing' 
  },
  { 
    id: 2, 
    company: 'Vertex Solutions', 
    initials: 'VS', 
    color: '#10B981', // Green border / icon bg
    stage: 'Quote Shared', 
    value: '₹5.2L', 
    idle: 0, 
    products: ['Group Health'],
    autoLogged: true, 
    contact: 'Sneha Pillai', 
    location: 'Bangalore',
    industry: 'SaaS Platforms'
  },
  { 
    id: 3, 
    company: 'Mango Foods Ltd', 
    initials: 'MF', 
    color: '#8B5CF6', // Purple
    stage: 'Negotiation', 
    value: '₹12.1L', 
    idle: 1, 
    products: ['Marine', 'Asset'],
    contact: 'Vikram Shetty', 
    location: 'Mumbai',
    industry: 'Food Processing'
  },
  { 
    id: 4, 
    company: 'Razorpay FinTech', 
    initials: 'RZ', 
    color: '#F59E0B', // Amber
    stage: 'Discovery', 
    value: '₹3.8L', 
    idle: 2, 
    products: ['Cyber', 'D&O'],
    contact: 'Anjali Rao', 
    location: 'Bangalore',
    industry: 'Financial Technology'
  },
  { 
    id: 5, 
    company: 'CloudBase Systems', 
    initials: 'CB', 
    color: '#6366F1', // Indigo
    stage: 'New Lead', 
    value: '₹2.1L', 
    idle: 0, 
    products: ['Liability'],
    autoCreated: true, 
    source: 'WhatsApp',
    contact: 'Siddharth Roy',
    location: 'Delhi',
    industry: 'Cloud Infrastructure'
  }
];

export const initialTimelineEvents: Record<number, TimelineEvent[]> = {
  1: [
    {
      title: 'Quote shared via email',
      sub: "Subject: 'Quote for Fire + Liability Coverage' detected. Stage auto-advanced.",
      time: 'Jun 2, 2:14 PM',
      type: 'email',
      isAuto: true
    },
    {
      title: 'Discovery call completed',
      sub: "'Will look at the quote' detected in WhatsApp. Stage: Discovery Done.",
      time: 'May 30, 11:00 AM',
      type: 'whatsapp',
      isAuto: true
    },
    {
      title: 'Lead created',
      sub: 'Inbound WhatsApp from Rajeev Nair detected. Lead auto-created.',
      time: 'May 28, 9:30 AM',
      type: 'whatsapp',
      isAuto: true
    }
  ],
  2: [
    {
      title: 'Quote shared via email',
      sub: 'Email subject \'Quote for Group Health Coverage\' detected. Stage advanced automatically.',
      time: 'Today, 2 minutes ago',
      type: 'email',
      isAuto: true
    },
    {
      title: 'Inbound Inquiry Email',
      sub: 'Inquiry for Group Health cover of 120 employees from Sneha Pillai.',
      time: 'Yesterday, 4:30 PM',
      type: 'email',
      isAuto: false
    }
  ],
  3: [
    {
      title: 'Terms under Negotiation',
      sub: 'Commercial discussions initiated regarding Marine cargo coverage deduction clauses.',
      time: 'May 31, 12:45 PM',
      type: 'call',
      isAuto: false
    },
    {
      title: 'Quote Shared',
      sub: 'Marine rates from ICICI Lombard and Iffco Tokio compiled and shared.',
      time: 'May 29, 3:15 PM',
      type: 'email',
      isAuto: false
    }
  ],
  4: [
    {
      title: 'Discovery WhatsApp Match',
      sub: 'Discovery done automatically matching current scope with existing corporate liability structures.',
      time: 'May 30, 10:15 AM',
      type: 'whatsapp',
      isAuto: true
    }
  ],
  5: [
    {
      title: 'WhatsApp Lead Auto-Created',
      sub: 'Inbound WhatsApp from Siddharth Roy: "Looking for liability insurance." Lead auto-created.',
      time: 'Today, 1 hour ago',
      type: 'whatsapp',
      isAuto: true
    }
  ]
};

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface RM {
  name: string;
  initials: string;
  pipeline: string;
  deals: number;
  accuracy: string;
  saved: string;
}

export interface Deal {
  id: number;
  company: string;
  initials: string;
  color: string; // Background color hex or class for avatar
  stage: 'New Lead' | 'Discovery' | 'Quote Shared' | 'Negotiation' | 'Closed';
  value: string;
  idle: number; // Days idle
  products: string[];
  contact: string;
  location: string;
  industry?: string;
  autoLogged?: boolean;
  autoCreated?: boolean;
  source?: string;
}

export type ScreenType = 'Home' | 'Pipeline' | 'Activity' | 'Reports' | 'DealDetail' | 'WhatsAppChat';

export interface TimelineEvent {
  title: string;
  sub: string;
  time: string;
  type: 'email' | 'call' | 'whatsapp' | 'system';
  isAuto?: boolean;
}

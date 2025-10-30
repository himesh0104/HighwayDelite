import axios from 'axios';

// axios client points to same-origin Next.js API routes
export const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

export type Experience = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  price: number;
};

export type Slot = {
  id: string;
  experienceId: string;
  dateTime: string;
  capacity: number;
  booked: boolean;
};

export type ExperienceWithSlots = Experience & { slots: Slot[] };



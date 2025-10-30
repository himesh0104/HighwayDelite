import axios from 'axios';

// quick axios client setup
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000',
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



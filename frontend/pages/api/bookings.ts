import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

const backend = (path: string) => {
  const base = process.env.BACKEND_URL || 'http://localhost:4000';
  return `${base.replace(/\/$/, '')}${path}`;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }
  try {
    const r = await axios.post(backend('/bookings'), req.body, { timeout: 10000 });
    res.status(r.status).json(r.data);
  } catch (e: any) {
    const status = e?.response?.status || 502;
    res.status(status).json({ message: e?.response?.data?.message || 'proxy error' });
  }
}

import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Cache-Control', 'no-store');
  const base = 'https://highway-delite-qz2f.vercel.app';
  const url = `${base.replace(/\/$/, '')}/health`;
  try {
    const r = await axios.get(url, { timeout: 4000 });
    res.status(200).json({ ok: true, from: url, data: r.data });
  } catch (err: any) {
    res.status(503).json({ ok: false, from: url, error: err?.message || 'unreachable' });
  }
}

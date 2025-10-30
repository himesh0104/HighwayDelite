import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  const base = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
  const url = `${base.replace(/\/$/, '')}/health`;
  try {
    const r = await axios.get(url, { timeout: 4000 });
    res.status(200).json({ ok: true, from: url, data: r.data });
  } catch (err: any) {
    res.status(503).json({ ok: false, from: url, error: err?.message || 'unreachable' });
  }
}

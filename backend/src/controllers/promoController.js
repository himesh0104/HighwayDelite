import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function validatePromo(req, res) {
  try {
    const { code } = req.body || {};
    if (!code) return res.status(400).json({ valid: false, message: 'code required' });

    // tiny helper: only these two are expected but let's read DB so we can add more later
    const found = await prisma.promoCode.findUnique({ where: { code: code.toUpperCase() } });
    if (!found || !found.active) {
      return res.json({ valid: false, message: 'invalid code' });
    }

    res.json({ valid: true, data: { type: found.type, amount: found.amount } });
  } catch (err) {
    console.error('validatePromo error', err);
    res.status(500).json({ valid: false, message: 'failed to validate code' });
  }
}



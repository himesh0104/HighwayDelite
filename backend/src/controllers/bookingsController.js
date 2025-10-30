import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient(); // forgot to close this once, hope it's fine here 🤞

export async function createBooking(req, res) {
  // booking endpoint here
  // adding new booking to database here (trying to keep it simple)
  try {
    const { experienceId, slotId, name, email, promoCode, quantity } = req.body || {};

    const qty = Number(quantity || 1);
    if (!name || !email || !experienceId || !slotId) {
      return res.status(400).json({ message: 'name, email, experienceId, slotId are required' });
    }
    if (!Number.isInteger(qty) || qty < 1) {
      return res.status(400).json({ message: 'invalid quantity' });
    }

    // check experience & slot
    // just checking if slot belongs to experience before saving
    const slot = await prisma.slot.findUnique({ where: { id: slotId } });
    if (!slot || slot.experienceId !== experienceId) {
      return res.status(400).json({ message: 'invalid slot for experience' });
    }

    // need to handle sold-out slots carefully
    // hope this logic makes sense
    if (slot.capacity <= 0) {
      return res.status(409).json({ message: 'slot already booked/sold out' });
    }

    // compute price, apply promo if valid
    // I decided to calculate discount on the full quantity subtotal so % off is more useful
    const experience = await prisma.experience.findUnique({ where: { id: experienceId } });
    if (!experience) return res.status(400).json({ message: 'experience not found' });

    let discount = 0;
    if (promoCode) {
      const promo = await prisma.promoCode.findUnique({ where: { code: promoCode.toUpperCase() } });
      if (promo && promo.active) {
        if (promo.type === 'PERCENT') {
          discount = Math.round((experience.price * qty * promo.amount) / 100);
        } else if (promo.type === 'FLAT') {
          discount = promo.amount;
        }
      }
    }

    const subtotal = experience.price * qty;
    const total = Math.max(0, subtotal - discount);

    // prevent double-booking same slot using a transaction
    // optimistic check then update capacity atomically
    const result = await prisma.$transaction(async (tx) => {
      // optimistic check again inside tx
      const freshSlot = await tx.slot.findUnique({ where: { id: slot.id } });
      if (!freshSlot || freshSlot.capacity <= 0) {
        throw new Error('SOLD_OUT');
      }
      if (freshSlot.capacity < qty) {
        throw new Error('INSUFFICIENT');
      }

      const booking = await tx.booking.create({
        data: {
          name,
          email,
          experienceId: experience.id,
          slotId: freshSlot.id,
          total,
          promoCode: promoCode ? promoCode.toUpperCase() : null,
        },
      });

      await tx.slot.update({
        where: { id: freshSlot.id },
        data: {
          booked: freshSlot.capacity - qty <= 0,
          capacity: Math.max(0, freshSlot.capacity - qty),
        },
      });

      return booking;
    });

    res.status(201).json({ message: 'booking confirmed', data: result });
  } catch (err) {
    if (err.message === 'SOLD_OUT') {
      return res.status(409).json({ message: 'slot sold out, sorry 😞' });
    }
    if (err.message === 'INSUFFICIENT') {
      return res.status(409).json({ message: 'not enough capacity for requested quantity' });
    }
    console.error('createBooking error', err); // TODO: better error messages later
    res.status(500).json({ message: 'failed to create booking' });
  }
}



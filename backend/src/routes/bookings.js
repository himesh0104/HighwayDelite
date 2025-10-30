import { Router } from 'express';
import { createBooking } from '../controllers/bookingsController.js';

const router = Router();

// POST /bookings → Accept booking details and save in DB
router.post('/', createBooking);

export default router;



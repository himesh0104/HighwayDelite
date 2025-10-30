import { Router } from 'express';
import { validatePromo } from '../controllers/promoController.js';

const router = Router();

// POST /promo/validate → Validate promo codes (SAVE10, FLAT100)
router.post('/validate', validatePromo);

export default router;



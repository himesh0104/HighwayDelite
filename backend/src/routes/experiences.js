import { Router } from 'express';
import { getAllExperiences, getExperienceById } from '../controllers/experiencesController.js';

const router = Router();

// GET /experiences → Return all experiences
// keeping routing super tiny, controller does the heavy lifting
router.get('/', getAllExperiences);

// GET /experiences/:id → Return single experience with slot details
// id is a Mongo ObjectId (string)
router.get('/:id', getExperienceById);

export default router;



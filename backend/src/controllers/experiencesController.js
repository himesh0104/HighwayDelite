import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient(); // creating prisma client once (hope I don't leak this 🙈)

export async function getAllExperiences(_req, res) {
  try {
    // fetching experiences from database here
    // keeping it simple: include slots so frontend doesn't need another round trip
    const experiences = await prisma.experience.findMany({
      include: { slots: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ data: experiences });
  } catch (err) {
    console.error('getAllExperiences error', err); // logging for myself
    res.status(500).json({ message: 'failed to load experiences' });
  }
}

export async function getExperienceById(req, res) {
  try {
    const id = req.params.id; // Mongo ObjectId is a string
    // not validating format strictly, prisma will throw if it's totally wrong

    const experience = await prisma.experience.findUnique({
      where: { id },
      include: { slots: true },
    });
    if (!experience) return res.status(404).json({ message: 'experience not found' });

    res.json({ data: experience });
  } catch (err) {
    console.error('getExperienceById error', err);
    res.status(500).json({ message: 'failed to load experience' });
  }
}



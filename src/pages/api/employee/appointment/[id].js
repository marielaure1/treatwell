import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const employeeId = req.query.id;

  try {
    const appointments = await prisma.appointment.findMany({
      where: {
        employeeId: parseInt(employeeId),
      },
      select: {
        date: true,
      },
    });

    res.status(200).json(appointments);
  } catch (error) {
    console.error('Erreur lors de la récupération des créneaux réservés :', error);
    res.status(500).json({ message: 'Une erreur est survenue lors de la récupération des créneaux réservés.' });
  }
}

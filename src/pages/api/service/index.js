import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      
      const existingServices = await prisma.service.findMany();

      if (existingServices.length < 1) {
        return res.status(400).json({ message: "Il n'existe aucun service" });
      }

      res.status(201).json({ message: 'Services récupéré avec succès', existingServices });
    } catch (error) {
      console.error('Erreur lors de la récupération des services:', error);
      res.status(500).json({ message: 'Une erreur est survenue lors de la récupération des services' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).json({ message: `La méthode ${req.method} n'est pas autorisée` });
  }
}

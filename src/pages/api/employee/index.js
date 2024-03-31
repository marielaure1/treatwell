import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const existingEmployee = await prisma.employee.findMany();
      
      if (existingEmployee.length < 1) {
        return res.status(400).json({ message: "Il n'existe aucun employee" });
      }

      res.status(201).json({ message: 'Employées récupéré avec succès', existingEmployee });
    } catch (error) {
      console.error('Erreur lors de la récupération des employés:', error);
      res.status(500).json({ message: 'Une erreur est survenue lors de la récupération des employés' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).json({ message: `La méthode ${req.method} n'est pas autorisée` });
  }
}

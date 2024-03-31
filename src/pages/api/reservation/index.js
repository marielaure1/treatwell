import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { date, time, employee, service, firstName, lastName, email, phone, notes } = req.body;

      if (!date || !time || !employee || !service || !firstName || !lastName || !email || !phone) {
        return res.status(400).json({ message: 'Tous les champs sont requis' });
      }

      const dateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
      if (!dateRegex.test(date)) {
        return res.status(400).json({ message: 'Format de date invalide' });
      }

      if (!/^\d{2}:\d{2}$/.test(time)) {
        return res.status(400).json({ message: 'Format de temps invalide' });
      }

      if (!validateEmail(email)) {
        return res.status(400).json({ message: "Format d'email invalide" });
      }

      const existingEmployee = await prisma.employee.findUnique({
        where: {
          id: parseInt(employee)
        }
      });

      if (!existingEmployee) {
        return res.status(400).json({ message: 'L\'employé spécifié n\'existe pas' });
      }

      const existingService = await prisma.service.findUnique({
        where: {
          id: parseInt(service)
        }
      });

      if (!existingService) {
        return res.status(400).json({ message: 'Le service spécifié n\'existe pas' });
      }

      let selectedDateTime = date.split("T")[0] + "T" + time  + ":00.000Z";
      let selectedDateTimeFormat = new Date(selectedDateTime);

      const existingReservation = await prisma.appointment.findFirst({
        where: {
          AND: [
            { date: selectedDateTimeFormat },
            { employeeId: parseInt(employee) }
          ]
        }
      });

      if (existingReservation) {
        return res.status(400).json({ message: 'Ce créneau est déjà réservé. Veuillez choisir un autre créneau.' });
      }

      

      const reservation = await prisma.appointment.create({
        data: {
          date: selectedDateTimeFormat,
          employeeId: parseInt(employee),
          serviceId: parseInt(service),
          firstName, 
          lastName, 
          email, 
          phoneNumber: phone,
          notes
        },
      });

      res.status(201).json({ message: 'Réservation créée avec succès', reservation});
    } catch (error) {
      console.error('Erreur lors de la création de la réservation:', error);
      res.status(500).json({ message: 'Une erreur est survenue lors de la création de la réservation' });
    }
  }
  else {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ message: `La méthode ${req.method} n'est pas autorisée` });
  }
}

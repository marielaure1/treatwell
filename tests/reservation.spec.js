import { expect } from 'chai';
import fetch from 'node-fetch';
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('API Route: /api/reservation', async () => {
  const port = process.env.PORT || 3000;
  let reservationId;
  let lastTest = false;

  it("Création d'une réservation - Champ manquant", async () => {
      const response = await fetch(
        `http://localhost:${port}/api/reservation`, 
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                date: '2026-03-04T23:00:00.000Z',
                employee: 1,
                service: 1,
                firstName: 'John',
                lastName: 'Doe',
                email: 'johnexample.com',
                phone: '123456789',
                notes: 'Test appointment'
            })
        }
      );
      expect(response.status).to.equal(400);
      const responseData = await response.json();
      expect(responseData.message).to.equal('Tous les champs sont requis');
  });

  it("Création d'une réservation - Format de date invalide", async () => {
    const response = await fetch(
      `http://localhost:${port}/api/reservation`, 
      {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            date: '2026-03-04',
              time: '09:00',
              employee: 1,
              service: 1,
              firstName: 'John',
              lastName: 'Doe',
              email: 'johnexample.com',
              phone: '123456789',
              notes: 'Test appointment'
          })
      }
    );
    expect(response.status).to.equal(400);
    const responseData = await response.json();
    expect(responseData.message).to.equal('Format de date invalide');
});

  it("Création d'une réservation - Format de temps invalide", async () => {
    const response = await fetch(
      `http://localhost:${port}/api/reservation`, 
      {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            date: '2026-03-04T23:00:00.000Z',
              time: '0900',
              employee: 1,
              service: 1,
              firstName: 'John',
              lastName: 'Doe',
              email: 'johnexample.com',
              phone: '123456789',
              notes: 'Test appointment'
          })
      }
    );
    expect(response.status).to.equal(400);
    const responseData = await response.json();
    expect(responseData.message).to.equal('Format de temps invalide');
});

  it("Création d'une réservation - Adresse email invalide", async () => {
    const response = await fetch(
      `http://localhost:${port}/api/reservation`, 
      {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({
              date: '2026-03-04T23:00:00.000Z',
              time: '09:00',
              employee: 1,
              service: 1,
              firstName: 'John',
              lastName: 'Doe',
              email: 'johnexample.com',
              phone: '123456789',
              notes: 'Test appointment'
          })
      }
    );

    expect(response.status).to.equal(400);
    const responseData = await response.json();
    expect(responseData.message).to.equal('Format d\'email invalide');
  });

  it("Création d'une réservation - Employé inexistant", async () => {
    const response = await fetch(
      `http://localhost:${port}/api/reservation`, 
      {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({
              date: '2026-03-04T23:00:00.000Z',
              time: '09:00',
              employee: 9999, 
              service: 1,
              firstName: 'John',
              lastName: 'Doe',
              email: 'john@example.com',
              phone: '123456789',
              notes: 'Test appointment'
          })
      }
    );

    expect(response.status).to.equal(400);
    const responseData = await response.json();
    expect(responseData.message).to.equal("L'employé spécifié n'existe pas");
  });

  it("Création d'une réservation - Service inexistant", async () => {
    const response = await fetch(
      `http://localhost:${port}/api/reservation`, 
      {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({
              date: '2026-03-04T23:00:00.000Z',
              time: '09:00',
              employee: 1,
              service: 9999, 
              firstName: 'John',
              lastName: 'Doe',
              email: 'john@example.com',
              phone: '123456789',
              notes: 'Test appointment'
          })
      }
    );

    expect(response.status).to.equal(400);
    const responseData = await response.json();
    expect(responseData.message).to.equal("Le service spécifié n'existe pas");
  });

  it("Création d'une réservation - Succès", async () => {
    const response = await fetch(
      `http://localhost:${port}/api/reservation`, 
      {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({
              date: '2026-03-04T23:00:00.000Z',
              time: '09:00',
              employee: 1,
              service: 1,
              firstName: 'John',
              lastName: 'Doe',
              email: 'john@example.com',
              phone: '123456789',
              notes: 'Test appointment'
          })
      }
    );
        
    expect(response.status).to.equal(201);
    const responseData = await response.json();
    expect(responseData.message).to.equal('Réservation créée avec succès');
    expect(responseData.reservation).to.be.an('object');

    reservationId = responseData.reservation.id;
  });

  it("Création d'une réservation - Créneau non disponible", async () => {
    const response = await fetch(
      `http://localhost:${port}/api/reservation`, 
      {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({
              date: '2026-03-04T23:00:00.000Z',
              time: '09:00',
              employee: 1,
              service: 1,
              firstName: 'John',
              lastName: 'Doe',
              email: 'john@example.com',
              phone: '123456789',
              notes: 'Test appointment'
          })
      }
    );
      
    expect(response.status).to.equal(400);
    const responseData = await response.json();
    expect(responseData.message).to.equal('Ce créneau est déjà réservé. Veuillez choisir un autre créneau.');

    lastTest = true;
  });

  after(async () => {
    if (lastTest && reservationId) {
      await prisma.appointment.delete({
        where: {
          id: reservationId
        }
      });
    }
  });
});

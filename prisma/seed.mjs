import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    // Création des services
    const services = await prisma.service.createMany({
      data: [
        { name: 'Coupe de cheveux', price: 30 },
        { name: 'Coloration', price: 50 },
        { name: 'Mèches', price: 60 },
        { name: 'Brushing', price: 20 },
        { name: 'Coiffure de mariage', price: 80 },
      ],
    });

    // Création des employés
    const employees = await prisma.employee.createMany({
      data: [
        { name: 'John' },
        { name: 'Anna' },
        { name: 'Marie' },
        { name: 'Jane' },
        { name: 'Wallas' },
      ],
    });

    console.log('Seeders exécutés avec succès.');
  } catch (error) {
    console.error('Erreur lors de l\'exécution des seeders :', error);
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

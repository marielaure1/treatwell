## Getting Started

Lancer le serveur:

```bash
npm run dev
# ou
yarn dev
# ou
pnpm dev
# ou
bun dev
```

## Seeders

Pour ajouter des données initiales à votre base de données, vous pouvez exécuter les seeders. Assurez-vous d'avoir configuré votre base de données et votre connexion correctement avant d'exécuter les seeders.

### Étapes pour exécuter les seeders :

1. Assurez-vous que votre base de données est configurée et accessible.
2. Assurez-vous que vous avez correctement configuré votre fichier .env avec les détails de connexion à votre base de données.
3. Exécutez la commande suivante pour exécuter les seeders :

```bash
npx prisma db seed
```

## Tests

Faire des tests fonctionnels avec Mocha:

```bash
npm run test
``` 

import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

// Parsing manuale dell'URL del database
const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
  throw new Error('DATABASE_URL environment variable is not set');
}

// Parse dell'URL MySQL
const url = new URL(dbUrl);
const connectionString = dbUrl;

// Crea l'adapter direttamente con la connection string
const adapter = new PrismaMariaDb(connectionString);

// Crea l'istanza global per evitare multiple connessioni in development
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Inizializza PrismaClient con l'adapter
const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma;
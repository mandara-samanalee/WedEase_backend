import { PrismaClient } from "@prisma/client";
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env file

const prisma = new PrismaClient({
    log: ["query", "warn", "error"],
});

export const connectDB = async () => {
    try {
        await prisma.$connect();
        console.log('✅ Database connected successfully');
    } catch {
        console.error('❌ Database connection failed');
        process.exit(1); // Exit the process with failure
    }
}

export default prisma;
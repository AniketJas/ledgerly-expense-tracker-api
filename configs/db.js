import { neon } from "@neondatabase/serverless";
import "dotenv/config";

export const sql = neon(process.env.DB_URI);

export const initDB = async () => {
  try {
    await sql`CREATE TABLE IF NOT EXISTS transactions(
    id UUID PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    category VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
    );`;

    await sql`CREATE TABLE IF NOT EXISTS users(
    id UUID PRIMARY KEY,
    clerk_id VARCHAR(255) NOT NULL UNIQUE,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    email VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
    );`;

    console.log('Database initialized successfully.');
  } catch (error) {
    console.log('Error initializing database:', error.message);
    process.exit(1)
  }
}
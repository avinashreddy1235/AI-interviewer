import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

let db;

export async function initializeDatabase() {
    db = await open({
        filename: './database.sqlite',
        driver: sqlite3.Database
    });

    await db.exec(`
    CREATE TABLE IF NOT EXISTS interviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT,
      topic TEXT,
      score INTEGER,
      feedback TEXT,
      transcript TEXT
    )
  `);

    console.log('Database initialized');
}

export function getDb() {
    if (!db) {
        throw new Error('Database not initialized');
    }
    return db;
}

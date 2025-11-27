import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import pg from 'pg';

const { Pool } = pg;

let db;
let isPostgres = false;

export async function initializeDatabase() {
  if (process.env.DATABASE_URL) {
    // Use PostgreSQL
    isPostgres = true;
    db = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false
      }
    });

    await db.query(`
            CREATE TABLE IF NOT EXISTS interviews (
                id SERIAL PRIMARY KEY,
                date TEXT,
                topic TEXT,
                score INTEGER,
                feedback TEXT,
                transcript TEXT
            )
        `);
    console.log('Connected to PostgreSQL');
  } else {
    // Use SQLite
    isPostgres = false;
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
    console.log('Connected to SQLite');
  }
}

export function getDb() {
  if (!db) {
    throw new Error('Database not initialized');
  }
  return {
    // Abstraction layer to handle differences between sqlite and pg
    all: async (sql, params = []) => {
      if (isPostgres) {
        // Convert ? to $1, $2, etc. for Postgres
        let i = 1;
        const pgSql = sql.replace(/\?/g, () => `$${i++}`);
        const result = await db.query(pgSql, params);
        return result.rows;
      } else {
        return db.all(sql, params);
      }
    },
    get: async (sql, params = []) => {
      if (isPostgres) {
        let i = 1;
        const pgSql = sql.replace(/\?/g, () => `$${i++}`);
        const result = await db.query(pgSql, params);
        return result.rows[0];
      } else {
        return db.get(sql, params);
      }
    },
    run: async (sql, params = []) => {
      if (isPostgres) {
        let i = 1;
        const pgSql = sql.replace(/\?/g, () => `$${i++}`);
        // For INSERT, we want to return the ID. Postgres uses RETURNING id.
        if (pgSql.trim().toUpperCase().startsWith('INSERT')) {
          const result = await db.query(`${pgSql} RETURNING id`, params);
          return { lastID: result.rows[0].id };
        } else {
          await db.query(pgSql, params);
          return {};
        }
      } else {
        return db.run(sql, params);
      }
    }
  };
}

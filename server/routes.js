import express from 'express';
import { getDb } from './database.js';

const router = express.Router();

// Get all interviews (summary)
router.get('/interviews', async (req, res) => {
    try {
        const db = getDb();
        const interviews = await db.all('SELECT id, date, topic, score FROM interviews ORDER BY date DESC');
        res.json(interviews);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get interview by ID
router.get('/interviews/:id', async (req, res) => {
    try {
        const db = getDb();
        const interview = await db.get('SELECT * FROM interviews WHERE id = ?', req.params.id);
        if (!interview) {
            return res.status(404).json({ error: 'Interview not found' });
        }
        // Parse JSON fields if they are stored as strings, or just return as is if SQLite handles it.
        // Since we store them as TEXT, we might need to parse them if the client expects objects.
        // However, for simplicity, let's assume the client handles parsing or we store as JSON string.
        // Let's parse them here for the client.
        try {
            interview.feedback = JSON.parse(interview.feedback);
            interview.transcript = JSON.parse(interview.transcript);
        } catch (e) {
            // In case it's not valid JSON or already an object (unlikely with TEXT)
            console.warn('Failed to parse JSON fields', e);
        }

        res.json(interview);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Save a new interview
router.post('/interviews', async (req, res) => {
    try {
        const { date, topic, score, feedback, transcript } = req.body;
        const db = getDb();

        const result = await db.run(
            'INSERT INTO interviews (date, topic, score, feedback, transcript) VALUES (?, ?, ?, ?, ?)',
            [date, topic, score, JSON.stringify(feedback), JSON.stringify(transcript)]
        );

        res.status(201).json({ id: result.lastID });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;

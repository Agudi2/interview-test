import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { analyzeDiaryEntry } from './template/src/api/analyze.ts';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/analyze', async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'Missing diary text' });

  try {
    const result = await analyzeDiaryEntry(text);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong.' });
  }
});

app.listen(5174, () => {
  console.log('Server is running on http://localhost:5174');
});

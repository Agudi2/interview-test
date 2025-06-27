import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'csv-parse/sync';


import { VoiceEntry } from './types'; 

const csvPath = path.join(
  path.dirname(new URL(import.meta.url).pathname).replace(/^\/([A-Za-z]):/, '$1:'),
  'Expanded_Diary_Entries.csv'
);

let raw = '';
try {
  raw = fs.readFileSync(csvPath, 'utf8');
} catch {
  console.warn('⚠️ CSV file not found, falling back to dummy data');
  raw = 'transcript_raw,transcript_user,tags_model,tags_user,emotion_score_score,created_at,updated_at,embedding\n"","","","","","","",""';
}

const records = parse(raw, {
  columns: true,
  skip_empty_lines: true,
});

export const mockVoiceEntries: VoiceEntry[] = records.map((row: Record<string, string>, index: number) => {
  const isoCreated = new Date(row.created_at).toISOString();
  const isoUpdated = new Date(row.updated_at).toISOString();

  return {
    id: String(index),
    user_id: 'mock',
    audio_url: null,
    transcript_raw: row.transcript_raw || '',
    transcript_user: row.transcript_user || '',
    language_detected: 'en',
    language_rendered: 'en',
    tags_model: [],
    tags_user: row.tags_user ? row.tags_user.split(',') : ['reflection'],
    category: null,
    created_at: isoCreated,
    updated_at: isoUpdated,
    emotion_score_score: row.emotion_score_score ? parseFloat(row.emotion_score_score) : null,
    embedding: null,
  };
});

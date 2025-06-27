// src/lib/mockData.ts
import fs from 'node:fs'
import path from 'node:path'

import type { VoiceEntry } from './types'

// Read CSV file or fallback to a minimal dummy row
const csvPath = path.join(
  path.dirname(new URL(import.meta.url).pathname).replace(/^\/([A-Za-z]):/, '$1:'),
  'Expanded_Diary_Entries.csv'
)

let raw = ''
try {
  raw = fs.readFileSync(csvPath, 'utf8')
} catch {
  console.warn('⚠️ CSV file not found, falling back to dummy data')
  // Fallback includes valid ISO timestamps for created_at and updated_at
  const now = new Date().toISOString()
  raw = `transcript_raw,transcript_user,tags_model,tags_user,emotion_score_score,created_at,updated_at,embedding\n"", "", "", "", "", "${now}", "${now}", ""`
}

// Simple CSV parsing without external dependency
const lines = raw.split('\n').filter(Boolean)
const headers = lines[0].split(',').map(h => h.trim())
const dataRows = lines.slice(1)

const records = dataRows.map((line) => {
  // Extract quoted values
  const matches = line.match(/"(.*?)"/g) || []
  const values = matches.map(v => v.replace(/"/g, '').trim())
  const obj: Record<string, string> = {}
  headers.forEach((header, idx) => {
    obj[header] = values[idx] ?? ''
  })
  return obj
})

export const mockVoiceEntries: VoiceEntry[] = records.map((row, index) => {
  // Parse ISO dates, fallback to now if invalid
  const createdDate = new Date(row.created_at)
  const updatedDate = new Date(row.updated_at)
  const isoCreated = isNaN(createdDate.getTime())
    ? new Date().toISOString()
    : createdDate.toISOString()
  const isoUpdated = isNaN(updatedDate.getTime())
    ? new Date().toISOString()
    : updatedDate.toISOString()

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
  }
})

import { TranscriptEntry, Task } from './types'
import type { ParsedEntry } from './types'

const TASK_PATTERNS: RegExp[] = [
  /call\s+[\w\s]+/i,
  /email\s+[\w\s]+/i,
  /schedule\s+[\w\s]+/i,
  /buy\s+[\w\s]+/i,
  /remind\s+me\s+to\s+[\w\s]+/i,
  /book\s+[\w\s]+/i,
  /meet\s+with\s+[\w\s]+/i,
  /finish\s+[\w\s]+/i,
  /submit\s+[\w\s]+/i,
]

export function extractTasksFromTranscript(entry: TranscriptEntry): Task[] {
  const text = entry.transcript.toLowerCase()
  const tasks: Task[] = []

  TASK_PATTERNS.forEach((pattern) => {
    const match = text.match(pattern)
    if (match) {
      tasks.push({
        task_text: match[0],
        due_date: undefined,
        status: 'pending',
        category: 'general',
      })
    }
  })

  return tasks
}

export function parseEntry(text: string): ParsedEntry {
  const lower = text.toLowerCase();

  let theme = 'general';
  let vibe = 'reflective';

  if (lower.includes('scrolling') || lower.includes('sleep') || lower.includes('exhausted') || lower.includes('guilt')) {
    theme = 'work-life balance';
    vibe = 'anxious';
  } else if (lower.includes('opportunity') || lower.includes('decision') || lower.includes('right call')) {
    theme = 'decision making';
    vibe = 'conflicted';
  } else if (lower.includes('promotion') || lower.includes('career') || lower.includes('goal')) {
    theme = 'career growth';
    vibe = 'driven';
  }

  return {
    theme: [theme],
    vibe: [vibe],
    intent: "reflecting",
    subtext: "",
    persona_trait: [vibe],
    bucket: ["Thought"]
  };
}

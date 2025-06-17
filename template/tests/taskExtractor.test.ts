import { describe, it, expect } from 'vitest'
import { extractTasksFromTranscript } from '../src/lib/taskExtractor'
import { TranscriptEntry } from '../src/lib/types'

describe('Task extraction', () => {
  it('should detect tasks in transcript text', () => {
    const entry: TranscriptEntry = {
      id: '1',
      transcript: 'I need to call mom and schedule a dentist appointment.',
    }

    const tasks = extractTasksFromTranscript(entry)

    expect(tasks.length).toBeGreaterThan(0)
    expect(tasks[0]).toHaveProperty('task_text')
    expect(tasks[0].status).toBe('pending')
  })
})

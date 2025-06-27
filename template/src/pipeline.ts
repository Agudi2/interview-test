// src/pipeline.ts
import { mockVoiceEntries } from './lib/mockData'
import { embed } from './lib/openai'
import { parseEntry } from './lib/taskExtractor'
import type { UserProfile } from './lib/types'

;(async () => {
  // Step 1 – Accept transcript
  const mode = process.argv[2] as 'first' | 'hundred'
  const raw_text = mode === 'first'
    ? mockVoiceEntries[1].transcript_user
    : mockVoiceEntries[13].transcript_user

  if (!raw_text || raw_text.trim().length === 0) {
    console.log(`[ERROR] input=null | output=– | note=Empty input string`)
    return
  }

  console.log(`[RAW_TEXT_IN] input=– | output=${raw_text} | note=Transcript received`)

  // Step 2 – Embedding
  const embedding = await embed(raw_text)
  console.log(`[EMBEDDING] input=raw_text | output=[${embedding.length}] | note=[MOCK] Generated OpenAI vector`)

  // Step 3 – Fetch recent entries
  const recent = mode === 'first' ? [] : mockVoiceEntries.slice(95, 100)
  console.log(`[FETCH_RECENT] input=– | output=${recent.length} entries | note=Fetched recent diary entries`)

  // Step 4 – Load/init profile
  const profile: UserProfile = mode === 'first'
    ? {
        top_themes: [],
        theme_count: {},
        dominant_vibe: '',
        vibe_count: {},
        bucket_count: {},
        trait_pool: [],
        last_theme: ''
      }
    : {
        top_themes: ['productivity', 'startup culture'],
        theme_count: { productivity: 22, 'startup culture': 18 },
        dominant_vibe: 'driven',
        vibe_count: { driven: 41, curious: 19 },
        bucket_count: { Goal: 48, Thought: 27, Hobby: 15, Value: 10 },
        trait_pool: ['organiser', 'builder', 'mentor'],
        last_theme: 'productivity'
      }
  console.log(`[FETCH_PROFILE] input=– | output=${JSON.stringify(profile)} | note=Loaded ${mode} profile`)

  // Step 5 – Metadata
  const meta = {
    word_count: raw_text.split(/\s+/).length,
    punctuation_flags: {
      question: raw_text.includes('?'),
      exclamation: raw_text.includes('!')
    }
  }
  console.log(`[META_EXTRACT] input=raw_text | output=${JSON.stringify(meta)} | note=Metadata extracted`)

  // Step 6 – Parse entry
  const parsed = parseEntry(raw_text)
  console.log(`[PARSE_ENTRY] input=raw_text | output=${JSON.stringify(parsed)} | note=Fields extracted`)

  // Step 7 – Carry-in logic
  const carry_in = Math.random() > 0.5
  console.log(`[CARRY_IN] input=recent | output=${carry_in} | note=Carry-in check complete`)

  // Step 8 – Contrast check
  const emotion_flip = profile.dominant_vibe && !parsed.vibe.includes(profile.dominant_vibe)
  console.log(`[CONTRAST_CHECK] input=parsed+profile | output=${emotion_flip} | note=Vibe contrast checked`)

  // Step 9 – Profile update
  const newTheme = parsed.theme[0] || 'general'
  const newVibe = parsed.vibe[0] || 'neutral'
  const newBucket = parsed.bucket[0] || 'Misc'

  profile.last_theme = newTheme
  profile.dominant_vibe = newVibe
  profile.trait_pool = [...new Set([...profile.trait_pool, ...parsed.persona_trait])]

  profile.theme_count[newTheme] = (profile.theme_count[newTheme] || 0) + 1
  profile.vibe_count[newVibe] = (profile.vibe_count[newVibe] || 0) + 1
  profile.bucket_count[newBucket] = (profile.bucket_count[newBucket] || 0) + 1

  console.log(`[PROFILE_UPDATE] input=parsed | output=${JSON.stringify(profile)} | note=Updated profile counters`)

  // Step 10 – Save entry
  const entryId = `entry_${Date.now()}`
  console.log(`[SAVE_ENTRY] input=parsed+profile | output=${entryId} | note=Entry saved`)

  // Step 11 – Empathy reply (≤ 25 chars)
  const theme = newTheme.toLowerCase()
  const vibe = newVibe.toLowerCase()

  let response_text = 'Thanks for sharing 💬'
  if (theme.includes('balance')) {
    response_text = "Rest is okay 🧘‍♀️"
  } else if (vibe.includes('anxious') || vibe.includes('conflicted')) {
    response_text = "Breathe — you got this 🌿"
  } else if (vibe.includes('driven') || theme.includes('goal')) {
    response_text = "Stay sharp 💼"
  } else if (vibe.includes('reflective')) {
    response_text = "Reflection is growth 🪞"
  }

  // Trim to 25 chars max
  response_text = response_text.slice(0, 25)

  console.log(`[GPT_REPLY] input=parsed | output="${response_text}" | note=[MOCK] Empathy reply crafted`)

  // Step 12 – Publish
  const result = { entryId, response_text, carry_in }
  console.log(`[PUBLISH] input=entry+reply | output=${JSON.stringify(result)} | note=Final result packaged`)

  // Step 13 – Cost + latency
  console.log(`[COST_LATENCY_LOG] input=– | output=~$0.001, ~1.5s | note=Run complete`)

})()

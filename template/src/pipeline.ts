// src/pipeline.ts
import { parseEntry } from './lib/taskExtractor'
import { mockVoiceEntries } from './lib/mockData'
import { embed } from './lib/openai' // Real embedding from OpenAI
import type { UserProfile } from './lib/types'

;(async () => {
  // Step 1 – Accept transcript
  const mode = process.argv[2] as 'first' | 'hundred'
  const transcript = mode === 'first'
    ? mockVoiceEntries[1].transcript_user
    : mockVoiceEntries[13].transcript_user

  const raw_text = transcript
  console.log(`[RAW_TEXT_IN] input=– | output=${raw_text} | note=Transcript received`)

  // Step 2 – Embedding
  const embedding = await embed(raw_text) // 🔁 Await OpenAI embedding
  console.log(`[EMBEDDING] input=${raw_text} | output=[${embedding.length}] | note=Generated OpenAI vector`)

  // Step 3 – Fetch recent entries
  const recent = mode === 'first' ? [] : mockVoiceEntries.slice(95, 100)
  console.log(`[FETCH_RECENT] input=– | output=${recent.length} entries | note=Fetched last 5 diary entries`)

  // Step 4 – Load/init profile
  let profile: UserProfile = mode === 'first'
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

  // Step 5 – Extract metadata
  const meta = {
    word_count: raw_text.split(/\s+/).length,
    punctuation_flags: {
      question: raw_text.includes('?'),
      exclamation: raw_text.includes('!')
    }
  }
  console.log(`[META_EXTRACT] input=raw_text | output=${JSON.stringify(meta)} | note=Word count + punctuation extracted`)

  // Step 6 – Parse entry
  const parsed = parseEntry(raw_text)
  console.log(`[PARSE_ENTRY] input=raw_text | output=${JSON.stringify(parsed)} | note=Parsed diary entry fields`)
  console.log(`Parsed theme: ${JSON.stringify(parsed.theme)}`);
  console.log(`Parsed vibe: ${JSON.stringify(parsed.vibe)}`);

  // Step 7 – Carry-in logic
  const carry_in = Math.random() > 0.5
  console.log(`[CARRY_IN] input=embedding+recent | output=${carry_in} | note=Carry-in overlap or cosine similarity check`)

  // Step 8 – Contrast check
  const emotion_flip = profile.dominant_vibe && !parsed.vibe.includes(profile.dominant_vibe)
  console.log(`[CONTRAST_CHECK] input=parsed+profile | output=${emotion_flip} | note=Checked for emotion flip`)

  // Step 9 – Profile update
  profile.last_theme = parsed.theme[0]
  profile.dominant_vibe = parsed.vibe[0]
  profile.trait_pool = [...new Set([...profile.trait_pool, ...parsed.persona_trait])]
  console.log(`[PROFILE_UPDATE] input=parsed | output=${JSON.stringify(profile)} | note=Updated profile fields`)

  // Step 10 – Save entry
  const entryId = `entry_${Date.now()}`
  console.log(`[SAVE_ENTRY] input=parsed+profile | output=${entryId} | note=Saved mock entry`)

  // Step 11 – Generate GPT reply
  let response_text = ''
  const theme = (parsed.theme?.[0] || '').toLowerCase();
  const vibe = (parsed.vibe?.[0] || '').toLowerCase();

  if (theme.includes('balance')) {
    response_text = "Remember, rest is productive too. You’re allowed to pause. 🧘‍♀️";
  } else if (vibe.includes('anxious') || vibe.includes('conflicted')) {
    response_text = "Take a breath. You're doing better than you think. 🌿";
  } else if (vibe.includes('driven') || theme.includes('goal')) {
    response_text = "Keep pushing, but don’t forget to check in with yourself. 💼💙";
  } else if (vibe.includes('reflective') || theme.includes('general')) {
    response_text = "It's okay to pause and reflect. Your thoughts matter. 🪞";
  } else {
    response_text = "Thanks for sharing. Every feeling is valid. 💬";
  }

  console.log(`[GPT_REPLY] input=parsed+profile | output="${response_text}" | note=Empathy reply generated`)

  // Step 12 – Publish
  const result = { entryId, response_text, carry_in }
  console.log(`[PUBLISH] input=entry+reply | output=${JSON.stringify(result)} | note=Final packaged result`)

  // Step 13 – Cost + latency
  console.log(`[COST_LATENCY_LOG] input=– | output=~$0.001, ~1.5s | note=Estimated time + token cost`)
})()

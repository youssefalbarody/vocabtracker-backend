// Dictionary integration service (V1 real API)
// Calls Free Dictionary API to validate English words and extract part of speech.
// Confidence heuristic: 0.6–1.0 based on presence and volume of definitions.
// NOTE: Future translation API can be plugged alongside this (e.g., Arabic translation),
// returning a non-null "arabic" value without changing controller logic.
//
// API: https://api.dictionaryapi.dev/api/v2/entries/en/{word}
// - Success: array of entries; each has "meanings" with "partOfSpeech" and "definitions"
// - Failure: 404 with JSON like:
//   { "title": "No Definitions Found", "message": "...", "resolution": "..." }

export async function lookupDictionary(english) {
  const normalized = String(english || '').trim().toLowerCase()
  if (!normalized) return { ok: false, english: normalized }

  try {
    const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(normalized)}`
    const resp = await fetch(url, { headers: { Accept: 'application/json' } })
    if (!resp.ok) {
      return { ok: false, english: normalized }
    }
    const json = await resp.json()
    const entry = Array.isArray(json) ? json[0] : null
    const meanings = entry && Array.isArray(entry.meanings) ? entry.meanings : []
    const firstPos = meanings.length > 0 && meanings[0]?.partOfSpeech ? String(meanings[0].partOfSpeech) : 'unknown'
    const defsCount = meanings.reduce((acc, m) => acc + (Array.isArray(m.definitions) ? m.definitions.length : 0), 0)

    // Confidence heuristic:
    // - Base 0.6 when a definition exists
    // - +0.05 per definition up to +0.4 cap (i.e., 8+ definitions -> 1.0)
    // Rationale: more definitions imply stronger dictionary coverage.
    const confidence = Math.max(0.6, Math.min(1.0, 0.6 + Math.min(0.4, defsCount * 0.05)))

    return {
      ok: true,
      english: normalized,
      type: firstPos || 'unknown',
      confidence
    }
  } catch {
    // Network or parsing error: treat as failure without crashing the server
    return { ok: false, english: normalized }
  }
}

// V1 Arabic translation (machine-based) using MyMemory Translation API.
// Placeholder for production: can be replaced later with a dedicated Arabic dictionary API.
// On any failure (network/bad response), return null and keep the word accepted.
export async function translateToArabic(english) {
  const text = String(english || '').trim()
  if (!text) return null
  try {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|ar`
    const resp = await fetch(url, { headers: { Accept: 'application/json' } })
    if (!resp.ok) {
      return null
    }
    const json = await resp.json()
    const status = typeof json?.responseStatus === 'number' ? json.responseStatus : 0
    const translated = typeof json?.responseData?.translatedText === 'string' ? json.responseData.translatedText : null
    if (status === 200 && translated) {
      return translated
    }
    return null
  } catch {
    return null
  }
}

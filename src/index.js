import express from 'express';
import cors from 'cors';
import { lookupDictionary, translateToArabic } from '../services/translate.service.js';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// ✅ ROOT
app.get('/', (req, res) => {
  res.send('VocabTracker Backend API is running');
});

// ⚠️ TEMP: Error for GET
app.get('/translate', (req, res) => {
  res.status(405).send('Use POST not GET');
});

// ✅ TRANSLATE (Real Implementation)
app.post('/translate', async (req, res) => {
  const { word } = req.body;

  if (!word) {
    return res.status(400).json({ error: 'word is required' });
  }

  try {
    // Run dictionary lookup and translation in parallel
    const [dictResult, arabicTranslation] = await Promise.all([
      lookupDictionary(word),
      translateToArabic(word)
    ]);

    // Construct the response
    // If dictionary lookup failed, dictResult.ok is false, but we might still have a translation
    // or vice versa.
    
    res.json({
      original: word,
      english: dictResult.english || word,
      type: dictResult.type || 'unknown',
      arabic: arabicTranslation, // might be null
      confidence: dictResult.confidence || 0,
      status: 'accepted' // Logic: if we processed it, it's accepted. Client handles "error" visual if needed.
    });

  } catch (err) {
    console.error('Translation handler error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


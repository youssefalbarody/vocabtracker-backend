import express from 'express';
import cors from 'cors';
import { lookupDictionary, translateToArabic } from '../services/translate.service.js';

const app = express();
const PORT = process.env.PORT || 4000;

// ✅ CORS (FIX)
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));
app.options('*', cors());

app.use(express.json());

// ✅ ROOT
app.get('/', (req, res) => {
  res.send('VocabTracker Backend API is running');
});

// ⚠️ GET not allowed
app.get('/translate', (req, res) => {
  res.status(405).send('Use POST not GET');
});

// ✅ POST translate
app.post('/translate', async (req, res) => {
  const { word } = req.body;

  if (!word) {
    return res.status(400).json({ error: 'word is required' });
  }

  try {
    const [dictResult, arabicTranslation] = await Promise.all([
      lookupDictionary(word),
      translateToArabic(word)
    ]);

    res.json({
      original: word,
      english: dictResult.english || word,
      type: dictResult.type || 'unknown',
      arabic: arabicTranslation,
      confidence: dictResult.confidence || 0,
      status: 'accepted'
    });

  } catch (err) {
    console.error('Translation handler error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});



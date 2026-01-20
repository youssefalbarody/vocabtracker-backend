import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// ✅ ROOT
app.get('/', (req, res) => {
  res.send('VocabTracker Backend API is running');
});

// ⚠️ TEMP: لو حد دخل /translate بـ GET
app.get('/translate', (req, res) => {
  res.status(405).send('Use POST not GET');
});

// ✅ TRANSLATE (الصح)
app.post('/translate', (req, res) => {
  const { word } = req.body;

  if (!word) {
    return res.status(400).json({ error: 'word is required' });
  }

  res.json({
    original: word,
    translation: 'ترجمة تجريبية'
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


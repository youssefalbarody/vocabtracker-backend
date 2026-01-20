import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 4000;

// middlewares
app.use(cors());
app.use(express.json());

// ✅ ROOT ROUTE (علشان تتأكد إن السيرفر شغال)
app.get('/', (req, res) => {
  res.send('VocabTracker Backend API is running');
});

// ✅ TRANSLATE ROUTE
app.post('/translate', (req, res) => {
  const { word } = req.body;

  if (!word) {
    return res.status(400).json({
      error: 'word is required'
    });
  }

  // ترجمة تجريبية (هنغيرها بعدين بترجمة حقيقية)
  res.json({
    original: word,
    translation: 'ترجمة ترحيبية'
  });
});

// start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


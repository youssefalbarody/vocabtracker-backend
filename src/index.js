import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.post('/translate', async (req, res) => {
  console.log('translate hit');

  const { word } = req.body;

  if (!word) {
    return res.status(400).json({ error: 'word is required' });
  }

  // مؤقتًا رد ثابت للاختبار
  res.json({
    original: word,
    translated: 'اختبار الترجمة'
  });
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

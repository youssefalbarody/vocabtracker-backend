import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// ✅ ROUTE ROOT
app.get('/', (req, res) => {
  res.send('VocabTracker Backend API is running');
});

// باقي ال routes
app.post('/translate', (req, res) => {
  // translate logic
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

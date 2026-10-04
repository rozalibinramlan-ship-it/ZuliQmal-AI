const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_MODEL = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ status: 'ok', service: 'IQmal AI Backend', model: GROQ_MODEL });
});

app.post('/api/nota', async (req, res) => {
  try {
    const { tahun, subjek, topik } = req.body;
    if (!tahun || !subjek || !topik) {
      return res.status(400).json({ error: 'Parameter tidak lengkap' });
    }
    const systemPrompt = 'Anda cikgu ' + subjek + ' untuk pelajar Tahun ' + tahun + ' Sekolah Kebangsaan Malaysia. Bagi NOTA ringkas tentang topik "' + topik + '". Guna format HTML ini sahaja (tiada ```html): <h2>📝 [TAJUK]</h2><p>[penerangan]</p><h3>📌 Poin Penting</h3><div class="langkah"><b>1.</b> [poin]</div><div class="langkah"><b>2.</b> [poin]</div><div class="langkah"><b>3.</b> [poin]</div><h3>✨ Contoh</h3><div class="contoh">[contoh]</div><h3>💡 Tip</h3><div class="formula">[tip]</div>. Bahasa Melayu mudah. Guna emoji.';
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + GROQ_API_KEY
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        max_tokens: 1200,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: 'Nota ' + topik + ' Tahun ' + tahun }
        ]
      })
    });
    const data = await response.json();
    if (data.error) {
      return res.status(500).json({ error: data.error.message });
    }
    let nota = data.choices[0].message.content;
    nota = nota.replace(/```html/g, '').replace(/```/g, '').trim();
    res.json({ nota: nota });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/latihan', async (req, res) => {
  try {
    const { tahun, subjek, topik } = req.body;
    if (!tahun || !subjek || !topik) {
      return res.status(400).json({ error: 'Parameter tidak lengkap' });
    }
    const systemPrompt = 'Anda cikgu ' + subjek + ' Tahun ' + tahun + ' SK Malaysia. Bagi TEPAT 5 soalan A B C D tentang "' + topik + '". Format WAJIB (tiada markdown):\n\nSOALAN1: [soalan]\nA: [pilihan]\nB: [pilihan]\nC: [pilihan]\nD: [pilihan]\nJAWAPAN1: [A/B/C/D]\n\nSOALAN2: [soalan]\nA: [pilihan]\nB: [pilihan]\nC: [pilihan]\nD: [pilihan]\nJAWAPAN2: [A/B/C/D]\n\nSOALAN3: [soalan]\nA: [pilihan]\nB: [pilihan]\nC: [pilihan]\nD: [pilihan]\nJAWAPAN3: [A/B/C/D]\n\nSOALAN4: [soalan]\nA: [pilihan]\nB: [pilihan]\nC: [pilihan]\nD: [pilihan]\nJAWAPAN4: [A/B/C/D]\n\nSOALAN5: [soalan]\nA: [pilihan]\nB: [pilihan]\nC: [pilihan]\nD: [pilihan]\nJAWAPAN5: [A/B/C/D]\n\nBahasa Melayu mudah.';
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + GROQ_API_KEY
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        max_tokens: 1500,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: 'Latihan ' + topik + ' Tahun ' + tahun }
        ]
      })
    });
    const data = await response.json();
    if (data.error) {
      return res.status(500).json({ error: data.error.message });
    }
    let teks = data.choices[0].message.content.replace(/```/g, '').trim();
    res.json({ teks: teks });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log('IQmal AI Backend jalan di port ' + PORT);
});
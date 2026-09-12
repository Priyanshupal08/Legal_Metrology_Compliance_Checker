import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { analyzePackageWithGemini } from './server/geminiService.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '25mb' }));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', hasGeminiKey: !!process.env.GEMINI_API_KEY });
});

app.post('/api/analyze', async (req, res) => {
  try {
    const {
      imageBase64,
      mimeType,
      additionalContext,
      backPanelBase64,
      sidePanelBase64,
      macroBase64,
      additionalImages,
      dimensions,
    } = req.body;
    if (!imageBase64) {
      return res.status(400).json({ error: 'imageBase64 is required' });
    }
    const options = {
      ...additionalContext,
      backPanelBase64: backPanelBase64 || additionalContext?.backPanelBase64,
      sidePanelBase64: sidePanelBase64 || additionalContext?.sidePanelBase64,
      macroBase64: macroBase64 || additionalContext?.macroBase64,
      additionalImages: additionalImages || additionalContext?.additionalImages,
      dimensions: dimensions || additionalContext?.dimensions,
    };
    const result = await analyzePackageWithGemini(imageBase64, mimeType || 'image/jpeg', options);
    res.json({ success: true, result });
  } catch (err: any) {
    console.error('Error in /api/analyze:', err);
    res.status(500).json({ success: false, error: err?.message || 'Server analysis error' });
  }
});

// Serve static files from dist in production
app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`LMPC Compliance Checker server running on http://0.0.0.0:${PORT}`);
});

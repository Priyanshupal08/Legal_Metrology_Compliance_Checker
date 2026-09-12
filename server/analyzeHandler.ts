import http from 'http';
import { analyzePackageWithGemini } from './geminiService';

export async function handleAnalyzeRequest(
  req: http.IncomingMessage,
  res: http.ServerResponse
): Promise<void> {
  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Method Not Allowed' }));
    return;
  }

  let rawBody = '';
  req.on('data', (chunk) => {
    rawBody += chunk;
  });

  req.on('end', async () => {
    try {
      if (!rawBody) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Request body is empty' }));
        return;
      }

      const parsed = JSON.parse(rawBody);
      const {
        imageBase64,
        mimeType,
        additionalContext,
        backPanelBase64,
        sidePanelBase64,
        macroBase64,
        additionalImages,
        dimensions,
      } = parsed;

      if (!imageBase64) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'imageBase64 is required' }));
        return;
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
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ success: true, result }));
    } catch (err: any) {
      console.error('Error in /api/analyze:', err);
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ success: false, error: err?.message || 'Server error during analysis' }));
    }
  });
}

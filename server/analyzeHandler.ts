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

export async function handleVerifyQrUrlRequest(
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
      const { url } = JSON.parse(rawBody || '{}');
      if (!url || (!url.startsWith('http://') && !url.startsWith('https://'))) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Valid URL starting with http:// or https:// is required' }));
        return;
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      const targetRes = await fetch(url, {
        method: 'GET',
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 LMPC-Inspector/1.0',
          Accept: 'text/html,application/xhtml+xml,application/json,text/plain;q=0.9,*/*;q=0.8',
        },
        signal: controller.signal,
        redirect: 'follow',
      });
      clearTimeout(timeoutId);

      const status = targetRes.status;
      const isAccessible = status >= 200 && status < 400;
      const text = await targetRes.text();
      const cleanText = text
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, ' ')
        .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, ' ')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .toLowerCase();

      const detectedDeclarations = {
        manufacturerNameAndAddress: /manufactur|pack(?:ed|er)|import(?:ed|er)|factory|address|pin\s*code|mfg|unit/i.test(cleanText),
        commonGenericName: /product|generic|commodity|model|item|description/i.test(cleanText),
        sizeAndDimensions: /dimension|size|weight|net\s*wt|volum|capacity|mm|cm|kg|g|ml|litre/i.test(cleanText),
        countryOfOrigin: /origin|made\s*in|country/i.test(cleanText),
        consumerCareDetails: /customer|care|toll|support|email|helpline|contact|phone/i.test(cleanText),
        warrantyOrCustomerGuide: /warranty|guarantee|manual|user\s*guide|instructions/i.test(cleanText),
      };

      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(
        JSON.stringify({
          ok: true,
          httpStatus: status,
          isAccessible,
          detectedDeclarations,
          sampleSnippet: text.substring(0, 300).replace(/<[^>]+>/g, ' ').trim(),
        })
      );
    } catch (err: any) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(
        JSON.stringify({
          ok: false,
          httpStatus: 0,
          isAccessible: false,
          error: err?.message || 'Failed to fetch QR destination URL',
        })
      );
    }
  });
}

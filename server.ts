import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';
import { buildSampleMarketDataset, CROPS_CATALOG, MARKET_LOCATIONS } from './src/data/cropsCatalog.js';
import type { MarketQuote } from './src/types/farm.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '1mb' }));

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'smart-farmer-api', timestamp: new Date().toISOString() });
});

// Helper to map AGMARKNET commodity names to local crop IDs
function matchCropId(commodityName: string): string | null {
  const lower = commodityName.toLowerCase();
  if (lower.includes('tomato')) return 'tomato';
  if (lower.includes('potato')) return 'potato';
  if (lower.includes('onion')) return 'onion';
  if (lower.includes('brinjal')) return 'brinjal';
  if (lower.includes('cabbage')) return 'cabbage';
  if (lower.includes('carrot')) return 'carrot';
  if (lower.includes('chilli') || lower.includes('chili')) return 'green-chilli';
  if (lower.includes('bhindi') || lower.includes('ladies finger') || lower.includes('okra')) return 'okra';
  if (lower.includes('cauliflower')) return 'cauliflower';
  if (lower.includes('banana')) return 'banana';
  if (lower.includes('paddy') || lower.includes('rice')) return 'paddy';
  if (lower.includes('turmeric')) return 'turmeric';
  return null;
}

// GET /api/markets — Official AGMARKNET (data.gov.in) when key configured, else clearly labeled sample reference dataset
app.get('/api/markets', async (_req, res) => {
  const apiKey = process.env.DATA_GOV_IN_API_KEY?.trim();
  const sampleFallback = buildSampleMarketDataset();

  if (!apiKey) {
    return res.json(sampleFallback);
  }

  try {
    const url = new URL('https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070');
    url.searchParams.set('api-key', apiKey);
    url.searchParams.set('format', 'json');
    url.searchParams.set('limit', '200');

    const response = await fetch(url.toString(), {
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(8000),
    });

    if (!response.ok) {
      return res.json({
        ...sampleFallback,
        note: `Live AGMARKNET service returned status ${response.status}; displaying Sample Reference Dataset.`,
      });
    }

    const payload = (await response.json()) as {
      records?: Array<{
        state?: string;
        district?: string;
        market?: string;
        commodity?: string;
        variety?: string;
        grade?: string;
        arrival_date?: string;
        min_price?: string;
        max_price?: string;
        modal_price?: string;
      }>;
    };

    const rawRecords = payload.records ?? [];
    const liveQuotes: MarketQuote[] = [];

    for (let i = 0; i < rawRecords.length; i++) {
      const rec = rawRecords[i];
      const cropId = rec.commodity ? matchCropId(rec.commodity) : null;
      if (!cropId) continue;

      const modalQuintal = Number(rec.modal_price);
      const minQuintal = Number(rec.min_price) || modalQuintal;
      const maxQuintal = Number(rec.max_price) || modalQuintal;
      if (!Number.isFinite(modalQuintal) || modalQuintal <= 0) continue;

      const modalKg = Math.round((modalQuintal / 100) * 100) / 100;
      const marketLabel = rec.market?.trim() || rec.district?.trim() || 'Regional Mandi';
      const stateLabel = rec.state?.trim() || 'India';
      const parsedDate = rec.arrival_date ? new Date(rec.arrival_date) : new Date();
      const isoDate = Number.isNaN(parsedDate.getTime()) ? new Date().toISOString() : parsedDate.toISOString();

      liveQuotes.push({
        id: `agm__${cropId}__${marketLabel.toLowerCase().replace(/\s+/g, '-')}__${i}`,
        cropId,
        marketId: `agm-${marketLabel.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
        marketName: {
          en: `${marketLabel} Mandi`,
          ta: `${marketLabel} சந்தை`,
          hi: `${marketLabel} मंडी`,
        },
        city: rec.district?.trim() || marketLabel,
        state: stateLabel,
        variety: rec.variety?.trim() || 'Standard',
        grade: rec.grade?.trim() || 'FAQ',
        minPricePerKg: Math.round((minQuintal / 100) * 100) / 100,
        maxPricePerKg: Math.round((maxQuintal / 100) * 100) / 100,
        modalPricePerKg: modalKg,
        modalPricePerQuintal: modalQuintal,
        demand: modalKg >= 35 ? 'high' : modalKg >= 22 ? 'moderate' : 'steady',
        availableQuantityKg: 2500,
        lastUpdated: isoDate,
        source: 'live-agmarknet',
        sourceLabel: 'Official AGMARKNET (data.gov.in)',
      });
    }

    if (liveQuotes.length === 0) {
      return res.json({
        ...sampleFallback,
        note: 'AGMARKNET returned no matching vegetable records today; displaying Sample Reference Dataset.',
      });
    }

    return res.json({
      source: 'live-agmarknet',
      sourceLabel: 'Official AGMARKNET (data.gov.in)',
      fetchedAt: new Date().toISOString(),
      note: `Fetched ${liveQuotes.length} verified mandi records from Open Government Data Platform India.`,
      quotes: liveQuotes,
    });
  } catch (err) {
    console.error('AGMARKNET fetch failed:', err);
    return res.json({
      ...sampleFallback,
      note: 'Live AGMARKNET feed temporarily unreachable; displaying Sample Reference Dataset.',
    });
  }
});

// GET /api/weather?location=... — Live Open-Meteo Geocoding + Weather Forecast
app.get('/api/weather', async (req, res) => {
  const rawLocation = typeof req.query.location === 'string' ? req.query.location.trim() : '';
  const locationQuery = rawLocation || 'Chennai';

  try {
    const geoUrl = new URL('https://geocoding-api.open-meteo.com/v1/search');
    geoUrl.searchParams.set('name', locationQuery);
    geoUrl.searchParams.set('count', '5');
    geoUrl.searchParams.set('language', 'en');
    geoUrl.searchParams.set('format', 'json');

    const geoResponse = await fetch(geoUrl.toString(), { signal: AbortSignal.timeout(8000) });
    if (!geoResponse.ok) {
      return res.status(502).json({
        error: 'WEATHER_GEOCODING_FAILED',
        message: 'Weather geocoding service is currently unavailable.',
      });
    }

    const geoData = (await geoResponse.json()) as {
      results?: Array<{
        name: string;
        admin1?: string;
        country?: string;
        country_code?: string;
        latitude: number;
        longitude: number;
      }>;
    };

    const matches = geoData.results ?? [];
    if (matches.length === 0) {
      return res.status(404).json({
        error: 'LOCATION_NOT_FOUND',
        message: `No location found matching "${locationQuery}". Try a nearby town or district city.`,
      });
    }

    // Prefer India matches when farmers search regional city names
    const chosen = matches.find((m) => m.country_code === 'IN') ?? matches[0];

    const forecastUrl = new URL('https://api.open-meteo.com/v1/forecast');
    forecastUrl.searchParams.set('latitude', String(chosen.latitude));
    forecastUrl.searchParams.set('longitude', String(chosen.longitude));
    forecastUrl.searchParams.set(
      'current',
      'temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m'
    );
    forecastUrl.searchParams.set('hourly', 'precipitation_probability');
    forecastUrl.searchParams.set(
      'daily',
      'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max'
    );
    forecastUrl.searchParams.set('timezone', 'auto');
    forecastUrl.searchParams.set('forecast_days', '6');

    const weatherResp = await fetch(forecastUrl.toString(), { signal: AbortSignal.timeout(8000) });
    if (!weatherResp.ok) {
      return res.status(502).json({
        error: 'WEATHER_FORECAST_FAILED',
        message: 'Live weather forecast service returned an error.',
      });
    }

    const weatherData = (await weatherResp.json()) as {
      current?: {
        temperature_2m?: number;
        relative_humidity_2m?: number;
        apparent_temperature?: number;
        precipitation?: number;
        weather_code?: number;
        wind_speed_10m?: number;
      };
      hourly?: {
        precipitation_probability?: number[];
      };
      daily?: {
        time?: string[];
        weather_code?: number[];
        temperature_2m_max?: number[];
        temperature_2m_min?: number[];
        precipitation_probability_max?: number[];
        wind_speed_10m_max?: number[];
      };
    };

    const current = weatherData.current ?? {};
    const dailyTimes = weatherData.daily?.time ?? [];
    const rainProbNow =
      weatherData.hourly?.precipitation_probability?.[0] ??
      weatherData.daily?.precipitation_probability_max?.[0] ??
      0;

    const daily = dailyTimes.slice(0, 5).map((dateStr, idx) => ({
      date: dateStr,
      weatherCode: weatherData.daily?.weather_code?.[idx] ?? 0,
      tempMax: Math.round((weatherData.daily?.temperature_2m_max?.[idx] ?? 0) * 10) / 10,
      tempMin: Math.round((weatherData.daily?.temperature_2m_min?.[idx] ?? 0) * 10) / 10,
      rainProbability: weatherData.daily?.precipitation_probability_max?.[idx] ?? 0,
      windSpeedMax: Math.round((weatherData.daily?.wind_speed_10m_max?.[idx] ?? 0) * 10) / 10,
    }));

    return res.json({
      source: 'open-meteo-live',
      sourceLabel: 'Open-Meteo Live Weather',
      locationName: chosen.name,
      region: chosen.admin1 ?? '',
      country: chosen.country ?? '',
      latitude: chosen.latitude,
      longitude: chosen.longitude,
      fetchedAt: new Date().toISOString(),
      current: {
        temperature: Math.round((current.temperature_2m ?? 0) * 10) / 10,
        apparentTemperature: Math.round((current.apparent_temperature ?? current.temperature_2m ?? 0) * 10) / 10,
        humidity: Math.round(current.relative_humidity_2m ?? 0),
        windSpeed: Math.round((current.wind_speed_10m ?? 0) * 10) / 10,
        rainProbability: Math.round(rainProbNow),
        precipitationMm: Math.round((current.precipitation ?? 0) * 10) / 10,
        weatherCode: current.weather_code ?? 0,
      },
      daily,
    });
  } catch (err) {
    console.error('Weather API error:', err);
    return res.status(503).json({
      error: 'WEATHER_UNAVAILABLE',
      message: 'Unable to reach the live weather service right now. Please try again shortly.',
    });
  }
});

// POST /api/assistant — Server-side Gemini agricultural assistant
app.post('/api/assistant', async (req, res) => {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    return res.status(503).json({
      error: 'GEMINI_KEY_MISSING',
      message: 'AI assistant service key is not configured. Add GEMINI_API_KEY in Settings > Secrets.',
    });
  }

  const { message, language, context } = req.body as {
    message?: string;
    language?: 'en' | 'ta' | 'hi';
    context?: {
      dataSourceLabel?: string;
      selectedCropName?: string;
      weatherSummary?: string;
      marketSummary?: string;
      profitSummary?: string;
    };
  };

  if (!message || typeof message !== 'string' || !message.trim()) {
    return res.status(400).json({
      error: 'EMPTY_QUERY',
      message: 'Please provide a question for the Smart Farmer assistant.',
    });
  }

  const targetLang = language === 'ta' ? 'Tamil' : language === 'hi' ? 'Hindi' : 'English';

  const marketCatalogSummary = CROPS_CATALOG.map(
    (c) => `${c.name.en} (base ~₹${c.basePricePerKg}/kg, expected ₹${c.expectedSellingMinKg}-₹${c.expectedSellingMaxKg}/kg, demand: ${c.demand})`
  ).join('; ');

  const hubsSummary = MARKET_LOCATIONS.map((m) => `${m.name.en} (${m.city}, ${m.state})`).join('; ');

  const systemInstruction = [
    `You are Smart Farmer's multilingual agricultural market advisor.`,
    `Always respond exclusively in ${targetLang} using clear, respectful, farmer-friendly prose (3 to 5 concise sentences, plain text without markdown bullet clutter or asterisks so it reads naturally aloud via text-to-speech).`,
    `Ground your advice in the application's provided data below. Whenever quoting market prices or profit figures, mention clearly if they come from the Sample Reference Dataset or Live AGMARKNET, and state that profit calculations are estimates.`,
    `Supported crops in catalog: ${marketCatalogSummary}.`,
    `Featured agricultural markets: ${hubsSummary}.`,
    context?.dataSourceLabel ? `Active Market Data Source: ${context.dataSourceLabel}.` : '',
    context?.selectedCropName ? `Farmer's currently selected crop: ${context.selectedCropName}.` : '',
    context?.marketSummary ? `Active Market Snapshot: ${context.marketSummary}` : '',
    context?.weatherSummary ? `Active Weather Snapshot: ${context.weatherSummary}` : '',
    context?.profitSummary ? `Latest Profit Calculator State: ${context.profitSummary}` : '',
    `If the user asks about something outside these markets or crops, give practical general Indian agricultural selling advice and suggest checking the Market Comparison or Profit Calculator tabs.`,
  ]
    .filter(Boolean)
    .join('\n');

  try {
    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const maxAttempts = 3;
    let response;
    let lastErr: unknown;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        response = await ai.models.generateContent({
          model: 'gemini-4-hydrogen',
          contents: message.trim(),
          config: {
            systemInstruction,
            thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
          },
        });
        break;
      } catch (err: unknown) {
        lastErr = err;
        const msg = err instanceof Error ? err.message : '';
        const isTransient = msg.includes('503') || msg.includes('429') || msg.includes('UNAVAILABLE');
        if (!isTransient || attempt === maxAttempts - 1) {
          throw err;
        }
        await new Promise((resolve) => setTimeout(resolve, 600 * Math.pow(2, attempt)));
      }
    }

    if (!response) {
      throw lastErr instanceof Error ? lastErr : new Error('No response from AI model');
    }

    const replyText = response.text?.trim();
    if (!replyText) {
      return res.status(502).json({
        error: 'EMPTY_AI_RESPONSE',
        message: 'The AI assistant returned an empty response. Please try asking again.',
      });
    }

    return res.json({
      reply: replyText,
      model: 'gemini-4-hydrogen',
      language: language ?? 'en',
      timestamp: new Date().toISOString(),
    });
  } catch (err: unknown) {
    console.error('Gemini assistant error:', err);
    const errMsg = err instanceof Error ? err.message : 'Unknown upstream AI error';
    return res.status(502).json({
      error: 'AI_ASSISTANT_ERROR',
      message: `Unable to reach the AI assistant right now (${errMsg}).`,
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Smart Farmer server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();

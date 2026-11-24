export type Language = 'en' | 'ta' | 'hi';

export type SectionId =
  | 'dashboard'
  | 'crop-info'
  | 'market-prices'
  | 'market-comparison'
  | 'profit-calculator'
  | 'weather'
  | 'voice-assistant'
  | 'products'
  | 'favorites'
  | 'profile';

export type DemandLevel = 'high' | 'moderate' | 'steady';

export type MarketDataSource = 'live-agmarknet' | 'sample-reference';

export interface LocalizedText {
  en: string;
  ta: string;
  hi: string;
}

export interface CropHistoryPoint {
  dayLabel: string;
  pricePerKg: number;
}

export interface CropInfo {
  id: string;
  name: LocalizedText;
  category: 'vegetable' | 'grain' | 'fruit' | 'spice';
  variety: LocalizedText;
  qualityGrade: LocalizedText;
  availableQuantityKg: number;
  basePricePerKg: number;
  expectedSellingMinKg: number;
  expectedSellingMaxKg: number;
  demand: DemandLevel;
  defaultMarketId: string;
  shelfLifeDays: number;
  harvestSeason: LocalizedText;
  storageTip: LocalizedText;
  history7d: CropHistoryPoint[];
}

export interface MarketLocation {
  id: string;
  name: LocalizedText;
  city: string;
  state: string;
  latitude: number;
  longitude: number;
  distanceNoteKm: number;
}

export interface MarketQuote {
  id: string;
  cropId: string;
  marketId: string;
  marketName: LocalizedText;
  city: string;
  state: string;
  variety: string;
  grade: string;
  minPricePerKg: number;
  maxPricePerKg: number;
  modalPricePerKg: number;
  modalPricePerQuintal: number;
  demand: DemandLevel;
  availableQuantityKg: number;
  lastUpdated: string;
  source: MarketDataSource;
  sourceLabel: string;
}

export interface MarketDatasetResponse {
  source: MarketDataSource;
  sourceLabel: string;
  fetchedAt: string;
  note?: string;
  quotes: MarketQuote[];
}

export interface WeatherDay {
  date: string;
  weatherCode: number;
  tempMax: number;
  tempMin: number;
  rainProbability: number;
  windSpeedMax: number;
}

export interface WeatherResponse {
  source: 'open-meteo-live';
  sourceLabel: string;
  locationName: string;
  region: string;
  country: string;
  latitude: number;
  longitude: number;
  fetchedAt: string;
  current: {
    temperature: number;
    apparentTemperature: number;
    humidity: number;
    windSpeed: number;
    rainProbability: number;
    precipitationMm: number;
    weatherCode: number;
  };
  daily: WeatherDay[];
}

export interface FarmerProfile {
  name: string;
  villageOrTown: string;
  state: string;
  farmSizeAcres: string;
  primaryCropIds: string[];
  notes: string;
}

export interface PriceAlertRule {
  id: string;
  cropId: string;
  targetPricePerKg: number;
  createdAt: string;
  active: boolean;
}

export interface PriceNotification {
  id: string;
  cropId: string;
  marketName: string;
  currentPricePerKg: number;
  targetPricePerKg: number;
  timestamp: string;
  read: boolean;
}

export interface AssistantMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
  isError?: boolean;
}

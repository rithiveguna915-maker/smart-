import { Language } from '../types/farm';

export function describeWeatherCode(code: number, lang: Language): string {
  const map: Record<number, { en: string; ta: string; hi: string }> = {
    0: { en: 'Clear Sky', ta: 'தெளிவான வானம்', hi: 'साफ आसमान' },
    1: { en: 'Mainly Clear', ta: 'பெரும்பாலும் தெளிவு', hi: 'मुख्यतः साफ' },
    2: { en: 'Partly Cloudy', ta: 'பகுதி மேகமூட்டம்', hi: 'आंशिक बादल' },
    3: { en: 'Overcast', ta: 'முழு மேகமூட்டம்', hi: 'घने बादल' },
    45: { en: 'Foggy', ta: 'பனிமூட்டம்', hi: 'कोहरा' },
    48: { en: 'Depositing Rime Fog', ta: 'அடர் பனிமூட்டம்', hi: 'घना कोहरा' },
    51: { en: 'Light Drizzle', ta: 'லேசான தூறல்', hi: 'हल्की बूंदाबांदी' },
    53: { en: 'Moderate Drizzle', ta: 'மிதமான தூறல்', hi: 'मध्यम बूंदाबांदी' },
    55: { en: 'Dense Drizzle', ta: 'அடர் தூறல்', hi: 'तेज़ बूंदाबांदी' },
    61: { en: 'Slight Rain', ta: 'லேசான மழை', hi: 'हल्की बारिश' },
    63: { en: 'Moderate Rain', ta: 'மிதமான மழை', hi: 'मध्यम बारिश' },
    65: { en: 'Heavy Rain', ta: 'கனமழை', hi: 'भारी बारिश' },
    71: { en: 'Slight Snow', ta: 'லேசான பனிப்பொழிவு', hi: 'हल्की बर्फबारी' },
    80: { en: 'Rain Showers', ta: 'மழைத் தூறல்', hi: 'बौछारें' },
    81: { en: 'Moderate Showers', ta: 'மிதமான மழைப்பொழிவு', hi: 'मध्यम बौछारें' },
    82: { en: 'Heavy Showers', ta: 'கனமழைப் பொழிவு', hi: 'तेज़ बौछारें' },
    95: { en: 'Thunderstorm', ta: 'இடியுடன் மழை', hi: 'आंधी-तूफान' },
    96: { en: 'Thunderstorm with Hail', ta: 'ஆலங்கட்டி மழை', hi: 'ओलों के साथ तूफान' },
    99: { en: 'Severe Thunderstorm', ta: 'கடுமையான இடி மழை', hi: 'तीव्र आंधी-तूफान' },
  };

  const entry = map[code];
  if (entry) return entry[lang];
  if (code >= 50 && code <= 69) return map[61][lang];
  if (code >= 80 && code <= 84) return map[80][lang];
  if (code >= 95) return map[95][lang];
  return map[2][lang];
}

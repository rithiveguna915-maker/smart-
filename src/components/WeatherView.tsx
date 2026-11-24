import React, { useEffect, useState } from 'react';
import {
  AlertTriangle,
  CloudRain,
  CloudSun,
  Droplets,
  MapPin,
  RefreshCw,
  Thermometer,
  Wind,
} from 'lucide-react';
import { Language, WeatherResponse } from '../types/farm';
import { AppStrings } from '../i18n/translations';
import { describeWeatherCode } from '../utils/weatherCodes';

interface WeatherViewProps {
  language: Language;
  strings: AppStrings;
  savedLocation: string;
  onWeatherLoaded?: (weather: WeatherResponse) => void;
}

const QUICK_HUB_CITIES = ['Chennai', 'Coimbatore', 'Bengaluru', 'Nashik', 'New Delhi', 'Indore'];

export const WeatherView: React.FC<WeatherViewProps> = ({
  language,
  strings,
  savedLocation,
  onWeatherLoaded,
}) => {
  const [locationInput, setLocationInput] = useState(savedLocation || 'Chennai');
  const [weather, setWeather] = useState<WeatherResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchWeather = async (targetCity: string) => {
    const cleaned = targetCity.trim();
    if (!cleaned) return;

    setLoading(true);
    setErrorMsg(null);

    try {
      const resp = await fetch(`/api/weather?location=${encodeURIComponent(cleaned)}`);
      const data = await resp.json();
      if (!resp.ok) {
        setWeather(null);
        setErrorMsg(data.message || strings.weather.unavailableMessage);
      } else {
        setWeather(data as WeatherResponse);
        onWeatherLoaded?.(data as WeatherResponse);
      }
    } catch {
      setWeather(null);
      setErrorMsg(strings.weather.unavailableMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather(savedLocation || 'Chennai');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchWeather(locationInput);
  };

  const formatDay = (dateStr: string) => {
    try {
      return new Intl.DateTimeFormat(language === 'ta' ? 'ta-IN' : language === 'hi' ? 'hi-IN' : 'en-IN', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      }).format(new Date(dateStr));
    } catch {
      return dateStr;
    }
  };

  const advisoryText = weather
    ? weather.current.rainProbability >= 45
      ? strings.weather.advisoryRain
      : weather.current.temperature >= 35
      ? strings.weather.advisoryHeat
      : strings.weather.advisoryClear
    : '';

  return (
    <div className="space-y-6">
      {/* Location Search Card */}
      <section className="rounded-xl border border-[#DCE4DF] bg-white p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="font-display text-xl sm:text-2xl font-bold text-[#111C16]">
              {strings.weather.title}
            </h1>
            <p className="mt-1 text-sm text-[#556B5F]">{strings.weather.subtitle}</p>
          </div>
          {savedLocation && (
            <button
              type="button"
              onClick={() => {
                setLocationInput(savedLocation);
                fetchWeather(savedLocation);
              }}
              className="inline-flex items-center gap-2 self-start rounded-lg border border-[#DCE4DF] bg-[#F7F9F8] px-3.5 py-2 text-xs font-semibold text-[#1D2D24] hover:bg-[#EAF1EC] whitespace-nowrap"
            >
              <MapPin className="h-3.5 w-3.5 text-[#15803D]" />
              <span>
                {strings.weather.useSavedLocationBtn}: {savedLocation}
              </span>
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={locationInput}
            onChange={(e) => setLocationInput(e.target.value)}
            placeholder={strings.weather.locationInputPlaceholder}
            aria-label={strings.weather.locationInputPlaceholder}
            className="h-11 flex-1 rounded-lg border border-[#DCE4DF] bg-[#F7F9F8] px-4 text-sm text-[#111C16] placeholder-[#6B7F74] focus:border-[#15803D] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#15803D]/20"
          />
          <button
            type="submit"
            disabled={loading}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#15803D] px-5 text-sm font-semibold text-white hover:bg-[#166534] disabled:opacity-60 transition-colors whitespace-nowrap"
          >
            {loading && <RefreshCw className="h-4 w-4 animate-spin" />}
            <span>{strings.weather.checkWeatherBtn}</span>
          </button>
        </form>

        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs font-medium text-[#556B5F]">{strings.weather.quickCitiesLabel}</span>
          {QUICK_HUB_CITIES.map((city) => (
            <button
              key={city}
              type="button"
              onClick={() => {
                setLocationInput(city);
                fetchWeather(city);
              }}
              className="rounded-md border border-[#DCE4DF] bg-[#F7F9F8] px-2.5 py-1 text-xs font-medium text-[#2A3D32] hover:border-[#15803D]/50 hover:bg-[#ECF5EF]"
            >
              {city}
            </button>
          ))}
        </div>
      </section>

      {/* Loading Skeleton */}
      {loading && (
        <div className="rounded-xl border border-[#DCE4DF] bg-white p-6 space-y-4 animate-pulse">
          <div className="h-6 w-48 rounded bg-[#E9EFEA]" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-20 rounded-lg bg-[#F1F5F2]" />
            ))}
          </div>
        </div>
      )}

      {/* Error State */}
      {!loading && errorMsg && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-[#DC2626]/30 bg-[#FEF2F2] p-5 text-sm text-[#991B1B]">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">{strings.weather.unavailableMessage}</p>
              <p className="mt-0.5 text-xs">{errorMsg}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => fetchWeather(locationInput)}
            className="self-start rounded-lg border border-[#DC2626]/40 bg-white px-4 py-2 text-xs font-semibold text-[#991B1B] hover:bg-[#FEE2E2] whitespace-nowrap"
          >
            {strings.common.retry}
          </button>
        </div>
      )}

      {/* Live Weather Results */}
      {!loading && weather && (
        <>
          <section className="rounded-xl border border-[#DCE4DF] bg-white p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#E9EFEA]">
              <div>
                <p className="text-xs font-medium text-[#15803D]">
                  {strings.common.liveWeatherTag} ·{' '}
                  <span className="font-mono tabular-nums">
                    {weather.latitude.toFixed(2)}°N, {weather.longitude.toFixed(2)}°E
                  </span>
                </p>
                <h2 className="mt-1 font-display text-2xl font-bold text-[#111C16]">
                  {weather.locationName}
                  {weather.region ? `, ${weather.region}` : ''}
                  {weather.country ? ` · ${weather.country}` : ''}
                </h2>
              </div>
              <p className="text-sm font-semibold text-[#1D2D24]">
                {describeWeatherCode(weather.current.weatherCode, language)}
              </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="rounded-lg border border-[#DCE4DF] bg-[#F7F9F8] p-4">
                <div className="flex items-center justify-between text-xs font-medium text-[#556B5F]">
                  <span>{strings.weather.currentTemp}</span>
                  <Thermometer className="h-4 w-4 text-[#15803D]" />
                </div>
                <p className="mt-2 font-mono tabular-nums text-2xl font-bold text-[#111C16]">
                  {weather.current.temperature}°C
                </p>
                <p className="mt-1 font-mono tabular-nums text-xs text-[#556B5F]">
                  {strings.weather.feelsLike}: {weather.current.apparentTemperature}°C
                </p>
              </div>

              <div className="rounded-lg border border-[#DCE4DF] bg-[#F7F9F8] p-4">
                <div className="flex items-center justify-between text-xs font-medium text-[#556B5F]">
                  <span>{strings.weather.rainProbability}</span>
                  <CloudRain className="h-4 w-4 text-[#15803D]" />
                </div>
                <p className="mt-2 font-mono tabular-nums text-2xl font-bold text-[#111C16]">
                  {weather.current.rainProbability}%
                </p>
                <p className="mt-1 font-mono tabular-nums text-xs text-[#556B5F]">
                  {weather.current.precipitationMm} mm
                </p>
              </div>

              <div className="rounded-lg border border-[#DCE4DF] bg-[#F7F9F8] p-4">
                <div className="flex items-center justify-between text-xs font-medium text-[#556B5F]">
                  <span>{strings.weather.humidity}</span>
                  <Droplets className="h-4 w-4 text-[#15803D]" />
                </div>
                <p className="mt-2 font-mono tabular-nums text-2xl font-bold text-[#111C16]">
                  {weather.current.humidity}%
                </p>
              </div>

              <div className="rounded-lg border border-[#DCE4DF] bg-[#F7F9F8] p-4">
                <div className="flex items-center justify-between text-xs font-medium text-[#556B5F]">
                  <span>{strings.weather.windSpeed}</span>
                  <Wind className="h-4 w-4 text-[#15803D]" />
                </div>
                <p className="mt-2 font-mono tabular-nums text-2xl font-bold text-[#111C16]">
                  {weather.current.windSpeed} km/h
                </p>
              </div>
            </div>

            {/* Farming Advisory */}
            <div className="rounded-lg border border-[#15803D]/30 bg-[#F0FDF4] p-4 flex items-start gap-3">
              <CloudSun className="h-5 w-5 shrink-0 text-[#15803D] mt-0.5" />
              <div>
                <p className="text-xs font-bold text-[#14532D]">{strings.weather.advisoryTitle}</p>
                <p className="mt-1 text-sm text-[#1D2D24]">{advisoryText}</p>
              </div>
            </div>
          </section>

          {/* 5-Day Forecast */}
          <section className="rounded-xl border border-[#DCE4DF] bg-white p-6">
            <h3 className="font-display text-base font-bold text-[#111C16] mb-4">
              {strings.weather.forecastTitle}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
              {weather.daily.map((day) => (
                <div
                  key={day.date}
                  className="rounded-lg border border-[#DCE4DF] bg-[#F7F9F8] p-3.5 flex flex-col justify-between"
                >
                  <div>
                    <p className="text-xs font-semibold text-[#111C16]">{formatDay(day.date)}</p>
                    <p className="mt-1 text-xs text-[#465B4F]">
                      {describeWeatherCode(day.weatherCode, language)}
                    </p>
                  </div>
                  <div className="mt-3 pt-2.5 border-t border-[#DCE4DF] space-y-1 font-mono tabular-nums text-xs">
                    <p className="font-bold text-[#111C16]">
                      {day.tempMax}°C / <span className="text-[#556B5F]">{day.tempMin}°C</span>
                    </p>
                    <p className="text-[#15803D]">
                      {strings.weather.rainProbability}: {day.rainProbability}%
                    </p>
                    <p className="text-[#556B5F]">
                      {strings.weather.windSpeed}: {day.windSpeedMax} km/h
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
};

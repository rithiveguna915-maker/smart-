/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useCallback, useEffect, useMemo, useState } from 'react';
import { CROPS_CATALOG, MARKET_LOCATIONS, buildSampleMarketDataset } from './data/cropsCatalog';
import { TRANSLATIONS } from './i18n/translations';
import { useLocalStorage } from './hooks/useLocalStorage';
import {
  FarmerProfile,
  Language,
  MarketDatasetResponse,
  PriceAlertRule,
  PriceNotification,
  SectionId,
  WeatherResponse,
} from './types/farm';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { DashboardView } from './components/DashboardView';
import { CropInfoView } from './components/CropInfoView';
import { MarketPricesView } from './components/MarketPricesView';
import { MarketComparisonView } from './components/MarketComparisonView';
import { ProfitCalculatorView } from './components/ProfitCalculatorView';
import { WeatherView } from './components/WeatherView';
import { VoiceAssistantView } from './components/VoiceAssistantView';
import { ProductsView } from './components/ProductsView';
import { FavoritesView } from './components/FavoritesView';
import { ProfileView } from './components/ProfileView';

export default function App() {
  const [language, setLanguage] = useLocalStorage<Language>('sf_language', 'en');
  const [activeSection, setActiveSection] = useState<SectionId>('dashboard');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Progressive disclosure: null on dashboard/crop-info until user picks a crop
  const [selectedCropId, setSelectedCropId] = useState<string | null>(null);
  const [comparisonCropId, setComparisonCropId] = useState<string>('tomato');
  const [calculatorCropId, setCalculatorCropId] = useState<string>('tomato');
  const [calculatorMarketId, setCalculatorMarketId] = useState<string>('bengaluru-yeshwanthpur');

  // Market data fetched from Express /api/markets (AGMARKNET if key set, else labeled Sample Reference)
  const [marketData, setMarketData] = useState<MarketDatasetResponse>(() =>
    buildSampleMarketDataset()
  );
  const [marketsLoading, setMarketsLoading] = useState(false);

  // Live weather context shared with AI assistant
  const [latestWeather, setLatestWeather] = useState<WeatherResponse | null>(null);
  const [profitSummary, setProfitSummary] = useState('');

  // Persisted Farmer Preferences
  const [favoriteCropIds, setFavoriteCropIds] = useLocalStorage<string[]>('sf_fav_crops', [
    'tomato',
    'onion',
  ]);
  const [favoriteMarketIds, setFavoriteMarketIds] = useLocalStorage<string[]>('sf_fav_markets', [
    'oddanchatram-dindigul',
    'koyambedu-chennai',
  ]);
  const [recentSearches, setRecentSearches] = useLocalStorage<string[]>('sf_recent_searches', []);
  const [alertRules, setAlertRules] = useLocalStorage<PriceAlertRule[]>('sf_alert_rules', [
    {
      id: 'default-tomato-rule',
      cropId: 'tomato',
      targetPricePerKg: 30,
      createdAt: new Date().toISOString(),
      active: true,
    },
  ]);
  const [readNotificationIds, setReadNotificationIds] = useLocalStorage<string[]>(
    'sf_read_notif_ids',
    []
  );
  const [farmerProfile, setFarmerProfile] = useLocalStorage<FarmerProfile>('sf_profile', {
    name: 'Muruganandam S.',
    villageOrTown: 'Coimbatore',
    state: 'Tamil Nadu',
    farmSizeAcres: '4.5',
    primaryCropIds: ['tomato', 'onion'],
    notes: 'Prefer direct morning mandi delivery in ventilated crates.',
  });

  const strings = TRANSLATIONS[language];

  const loadMarkets = useCallback(async () => {
    setMarketsLoading(true);
    try {
      const resp = await fetch('/api/markets');
      if (resp.ok) {
        const data = (await resp.json()) as MarketDatasetResponse;
        setMarketData(data);
      }
    } catch {
      // Keep labeled sample reference dataset on network error
    } finally {
      setMarketsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMarkets();
  }, [loadMarkets]);

  // Update HTML lang attribute when language changes
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  // Evaluate price alert notifications against current market quotes
  const notifications = useMemo<PriceNotification[]>(() => {
    const triggered: PriceNotification[] = [];
    for (const rule of alertRules) {
      if (!rule.active) continue;
      const matching = marketData.quotes.filter(
        (q) => q.cropId === rule.cropId && q.modalPricePerKg >= rule.targetPricePerKg
      );
      if (matching.length > 0) {
        const best = matching.reduce((a, b) =>
          b.modalPricePerKg > a.modalPricePerKg ? b : a
        );
        const notifId = `${rule.id}__${best.marketId}__${best.modalPricePerKg}`;
        triggered.push({
          id: notifId,
          cropId: rule.cropId,
          marketName: best.marketName[language],
          currentPricePerKg: best.modalPricePerKg,
          targetPricePerKg: rule.targetPricePerKg,
          timestamp: best.lastUpdated,
          read: readNotificationIds.includes(notifId),
        });
      }
    }
    return triggered;
  }, [alertRules, marketData.quotes, language, readNotificationIds]);

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  const handleToggleFavoriteCrop = (cropId: string) => {
    setFavoriteCropIds((prev) =>
      prev.includes(cropId) ? prev.filter((id) => id !== cropId) : [...prev, cropId]
    );
  };

  const handleToggleFavoriteMarket = (marketId: string) => {
    setFavoriteMarketIds((prev) =>
      prev.includes(marketId) ? prev.filter((id) => id !== marketId) : [...prev, marketId]
    );
  };

  const handleAddRecentSearch = (term: string) => {
    const clean = term.trim();
    if (!clean) return;
    setRecentSearches((prev) => [clean, ...prev.filter((t) => t !== clean)].slice(0, 8));
  };

  const handleOpenCropInfo = (cropId: string) => {
    setSelectedCropId(cropId);
    setActiveSection('crop-info');
  };

  const handleOpenComparison = (cropId: string) => {
    setComparisonCropId(cropId);
    setActiveSection('market-comparison');
  };

  const handleOpenCalculator = (cropId: string, marketId?: string) => {
    setCalculatorCropId(cropId);
    if (marketId) {
      setCalculatorMarketId(marketId);
    } else {
      const quotes = marketData.quotes.filter((q) => q.cropId === cropId);
      if (quotes.length > 0) {
        const best = quotes.reduce((a, b) => (b.modalPricePerKg > a.modalPricePerKg ? b : a));
        setCalculatorMarketId(best.marketId);
      }
    }
    setActiveSection('profit-calculator');
  };

  const handleAddAlertRule = (cropId: string, targetPricePerKg: number) => {
    setAlertRules((prev) => [
      ...prev,
      {
        id: `rule-${Date.now()}`,
        cropId,
        targetPricePerKg,
        createdAt: new Date().toISOString(),
        active: true,
      },
    ]);
  };

  const handleRemoveAlertRule = (ruleId: string) => {
    setAlertRules((prev) => prev.filter((r) => r.id !== ruleId));
  };

  const handleMarkNotificationsRead = () => {
    setReadNotificationIds(notifications.map((n) => n.id));
  };

  return (
    <div className="min-h-screen flex bg-[#F7F9F8] text-[#111C16]">
      <Sidebar
        activeSection={activeSection}
        onSelectSection={setActiveSection}
        strings={strings}
        unreadNotificationsCount={unreadNotificationsCount}
        mobileOpen={mobileNavOpen}
        onCloseMobile={() => setMobileNavOpen(false)}
      />

      <div className="flex-1 min-w-0 flex flex-col">
        <TopBar
          language={language}
          onChangeLanguage={setLanguage}
          activeSection={activeSection}
          strings={strings}
          crops={CROPS_CATALOG}
          quotes={marketData.quotes}
          recentSearches={recentSearches}
          onAddRecentSearch={handleAddRecentSearch}
          onSelectSearchCrop={handleOpenCropInfo}
          onSelectSearchMarket={(cropId, _marketId) => handleOpenComparison(cropId)}
          onOpenMobileNav={() => setMobileNavOpen(true)}
        />

        <main className="flex-1 mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
          {activeSection === 'dashboard' && (
            <DashboardView
              language={language}
              strings={strings}
              crops={CROPS_CATALOG}
              marketData={marketData}
              selectedCropId={selectedCropId}
              onSelectCropId={setSelectedCropId}
              onNavigate={setActiveSection}
              unreadNotificationsCount={unreadNotificationsCount}
            />
          )}

          {activeSection === 'crop-info' && (
            <CropInfoView
              language={language}
              strings={strings}
              crops={CROPS_CATALOG}
              marketData={marketData}
              selectedCropId={selectedCropId}
              onSelectCropId={setSelectedCropId}
              favoriteCropIds={favoriteCropIds}
              onToggleFavoriteCrop={handleToggleFavoriteCrop}
              onCompareMarkets={handleOpenComparison}
              onOpenCalculator={handleOpenCalculator}
            />
          )}

          {activeSection === 'market-prices' && (
            <MarketPricesView
              language={language}
              strings={strings}
              crops={CROPS_CATALOG}
              marketData={marketData}
              isLoading={marketsLoading}
              onRefresh={loadMarkets}
              onSelectCrop={handleOpenCropInfo}
              onUseInCalculator={handleOpenCalculator}
            />
          )}

          {activeSection === 'market-comparison' && (
            <MarketComparisonView
              language={language}
              strings={strings}
              crops={CROPS_CATALOG}
              marketData={marketData}
              selectedCropId={comparisonCropId}
              onSelectCropId={setComparisonCropId}
              favoriteMarketIds={favoriteMarketIds}
              onToggleFavoriteMarket={handleToggleFavoriteMarket}
              onUseInCalculator={handleOpenCalculator}
            />
          )}

          {activeSection === 'profit-calculator' && (
            <ProfitCalculatorView
              language={language}
              strings={strings}
              crops={CROPS_CATALOG}
              marketData={marketData}
              initialCropId={calculatorCropId}
              initialDestinationMarketId={calculatorMarketId}
              onSummaryChange={setProfitSummary}
            />
          )}

          {activeSection === 'weather' && (
            <WeatherView
              language={language}
              strings={strings}
              savedLocation={farmerProfile.villageOrTown}
              onWeatherLoaded={setLatestWeather}
            />
          )}

          {activeSection === 'voice-assistant' && (
            <VoiceAssistantView
              language={language}
              strings={strings}
              crops={CROPS_CATALOG}
              selectedCropId={selectedCropId}
              marketData={marketData}
              latestWeather={latestWeather}
              profitSummary={profitSummary}
            />
          )}

          {activeSection === 'products' && (
            <ProductsView
              language={language}
              strings={strings}
              crops={CROPS_CATALOG}
              onInspectCrop={handleOpenCropInfo}
              onCalculateProfit={(cId) => handleOpenCalculator(cId)}
            />
          )}

          {activeSection === 'favorites' && (
            <FavoritesView
              language={language}
              strings={strings}
              crops={CROPS_CATALOG}
              markets={MARKET_LOCATIONS}
              favoriteCropIds={favoriteCropIds}
              favoriteMarketIds={favoriteMarketIds}
              recentSearches={recentSearches}
              alertRules={alertRules}
              notifications={notifications}
              onToggleFavoriteCrop={handleToggleFavoriteCrop}
              onToggleFavoriteMarket={handleToggleFavoriteMarket}
              onInspectCrop={handleOpenCropInfo}
              onClearRecentSearches={() => setRecentSearches([])}
              onAddAlertRule={handleAddAlertRule}
              onRemoveAlertRule={handleRemoveAlertRule}
              onMarkNotificationsRead={handleMarkNotificationsRead}
            />
          )}

          {activeSection === 'profile' && (
            <ProfileView
              strings={strings}
              profile={farmerProfile}
              onSaveProfile={setFarmerProfile}
            />
          )}
        </main>
      </div>
    </div>
  );
}

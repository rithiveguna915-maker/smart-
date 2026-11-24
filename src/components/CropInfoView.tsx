import React, { useMemo, useState } from 'react';
import { ArrowRight, Bookmark, Calculator, Scale, Sprout } from 'lucide-react';
import { CropInfo, DemandLevel, Language, MarketDatasetResponse } from '../types/farm';
import { AppStrings } from '../i18n/translations';

interface CropInfoViewProps {
  language: Language;
  strings: AppStrings;
  crops: CropInfo[];
  marketData: MarketDatasetResponse;
  selectedCropId: string | null;
  onSelectCropId: (cropId: string) => void;
  favoriteCropIds: string[];
  onToggleFavoriteCrop: (cropId: string) => void;
  onCompareMarkets: (cropId: string) => void;
  onOpenCalculator: (cropId: string, marketId?: string) => void;
}

function demandColorClass(demand: DemandLevel): string {
  if (demand === 'high') return 'text-[#15803D] font-semibold';
  if (demand === 'moderate') return 'text-[#B45309] font-semibold';
  return 'text-[#31443A] font-medium';
}

export const CropInfoView: React.FC<CropInfoViewProps> = ({
  language,
  strings,
  crops,
  marketData,
  selectedCropId,
  onSelectCropId,
  favoriteCropIds,
  onToggleFavoriteCrop,
  onCompareMarkets,
  onOpenCalculator,
}) => {
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'vegetable' | 'other'>('all');

  const filteredCrops = useMemo(() => {
    if (categoryFilter === 'vegetable') return crops.filter((c) => c.category === 'vegetable');
    if (categoryFilter === 'other') return crops.filter((c) => c.category !== 'vegetable');
    return crops;
  }, [crops, categoryFilter]);

  const selectedCrop = selectedCropId ? crops.find((c) => c.id === selectedCropId) ?? null : null;

  const cropQuotes = useMemo(() => {
    if (!selectedCrop) return [];
    return marketData.quotes.filter((q) => q.cropId === selectedCrop.id);
  }, [selectedCrop, marketData.quotes]);

  const primaryQuote = useMemo(() => {
    if (cropQuotes.length === 0) return null;
    const matchDefault = cropQuotes.find((q) => q.marketId === selectedCrop?.defaultMarketId);
    return matchDefault ?? cropQuotes[0];
  }, [cropQuotes, selectedCrop]);

  const priceSpread = useMemo(() => {
    if (cropQuotes.length === 0) return null;
    const sorted = [...cropQuotes].sort((a, b) => a.modalPricePerKg - b.modalPricePerKg);
    return {
      lowest: sorted[0],
      highest: sorted[sorted.length - 1],
    };
  }, [cropQuotes]);

  const isFavorite = selectedCrop ? favoriteCropIds.includes(selectedCrop.id) : false;

  const formatDate = (iso: string) => {
    try {
      return new Intl.DateTimeFormat(language === 'ta' ? 'ta-IN' : language === 'hi' ? 'hi-IN' : 'en-IN', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }).format(new Date(iso));
    } catch {
      return iso;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Category Switcher */}
      <section className="rounded-xl border border-[#DCE4DF] bg-white p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-[#E9EFEA]">
          <div>
            <h1 className="font-display text-xl sm:text-2xl font-bold text-[#111C16]">
              {strings.cropInfo.title}
            </h1>
            <p className="mt-1 text-sm text-[#556B5F]">{strings.cropInfo.subtitle}</p>
          </div>

          <div className="flex items-center gap-1 rounded-lg border border-[#DCE4DF] bg-[#F7F9F8] p-1 self-start">
            {(
              [
                { id: 'all', label: strings.common.all },
                { id: 'vegetable', label: strings.common.vegetables },
                { id: 'other', label: strings.common.otherCrops },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setCategoryFilter(tab.id)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                  categoryFilter === tab.id
                    ? 'bg-[#15803D] text-white'
                    : 'text-[#31443A] hover:bg-[#EAF1EC]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
          {filteredCrops.map((crop) => {
            const active = selectedCropId === crop.id;
            return (
              <button
                key={crop.id}
                type="button"
                onClick={() => onSelectCropId(crop.id)}
                aria-pressed={active}
                className={`flex flex-col items-start justify-between rounded-lg border p-3.5 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#15803D] ${
                  active
                    ? 'border-[#15803D] bg-[#15803D] text-white'
                    : 'border-[#DCE4DF] bg-[#F7F9F8] text-[#111C16] hover:border-[#15803D]/60 hover:bg-[#ECF5EF]'
                }`}
              >
                <span className="font-display text-sm font-bold leading-snug">
                  {crop.name[language]}
                </span>
                <span
                  className={`mt-1.5 font-mono tabular-nums text-xs ${
                    active ? 'text-[#DCFCE7]' : 'text-[#556B5F]'
                  }`}
                >
                  ₹{crop.basePricePerKg} {strings.common.perKg}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Progressive Disclosure: Show 9-point details ONLY after user selects a crop */}
      {!selectedCrop ? (
        <div className="rounded-xl border border-dashed border-[#C6D5CC] bg-white px-6 py-12 text-center">
          <Sprout className="mx-auto h-8 w-8 text-[#15803D]" />
          <p className="mt-3 text-sm font-medium text-[#31443A]">{strings.cropInfo.choosePrompt}</p>
        </div>
      ) : (
        <section className="rounded-xl border border-[#DCE4DF] bg-white p-6 space-y-6">
          {/* Card Top Actions */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-5 border-b border-[#E9EFEA]">
            <div>
              <p className="text-xs font-medium text-[#556B5F]">
                {selectedCrop.variety[language]} ·{' '}
                {marketData.source === 'live-agmarknet'
                  ? strings.common.liveAgmarknetTag
                  : strings.common.sampleDataTag}
              </p>
              <h2 className="mt-1 font-display text-2xl font-bold text-[#111C16]">
                {selectedCrop.name[language]}
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={() => onToggleFavoriteCrop(selectedCrop.id)}
                aria-pressed={isFavorite}
                className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-semibold transition-colors whitespace-nowrap ${
                  isFavorite
                    ? 'border-[#15803D] bg-[#F0FDF4] text-[#15803D]'
                    : 'border-[#DCE4DF] bg-white text-[#1D2D24] hover:bg-[#F1F5F2]'
                }`}
              >
                <Bookmark className={`h-4 w-4 ${isFavorite ? 'fill-[#15803D]' : ''}`} />
                <span>
                  {isFavorite ? strings.common.removeFavorite : strings.common.addFavorite}
                </span>
              </button>

              <button
                type="button"
                onClick={() => onCompareMarkets(selectedCrop.id)}
                className="inline-flex items-center gap-2 rounded-lg border border-[#DCE4DF] bg-[#F7F9F8] px-4 py-2 text-sm font-semibold text-[#1D2D24] hover:bg-[#EAF1EC] transition-colors whitespace-nowrap"
              >
                <Scale className="h-4 w-4 text-[#15803D]" />
                <span>{strings.common.compareMarkets}</span>
              </button>

              <button
                type="button"
                onClick={() => onOpenCalculator(selectedCrop.id, primaryQuote?.marketId)}
                className="inline-flex items-center gap-2 rounded-lg bg-[#15803D] px-4 py-2 text-sm font-semibold text-white hover:bg-[#166534] transition-colors whitespace-nowrap"
              >
                <Calculator className="h-4 w-4" />
                <span>{strings.common.calculateProfit}</span>
              </button>
            </div>
          </div>

          {/* 9-Point Organized Information Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-5">
            <div className="py-2 border-b border-[#EEF3EF]">
              <p className="text-xs font-medium text-[#556B5F]">{strings.cropInfo.fields.cropName}</p>
              <p className="mt-1 text-base font-semibold text-[#111C16]">
                {selectedCrop.name[language]}
              </p>
            </div>

            <div className="py-2 border-b border-[#EEF3EF]">
              <p className="text-xs font-medium text-[#556B5F]">{strings.cropInfo.fields.cropQuality}</p>
              <p className="mt-1 text-base font-semibold text-[#111C16]">
                {selectedCrop.qualityGrade[language]}
              </p>
            </div>

            <div className="py-2 border-b border-[#EEF3EF]">
              <p className="text-xs font-medium text-[#556B5F]">
                {strings.cropInfo.fields.availableQuantity}
              </p>
              <p className="mt-1 font-mono tabular-nums text-base font-semibold text-[#111C16]">
                {(primaryQuote?.availableQuantityKg ?? selectedCrop.availableQuantityKg).toLocaleString()}{' '}
                {strings.common.kg} /{' '}
                {(
                  (primaryQuote?.availableQuantityKg ?? selectedCrop.availableQuantityKg) / 100
                ).toFixed(1)}{' '}
                {strings.common.quintal}
              </p>
            </div>

            <div className="py-2 border-b border-[#EEF3EF]">
              <p className="text-xs font-medium text-[#556B5F]">
                {strings.cropInfo.fields.currentMarketPrice}
              </p>
              <p className="mt-1 font-mono tabular-nums text-lg font-bold text-[#15803D]">
                ₹{primaryQuote?.modalPricePerKg ?? selectedCrop.basePricePerKg} {strings.common.perKg}
                <span className="ml-2 text-xs font-medium text-[#556B5F]">
                  (₹
                  {(primaryQuote?.modalPricePerQuintal ?? selectedCrop.basePricePerKg * 100).toLocaleString()}{' '}
                  {strings.common.perQuintal})
                </span>
              </p>
            </div>

            <div className="py-2 border-b border-[#EEF3EF]">
              <p className="text-xs font-medium text-[#556B5F]">
                {strings.cropInfo.fields.marketLocation}
              </p>
              <p className="mt-1 text-base font-semibold text-[#111C16]">
                {primaryQuote ? `${primaryQuote.marketName[language]}` : '—'}
              </p>
              {primaryQuote && (
                <p className="text-xs text-[#556B5F]">
                  {primaryQuote.city}, {primaryQuote.state}
                </p>
              )}
            </div>

            <div className="py-2 border-b border-[#EEF3EF]">
              <p className="text-xs font-medium text-[#556B5F]">
                {strings.cropInfo.fields.priceComparison}
              </p>
              {priceSpread ? (
                <p className="mt-1 font-mono tabular-nums text-sm font-semibold text-[#111C16]">
                  ₹{priceSpread.lowest.modalPricePerKg} ({priceSpread.lowest.city}) → ₹
                  {priceSpread.highest.modalPricePerKg} ({priceSpread.highest.city})
                </p>
              ) : (
                <p className="mt-1 text-sm text-[#556B5F]">—</p>
              )}
            </div>

            <div className="py-2 border-b border-[#EEF3EF]">
              <p className="text-xs font-medium text-[#556B5F]">{strings.cropInfo.fields.marketDemand}</p>
              <p className={`mt-1 text-base ${demandColorClass(primaryQuote?.demand ?? selectedCrop.demand)}`}>
                {strings.demand[primaryQuote?.demand ?? selectedCrop.demand]}
              </p>
            </div>

            <div className="py-2 border-b border-[#EEF3EF]">
              <p className="text-xs font-medium text-[#556B5F]">
                {strings.cropInfo.fields.expectedSellingPrice}
              </p>
              <p className="mt-1 font-mono tabular-nums text-base font-semibold text-[#111C16]">
                ₹{selectedCrop.expectedSellingMinKg} – ₹{selectedCrop.expectedSellingMaxKg}{' '}
                {strings.common.perKg}
              </p>
            </div>

            <div className="py-2 border-b border-[#EEF3EF]">
              <p className="text-xs font-medium text-[#556B5F]">
                {strings.cropInfo.fields.lastUpdatedPrice}
              </p>
              <p className="mt-1 font-mono tabular-nums text-sm font-medium text-[#111C16]">
                {formatDate(primaryQuote?.lastUpdated ?? marketData.fetchedAt)}
              </p>
            </div>
          </div>

          {/* 7-Day Price History & Handling Guidance */}
          <div className="pt-2 grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7">
              <h3 className="font-display text-sm font-bold text-[#111C16]">
                {strings.cropInfo.historyTitle}
              </h3>
              <div className="mt-3 grid grid-cols-7 gap-2 items-end h-32 pt-4 border-b border-[#DCE4DF]">
                {selectedCrop.history7d.map((pt) => {
                  const maxVal = Math.max(...selectedCrop.history7d.map((p) => p.pricePerKg), 1);
                  const heightPct = Math.max(20, Math.round((pt.pricePerKg / maxVal) * 100));
                  return (
                    <div key={pt.dayLabel} className="flex flex-col items-center gap-1.5 h-full justify-end">
                      <span className="font-mono tabular-nums text-xs font-semibold text-[#1D2D24]">
                        ₹{pt.pricePerKg}
                      </span>
                      <div
                        className="w-full max-w-[36px] rounded-t-md bg-[#15803D]/85 transition-all"
                        style={{ height: `${heightPct * 0.65}%` }}
                      />
                      <span className="text-[11px] text-[#556B5F] pb-1.5">{pt.dayLabel}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="lg:col-span-5 flex flex-col justify-between bg-[#F7F9F8] rounded-lg border border-[#DCE4DF] p-4">
              <div>
                <h3 className="font-display text-sm font-bold text-[#111C16]">
                  {strings.cropInfo.storageTitle}
                </h3>
                <p className="mt-2 text-sm text-[#31443A] leading-relaxed">
                  {selectedCrop.storageTip[language]}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#DCE4DF] flex flex-wrap items-center justify-between gap-2 text-xs text-[#556B5F]">
                <span>
                  {strings.cropInfo.harvestSeasonLabel}:{' '}
                  <strong className="text-[#111C16]">{selectedCrop.harvestSeason[language]}</strong>
                </span>
                <span className="font-mono tabular-nums">
                  {strings.cropInfo.shelfLifeLabel}:{' '}
                  <strong className="text-[#111C16]">
                    {selectedCrop.shelfLifeDays} {strings.cropInfo.daysUnit}
                  </strong>
                </span>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

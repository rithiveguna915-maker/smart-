import React, { useMemo, useState } from 'react';
import { ArrowDownUp, Bookmark, Calculator, TrendingDown, TrendingUp } from 'lucide-react';
import { CropInfo, Language, MarketDatasetResponse } from '../types/farm';
import { AppStrings } from '../i18n/translations';

interface MarketComparisonViewProps {
  language: Language;
  strings: AppStrings;
  crops: CropInfo[];
  marketData: MarketDatasetResponse;
  selectedCropId: string;
  onSelectCropId: (cropId: string) => void;
  favoriteMarketIds: string[];
  onToggleFavoriteMarket: (marketId: string) => void;
  onUseInCalculator: (cropId: string, marketId: string) => void;
}

export const MarketComparisonView: React.FC<MarketComparisonViewProps> = ({
  language,
  strings,
  crops,
  marketData,
  selectedCropId,
  onSelectCropId,
  favoriteMarketIds,
  onToggleFavoriteMarket,
  onUseInCalculator,
}) => {
  const [sortDesc, setSortDesc] = useState(true);

  const cropQuotes = useMemo(() => {
    const list = marketData.quotes.filter((q) => q.cropId === selectedCropId);
    return [...list].sort((a, b) =>
      sortDesc ? b.modalPricePerKg - a.modalPricePerKg : a.modalPricePerKg - b.modalPricePerKg
    );
  }, [marketData.quotes, selectedCropId, sortDesc]);

  const highestQuote = useMemo(() => {
    if (cropQuotes.length === 0) return null;
    return cropQuotes.reduce((max, cur) => (cur.modalPricePerKg > max.modalPricePerKg ? cur : max));
  }, [cropQuotes]);

  const lowestQuote = useMemo(() => {
    if (cropQuotes.length === 0) return null;
    return cropQuotes.reduce((min, cur) => (cur.modalPricePerKg < min.modalPricePerKg ? cur : min));
  }, [cropQuotes]);

  const spreadKg =
    highestQuote && lowestQuote
      ? Math.round((highestQuote.modalPricePerKg - lowestQuote.modalPricePerKg) * 100) / 100
      : 0;

  const formatDateTime = (iso: string) => {
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
      {/* Crop Selector & Controls */}
      <section className="rounded-xl border border-[#DCE4DF] bg-white p-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-xl sm:text-2xl font-bold text-[#111C16]">
              {strings.marketComparison.title}
            </h1>
            <p className="mt-1 text-sm text-[#556B5F]">{strings.marketComparison.subtitle}</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div>
              <label
                htmlFor="mc-crop-select"
                className="block text-xs font-semibold text-[#465B4F] mb-1"
              >
                {strings.marketComparison.chooseCropLabel}
              </label>
              <select
                id="mc-crop-select"
                value={selectedCropId}
                onChange={(e) => onSelectCropId(e.target.value)}
                className="h-10 min-w-[180px] rounded-lg border border-[#DCE4DF] bg-[#F7F9F8] px-3 text-sm font-semibold text-[#111C16] focus:border-[#15803D] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#15803D]/20"
              >
                {crops.map((crop) => (
                  <option key={crop.id} value={crop.id}>
                    {crop.name[language]}
                  </option>
                ))}
              </select>
            </div>

            <div className="self-end">
              <button
                type="button"
                onClick={() => setSortDesc((s) => !s)}
                className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#DCE4DF] bg-white px-3.5 text-xs font-semibold text-[#1D2D24] hover:bg-[#F1F5F2] whitespace-nowrap"
              >
                <ArrowDownUp className="h-3.5 w-3.5 text-[#15803D]" />
                <span>
                  {sortDesc
                    ? strings.marketComparison.sortByPriceDesc
                    : strings.marketComparison.sortByPriceAsc}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* High / Low / Spread Highlights */}
        {highestQuote && lowestQuote && (
          <div className="mt-6 pt-5 border-t border-[#E9EFEA] grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="rounded-lg border border-[#15803D]/30 bg-[#F0FDF4] p-4">
              <div className="flex items-center justify-between text-xs font-semibold text-[#15803D]">
                <span>{strings.marketComparison.highestMarket}</span>
                <TrendingUp className="h-4 w-4" />
              </div>
              <p className="mt-2 font-mono tabular-nums text-2xl font-bold text-[#14532D]">
                ₹{highestQuote.modalPricePerKg} {strings.common.perKg}
                <span className="ml-2 text-xs font-medium text-[#166534]">
                  (₹{highestQuote.modalPricePerQuintal.toLocaleString()} {strings.common.perQuintal})
                </span>
              </p>
              <p className="mt-1 text-sm font-medium text-[#111C16]">
                {highestQuote.marketName[language]} · {highestQuote.city}
              </p>
            </div>

            <div className="rounded-lg border border-[#D97706]/30 bg-[#FFFBEB] p-4">
              <div className="flex items-center justify-between text-xs font-semibold text-[#B45309]">
                <span>{strings.marketComparison.lowestMarket}</span>
                <TrendingDown className="h-4 w-4" />
              </div>
              <p className="mt-2 font-mono tabular-nums text-2xl font-bold text-[#92400E]">
                ₹{lowestQuote.modalPricePerKg} {strings.common.perKg}
                <span className="ml-2 text-xs font-medium text-[#B45309]">
                  (₹{lowestQuote.modalPricePerQuintal.toLocaleString()} {strings.common.perQuintal})
                </span>
              </p>
              <p className="mt-1 text-sm font-medium text-[#111C16]">
                {lowestQuote.marketName[language]} · {lowestQuote.city}
              </p>
            </div>

            <div className="rounded-lg border border-[#DCE4DF] bg-[#F7F9F8] p-4">
              <p className="text-xs font-semibold text-[#556B5F]">
                {strings.marketComparison.priceSpread}
              </p>
              <p className="mt-2 font-mono tabular-nums text-2xl font-bold text-[#111C16]">
                ₹{spreadKg} {strings.common.perKg}
              </p>
              <p className="mt-1 font-mono tabular-nums text-xs text-[#556B5F]">
                ₹{(spreadKg * 100).toLocaleString()} {strings.common.perQuintal} ·{' '}
                {marketData.source === 'live-agmarknet'
                  ? strings.common.liveAgmarknetTag
                  : strings.common.sampleDataTag}
              </p>
            </div>
          </div>
        )}
      </section>

      {/* Comparison Table */}
      <section className="overflow-hidden rounded-xl border border-[#DCE4DF] bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#DCE4DF] bg-[#F7F9F8] text-xs font-semibold text-[#465B4F]">
                <th className="py-3 px-4">{strings.marketPrices.tableHeaders.market}</th>
                <th className="py-3 px-4">{strings.marketPrices.tableHeaders.location}</th>
                <th className="py-3 px-4 text-right">{strings.marketPrices.tableHeaders.priceKg}</th>
                <th className="py-3 px-4 text-right">
                  {strings.marketPrices.tableHeaders.priceQuintal}
                </th>
                <th className="py-3 px-4">{strings.marketPrices.tableHeaders.demand}</th>
                <th className="py-3 px-4">{strings.marketPrices.tableHeaders.updated}</th>
                <th className="py-3 px-4 text-right">{strings.marketPrices.tableHeaders.action}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EEF3EF] text-sm">
              {cropQuotes.map((q) => {
                const isHighest = highestQuote?.id === q.id && cropQuotes.length > 1;
                const isLowest = lowestQuote?.id === q.id && cropQuotes.length > 1;
                const isFav = favoriteMarketIds.includes(q.marketId);

                return (
                  <tr
                    key={q.id}
                    className={`transition-colors ${
                      isHighest
                        ? 'bg-[#F0FDF4]'
                        : isLowest
                        ? 'bg-[#FFFBEB]/60'
                        : 'hover:bg-[#F7F9F8]'
                    }`}
                  >
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => onToggleFavoriteMarket(q.marketId)}
                          aria-label={isFav ? strings.common.removeFavorite : strings.common.addFavorite}
                          className="text-[#556B5F] hover:text-[#15803D]"
                        >
                          <Bookmark
                            className={`h-4 w-4 ${isFav ? 'fill-[#15803D] text-[#15803D]' : ''}`}
                          />
                        </button>
                        <div>
                          <p className="font-semibold text-[#111C16]">{q.marketName[language]}</p>
                          {(isHighest || isLowest) && (
                            <p
                              className={`text-xs font-semibold ${
                                isHighest ? 'text-[#15803D]' : 'text-[#B45309]'
                              }`}
                            >
                              {isHighest
                                ? strings.marketComparison.highestTag
                                : strings.marketComparison.lowestTag}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-[#465B4F]">
                      {q.city}, {q.state}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono tabular-nums font-bold text-[#111C16]">
                      ₹{q.modalPricePerKg}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono tabular-nums text-[#31443A]">
                      ₹{q.modalPricePerQuintal.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`text-xs font-semibold ${
                          q.demand === 'high'
                            ? 'text-[#15803D]'
                            : q.demand === 'moderate'
                            ? 'text-[#B45309]'
                            : 'text-[#465B4F]'
                        }`}
                      >
                        {strings.demand[q.demand]}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono tabular-nums text-xs text-[#556B5F]">
                      {formatDateTime(q.lastUpdated)}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => onUseInCalculator(q.cropId, q.marketId)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-[#15803D]/40 bg-white px-3 py-1.5 text-xs font-semibold text-[#15803D] hover:bg-[#15803D] hover:text-white transition-colors whitespace-nowrap"
                      >
                        <Calculator className="h-3.5 w-3.5" />
                        <span>{strings.marketComparison.useInCalculator}</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

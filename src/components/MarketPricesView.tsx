import React, { useMemo, useState } from 'react';
import { RefreshCw, ArrowRight, Info } from 'lucide-react';
import { CropInfo, Language, MarketDatasetResponse } from '../types/farm';
import { AppStrings } from '../i18n/translations';

interface MarketPricesViewProps {
  language: Language;
  strings: AppStrings;
  crops: CropInfo[];
  marketData: MarketDatasetResponse;
  isLoading: boolean;
  onRefresh: () => void;
  onSelectCrop: (cropId: string) => void;
  onUseInCalculator: (cropId: string, marketId: string) => void;
}

export const MarketPricesView: React.FC<MarketPricesViewProps> = ({
  language,
  strings,
  crops,
  marketData,
  isLoading,
  onRefresh,
  onSelectCrop,
  onUseInCalculator,
}) => {
  const [stateFilter, setStateFilter] = useState('all');
  const [cropFilter, setCropFilter] = useState('all');

  const states = useMemo(() => {
    const set = new Set(marketData.quotes.map((q) => q.state));
    return Array.from(set).sort();
  }, [marketData.quotes]);

  const filteredQuotes = useMemo(() => {
    return marketData.quotes.filter((q) => {
      if (stateFilter !== 'all' && q.state !== stateFilter) return false;
      if (cropFilter !== 'all' && q.cropId !== cropFilter) return false;
      return true;
    });
  }, [marketData.quotes, stateFilter, cropFilter]);

  const getCropName = (cropId: string) => {
    const crop = crops.find((c) => c.id === cropId);
    return crop ? crop.name[language] : cropId;
  };

  const formatTime = (iso: string) => {
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
    <div className="space-y-5">
      {/* Header & Source Attribution */}
      <section className="rounded-xl border border-[#DCE4DF] bg-white p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="font-display text-xl sm:text-2xl font-bold text-[#111C16]">
              {strings.marketPrices.title}
            </h1>
            <p className="mt-1 text-sm text-[#556B5F]">{strings.marketPrices.subtitle}</p>
          </div>
          <button
            type="button"
            onClick={onRefresh}
            disabled={isLoading}
            className="inline-flex items-center gap-2 self-start rounded-lg border border-[#DCE4DF] bg-[#F7F9F8] px-4 py-2 text-sm font-semibold text-[#1D2D24] hover:bg-[#EAF1EC] disabled:opacity-60 transition-colors whitespace-nowrap"
          >
            <RefreshCw className={`h-4 w-4 text-[#15803D] ${isLoading ? 'animate-spin' : ''}`} />
            <span>{strings.common.refresh}</span>
          </button>
        </div>

        {/* Transparent Data Source Notice */}
        <div className="mt-4 flex items-start gap-2.5 rounded-lg border border-[#DCE4DF] bg-[#F7F9F8] px-4 py-3 text-xs text-[#31443A]">
          <Info className="h-4 w-4 shrink-0 text-[#15803D] mt-0.5" />
          <div className="space-y-0.5">
            <p className="font-semibold text-[#111C16]">
              {strings.common.dataSource}:{' '}
              {marketData.source === 'live-agmarknet'
                ? strings.common.liveAgmarknetTag
                : strings.common.sampleDataTag}
              <span className="mx-1.5" aria-hidden="true">
                ·
              </span>
              <span className="font-mono tabular-nums font-normal text-[#556B5F]">
                {strings.common.lastUpdated}: {formatTime(marketData.fetchedAt)}
              </span>
            </p>
            {marketData.note && <p className="text-[#556B5F]">{marketData.note}</p>}
          </div>
        </div>

        {/* Filters */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="mp-crop-filter"
              className="block text-xs font-semibold text-[#465B4F] mb-1.5"
            >
              {strings.marketPrices.filterByCrop}
            </label>
            <select
              id="mp-crop-filter"
              value={cropFilter}
              onChange={(e) => setCropFilter(e.target.value)}
              className="h-10 w-full rounded-lg border border-[#DCE4DF] bg-white px-3 text-sm text-[#111C16] focus:border-[#15803D] focus:outline-none focus:ring-2 focus:ring-[#15803D]/20"
            >
              <option value="all">{strings.marketPrices.allCrops}</option>
              {crops.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name[language]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="mp-state-filter"
              className="block text-xs font-semibold text-[#465B4F] mb-1.5"
            >
              {strings.marketPrices.filterByState}
            </label>
            <select
              id="mp-state-filter"
              value={stateFilter}
              onChange={(e) => setStateFilter(e.target.value)}
              className="h-10 w-full rounded-lg border border-[#DCE4DF] bg-white px-3 text-sm text-[#111C16] focus:border-[#15803D] focus:outline-none focus:ring-2 focus:ring-[#15803D]/20"
            >
              <option value="all">{strings.marketPrices.allStates}</option>
              {states.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Market Table */}
      <section className="overflow-hidden rounded-xl border border-[#DCE4DF] bg-white">
        {filteredQuotes.length === 0 ? (
          <div className="px-6 py-10 text-center text-sm text-[#556B5F]">
            {strings.marketPrices.noMatches}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#DCE4DF] bg-[#F7F9F8] text-xs font-semibold text-[#465B4F]">
                  <th className="py-3 px-4">{strings.marketPrices.tableHeaders.crop}</th>
                  <th className="py-3 px-4">{strings.marketPrices.tableHeaders.market}</th>
                  <th className="py-3 px-4">{strings.marketPrices.tableHeaders.location}</th>
                  <th className="py-3 px-4 text-right">{strings.marketPrices.tableHeaders.priceKg}</th>
                  <th className="py-3 px-4 text-right">
                    {strings.marketPrices.tableHeaders.priceQuintal}
                  </th>
                  <th className="py-3 px-4">{strings.marketPrices.tableHeaders.demand}</th>
                  <th className="py-3 px-4 text-right">{strings.marketPrices.tableHeaders.action}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EEF3EF] text-sm">
                {filteredQuotes.map((q) => (
                  <tr key={q.id} className="hover:bg-[#F7F9F8] transition-colors">
                    <td className="py-3 px-4 font-semibold text-[#111C16]">
                      <button
                        type="button"
                        onClick={() => onSelectCrop(q.cropId)}
                        className="hover:text-[#15803D] hover:underline text-left"
                      >
                        {getCropName(q.cropId)}
                      </button>
                    </td>
                    <td className="py-3 px-4 text-[#2A3D32]">{q.marketName[language]}</td>
                    <td className="py-3 px-4 text-[#556B5F]">
                      {q.city}, {q.state}
                    </td>
                    <td className="py-3 px-4 text-right font-mono tabular-nums font-semibold text-[#111C16]">
                      ₹{q.modalPricePerKg}
                    </td>
                    <td className="py-3 px-4 text-right font-mono tabular-nums text-[#31443A]">
                      ₹{q.modalPricePerQuintal.toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
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
                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => onUseInCalculator(q.cropId, q.marketId)}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-[#15803D] hover:underline whitespace-nowrap"
                      >
                        <span>{strings.common.calculateProfit}</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};

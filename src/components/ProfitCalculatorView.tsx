import React, { useEffect, useMemo, useState } from 'react';
import { AlertCircle, CheckCircle2, Info, RotateCcw, TrendingUp } from 'lucide-react';
import { CropInfo, Language, MarketDatasetResponse } from '../types/farm';
import { AppStrings } from '../i18n/translations';

interface ProfitCalculatorViewProps {
  language: Language;
  strings: AppStrings;
  crops: CropInfo[];
  marketData: MarketDatasetResponse;
  initialCropId: string;
  initialDestinationMarketId: string;
  onSummaryChange?: (summary: string) => void;
}

export const ProfitCalculatorView: React.FC<ProfitCalculatorViewProps> = ({
  language,
  strings,
  crops,
  marketData,
  initialCropId,
  initialDestinationMarketId,
  onSummaryChange,
}) => {
  const [cropId, setCropId] = useState(initialCropId || 'tomato');
  const [quantityInput, setQuantityInput] = useState('1000');
  const [unit, setUnit] = useState<'kg' | 'quintal'>('kg');
  const [sellingPriceInput, setSellingPriceInput] = useState('34');
  const [productionCostInput, setProductionCostInput] = useState('14000');
  const [transportCostInput, setTransportCostInput] = useState('3200');
  const [loadingCostInput, setLoadingCostInput] = useState('800');
  const [otherExpensesInput, setOtherExpensesInput] = useState('500');
  const [localMarketId, setLocalMarketId] = useState('oddanchatram-dindigul');
  const [destinationMarketId, setDestinationMarketId] = useState(
    initialDestinationMarketId || 'bengaluru-yeshwanthpur'
  );

  const cropQuotes = useMemo(() => {
    return marketData.quotes.filter((q) => q.cropId === cropId);
  }, [marketData.quotes, cropId]);

  // Sync incoming crop/market handoff
  useEffect(() => {
    if (initialCropId) {
      setCropId(initialCropId);
      const matchingQuotes = marketData.quotes.filter((q) => q.cropId === initialCropId);
      const dest =
        matchingQuotes.find((q) => q.marketId === initialDestinationMarketId) ??
        matchingQuotes[0];
      if (dest) {
        setDestinationMarketId(dest.marketId);
        setSellingPriceInput(String(dest.modalPricePerKg));
      }
      if (matchingQuotes.length > 1) {
        const local =
          matchingQuotes.find((q) => q.marketId !== dest?.marketId) ?? matchingQuotes[0];
        setLocalMarketId(local.marketId);
      }
    }
  }, [initialCropId, initialDestinationMarketId, marketData.quotes]);

  const handleCropChange = (newCropId: string) => {
    setCropId(newCropId);
    const matching = marketData.quotes.filter((q) => q.cropId === newCropId);
    if (matching.length > 0) {
      const highest = matching.reduce((a, b) => (b.modalPricePerKg > a.modalPricePerKg ? b : a));
      const lowest = matching.reduce((a, b) => (b.modalPricePerKg < a.modalPricePerKg ? b : a));
      setDestinationMarketId(highest.marketId);
      setLocalMarketId(lowest.marketId);
      setSellingPriceInput(String(highest.modalPricePerKg));
    }
  };

  const handleDestinationChange = (mktId: string) => {
    setDestinationMarketId(mktId);
    const quote = cropQuotes.find((q) => q.marketId === mktId);
    if (quote) {
      setSellingPriceInput(String(quote.modalPricePerKg));
    }
  };

  const handleAutoFillRate = () => {
    const quote = cropQuotes.find((q) => q.marketId === destinationMarketId);
    if (quote) {
      setSellingPriceInput(String(quote.modalPricePerKg));
    }
  };

  const handleReset = () => {
    setQuantityInput('1000');
    setUnit('kg');
    const quote = cropQuotes.find((q) => q.marketId === destinationMarketId);
    setSellingPriceInput(String(quote?.modalPricePerKg ?? 30));
    setProductionCostInput('14000');
    setTransportCostInput('3200');
    setLoadingCostInput('800');
    setOtherExpensesInput('500');
  };

  const parsed = useMemo(() => {
    const rawQty = Number(quantityInput);
    const priceKg = Number(sellingPriceInput);
    const prod = Number(productionCostInput);
    const trans = Number(transportCostInput);
    const load = Number(loadingCostInput);
    const other = Number(otherExpensesInput);

    const isValid =
      Number.isFinite(rawQty) &&
      rawQty > 0 &&
      Number.isFinite(priceKg) &&
      priceKg >= 0 &&
      Number.isFinite(prod) &&
      prod >= 0 &&
      Number.isFinite(trans) &&
      trans >= 0 &&
      Number.isFinite(load) &&
      load >= 0 &&
      Number.isFinite(other) &&
      other >= 0;

    const quantityKg = unit === 'quintal' ? rawQty * 100 : rawQty;
    const totalRevenue = quantityKg * priceKg;
    const totalTransportExpenses = trans + load;
    const totalExpenses = prod + trans + load + other;
    const netProfit = totalRevenue - totalExpenses;
    const profitPerKg = quantityKg > 0 ? netProfit / quantityKg : 0;
    const profitPercentage = totalExpenses > 0 ? (netProfit / totalExpenses) * 100 : 0;

    // Local market baseline estimate (assumes local sale avoids long-haul transport cost)
    const localQuote = cropQuotes.find((q) => q.marketId === localMarketId) ?? cropQuotes[0];
    const localPriceKg = localQuote ? localQuote.modalPricePerKg : Math.max(1, priceKg - 4);
    const localRevenue = quantityKg * localPriceKg;
    const localExpenses = prod + Math.round(load * 0.5) + other;
    const localNetProfit = localRevenue - localExpenses;
    const profitDelta = netProfit - localNetProfit;

    return {
      isValid,
      quantityKg,
      totalRevenue,
      totalTransportExpenses,
      totalExpenses,
      netProfit,
      profitPerKg,
      profitPercentage,
      localQuote,
      localPriceKg,
      localNetProfit,
      profitDelta,
    };
  }, [
    quantityInput,
    unit,
    sellingPriceInput,
    productionCostInput,
    transportCostInput,
    loadingCostInput,
    otherExpensesInput,
    cropQuotes,
    localMarketId,
  ]);

  const selectedCrop = crops.find((c) => c.id === cropId);
  const destQuote = cropQuotes.find((q) => q.marketId === destinationMarketId);

  useEffect(() => {
    if (!onSummaryChange || !parsed.isValid) return;
    onSummaryChange(
      `${selectedCrop?.name.en ?? cropId}, Qty: ${parsed.quantityKg} kg, Dest: ${
        destQuote?.marketName.en ?? destinationMarketId
      } at ₹${sellingPriceInput}/kg, Estimated Net Profit: ₹${Math.round(parsed.netProfit)}`
    );
  }, [onSummaryChange, parsed, selectedCrop, cropId, destQuote, destinationMarketId, sellingPriceInput]);

  const formatINR = (val: number) =>
    `₹${Math.round(val).toLocaleString('en-IN')}`;

  return (
    <div className="space-y-6">
      {/* Header & Estimate Disclaimer */}
      <section className="rounded-xl border border-[#DCE4DF] bg-white p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-display text-xl sm:text-2xl font-bold text-[#111C16]">
              {strings.profitCalc.title}
            </h1>
            <p className="mt-1 text-sm text-[#556B5F]">{strings.profitCalc.subtitle}</p>
          </div>
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-2 self-start rounded-lg border border-[#DCE4DF] bg-[#F7F9F8] px-3.5 py-2 text-xs font-semibold text-[#1D2D24] hover:bg-[#EAF1EC] whitespace-nowrap"
          >
            <RotateCcw className="h-3.5 w-3.5 text-[#15803D]" />
            <span>{strings.profitCalc.resetForm}</span>
          </button>
        </div>

        <div className="mt-4 flex items-start gap-2.5 rounded-lg border border-[#DCE4DF] bg-[#F7F9F8] px-4 py-3 text-xs text-[#31443A]">
          <Info className="h-4 w-4 shrink-0 text-[#15803D] mt-0.5" />
          <p>{strings.profitCalc.estimateDisclaimer}</p>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Input Form */}
        <section className="lg:col-span-6 rounded-xl border border-[#DCE4DF] bg-white p-6 space-y-4">
          <h2 className="font-display text-base font-bold text-[#111C16] pb-3 border-b border-[#E9EFEA]">
            {strings.profitCalc.inputsTitle}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label htmlFor="pc-crop" className="block text-xs font-semibold text-[#465B4F] mb-1.5">
                {strings.profitCalc.cropLabel}
              </label>
              <select
                id="pc-crop"
                value={cropId}
                onChange={(e) => handleCropChange(e.target.value)}
                className="h-10 w-full rounded-lg border border-[#DCE4DF] bg-white px-3 text-sm font-medium text-[#111C16] focus:border-[#15803D] focus:outline-none focus:ring-2 focus:ring-[#15803D]/20"
              >
                {crops.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name[language]}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="pc-qty" className="block text-xs font-semibold text-[#465B4F] mb-1.5">
                {strings.profitCalc.quantityLabel}
              </label>
              <input
                id="pc-qty"
                type="number"
                min="1"
                step="any"
                value={quantityInput}
                onChange={(e) => setQuantityInput(e.target.value)}
                className="h-10 w-full rounded-lg border border-[#DCE4DF] bg-white px-3 font-mono tabular-nums text-sm text-[#111C16] focus:border-[#15803D] focus:outline-none focus:ring-2 focus:ring-[#15803D]/20"
              />
            </div>

            <div>
              <label htmlFor="pc-unit" className="block text-xs font-semibold text-[#465B4F] mb-1.5">
                {strings.profitCalc.unitLabel}
              </label>
              <div className="grid grid-cols-2 gap-1 rounded-lg border border-[#DCE4DF] bg-[#F7F9F8] p-1 h-10">
                <button
                  type="button"
                  onClick={() => setUnit('kg')}
                  className={`rounded-md text-xs font-semibold transition-colors ${
                    unit === 'kg' ? 'bg-[#15803D] text-white' : 'text-[#31443A] hover:bg-[#EAF1EC]'
                  }`}
                >
                  {strings.common.kg}
                </button>
                <button
                  type="button"
                  onClick={() => setUnit('quintal')}
                  className={`rounded-md text-xs font-semibold transition-colors ${
                    unit === 'quintal'
                      ? 'bg-[#15803D] text-white'
                      : 'text-[#31443A] hover:bg-[#EAF1EC]'
                  }`}
                >
                  {strings.common.quintal}
                </button>
              </div>
            </div>

            <div>
              <label
                htmlFor="pc-local-mkt"
                className="block text-xs font-semibold text-[#465B4F] mb-1.5"
              >
                {strings.profitCalc.localMarketLabel}
              </label>
              <select
                id="pc-local-mkt"
                value={localMarketId}
                onChange={(e) => setLocalMarketId(e.target.value)}
                className="h-10 w-full rounded-lg border border-[#DCE4DF] bg-white px-3 text-sm text-[#111C16] focus:border-[#15803D] focus:outline-none focus:ring-2 focus:ring-[#15803D]/20"
              >
                {cropQuotes.map((q) => (
                  <option key={q.id} value={q.marketId}>
                    {q.marketName[language]} (₹{q.modalPricePerKg}/kg)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="pc-dest-mkt"
                className="block text-xs font-semibold text-[#465B4F] mb-1.5"
              >
                {strings.profitCalc.destinationMarketLabel}
              </label>
              <select
                id="pc-dest-mkt"
                value={destinationMarketId}
                onChange={(e) => handleDestinationChange(e.target.value)}
                className="h-10 w-full rounded-lg border border-[#DCE4DF] bg-white px-3 text-sm text-[#111C16] focus:border-[#15803D] focus:outline-none focus:ring-2 focus:ring-[#15803D]/20"
              >
                {cropQuotes.map((q) => (
                  <option key={q.id} value={q.marketId}>
                    {q.marketName[language]} (₹{q.modalPricePerKg}/kg)
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="pc-price" className="text-xs font-semibold text-[#465B4F]">
                  {strings.profitCalc.sellingPriceLabel}
                </label>
                <button
                  type="button"
                  onClick={handleAutoFillRate}
                  className="text-xs font-semibold text-[#15803D] hover:underline"
                >
                  {strings.profitCalc.autoFillRate}
                </button>
              </div>
              <input
                id="pc-price"
                type="number"
                min="0"
                step="0.5"
                value={sellingPriceInput}
                onChange={(e) => setSellingPriceInput(e.target.value)}
                className="h-10 w-full rounded-lg border border-[#DCE4DF] bg-white px-3 font-mono tabular-nums text-sm text-[#111C16] focus:border-[#15803D] focus:outline-none focus:ring-2 focus:ring-[#15803D]/20"
              />
            </div>

            <div>
              <label htmlFor="pc-prod" className="block text-xs font-semibold text-[#465B4F] mb-1.5">
                {strings.profitCalc.productionCostLabel}
              </label>
              <input
                id="pc-prod"
                type="number"
                min="0"
                step="any"
                value={productionCostInput}
                onChange={(e) => setProductionCostInput(e.target.value)}
                className="h-10 w-full rounded-lg border border-[#DCE4DF] bg-white px-3 font-mono tabular-nums text-sm text-[#111C16] focus:border-[#15803D] focus:outline-none focus:ring-2 focus:ring-[#15803D]/20"
              />
            </div>

            <div>
              <label htmlFor="pc-trans" className="block text-xs font-semibold text-[#465B4F] mb-1.5">
                {strings.profitCalc.transportCostLabel}
              </label>
              <input
                id="pc-trans"
                type="number"
                min="0"
                step="any"
                value={transportCostInput}
                onChange={(e) => setTransportCostInput(e.target.value)}
                className="h-10 w-full rounded-lg border border-[#DCE4DF] bg-white px-3 font-mono tabular-nums text-sm text-[#111C16] focus:border-[#15803D] focus:outline-none focus:ring-2 focus:ring-[#15803D]/20"
              />
            </div>

            <div>
              <label htmlFor="pc-load" className="block text-xs font-semibold text-[#465B4F] mb-1.5">
                {strings.profitCalc.loadingCostLabel}
              </label>
              <input
                id="pc-load"
                type="number"
                min="0"
                step="any"
                value={loadingCostInput}
                onChange={(e) => setLoadingCostInput(e.target.value)}
                className="h-10 w-full rounded-lg border border-[#DCE4DF] bg-white px-3 font-mono tabular-nums text-sm text-[#111C16] focus:border-[#15803D] focus:outline-none focus:ring-2 focus:ring-[#15803D]/20"
              />
            </div>

            <div>
              <label htmlFor="pc-other" className="block text-xs font-semibold text-[#465B4F] mb-1.5">
                {strings.profitCalc.otherExpensesLabel}
              </label>
              <input
                id="pc-other"
                type="number"
                min="0"
                step="any"
                value={otherExpensesInput}
                onChange={(e) => setOtherExpensesInput(e.target.value)}
                className="h-10 w-full rounded-lg border border-[#DCE4DF] bg-white px-3 font-mono tabular-nums text-sm text-[#111C16] focus:border-[#15803D] focus:outline-none focus:ring-2 focus:ring-[#15803D]/20"
              />
            </div>
          </div>
        </section>

        {/* Right: Results Breakdown & Local vs Destination Comparison */}
        <section className="lg:col-span-6 space-y-5">
          {!parsed.isValid ? (
            <div className="flex items-start gap-3 rounded-xl border border-[#DC2626]/30 bg-[#FEF2F2] p-5 text-sm text-[#991B1B]">
              <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
              <p>{strings.profitCalc.validationError}</p>
            </div>
          ) : (
            <>
              <div className="rounded-xl border border-[#DCE4DF] bg-white p-6 space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-[#E9EFEA]">
                  <h2 className="font-display text-base font-bold text-[#111C16]">
                    {strings.profitCalc.resultsTitle}
                  </h2>
                  <span className="text-xs font-semibold text-[#15803D]">
                    {strings.common.estimateTag}
                  </span>
                </div>

                {/* Primary Net Profit Highlight */}
                <div
                  className={`rounded-lg border p-4 ${
                    parsed.netProfit >= 0
                      ? 'border-[#15803D]/30 bg-[#F0FDF4]'
                      : 'border-[#DC2626]/30 bg-[#FEF2F2]'
                  }`}
                >
                  <p className="text-xs font-semibold text-[#465B4F]">
                    {strings.profitCalc.metrics.netProfit} ({strings.common.estimateTag})
                  </p>
                  <p
                    className={`mt-1 font-mono tabular-nums text-3xl font-bold ${
                      parsed.netProfit >= 0 ? 'text-[#14532D]' : 'text-[#991B1B]'
                    }`}
                  >
                    {formatINR(parsed.netProfit)}
                  </p>
                  <p className="mt-1 font-mono tabular-nums text-xs text-[#465B4F]">
                    {parsed.quantityKg.toLocaleString()} {strings.common.kg} ·{' '}
                    {strings.profitCalc.metrics.profitPerKg}:{' '}
                    <strong>₹{parsed.profitPerKg.toFixed(2)}</strong>
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="py-2 border-b border-[#EEF3EF]">
                    <p className="text-xs text-[#556B5F]">{strings.profitCalc.metrics.totalRevenue}</p>
                    <p className="mt-1 font-mono tabular-nums text-lg font-bold text-[#111C16]">
                      {formatINR(parsed.totalRevenue)}
                    </p>
                  </div>

                  <div className="py-2 border-b border-[#EEF3EF]">
                    <p className="text-xs text-[#556B5F]">{strings.profitCalc.metrics.totalExpenses}</p>
                    <p className="mt-1 font-mono tabular-nums text-lg font-bold text-[#111C16]">
                      {formatINR(parsed.totalExpenses)}
                    </p>
                  </div>

                  <div className="py-2 border-b border-[#EEF3EF]">
                    <p className="text-xs text-[#556B5F]">
                      {strings.profitCalc.metrics.totalTransport}
                    </p>
                    <p className="mt-1 font-mono tabular-nums text-lg font-bold text-[#111C16]">
                      {formatINR(parsed.totalTransportExpenses)}
                    </p>
                  </div>

                  <div className="py-2 border-b border-[#EEF3EF]">
                    <p className="text-xs text-[#556B5F]">{strings.profitCalc.metrics.profitMargin}</p>
                    <p
                      className={`mt-1 font-mono tabular-nums text-lg font-bold ${
                        parsed.profitPercentage >= 0 ? 'text-[#15803D]' : 'text-[#DC2626]'
                      }`}
                    >
                      {parsed.profitPercentage.toFixed(1)}%
                    </p>
                  </div>
                </div>
              </div>

              {/* Local vs Destination Market Comparison */}
              <div className="rounded-xl border border-[#DCE4DF] bg-white p-6 space-y-4">
                <h3 className="font-display text-base font-bold text-[#111C16]">
                  {strings.profitCalc.comparisonTitle}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="rounded-lg border border-[#DCE4DF] bg-[#F7F9F8] p-4">
                    <p className="text-xs font-medium text-[#556B5F]">
                      {strings.profitCalc.localSellingLabel}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-[#111C16]">
                      {parsed.localQuote?.marketName[language] ?? 'Local Mandi'}
                    </p>
                    <p className="mt-2 font-mono tabular-nums text-xl font-bold text-[#111C16]">
                      {formatINR(parsed.localNetProfit)}
                    </p>
                    <p className="mt-0.5 font-mono tabular-nums text-xs text-[#556B5F]">
                      ₹{parsed.localPriceKg} {strings.common.perKg} · {strings.common.estimateTag}
                    </p>
                  </div>

                  <div className="rounded-lg border border-[#15803D]/30 bg-[#F0FDF4] p-4">
                    <p className="text-xs font-medium text-[#15803D]">
                      {strings.profitCalc.destinationSellingLabel}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-[#111C16]">
                      {destQuote?.marketName[language] ?? 'Destination Market'}
                    </p>
                    <p className="mt-2 font-mono tabular-nums text-xl font-bold text-[#14532D]">
                      {formatINR(parsed.netProfit)}
                    </p>
                    <p className="mt-0.5 font-mono tabular-nums text-xs text-[#166534]">
                      ₹{sellingPriceInput} {strings.common.perKg} · {strings.common.estimateTag}
                    </p>
                  </div>
                </div>

                {/* Clear Verdict */}
                <div
                  className={`flex items-start gap-3 rounded-lg border p-3.5 text-sm ${
                    parsed.profitDelta > 100
                      ? 'border-[#15803D]/30 bg-[#F0FDF4] text-[#14532D]'
                      : parsed.profitDelta < -100
                      ? 'border-[#D97706]/40 bg-[#FFFBEB] text-[#92400E]'
                      : 'border-[#DCE4DF] bg-[#F7F9F8] text-[#31443A]'
                  }`}
                >
                  {parsed.profitDelta > 100 ? (
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-[#15803D] mt-0.5" />
                  ) : (
                    <TrendingUp className="h-5 w-5 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <p className="font-semibold">
                      {parsed.profitDelta > 100
                        ? strings.profitCalc.verdictHigher
                        : parsed.profitDelta < -100
                        ? strings.profitCalc.verdictLower
                        : strings.profitCalc.verdictEqual}
                    </p>
                    <p className="mt-0.5 font-mono tabular-nums text-xs">
                      {parsed.profitDelta >= 0 ? '+' : ''}
                      {formatINR(parsed.profitDelta)} ({strings.common.estimateTag})
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import {
  ArrowRight,
  Bell,
  Calculator,
  CloudSun,
  Mic,
  Scale,
  Sprout,
  Tag,
} from 'lucide-react';
import { CropInfo, Language, MarketDatasetResponse, SectionId } from '../types/farm';
import { AppStrings } from '../i18n/translations';

interface DashboardViewProps {
  language: Language;
  strings: AppStrings;
  crops: CropInfo[];
  marketData: MarketDatasetResponse;
  selectedCropId: string | null;
  onSelectCropId: (cropId: string) => void;
  onNavigate: (section: SectionId) => void;
  unreadNotificationsCount: number;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  language,
  strings,
  crops,
  marketData,
  selectedCropId,
  onSelectCropId,
  onNavigate,
  unreadNotificationsCount,
}) => {
  const [heroImageError, setHeroImageError] = useState(false);

  const primaryCrops = crops.slice(0, 7);
  const selectedCrop = selectedCropId ? crops.find((c) => c.id === selectedCropId) ?? null : null;

  const selectedCropQuotes = selectedCrop
    ? marketData.quotes.filter((q) => q.cropId === selectedCrop.id)
    : [];
  const bestQuote =
    selectedCropQuotes.length > 0
      ? selectedCropQuotes.reduce((best, cur) =>
          cur.modalPricePerKg > best.modalPricePerKg ? cur : best
        )
      : null;

  const serviceCards: Array<{
    section: SectionId;
    title: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
  }> = [
    {
      section: 'crop-info',
      title: strings.nav['crop-info'],
      description: strings.dashboard.serviceDescriptions.cropInfo,
      icon: Sprout,
    },
    {
      section: 'market-prices',
      title: strings.nav['market-prices'],
      description: strings.dashboard.serviceDescriptions.marketPrices,
      icon: Tag,
    },
    {
      section: 'market-comparison',
      title: strings.nav['market-comparison'],
      description: strings.dashboard.serviceDescriptions.marketComparison,
      icon: Scale,
    },
    {
      section: 'profit-calculator',
      title: strings.nav['profit-calculator'],
      description: strings.dashboard.serviceDescriptions.profitCalculator,
      icon: Calculator,
    },
    {
      section: 'weather',
      title: strings.nav.weather,
      description: strings.dashboard.serviceDescriptions.weather,
      icon: CloudSun,
    },
    {
      section: 'voice-assistant',
      title: strings.nav['voice-assistant'],
      description: strings.dashboard.serviceDescriptions.voiceAssistant,
      icon: Mic,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Editorial Welcome Banner */}
      <section className="overflow-hidden rounded-xl border border-[#DCE4DF] bg-white">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
          <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between gap-6">
            <div>
              <p className="text-xs font-semibold text-[#15803D]">
                {strings.brandName} ·{' '}
                {marketData.source === 'live-agmarknet'
                  ? strings.common.liveAgmarknetTag
                  : strings.common.sampleDataTag}
              </p>
              <h1 className="mt-2 font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#111C16] [text-wrap:balance]">
                {strings.dashboard.heroHeadline}
              </h1>
              <p className="mt-3 text-sm sm:text-base text-[#465B4F] max-w-2xl leading-relaxed">
                {strings.dashboard.heroBody}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => onNavigate('market-comparison')}
                className="inline-flex items-center gap-2 rounded-lg bg-[#15803D] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#166534] transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#15803D]"
              >
                <span>{strings.dashboard.ctaCompare}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => onNavigate('profit-calculator')}
                className="inline-flex items-center gap-2 rounded-lg border border-[#DCE4DF] bg-[#F7F9F8] px-5 py-2.5 text-sm font-semibold text-[#1D2D24] hover:bg-[#EAF1EC] transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#15803D]"
              >
                <Calculator className="h-4 w-4 text-[#15803D]" />
                <span>{strings.dashboard.ctaProfit}</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 min-h-[200px] lg:min-h-[260px] bg-[#E8F2EC] relative">
            {!heroImageError ? (
              <img
                src="/src/assets/images/hero_smart_farmer_1795426915070.jpg"
                alt="Fresh green agricultural farm rows in morning light"
                referrerPolicy="no-referrer"
                onError={() => setHeroImageError(true)}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-[#DCFCE7] to-[#BBF7D0]">
                <Sprout className="h-10 w-10 text-[#15803D]" />
                <p className="mt-2 font-display text-sm font-semibold text-[#14532D]">
                  {strings.brandName}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Active Price Alert Notification Strip (Shown only when unread triggers exist) */}
      {unreadNotificationsCount > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-[#15803D]/30 bg-[#F0FDF4] px-5 py-3.5">
          <div className="flex items-center gap-3 text-sm text-[#14532D]">
            <Bell className="h-4 w-4 shrink-0 text-[#15803D]" />
            <span className="font-medium">
              {unreadNotificationsCount} · {strings.dashboard.activeAlertsBanner}
            </span>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('favorites')}
            className="text-sm font-semibold text-[#15803D] hover:underline whitespace-nowrap"
          >
            {strings.dashboard.viewAlerts}
          </button>
        </div>
      )}

      {/* Progressive Disclosure Crop Selector */}
      <section className="rounded-xl border border-[#DCE4DF] bg-white p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-4 border-b border-[#E9EFEA]">
          <div>
            <h2 className="font-display text-lg font-bold text-[#111C16]">
              {strings.dashboard.quickCropTitle}
            </h2>
            <p className="text-sm text-[#556B5F] mt-0.5">{strings.dashboard.quickCropPrompt}</p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('crop-info')}
            className="self-start sm:self-auto text-sm font-semibold text-[#15803D] hover:underline whitespace-nowrap"
          >
            {strings.common.all} ({crops.length})
          </button>
        </div>

        <div className="mt-4 flex flex-wrap gap-2.5">
          {primaryCrops.map((crop) => {
            const isSelected = selectedCropId === crop.id;
            return (
              <button
                key={crop.id}
                type="button"
                onClick={() => onSelectCropId(crop.id)}
                aria-pressed={isSelected}
                className={`rounded-lg border px-4 py-2 text-sm font-semibold transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#15803D] ${
                  isSelected
                    ? 'border-[#15803D] bg-[#15803D] text-white'
                    : 'border-[#DCE4DF] bg-[#F7F9F8] text-[#1D2D24] hover:border-[#15803D]/50 hover:bg-[#ECF5EF]'
                }`}
              >
                {crop.name[language]}
              </button>
            );
          })}
        </div>

        {/* Detailed Preview ONLY revealed after the user selects a crop */}
        {selectedCrop && (
          <div className="mt-6 pt-6 border-t border-[#E9EFEA] grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
            <div>
              <p className="text-xs font-medium text-[#556B5F]">{strings.dashboard.previewReadyLabel}</p>
              <p className="mt-1 font-display text-xl font-bold text-[#111C16]">
                {selectedCrop.name[language]}
              </p>
              <p className="mt-1 text-xs text-[#556B5F]">
                {selectedCrop.qualityGrade[language]} · {strings.demand[selectedCrop.demand]}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium text-[#556B5F]">
                {strings.cropInfo.fields.currentMarketPrice}
              </p>
              <p className="mt-1 font-mono tabular-nums text-xl font-bold text-[#15803D]">
                ₹{bestQuote ? bestQuote.modalPricePerKg : selectedCrop.basePricePerKg}{' '}
                <span className="text-xs font-normal text-[#556B5F]">{strings.common.perKg}</span>
              </p>
              <p className="mt-1 text-xs text-[#556B5F] font-mono tabular-nums">
                ₹{(bestQuote ? bestQuote.modalPricePerKg : selectedCrop.basePricePerKg) * 100}{' '}
                {strings.common.perQuintal}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium text-[#556B5F]">
                {strings.cropInfo.fields.marketLocation}
              </p>
              <p className="mt-1 text-sm font-semibold text-[#111C16]">
                {bestQuote ? bestQuote.marketName[language] : '—'}
              </p>
              <p className="mt-1 text-xs text-[#556B5F]">
                {bestQuote ? `${bestQuote.city}, ${bestQuote.state}` : ''}
              </p>
            </div>

            <div className="flex flex-wrap md:justify-end gap-2.5">
              <button
                type="button"
                onClick={() => onNavigate('crop-info')}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#15803D] px-4 py-2 text-sm font-semibold text-white hover:bg-[#166534] transition-colors whitespace-nowrap"
              >
                <span>{strings.dashboard.openFullCard}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => onNavigate('profit-calculator')}
                className="inline-flex items-center gap-1.5 rounded-lg border border-[#DCE4DF] bg-white px-4 py-2 text-sm font-semibold text-[#1D2D24] hover:bg-[#F1F5F2] transition-colors whitespace-nowrap"
              >
                <span>{strings.common.calculateProfit}</span>
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Farmer Decision Tools Grid */}
      <section>
        <div className="mb-4">
          <h2 className="font-display text-lg font-bold text-[#111C16]">
            {strings.dashboard.servicesHeading}
          </h2>
          <p className="text-sm text-[#556B5F]">{strings.dashboard.servicesSubheading}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {serviceCards.map(({ section, title, description, icon: Icon }) => (
            <button
              key={section}
              type="button"
              onClick={() => onNavigate(section)}
              className="group flex flex-col justify-between rounded-xl border border-[#DCE4DF] bg-white p-5 text-left transition-colors duration-150 hover:border-[#15803D]/60 hover:bg-[#FAFDFB] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#15803D]"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#ECF5EF] text-[#15803D]">
                    <Icon className="h-5 w-5" />
                  </span>
                  <ArrowRight className="h-4 w-4 text-[#6B7F74] transition-transform group-hover:translate-x-0.5 group-hover:text-[#15803D]" />
                </div>
                <h3 className="mt-4 font-display text-base font-bold text-[#111C16]">{title}</h3>
                <p className="mt-1.5 text-sm text-[#556B5F] leading-relaxed">{description}</p>
              </div>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
};

import React, { useMemo, useRef, useState } from 'react';
import { Menu, Search, X, Clock, ArrowRight } from 'lucide-react';
import { CropInfo, Language, MarketQuote, SectionId } from '../types/farm';
import { AppStrings } from '../i18n/translations';

interface TopBarProps {
  language: Language;
  onChangeLanguage: (lang: Language) => void;
  activeSection: SectionId;
  strings: AppStrings;
  crops: CropInfo[];
  quotes: MarketQuote[];
  recentSearches: string[];
  onAddRecentSearch: (term: string) => void;
  onSelectSearchCrop: (cropId: string) => void;
  onSelectSearchMarket: (cropId: string, marketId: string) => void;
  onOpenMobileNav: () => void;
}

interface SearchSuggestion {
  key: string;
  type: 'crop' | 'market';
  title: string;
  meta: string;
  cropId: string;
  marketId?: string;
}

const LANG_OPTIONS: Array<{ code: Language; label: string }> = [
  { code: 'en', label: 'English' },
  { code: 'ta', label: 'தமிழ்' },
  { code: 'hi', label: 'हिन्दी' },
];

export const TopBar: React.FC<TopBarProps> = ({
  language,
  onChangeLanguage,
  activeSection,
  strings,
  crops,
  quotes,
  recentSearches,
  onAddRecentSearch,
  onSelectSearchCrop,
  onSelectSearchMarket,
  onOpenMobileNav,
}) => {
  const [query, setQuery] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const blurTimer = useRef<number | null>(null);

  const suggestions = useMemo<SearchSuggestion[]>(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    const results: SearchSuggestion[] = [];

    for (const crop of crops) {
      const hay = [
        crop.name.en,
        crop.name.ta,
        crop.name.hi,
        crop.variety.en,
        crop.qualityGrade.en,
        strings.demand[crop.demand],
        crop.category,
      ]
        .join(' ')
        .toLowerCase();

      if (hay.includes(q)) {
        results.push({
          key: `crop-${crop.id}`,
          type: 'crop',
          title: crop.name[language],
          meta: `${crop.qualityGrade[language]} · ${strings.demand[crop.demand]} · ₹${crop.basePricePerKg}${strings.common.perKg}`,
          cropId: crop.id,
        });
      }
    }

    for (const quote of quotes) {
      const crop = crops.find((c) => c.id === quote.cropId);
      const cropLabel = crop ? crop.name[language] : quote.cropId;
      const hay = [
        cropLabel,
        crop?.name.en ?? '',
        quote.marketName[language],
        quote.marketName.en,
        quote.city,
        quote.state,
        strings.demand[quote.demand],
        String(quote.modalPricePerKg),
      ]
        .join(' ')
        .toLowerCase();

      if (hay.includes(q)) {
        results.push({
          key: `mkt-${quote.id}`,
          type: 'market',
          title: `${cropLabel} — ${quote.marketName[language]}`,
          meta: `${quote.city}, ${quote.state} · ₹${quote.modalPricePerKg}${strings.common.perKg}`,
          cropId: quote.cropId,
          marketId: quote.marketId,
        });
      }
    }

    return results.slice(0, 8);
  }, [query, crops, quotes, language, strings]);

  const handleChooseSuggestion = (item: SearchSuggestion) => {
    onAddRecentSearch(item.title);
    setDropdownOpen(false);
    setQuery('');
    if (item.type === 'crop') {
      onSelectSearchCrop(item.cropId);
    } else if (item.marketId) {
      onSelectSearchMarket(item.cropId, item.marketId);
    }
  };

  const handleChooseRecent = (term: string) => {
    setQuery(term);
    setDropdownOpen(true);
  };

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-[#DCE4DF]">
      <div className="mx-auto flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 sm:px-6 lg:flex-nowrap lg:gap-8">
        {/* Zone 1: Mobile Menu Trigger + Section Title */}
        <div className="flex items-center gap-3 min-w-0 shrink-0">
          <button
            type="button"
            onClick={onOpenMobileNav}
            aria-label="Open navigation menu"
            className="lg:hidden flex h-10 w-10 items-center justify-center rounded-lg border border-[#DCE4DF] text-[#1D2D24] hover:bg-[#F1F5F2] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#15803D]"
          >
            <Menu className="h-5 w-5" />
          </button>
          <span className="font-display text-base sm:text-lg font-semibold text-[#111C16] whitespace-nowrap truncate">
            {strings.nav[activeSection]}
          </span>
        </div>

        {/* Zone 2: Case-Insensitive Search with Live Suggestions */}
        <div className="relative order-3 w-full lg:order-2 lg:flex-1 lg:max-w-xl">
          <div className="relative flex items-center">
            <Search className="pointer-events-none absolute left-3.5 h-4 w-4 text-[#556B5F]" />
            <input
              type="search"
              value={query}
              onFocus={() => {
                if (blurTimer.current) window.clearTimeout(blurTimer.current);
                setDropdownOpen(true);
              }}
              onBlur={() => {
                blurTimer.current = window.setTimeout(() => setDropdownOpen(false), 180);
              }}
              onChange={(e) => {
                setQuery(e.target.value);
                setDropdownOpen(true);
              }}
              placeholder={strings.searchPlaceholder}
              aria-label={strings.searchPlaceholder}
              className="h-10 w-full rounded-lg border border-[#DCE4DF] bg-[#F7F9F8] pl-10 pr-20 text-sm text-[#111C16] placeholder-[#6B7F74] transition-colors focus:border-[#15803D] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#15803D]/20"
            />
            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  setDropdownOpen(false);
                }}
                aria-label={strings.clearSearch}
                className="absolute right-2 flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-[#4B6356] hover:bg-[#E7EFEA] hover:text-[#111C16] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#15803D]"
              >
                <X className="h-3.5 w-3.5" />
                <span>{strings.clearSearch}</span>
              </button>
            )}
          </div>

          {dropdownOpen && (query.trim().length > 0 || recentSearches.length > 0) && (
            <div className="absolute left-0 right-0 mt-1.5 rounded-lg border border-[#DCE4DF] bg-white shadow-md overflow-hidden z-40">
              {query.trim().length > 0 ? (
                suggestions.length > 0 ? (
                  <div>
                    <div className="px-3.5 py-2 border-b border-[#E9EFEA] text-xs text-[#556B5F]">
                      {strings.searchHint}
                    </div>
                    <ul className="max-h-72 overflow-y-auto divide-y divide-[#EEF3EF]">
                      {suggestions.map((item) => (
                        <li key={item.key}>
                          <button
                            type="button"
                            onMouseDown={(e) => {
                              e.preventDefault();
                              handleChooseSuggestion(item);
                            }}
                            className="w-full flex items-center justify-between gap-3 px-3.5 py-2.5 text-left hover:bg-[#F1F5F2] transition-colors"
                          >
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-[#111C16] truncate">{item.title}</p>
                              <p className="text-xs text-[#556B5F] truncate tabular-nums">{item.meta}</p>
                            </div>
                            <ArrowRight className="h-4 w-4 shrink-0 text-[#15803D]" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <div className="px-4 py-4 text-sm text-[#556B5F]">{strings.noSearchResults}</div>
                )
              ) : (
                <div className="p-3">
                  <p className="text-xs font-semibold text-[#556B5F] mb-2">{strings.recentSearches}</p>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.slice(0, 6).map((term) => (
                      <button
                        key={term}
                        type="button"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          handleChooseRecent(term);
                        }}
                        className="inline-flex items-center gap-1.5 rounded-md border border-[#DCE4DF] bg-[#F7F9F8] px-2.5 py-1 text-xs font-medium text-[#2A3D32] hover:bg-[#E8F3EC] hover:border-[#15803D]/40 whitespace-nowrap"
                      >
                        <Clock className="h-3 w-3 text-[#556B5F]" />
                        <span>{term}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Zone 3: Prominent Multilingual Language Switcher */}
        <div
          role="group"
          aria-label={strings.languageLabel}
          className="order-2 lg:order-3 flex items-center rounded-lg border border-[#DCE4DF] bg-[#F7F9F8] p-1 shrink-0"
        >
          {LANG_OPTIONS.map((opt) => {
            const active = language === opt.code;
            return (
              <button
                key={opt.code}
                type="button"
                onClick={() => onChangeLanguage(opt.code)}
                aria-pressed={active}
                className={`px-2.5 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#15803D] ${
                  active
                    ? 'bg-[#15803D] text-white'
                    : 'text-[#31443A] hover:text-[#111C16] hover:bg-[#EAEFEA]'
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};

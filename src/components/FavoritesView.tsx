import React, { useState } from 'react';
import { Bell, Bookmark, CheckCheck, Clock, Plus, Trash2 } from 'lucide-react';
import {
  CropInfo,
  Language,
  MarketLocation,
  PriceAlertRule,
  PriceNotification,
} from '../types/farm';
import { AppStrings } from '../i18n/translations';

interface FavoritesViewProps {
  language: Language;
  strings: AppStrings;
  crops: CropInfo[];
  markets: MarketLocation[];
  favoriteCropIds: string[];
  favoriteMarketIds: string[];
  recentSearches: string[];
  alertRules: PriceAlertRule[];
  notifications: PriceNotification[];
  onToggleFavoriteCrop: (cropId: string) => void;
  onToggleFavoriteMarket: (marketId: string) => void;
  onInspectCrop: (cropId: string) => void;
  onClearRecentSearches: () => void;
  onAddAlertRule: (cropId: string, targetPricePerKg: number) => void;
  onRemoveAlertRule: (ruleId: string) => void;
  onMarkNotificationsRead: () => void;
}

export const FavoritesView: React.FC<FavoritesViewProps> = ({
  language,
  strings,
  crops,
  markets,
  favoriteCropIds,
  favoriteMarketIds,
  recentSearches,
  alertRules,
  notifications,
  onToggleFavoriteCrop,
  onToggleFavoriteMarket,
  onInspectCrop,
  onClearRecentSearches,
  onAddAlertRule,
  onRemoveAlertRule,
  onMarkNotificationsRead,
}) => {
  const [alertCropId, setAlertCropId] = useState('tomato');
  const [targetPrice, setTargetPrice] = useState('30');

  const favCrops = crops.filter((c) => favoriteCropIds.includes(c.id));
  const favMarkets = markets.filter((m) => favoriteMarketIds.includes(m.id));

  const handleCreateAlert = (e: React.FormEvent) => {
    e.preventDefault();
    const numeric = Number(targetPrice);
    if (!Number.isFinite(numeric) || numeric <= 0) return;
    onAddAlertRule(alertCropId, numeric);
  };

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-[#DCE4DF] bg-white p-6">
        <h1 className="font-display text-xl sm:text-2xl font-bold text-[#111C16]">
          {strings.favorites.title}
        </h1>
        <p className="mt-1 text-sm text-[#556B5F]">{strings.favorites.subtitle}</p>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Favorite Crops */}
        <section className="rounded-xl border border-[#DCE4DF] bg-white p-6 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#E9EFEA]">
            <Bookmark className="h-4 w-4 text-[#15803D]" />
            <h2 className="font-display text-base font-bold text-[#111C16]">
              {strings.favorites.favoriteCropsTitle}
            </h2>
          </div>

          {favCrops.length === 0 ? (
            <p className="text-sm text-[#556B5F] py-4">{strings.favorites.noFavoriteCrops}</p>
          ) : (
            <ul className="divide-y divide-[#EEF3EF]">
              {favCrops.map((crop) => (
                <li key={crop.id} className="py-3 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => onInspectCrop(crop.id)}
                    className="text-left hover:text-[#15803D]"
                  >
                    <p className="text-sm font-semibold text-[#111C16]">{crop.name[language]}</p>
                    <p className="font-mono tabular-nums text-xs text-[#556B5F]">
                      ₹{crop.basePricePerKg} {strings.common.perKg}
                    </p>
                  </button>
                  <button
                    type="button"
                    onClick={() => onToggleFavoriteCrop(crop.id)}
                    className="text-xs font-semibold text-[#DC2626] hover:underline whitespace-nowrap"
                  >
                    {strings.common.remove}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Favorite Markets */}
        <section className="rounded-xl border border-[#DCE4DF] bg-white p-6 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#E9EFEA]">
            <Bookmark className="h-4 w-4 text-[#15803D]" />
            <h2 className="font-display text-base font-bold text-[#111C16]">
              {strings.favorites.favoriteMarketsTitle}
            </h2>
          </div>

          {favMarkets.length === 0 ? (
            <p className="text-sm text-[#556B5F] py-4">{strings.favorites.noFavoriteMarkets}</p>
          ) : (
            <ul className="divide-y divide-[#EEF3EF]">
              {favMarkets.map((mkt) => (
                <li key={mkt.id} className="py-3 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-[#111C16]">{mkt.name[language]}</p>
                    <p className="text-xs text-[#556B5F]">
                      {mkt.city}, {mkt.state}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onToggleFavoriteMarket(mkt.id)}
                    className="text-xs font-semibold text-[#DC2626] hover:underline whitespace-nowrap"
                  >
                    {strings.common.remove}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {/* Price Alert Rules & Triggered Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="rounded-xl border border-[#DCE4DF] bg-white p-6 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#E9EFEA]">
            <Bell className="h-4 w-4 text-[#15803D]" />
            <h2 className="font-display text-base font-bold text-[#111C16]">
              {strings.favorites.alertsTitle}
            </h2>
          </div>

          <form onSubmit={handleCreateAlert} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
            <div className="sm:col-span-5">
              <label htmlFor="alert-crop" className="block text-xs font-semibold text-[#465B4F] mb-1">
                {strings.favorites.alertCropLabel}
              </label>
              <select
                id="alert-crop"
                value={alertCropId}
                onChange={(e) => setAlertCropId(e.target.value)}
                className="h-10 w-full rounded-lg border border-[#DCE4DF] bg-[#F7F9F8] px-3 text-sm text-[#111C16]"
              >
                {crops.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name[language]}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-4">
              <label
                htmlFor="alert-target"
                className="block text-xs font-semibold text-[#465B4F] mb-1"
              >
                {strings.favorites.alertTargetLabel}
              </label>
              <input
                id="alert-target"
                type="number"
                min="1"
                step="1"
                value={targetPrice}
                onChange={(e) => setTargetPrice(e.target.value)}
                className="h-10 w-full rounded-lg border border-[#DCE4DF] bg-[#F7F9F8] px-3 font-mono tabular-nums text-sm text-[#111C16]"
              />
            </div>

            <div className="sm:col-span-3">
              <button
                type="submit"
                className="inline-flex h-10 w-full items-center justify-center gap-1.5 rounded-lg bg-[#15803D] px-3 text-xs font-semibold text-white hover:bg-[#166534] whitespace-nowrap"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>{strings.favorites.addAlertBtn}</span>
              </button>
            </div>
          </form>

          {alertRules.length > 0 && (
            <ul className="divide-y divide-[#EEF3EF] pt-2">
              {alertRules.map((rule) => {
                const c = crops.find((item) => item.id === rule.cropId);
                return (
                  <li key={rule.id} className="py-2.5 flex items-center justify-between text-sm">
                    <span className="font-medium text-[#111C16]">
                      {c?.name[language] ?? rule.cropId} ·{' '}
                      <span className="font-mono tabular-nums text-[#15803D]">
                        ≥ ₹{rule.targetPricePerKg} {strings.common.perKg}
                      </span>
                    </span>
                    <button
                      type="button"
                      onClick={() => onRemoveAlertRule(rule.id)}
                      aria-label={strings.common.remove}
                      className="text-[#556B5F] hover:text-[#DC2626]"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        {/* Triggered Notifications */}
        <section className="rounded-xl border border-[#DCE4DF] bg-white p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E9EFEA]">
            <h2 className="font-display text-base font-bold text-[#111C16]">
              {strings.favorites.notificationsTitle}
            </h2>
            {notifications.some((n) => !n.read) && (
              <button
                type="button"
                onClick={onMarkNotificationsRead}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#15803D] hover:underline"
              >
                <CheckCheck className="h-3.5 w-3.5" />
                <span>{strings.favorites.markAllRead}</span>
              </button>
            )}
          </div>

          {notifications.length === 0 ? (
            <p className="text-sm text-[#556B5F] py-4">{strings.favorites.noNotifications}</p>
          ) : (
            <ul className="divide-y divide-[#EEF3EF]">
              {notifications.map((n) => {
                const c = crops.find((item) => item.id === n.cropId);
                return (
                  <li
                    key={n.id}
                    className={`py-3 flex items-start justify-between gap-3 ${
                      n.read ? 'opacity-70' : ''
                    }`}
                  >
                    <div>
                      <p className="text-sm font-semibold text-[#111C16]">
                        {c?.name[language] ?? n.cropId} — {n.marketName}
                      </p>
                      <p className="mt-0.5 font-mono tabular-nums text-xs text-[#15803D]">
                        ₹{n.currentPricePerKg} {strings.common.perKg} (Target: ₹
                        {n.targetPricePerKg})
                      </p>
                    </div>
                    {!n.read && (
                      <span className="text-xs font-semibold text-[#15803D] whitespace-nowrap">
                        New
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>

      {/* Recent Searches */}
      <section className="rounded-xl border border-[#DCE4DF] bg-white p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#E9EFEA]">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-[#15803D]" />
            <h2 className="font-display text-base font-bold text-[#111C16]">
              {strings.favorites.recentSearchesTitle}
            </h2>
          </div>
          {recentSearches.length > 0 && (
            <button
              type="button"
              onClick={onClearRecentSearches}
              className="text-xs font-semibold text-[#DC2626] hover:underline"
            >
              {strings.favorites.clearRecent}
            </button>
          )}
        </div>

        {recentSearches.length === 0 ? (
          <p className="text-sm text-[#556B5F]">{strings.favorites.noRecentSearches}</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {recentSearches.map((term) => (
              <span
                key={term}
                className="rounded-md border border-[#DCE4DF] bg-[#F7F9F8] px-3 py-1.5 text-xs font-medium text-[#1D2D24]"
              >
                {term}
              </span>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

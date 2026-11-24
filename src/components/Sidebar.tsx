import React from 'react';
import {
  LayoutDashboard,
  Sprout,
  Tag,
  Scale,
  Calculator,
  CloudSun,
  Mic,
  Package,
  Bookmark,
  User,
  X,
} from 'lucide-react';
import { SectionId } from '../types/farm';
import { AppStrings } from '../i18n/translations';

interface SidebarProps {
  activeSection: SectionId;
  onSelectSection: (section: SectionId) => void;
  strings: AppStrings;
  unreadNotificationsCount: number;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

const SECTION_ITEMS: Array<{ id: SectionId; icon: React.ComponentType<{ className?: string }> }> = [
  { id: 'dashboard', icon: LayoutDashboard },
  { id: 'crop-info', icon: Sprout },
  { id: 'market-prices', icon: Tag },
  { id: 'market-comparison', icon: Scale },
  { id: 'profit-calculator', icon: Calculator },
  { id: 'weather', icon: CloudSun },
  { id: 'voice-assistant', icon: Mic },
  { id: 'products', icon: Package },
  { id: 'favorites', icon: Bookmark },
  { id: 'profile', icon: User },
];

export const Sidebar: React.FC<SidebarProps> = ({
  activeSection,
  onSelectSection,
  strings,
  unreadNotificationsCount,
  mobileOpen,
  onCloseMobile,
}) => {
  const handlePick = (id: SectionId) => {
    onSelectSection(id);
    onCloseMobile();
  };

  const navContent = (
    <div className="flex h-full flex-col bg-white border-r border-[#DCE4DF]">
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#DCE4DF]">
        <button
          type="button"
          onClick={() => handlePick('dashboard')}
          className="flex items-center gap-2.5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#15803D] rounded-lg"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#15803D] text-white">
            <Sprout className="h-5 w-5" />
          </span>
          <span className="font-display text-base font-bold tracking-tight text-[#111C16] whitespace-nowrap">
            {strings.brandName}
          </span>
        </button>
        <button
          type="button"
          onClick={onCloseMobile}
          aria-label={strings.common.close}
          className="lg:hidden flex h-9 w-9 items-center justify-center rounded-lg text-[#4B5E53] hover:bg-[#F1F5F2] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#15803D]"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <nav aria-label="Primary Navigation" className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {SECTION_ITEMS.map(({ id, icon: Icon }) => {
          const isActive = activeSection === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => handlePick(id)}
              aria-current={isActive ? 'page' : undefined}
              className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#15803D] ${
                isActive
                  ? 'bg-[#15803D] text-white'
                  : 'text-[#31443A] hover:bg-[#F1F5F2] hover:text-[#111C16]'
              }`}
            >
              <span className="flex items-center gap-3 min-w-0">
                <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-white' : 'text-[#4B6356]'}`} />
                <span className="truncate whitespace-nowrap">{strings.nav[id]}</span>
              </span>
              {id === 'favorites' && unreadNotificationsCount > 0 && (
                <span
                  className={`font-mono tabular-nums text-xs font-semibold shrink-0 ${
                    isActive ? 'text-white' : 'text-[#15803D]'
                  }`}
                >
                  {unreadNotificationsCount}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="px-5 py-4 border-t border-[#DCE4DF] text-xs text-[#556B5F]">
        <p className="font-medium text-[#2A3D32]">{strings.brandName}</p>
        <p className="mt-0.5 leading-relaxed">{strings.brandSubtitle}</p>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden lg:block lg:w-64 lg:shrink-0 lg:sticky lg:top-0 lg:h-screen">
        {navContent}
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-[#111C16]/40"
            onClick={onCloseMobile}
            aria-hidden="true"
          />
          <div className="relative z-10 w-72 max-w-[82vw] h-full shadow-lg">
            {navContent}
          </div>
        </div>
      )}
    </>
  );
};

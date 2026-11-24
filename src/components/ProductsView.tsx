import React, { useState } from 'react';
import { ArrowRight, Calculator } from 'lucide-react';
import { CropInfo, Language } from '../types/farm';
import { AppStrings } from '../i18n/translations';

interface ProductsViewProps {
  language: Language;
  strings: AppStrings;
  crops: CropInfo[];
  onInspectCrop: (cropId: string) => void;
  onCalculateProfit: (cropId: string) => void;
}

export const ProductsView: React.FC<ProductsViewProps> = ({
  language,
  strings,
  crops,
  onInspectCrop,
  onCalculateProfit,
}) => {
  const [filter, setFilter] = useState<'all' | 'vegetable' | 'other'>('all');

  const visibleCrops = crops.filter((c) => {
    if (filter === 'vegetable') return c.category === 'vegetable';
    if (filter === 'other') return c.category !== 'vegetable';
    return true;
  });

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-[#DCE4DF] bg-white p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-display text-xl sm:text-2xl font-bold text-[#111C16]">
              {strings.products.title}
            </h1>
            <p className="mt-1 text-sm text-[#556B5F]">{strings.products.subtitle}</p>
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
                onClick={() => setFilter(tab.id)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                  filter === tab.id
                    ? 'bg-[#15803D] text-white'
                    : 'text-[#31443A] hover:bg-[#EAF1EC]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {visibleCrops.map((crop) => (
          <article
            key={crop.id}
            className="flex flex-col justify-between rounded-xl border border-[#DCE4DF] bg-white p-5 space-y-4"
          >
            <div>
              <div className="flex items-baseline justify-between gap-2">
                <h2 className="font-display text-lg font-bold text-[#111C16]">
                  {crop.name[language]}
                </h2>
                <span className="font-mono tabular-nums text-base font-bold text-[#15803D]">
                  ₹{crop.basePricePerKg} {strings.common.perKg}
                </span>
              </div>

              <p className="mt-1 text-xs text-[#556B5F]">
                {crop.variety[language]} · {strings.demand[crop.demand]}
              </p>

              <dl className="mt-4 space-y-2 border-t border-[#EEF3EF] pt-3 text-xs">
                <div className="flex justify-between gap-2">
                  <dt className="text-[#556B5F]">{strings.products.gradeLabel}</dt>
                  <dd className="font-medium text-[#111C16] text-right">
                    {crop.qualityGrade[language]}
                  </dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt className="text-[#556B5F]">{strings.products.shelfLifeLabel}</dt>
                  <dd className="font-mono tabular-nums font-medium text-[#111C16]">
                    {crop.shelfLifeDays} {strings.cropInfo.daysUnit}
                  </dd>
                </div>
              </dl>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-[#EEF3EF]">
              <button
                type="button"
                onClick={() => onInspectCrop(crop.id)}
                className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#15803D] px-3 py-2 text-xs font-semibold text-white hover:bg-[#166534] transition-colors whitespace-nowrap"
              >
                <span>{strings.common.viewDetails}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onCalculateProfit(crop.id)}
                className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-[#DCE4DF] bg-[#F7F9F8] px-3 py-2 text-xs font-semibold text-[#1D2D24] hover:bg-[#EAF1EC] transition-colors whitespace-nowrap"
              >
                <Calculator className="h-3.5 w-3.5 text-[#15803D]" />
                <span>{strings.common.calculateProfit}</span>
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { CheckCircle2, HelpCircle, Info, User } from 'lucide-react';
import { FarmerProfile } from '../types/farm';
import { AppStrings } from '../i18n/translations';

interface ProfileViewProps {
  strings: AppStrings;
  profile: FarmerProfile;
  onSaveProfile: (next: FarmerProfile) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ strings, profile, onSaveProfile }) => {
  const [draft, setDraft] = useState<FarmerProfile>(profile);
  const [savedNotice, setSavedNotice] = useState(false);
  const [avatarError, setAvatarError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile({
      ...draft,
      name: draft.name.trim() || 'Farmer',
      villageOrTown: draft.villageOrTown.trim() || 'Chennai',
      state: draft.state.trim() || 'Tamil Nadu',
    });
    setSavedNotice(true);
    window.setTimeout(() => setSavedNotice(false), 3000);
  };

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-[#DCE4DF] bg-white p-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-5 pb-6 border-b border-[#E9EFEA]">
          <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-[#DCE4DF] bg-[#ECF5EF]">
            {!avatarError ? (
              <img
                src="/src/assets/images/farmer_profile_avatar_1795426916447.jpg"
                alt="Farmer profile portrait"
                referrerPolicy="no-referrer"
                onError={() => setAvatarError(true)}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-[#15803D]">
                <User className="h-9 w-9" />
              </div>
            )}
          </div>
          <div>
            <h1 className="font-display text-xl sm:text-2xl font-bold text-[#111C16]">
              {strings.profile.title}
            </h1>
            <p className="mt-1 text-sm text-[#556B5F]">{strings.profile.subtitle}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <h2 className="font-display text-base font-bold text-[#111C16]">
            {strings.profile.farmerDetailsTitle}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="prof-name" className="block text-xs font-semibold text-[#465B4F] mb-1.5">
                {strings.profile.nameLabel}
              </label>
              <input
                id="prof-name"
                type="text"
                value={draft.name}
                onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                className="h-10 w-full rounded-lg border border-[#DCE4DF] bg-[#F7F9F8] px-3 text-sm text-[#111C16] focus:border-[#15803D] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#15803D]/20"
              />
            </div>

            <div>
              <label
                htmlFor="prof-location"
                className="block text-xs font-semibold text-[#465B4F] mb-1.5"
              >
                {strings.profile.locationLabel}
              </label>
              <input
                id="prof-location"
                type="text"
                value={draft.villageOrTown}
                onChange={(e) => setDraft({ ...draft, villageOrTown: e.target.value })}
                className="h-10 w-full rounded-lg border border-[#DCE4DF] bg-[#F7F9F8] px-3 text-sm text-[#111C16] focus:border-[#15803D] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#15803D]/20"
              />
            </div>

            <div>
              <label htmlFor="prof-state" className="block text-xs font-semibold text-[#465B4F] mb-1.5">
                {strings.profile.stateLabel}
              </label>
              <input
                id="prof-state"
                type="text"
                value={draft.state}
                onChange={(e) => setDraft({ ...draft, state: e.target.value })}
                className="h-10 w-full rounded-lg border border-[#DCE4DF] bg-[#F7F9F8] px-3 text-sm text-[#111C16] focus:border-[#15803D] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#15803D]/20"
              />
            </div>

            <div>
              <label htmlFor="prof-acres" className="block text-xs font-semibold text-[#465B4F] mb-1.5">
                {strings.profile.farmSizeLabel}
              </label>
              <input
                id="prof-acres"
                type="text"
                value={draft.farmSizeAcres}
                onChange={(e) => setDraft({ ...draft, farmSizeAcres: e.target.value })}
                className="h-10 w-full rounded-lg border border-[#DCE4DF] bg-[#F7F9F8] px-3 font-mono tabular-nums text-sm text-[#111C16] focus:border-[#15803D] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#15803D]/20"
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="prof-notes" className="block text-xs font-semibold text-[#465B4F] mb-1.5">
                {strings.profile.notesLabel}
              </label>
              <textarea
                id="prof-notes"
                rows={2}
                value={draft.notes}
                onChange={(e) => setDraft({ ...draft, notes: e.target.value })}
                className="w-full rounded-lg border border-[#DCE4DF] bg-[#F7F9F8] p-3 text-sm text-[#111C16] focus:border-[#15803D] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#15803D]/20"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <button
              type="submit"
              className="rounded-lg bg-[#15803D] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#166534] transition-colors whitespace-nowrap"
            >
              {strings.profile.saveProfileBtn}
            </button>

            {savedNotice && (
              <span className="inline-flex items-center gap-1.5 text-sm font-medium text-[#15803D]">
                <CheckCircle2 className="h-4 w-4" />
                <span>{strings.profile.profileSavedToast}</span>
              </span>
            )}
          </div>
        </form>
      </section>

      {/* Help & Support */}
      <section className="rounded-xl border border-[#DCE4DF] bg-white p-6 space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-[#E9EFEA]">
          <HelpCircle className="h-4 w-4 text-[#15803D]" />
          <h2 className="font-display text-base font-bold text-[#111C16]">
            {strings.profile.helpTitle}
          </h2>
        </div>

        <div className="divide-y divide-[#EEF3EF]">
          {strings.profile.faqs.map((item) => (
            <div key={item.q} className="py-3.5">
              <h3 className="text-sm font-bold text-[#111C16]">{item.q}</h3>
              <p className="mt-1 text-sm text-[#465B4F] leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* About & Data Accuracy Policy */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-xl border border-[#DCE4DF] bg-white p-6">
          <div className="flex items-center gap-2 pb-3 border-b border-[#E9EFEA]">
            <Info className="h-4 w-4 text-[#15803D]" />
            <h2 className="font-display text-base font-bold text-[#111C16]">
              {strings.profile.aboutTitle}
            </h2>
          </div>
          <p className="mt-3 text-sm text-[#465B4F] leading-relaxed">
            {strings.profile.aboutBody}
          </p>
        </div>

        <div className="rounded-xl border border-[#DCE4DF] bg-white p-6">
          <div className="flex items-center gap-2 pb-3 border-b border-[#E9EFEA]">
            <Info className="h-4 w-4 text-[#15803D]" />
            <h2 className="font-display text-base font-bold text-[#111C16]">
              {strings.profile.dataPolicyTitle}
            </h2>
          </div>
          <p className="mt-3 text-sm text-[#465B4F] leading-relaxed">
            {strings.profile.dataPolicyBody}
          </p>
        </div>
      </section>
    </div>
  );
};

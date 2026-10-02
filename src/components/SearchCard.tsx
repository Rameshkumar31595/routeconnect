import { Calendar } from 'lucide-react';
import LocationInput from './LocationInput';

interface SearchCardProps {
  from: string;
  to: string;
  date: string;
  onFromChange: (value: string) => void;
  onCurrentLocation: (latitude: number, longitude: number) => void;
  onToChange: (value: string) => void;
  onDateChange: (value: string) => void;
  onSwapLocations: () => void;
  onSearch: () => void;
  loading: boolean;
  isValid: boolean;
}

export default function SearchCard({
  from,
  to,
  date,
  onFromChange,
  onCurrentLocation,
  onToChange,
  onDateChange,
  onSwapLocations,
  onSearch,
  loading,
  isValid,
}: SearchCardProps) {
  return (
    <div className="w-full bg-[#F8FAF9] p-6 md:p-8 border border-[#D9DED9] rounded-xl shadow-sm">
      <div className="mb-6">
        <p className="text-xs uppercase tracking-[0.2em] font-extrabold text-[#146B5B]">Journey Planner</p>
        <h2 className="mt-1 text-2xl font-black text-[#1F2933]">Find travel routes across India</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* From & To Group with Centered Overlapping Swap Button */}
        <div className="lg:col-span-9 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-0 relative items-start">
          {/* From Location */}
          <div className="md:pr-3">
            <LocationInput
              label="From"
              placeholder="Enter starting location..."
              value={from}
              onChange={onFromChange}
              onCurrentLocation={onCurrentLocation}
            />
          </div>
          
          {/* Absolute Overlapping Swap Button for Desktop */}
          <div className="hidden md:block absolute left-1/2 top-[34px] -translate-x-1/2 z-10">
            <button
              type="button"
              onClick={onSwapLocations}
              title="Swap Locations"
              className="rounded-full border border-[#D9DED9] bg-white hover:bg-gray-50 text-[#146B5B] transition flex items-center justify-center font-black h-9 w-9 shadow-sm hover:shadow-md shrink-0"
            >
              ⇅
            </button>
          </div>

          {/* To Location */}
          <div className="md:pl-3">
            <LocationInput
              label="To"
              placeholder="Enter destination..."
              value={to}
              onChange={onToChange}
            />
          </div>

          {/* Swap Button helper for mobile (visible under stacked layout) */}
          <div className="flex md:hidden justify-center py-1">
            <button
              type="button"
              onClick={onSwapLocations}
              className="px-4 py-1.5 rounded-full border border-[#D9DED9] bg-white text-xs font-bold text-[#146B5B]"
            >
              ⇅ Swap Locations
            </button>
          </div>
        </div>

        {/* Travel Date */}
        <div className="lg:col-span-3 space-y-2">
          <label className="block text-sm font-bold text-[#1F2933]">Date</label>
          <div className="relative">
            <Calendar className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#667085]" />
            <input
              type="date"
              value={date}
              onChange={(e) => onDateChange(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full pl-11 pr-4 py-3 text-sm font-semibold text-[#1F2933] border border-[#D9DED9] rounded-xl bg-white shadow-sm focus:border-[#146B5B] focus:ring-1 focus:ring-[#146B5B] outline-none transition"
              required
            />
          </div>
        </div>
      </div>

      {/* Find All Routes Button */}
      <div className="mt-6 flex justify-end">
        <button
          type="button"
          onClick={onSearch}
          disabled={!isValid || loading}
          className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl bg-[#146B5B] hover:bg-[#0f5447] text-white px-8 py-3.5 text-sm font-extrabold shadow-md hover:shadow-lg transition disabled:cursor-not-allowed disabled:opacity-40"
        >
          {loading ? 'Searching...' : 'Find All Routes'}
        </button>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { ChevronDown, ChevronUp, Map, Bookmark } from 'lucide-react';
import type { RouteResult } from '../services/routeService';
import RouteMap from './RouteMap';

const MODE_CONFIG = {
  train: { label: 'Train', icon: '🚆' },
  bus: { label: 'Bus', icon: '🚌' },
  rapido: { label: 'Rapido', icon: '🛵' },
  uber: { label: 'Uber', icon: '🚗' },
  walking: { label: 'Walking', icon: '🚶' }
};

export default function RouteCard({ route }: { route: RouteResult }) {
  const [showDetails, setShowDetails] = useState(false);
  const [showMap, setShowMap] = useState(false);

  const formatDuration = (mins: number) => {
    const hours = Math.floor(mins / 60);
    const minutes = mins % 60;
    return `${hours > 0 ? `${hours}h ` : ''}${minutes}m`;
  };

  const getEstimatedCostLabel = (price: number) => {
    if (price < 150) return 'Very Low Cost';
    if (price < 400) return 'Moderate Cost';
    if (price < 1000) return 'Standard Fare';
    return 'Premium Fare';
  };

  const departure = route.segments.find(s => s.departure)?.departure || '09:00 AM';
  const arrival = [...route.segments].reverse().find(s => s.arrival)?.arrival || '12:10 PM';

  // Desktop Sequence vs Mobile Sequence
  const renderModeChain = () => {
    return (
      <div>
        {/* Desktop View */}
        <div className="hidden sm:flex items-center gap-2 flex-wrap text-lg md:text-xl font-bold text-[#1F2933]">
          {route.segments.map((seg, idx) => {
            const config = MODE_CONFIG[seg.mode as keyof typeof MODE_CONFIG] || MODE_CONFIG.walking;
            let displayLabel = config.label;
            
            if (seg.mode === 'train') {
              displayLabel = seg.trainName || 'Express Train';
            } else if (seg.mode === 'bus') {
              displayLabel = seg.serviceName ? `APSRTC ${seg.serviceName}` : 'APSRTC Bus';
            }

            return (
              <div key={idx} className="flex items-center gap-1.5">
                <span>{config.icon}</span>
                <span className="text-[#1F2933]">{displayLabel}</span>
                {idx < route.segments.length - 1 && <span className="text-[#667085] mx-1">→</span>}
              </div>
            );
          })}
        </div>

        {/* Mobile View (Icons only) */}
        <div className="flex sm:hidden items-center gap-1 text-lg font-bold text-[#1F2933]">
          {route.segments.map((seg, idx) => {
            const config = MODE_CONFIG[seg.mode as keyof typeof MODE_CONFIG] || MODE_CONFIG.walking;
            return (
              <div key={idx} className="flex items-center gap-1">
                <span>{config.icon}</span>
                {idx < route.segments.length - 1 && <span className="text-[#667085] text-xs">→</span>}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const getTagBadge = () => {
    if (route.tag === 'best') {
      return (
        <span className="inline-flex items-center gap-1 rounded bg-[#E5A93D] px-2.5 py-1 text-[10px] font-black uppercase text-white tracking-wider">
          🏆 RECOMMENDED
        </span>
      );
    }
    if (route.tag === 'cheapest') {
      return (
        <span className="inline-flex items-center gap-1 rounded bg-[#146B5B] px-2.5 py-1 text-[10px] font-black uppercase text-white tracking-wider">
          💰 CHEAPEST
        </span>
      );
    }
    if (route.tag === 'fastest') {
      return (
        <span className="inline-flex items-center gap-1 rounded bg-[#667085] px-2.5 py-1 text-[10px] font-black uppercase text-white tracking-wider">
          ⚡ FASTEST
        </span>
      );
    }
    return null;
  };

  const handleSaveRoute = () => {
    try {
      const savedRoutes = JSON.parse(localStorage.getItem('saved_routes') || '[]');
      const newRoute = {
        id: route.id,
        from: route.from,
        to: route.to,
        price: route.totalPrice,
        duration: route.totalDurationMinutes,
        transfers: route.totalTransfers,
        modes: route.segments.map(s => s.mode)
      };
      const isDup = savedRoutes.some((r: any) => r.id === route.id);
      if (!isDup) {
        savedRoutes.push(newRoute);
        localStorage.setItem('saved_routes', JSON.stringify(savedRoutes));
      }
      alert('This route itinerary has been successfully pinned to your saved journeys.');
    } catch (e) {
      console.error('Failed to save route to localStorage:', e);
    }
  };

  const renderTimeline = () => {
    const totalDist = route.segments.reduce((acc, s) => acc + s.distanceKm, 0);
    return (
      <div className="mt-6 border-t border-[#D9DED9] pt-6 space-y-6">
        
        {/* Timeline Start City */}
        <div className="font-extrabold text-sm text-[#1F2933] flex items-center gap-2.5">
          <span className="h-2 w-2 rounded-full bg-[#146B5B]" />
          <span>{route.from}</span>
        </div>

        {/* Dynamic legs */}
        {route.segments.map((seg, idx) => {
          const config = MODE_CONFIG[seg.mode as keyof typeof MODE_CONFIG] || MODE_CONFIG.walking;
          const waitTime = idx > 0 ? '10 min transfer buffer' : null;
          
          let cardTitle = config.label;
          if (seg.mode === 'train') {
            cardTitle = seg.trainName || 'Express Train';
          } else if (seg.mode === 'bus') {
            cardTitle = seg.serviceName ? `APSRTC ${seg.serviceName}` : 'APSRTC Bus';
          }

          return (
            <div key={idx} className="pl-1 relative">
              <div className="absolute left-1 top-0 bottom-0 w-[1px] bg-[#D9DED9]" />

              <div className="pl-6 space-y-2">
                {waitTime && (
                  <p className="text-[11px] text-[#667085] italic font-semibold">
                    ⏳ {waitTime}
                  </p>
                )}

                {/* Card detailing segment parameters */}
                <div className="bg-white border border-[#D9DED9] p-4 rounded-xl space-y-2.5">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-bold text-[#1F2933] flex items-center gap-1">
                        <span>{config.icon}</span>
                        <span>{cardTitle}</span>
                      </p>
                      {seg.mode === 'train' && seg.trainNumber && (
                        <p className="text-[10px] text-[#667085] font-black uppercase mt-0.5">
                          Train No: {seg.trainNumber}
                        </p>
                      )}
                      {seg.mode === 'bus' && seg.serviceName && (
                        <p className="text-[10px] text-[#667085] font-black uppercase mt-0.5">
                          Service: {seg.serviceName}
                        </p>
                      )}
                      <p className="text-xs text-[#667085] font-semibold mt-1">
                        {seg.from} → {seg.to}
                      </p>
                    </div>
                    <span className="text-sm font-black text-[#146B5B]">₹{seg.price}</span>
                  </div>

                  <div className="flex gap-4 text-xs text-[#667085] font-medium">
                    <span>⏱ {formatDuration(seg.durationMinutes)}</span>
                    <span>📍 {seg.distanceKm} km</span>
                    {seg.departure && (
                      <span className="font-bold text-[#1F2933]">
                        🕒 {seg.departure} - {seg.arrival}
                      </span>
                    )}
                  </div>

                  {/* Intermediate stops list */}
                  {seg.stops && (
                    <div className="mt-2 pt-2 border-t border-[#D9DED9] space-y-1">
                      <p className="text-[9px] uppercase font-black text-[#667085] tracking-wider">Stops Timeline</p>
                      <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-semibold text-[#1F2933]">
                        <span>{seg.from.replace(' Junction', '').replace(' Railway Station', '')}</span>
                        {seg.stops.split(',').map((stop, sIdx) => (
                          <div key={sIdx} className="flex items-center gap-1.5">
                            <span className="text-[#667085] text-xs">↓</span>
                            <span>{stop.trim()}</span>
                          </div>
                        ))}
                        <span className="text-[#667085] text-xs">↓</span>
                        <span>{seg.to.replace(' Junction', '').replace(' Railway Station', '')}</span>
                      </div>
                    </div>
                  )}

                  {/* Train ticket classes */}
                  {seg.mode === 'train' && (
                    <div className="mt-2 pt-2 border-t border-[#D9DED9] flex flex-wrap gap-2 text-[10px] text-[#667085] font-bold">
                      <span className="bg-gray-50 border border-[#D9DED9] px-2 py-0.5 rounded">General: ₹80</span>
                      <span className="bg-[#146B5B]/10 border border-[#146B5B]/20 text-[#146B5B] px-2 py-0.5 rounded">Sleeper: ₹{seg.price}</span>
                      <span className="bg-gray-50 border border-[#D9DED9] px-2 py-0.5 rounded">3A: ₹{seg.price * 3}</span>
                      <span className="bg-gray-50 border border-[#D9DED9] px-2 py-0.5 rounded">2A: ₹{Math.round(seg.price * 4.2)}</span>
                    </div>
                  )}
                </div>

                {/* Station target point label */}
                <div className="font-extrabold text-sm text-[#1F2933] flex items-center gap-2.5 -ml-7 pt-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-white border-2 border-[#146B5B] shrink-0" />
                  <span>{seg.to}</span>
                </div>
              </div>
            </div>
          );
        })}

        {/* Timeline Bottom Summary Section */}
        <div className="pt-6 border-t border-[#D9DED9] space-y-4">
          <p className="text-xs uppercase tracking-wider font-extrabold text-[#667085]">Total Journey Summary</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-gray-50 p-4 rounded-xl border border-[#D9DED9]">
            <div>
              <p className="text-[10px] font-extrabold text-[#667085] uppercase">Duration</p>
              <p className="text-sm font-black text-[#1F2933]">⏱ {formatDuration(route.totalDurationMinutes)}</p>
            </div>
            <div>
              <p className="text-[10px] font-extrabold text-[#667085] uppercase">Total Cost</p>
              <p className="text-sm font-black text-[#146B5B]">💰 ₹{route.totalPrice}</p>
            </div>
            <div>
              <p className="text-[10px] font-extrabold text-[#667085] uppercase">Transfers</p>
              <p className="text-sm font-black text-[#1F2933]">🔄 {route.totalTransfers} Transfer{route.totalTransfers !== 1 && 's'}</p>
            </div>
            <div>
              <p className="text-[10px] font-extrabold text-[#667085] uppercase">Distance</p>
              <p className="text-sm font-black text-[#1F2933]">📍 {totalDist.toFixed(1)} km</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={() => setShowMap(true)}
              className="flex-1 py-3 px-4 rounded-xl bg-[#146B5B] hover:bg-[#0f5447] text-white font-extrabold text-xs transition flex items-center justify-center gap-2 shadow-sm"
            >
              <Map className="h-4 w-4" /> View Route on Map
            </button>
            <button
              onClick={handleSaveRoute}
              className="flex-1 py-3 px-4 rounded-xl border border-[#D9DED9] hover:bg-gray-50 text-[#1F2933] font-bold text-xs transition flex items-center justify-center gap-2"
            >
              <Bookmark className="h-4 w-4 text-[#667085]" /> Save Route
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <article className="bg-white border border-[#D9DED9] rounded-xl p-5 md:p-6 shadow-sm hover:border-[#146B5B] transition-all">
      <div className="space-y-4">
        {/* Recommendation badge & Modes sequence */}
        <div className="flex flex-col gap-2.5">
          {route.tag && <div className="self-start">{getTagBadge()}</div>}
          {renderModeChain()}
        </div>

        {/* Departure -> Line -> Arrival timeline */}
        <div className="flex items-center gap-4 py-2">
          <div className="text-sm md:text-base font-semibold text-[#1F2933]">{departure}</div>
          <div className="flex-1 border-t-2 border-dashed border-[#D9DED9]" />
          <div className="text-sm md:text-base font-semibold text-[#1F2933]">{arrival}</div>
        </div>

        {/* Duration + Cost + Transfers grid */}
        <div className="flex justify-between items-end border-t border-[#D9DED9] pt-4">
          <div className="space-y-1">
            <p className="text-lg font-black text-[#1F2933]">{formatDuration(route.totalDurationMinutes)}</p>
            <p className="text-xs text-[#667085] font-semibold">
              {route.totalTransfers === 0 ? '0 Transfers (Direct)' : `${route.totalTransfers} Transfer${route.totalTransfers !== 1 ? 's' : ''}`}
            </p>
          </div>

          <div className="text-right space-y-1">
            <p className="text-lg font-black text-[#146B5B]">₹{route.totalPrice}</p>
            <p className="text-[11px] text-[#667085] font-bold uppercase tracking-wider">
              {getEstimatedCostLabel(route.totalPrice)}
            </p>
          </div>
        </div>

        {/* Show Details toggle */}
        <div className="pt-4 border-t border-[#D9DED9] flex justify-start">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="inline-flex items-center gap-1 text-xs font-black uppercase text-[#146B5B] hover:text-[#0f5447] transition"
          >
            <span>{showDetails ? 'Hide Details' : 'Show Details'}</span>
            {showDetails ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
        </div>

        {showDetails && renderTimeline()}
      </div>

      <RouteMap route={route} isOpen={showMap} onClose={() => setShowMap(false)} />
    </article>
  );
}

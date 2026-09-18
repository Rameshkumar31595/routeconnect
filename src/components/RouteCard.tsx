import { useState } from 'react';
import { ChevronDown, ChevronUp, Map, Bookmark, Check } from 'lucide-react';
import type { RouteResult } from '../services/routeService';
import RouteMap from './RouteMap';

const MODE_CONFIG = {
  train: { label: 'Train', icon: '🚆' },
  bus: { label: 'Bus', icon: '🚌' },
  rapido: { label: 'Rapido', icon: '🛵' },
  uber: { label: 'Uber', icon: '🚗' },
  walking: { label: 'Walking', icon: '🚶' }
};

const getModeHighlightClass = (mode: keyof typeof MODE_CONFIG) => {
  if (mode === 'train') return 'bg-amber-100 text-amber-800 border-amber-200';
  if (mode === 'rapido') return 'bg-orange-100 text-orange-800 border-orange-200';
  if (mode === 'uber') return 'bg-sky-100 text-sky-800 border-sky-200';
  return '';
};

export default function RouteCard({ route }: { route: RouteResult }) {
  const [showDetails, setShowDetails] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [saved, setSaved] = useState(false);

  const formatDuration = (mins: number) => {
    const hours = Math.floor(mins / 60);
    const minutes = mins % 60;
    return `${hours > 0 ? `${hours}h ` : ''}${minutes}m`;
  };

  const totalDist = route.distanceKm || route.segments.reduce((acc, s) => acc + s.distanceKm, 0);

  // Route Name / Type
  const routeDisplayName = route.routeName
    || (route.via ? `Via ${route.via}` : route.totalTransfers === 0 ? 'Direct Corridor' : '');
  const isDirectBus = route.totalTransfers === 0
    && route.segments.length === 1
    && route.segments[0].mode === 'bus';

  // Key status or availability badge
  const getStatusBadge = () => {
    if (route.tag === 'best') {
      return (
        <span className="inline-flex items-center gap-1 rounded-md bg-[#E5A93D] px-2 py-0.5 text-[10px] font-black uppercase text-white tracking-wider">
          ★ Recommended
        </span>
      );
    }
    if (route.tag === 'cheapest') {
      return (
        <span className="inline-flex items-center gap-1 rounded-md bg-[#146B5B] px-2 py-0.5 text-[10px] font-black uppercase text-white tracking-wider">
          💰 Best Price
        </span>
      );
    }
    if (route.tag === 'fastest') {
      return (
        <span className="inline-flex items-center gap-1 rounded-md bg-[#1F2933] px-2 py-0.5 text-[10px] font-black uppercase text-white tracking-wider">
          ⚡ Fastest
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 rounded-md bg-[#E8F1EE] px-2 py-0.5 text-[10px] font-bold text-[#146B5B]">
        ✓ {isDirectBus ? 'Direct Bus' : route.totalTransfers === 0 ? 'Direct Route' : 'Confirmed Connection'}
      </span>
    );
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
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (e) {
      console.error('Failed to save route to localStorage:', e);
    }
  };

  const firstDepartureTime = route.segments.find(s => s.departure)?.departure || '08:30 AM';
  const lastArrivalTime = [...route.segments].reverse().find(s => s.arrival)?.arrival || '11:45 AM';
  const originLabel = route.segments[0]?.from || route.from;
  const destinationLabel = route.segments[route.segments.length - 1]?.to || route.to;
  const cleanLocationName = (location: string) => location.replace(/\s+(Bus Station|Bus Stand)$/i, '');

  return (
    <article className="bg-white border border-[#D9DED9] rounded-2xl p-5 md:p-6 shadow-sm hover:border-[#146B5B]/60 transition-all">
      {/* ===== COLLAPSED STATE (Clean, simple, easy to scan) ===== */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        
        {/* Route Name, Type & Modes */}
        <div className="space-y-1.5 min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            {routeDisplayName && (
              <h3 className="text-lg md:text-xl font-black text-[#1F2933] tracking-tight">
                {routeDisplayName}
              </h3>
            )}
            {getStatusBadge()}
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-[#667085] flex-wrap">
            <span className="uppercase tracking-wider font-bold text-[10px] text-[#146B5B] bg-[#E8F1EE] px-2 py-0.5 rounded">
              {route.totalTransfers === 0 ? 'Direct' : `${route.totalTransfers} Transfer${route.totalTransfers > 1 ? 's' : ''}`}
            </span>
            <span>•</span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {route.segments.map((seg, idx) => {
                const cfg = MODE_CONFIG[seg.mode as keyof typeof MODE_CONFIG] || MODE_CONFIG.walking;
                  return (
                  <span key={idx} className={`inline-flex items-center gap-1 font-bold ${getModeHighlightClass(seg.mode as keyof typeof MODE_CONFIG)} ${getModeHighlightClass(seg.mode as keyof typeof MODE_CONFIG) ? 'rounded-md border px-2 py-1' : 'text-[#1F2933]'}`}>
                    <span>{cfg.icon}</span>
                    <span>{cfg.label}</span>
                    {idx < route.segments.length - 1 && <span className="text-[#667085] font-normal mx-0.5">→</span>}
                  </span>
                );
              })}
            </div>
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
              <span className="rounded-lg border border-blue-200 bg-blue-50 px-2.5 py-1.5 font-black text-blue-800">
                <span className="mr-1 text-[10px] uppercase tracking-wider text-blue-600">From</span>
                {cleanLocationName(originLabel)}
              </span>
              <span className="font-black text-blue-600">→</span>
              <span className="rounded-lg border border-blue-200 bg-blue-50 px-2.5 py-1.5 font-black text-blue-800">
                <span className="mr-1 text-[10px] uppercase tracking-wider text-blue-600">To</span>
                {cleanLocationName(destinationLabel)}
              </span>
            </div>
          </div>
        </div>

        {/* Essential Metrics: Time, Distance, Price, Show Details Action */}
        <div className="flex items-center justify-between md:justify-end gap-5 sm:gap-7 pt-3 md:pt-0 border-t md:border-t-0 border-[#D9DED9]/70 shrink-0">

          {/* Estimated Travel Time */}
          <div className="text-left md:text-right">
            <p className="text-[10px] text-[#667085] font-bold uppercase tracking-wider">Time</p>
            <p className="text-base md:text-lg font-black text-[#1F2933]">
              {formatDuration(route.totalDurationMinutes)}
            </p>
          </div>

          {/* Distance */}
          <div className="text-left md:text-right">
            <p className="text-[10px] text-[#667085] font-bold uppercase tracking-wider">Distance</p>
            <p className="text-base md:text-lg font-black text-[#1F2933]">
              {totalDist.toFixed(0)} km
            </p>
          </div>

          {/* Price */}
          <div className="text-left md:text-right">
            <p className="text-[10px] text-[#667085] font-bold uppercase tracking-wider">Price</p>
            <p className="text-lg md:text-xl font-black text-[#146B5B]">
              ₹{route.totalPrice}
            </p>
          </div>

          {/* Show Details Action */}
          <div>
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#146B5B] hover:text-[#0E4E42] bg-[#E8F1EE] hover:bg-[#d6e5df] px-3.5 py-2 rounded-xl transition"
              aria-expanded={showDetails}
            >
              <span>{showDetails ? 'Hide details' : 'Show details'}</span>
              {showDetails ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
          </div>

        </div>

      </div>

      {/* ===== EXPANDED STATE (Comprehensive details on demand) ===== */}
      {showDetails && (
        <div className="mt-5 pt-5 border-t border-[#D9DED9] space-y-6 animate-fadeIn">

          {/* Journey summary */}
          <div className="bg-[#E8F1EE] border border-[#146B5B]/20 rounded-xl p-4 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h4 className="text-sm font-black text-[#1F2933]">Complete Journey</h4>
              <span className="text-xs font-black text-[#146B5B]">
                {route.segments.length} bus{route.segments.length === 1 ? '' : 'es'} / {route.totalTransfers} transfer{route.totalTransfers === 1 ? '' : 's'}
              </span>
            </div>
            <div className="grid gap-2 text-xs sm:grid-cols-2">
              <p><strong>Starting point:</strong> {route.from}</p>
              <p><strong>Destination:</strong> {route.to}</p>
              <p><strong>Boarding:</strong> {route.segments[0]?.from || route.from}</p>
              <p><strong>Dropping:</strong> {route.segments[route.segments.length - 1]?.to || route.to}</p>
              <p><strong>Via / route:</strong> {route.via ? `Via ${route.via}` : 'Direct route'}</p>
              <p><strong>Total journey:</strong> {formatDuration(route.totalDurationMinutes)}</p>
            </div>
            <p className="text-sm font-black text-[#146B5B]">
              {route.villages?.join(' → ') || `${route.from} → ${route.to}`}
            </p>
          </div>
          
          {/* 1. Departure & Arrival Information */}
          <div className="bg-[#F8FAF9] border border-[#D9DED9] rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="h-3 w-3 rounded-full bg-[#146B5B] shrink-0" />
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#667085]">Departure</p>
                <p className="text-sm font-black text-[#1F2933]">
                  {firstDepartureTime} • {route.from}
                </p>
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-2 text-xs font-bold text-[#667085]">
              {route.highway && (
                <span className="bg-white border border-[#D9DED9] px-2.5 py-1 rounded-md text-[11px]">
                  🛣️ {route.highway}
                </span>
              )}
              <span>──────────►</span>
            </div>

            <div className="flex items-center gap-3 sm:text-right">
              <div className="sm:ml-auto">
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#667085]">Arrival</p>
                <p className="text-sm font-black text-[#1F2933]">
                  {lastArrivalTime} • {route.to}
                </p>
              </div>
              <div className="h-3 w-3 rounded-full border-2 border-[#146B5B] bg-white shrink-0 sm:order-last" />
            </div>
          </div>

          {/* 2. Step-by-Step Route Legs, Transfers, Providers, Waypoints & Pricing */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase font-extrabold tracking-wider text-[#667085]">
              Route Legs & Transfers Breakdown
            </h4>

            {route.segments.map((seg, idx) => {
              const cfg = MODE_CONFIG[seg.mode as keyof typeof MODE_CONFIG] || MODE_CONFIG.walking;

              let providerTitle = seg.provider;
              if (seg.mode === 'train') {
                providerTitle = seg.trainName ? `${seg.trainName} (Indian Railways)` : 'Indian Railways Express';
              } else if (seg.mode === 'bus') {
                providerTitle = seg.serviceName ? `APSRTC ${seg.serviceName}` : 'APSRTC Express Bus';
              }

              return (
                <div key={idx} className="space-y-3">
                  {/* Transfer indicator */}
                  {idx > 0 && (
                    <div className="flex items-center gap-2 text-xs font-bold text-[#146B5B] bg-[#E8F1EE] border border-[#146B5B]/20 px-3.5 py-2 rounded-lg">
                      <span>🔄</span>
                      <span>Change buses at <strong>{seg.from.replace(/\s+(Bus Station|Bus Stand)$/i, '')}</strong> (Transfer {idx} of {route.totalTransfers})</span>
                    </div>
                  )}

                  {/* Leg Card */}
                  <div className="border border-[#D9DED9] bg-white rounded-xl p-4 space-y-3 shadow-xs">
                    {/* Header: Mode, Provider, Leg Fare */}
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-base">{cfg.icon}</span>
                          <span className={`text-sm font-black ${getModeHighlightClass(seg.mode as keyof typeof MODE_CONFIG) || 'text-[#1F2933]'} ${getModeHighlightClass(seg.mode as keyof typeof MODE_CONFIG) ? 'rounded-md border px-2 py-1' : ''}`}>
                            {route.segments.length > 1 ? `${idx + 1}${idx === 0 ? 'st' : 'nd'} Bus: ` : ''}{providerTitle}
                          </span>
                        </div>
                        {/* Operator / Service Identifiers */}
                        <div className="flex items-center gap-2 mt-1 text-xs text-[#667085] flex-wrap">
                          {seg.mode === 'train' && seg.trainNumber && (
                            <span className="font-bold bg-gray-100 px-2 py-0.5 rounded text-[11px] text-[#1F2933]">
                              Train #{seg.trainNumber}
                            </span>
                          )}
                          {seg.mode === 'bus' && seg.serviceName && (
                            <span className="font-bold bg-gray-100 px-2 py-0.5 rounded text-[11px] text-[#1F2933]">
                              Service: {seg.serviceName}
                            </span>
                          )}
                          {seg.mode === 'bus' && (
                            <span className="font-bold bg-[#E8F1EE] px-2 py-0.5 rounded text-[11px] text-[#146B5B]">
                              Bus Type: {seg.busType || seg.serviceName || 'Other'}
                            </span>
                          )}
                          <span>•</span>
                          <span>{seg.from} → {seg.to}</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-sm font-black text-[#146B5B]">₹{seg.price}</span>
                        <p className="text-[10px] text-[#667085] font-bold uppercase">Leg Fare</p>
                      </div>
                    </div>

                    {/* Schedule & Distance */}
                    <div className="flex flex-wrap gap-4 text-xs text-[#667085] bg-gray-50/70 p-2.5 rounded-lg border border-gray-100">
                      <span>⏱ <strong>Duration:</strong> {formatDuration(seg.durationMinutes)}</span>
                      <span>📍 <strong>Distance:</strong> {seg.distanceKm} km</span>
                      {seg.mode === 'bus' && <span><strong>Board:</strong> {seg.from} · <strong>Drop:</strong> {seg.to}</span>}
                      {seg.departure && seg.arrival && (
                        <span>🕒 <strong>Timing:</strong> {seg.departure} – {seg.arrival}</span>
                      )}
                    </div>

                    {/* Stops / Waypoints for this leg */}
                    {seg.stops && (
                      <div className="pt-2 border-t border-[#D9DED9]/70 space-y-1.5">
                        <p className="text-[10px] uppercase font-black text-[#667085] tracking-wider">
                          Intermediate Stops / Waypoints
                        </p>
                        <div className="flex flex-wrap items-center gap-1.5 text-xs text-[#1F2933]">
                          <span className="font-bold text-[#146B5B]">{seg.from}</span>
                          {seg.stops.split(',').map((stop, sIdx) => (
                            <span key={sIdx} className="inline-flex items-center gap-1.5">
                              <span className="text-[#667085] text-[10px]">→</span>
                              <span className="bg-white border border-[#D9DED9] px-2 py-0.5 rounded text-[11px] font-medium">
                                {stop.trim()}
                              </span>
                            </span>
                          ))}
                          <span className="text-[#667085] text-[10px]">→</span>
                          <span className="font-bold text-[#146B5B]">{seg.to}</span>
                        </div>
                      </div>
                    )}

                    {/* Train Fare Classes Breakdown */}
                    {seg.mode === 'train' && (
                      <div className="pt-2 border-t border-[#D9DED9]/70 space-y-1.5">
                        <p className="text-[10px] uppercase font-black text-[#667085] tracking-wider">
                          Pricing Breakdown by Class
                        </p>
                        <div className="flex flex-wrap gap-2 text-xs">
                          <span className="bg-gray-50 border border-[#D9DED9] px-2.5 py-1 rounded-md text-[#667085] font-semibold">
                            General: ₹80
                          </span>
                          <span className="bg-[#146B5B]/10 border border-[#146B5B]/30 px-2.5 py-1 rounded-md text-[#146B5B] font-bold">
                            Sleeper: ₹{seg.price} (Included)
                          </span>
                          <span className="bg-gray-50 border border-[#D9DED9] px-2.5 py-1 rounded-md text-[#667085] font-semibold">
                            3A AC: ₹{seg.price * 3}
                          </span>
                          <span className="bg-gray-50 border border-[#D9DED9] px-2.5 py-1 rounded-md text-[#667085] font-semibold">
                            2A AC: ₹{Math.round(seg.price * 4.2)}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* 3. Waypoint Towns & Villages along Corridor */}
          {route.villages && route.villages.length > 0 && (
            <div className="bg-[#F8FAF9] border border-[#D9DED9] rounded-xl p-4 space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-extrabold uppercase tracking-wider text-[#667085]">
                  📍 Waypoint Towns & Villages along Route ({route.villages.length})
                </span>
                {route.via && (
                  <span className="text-[11px] font-bold text-[#146B5B]">
                    Primary Junction: {route.via}
                  </span>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-1.5 text-xs font-semibold text-[#1F2933]">
                {route.villages.map((village, vIdx) => {
                  const isTerminal = vIdx === 0 || vIdx === route.villages!.length - 1;
                  const isVia = village.toLowerCase() === (route.via || '').toLowerCase();
                  return (
                    <div key={vIdx} className="flex items-center gap-1.5">
                      <span
                        className={`px-2 py-0.5 rounded-md text-[11px] transition ${
                          isTerminal
                            ? 'bg-[#146B5B] text-white font-bold'
                            : isVia
                            ? 'bg-[#146B5B]/15 text-[#146B5B] font-black border border-[#146B5B]/30'
                            : 'bg-white border border-[#D9DED9] text-[#1F2933]'
                        }`}
                      >
                        {village}
                      </span>
                      {vIdx < route.villages!.length - 1 && (
                        <span className="text-[#667085] text-xs font-bold">→</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 4. Supporting Actions */}
          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => setShowMap(true)}
              className="flex-1 py-2.5 px-4 rounded-xl bg-[#146B5B] hover:bg-[#0f5447] text-white font-extrabold text-xs transition flex items-center justify-center gap-2 shadow-sm"
            >
              <Map className="h-4 w-4" /> View Route on Map
            </button>
            <button
              onClick={handleSaveRoute}
              className="flex-1 py-2.5 px-4 rounded-xl border border-[#D9DED9] hover:bg-gray-50 text-[#1F2933] font-bold text-xs transition flex items-center justify-center gap-2"
            >
              {saved ? (
                <>
                  <Check className="h-4 w-4 text-[#146B5B]" />
                  <span className="text-[#146B5B]">Saved to Journeys</span>
                </>
              ) : (
                <>
                  <Bookmark className="h-4 w-4 text-[#667085]" />
                  <span>Save Route Itinerary</span>
                </>
              )}
            </button>
          </div>

        </div>
      )}

      <RouteMap route={route} isOpen={showMap} onClose={() => setShowMap(false)} />
    </article>
  );
}

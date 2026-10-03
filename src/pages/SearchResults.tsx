import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import RouteCard from '../components/RouteCard';
import LoadingState from '../components/LoadingState';
import { searchMultiModalRoutes, FlightSearchInfo, RouteInsights, RouteResult } from '../services/routeService';
import { isRideHailingRoute } from '../services/rideHailing';
import { SlidersHorizontal, ArrowUpDown, X, Filter, ChevronLeft } from 'lucide-react';

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const from = searchParams.get('from') || '';
  const to = searchParams.get('to') || '';
  const date = searchParams.get('date') || '';
  const isExplicitCurrentLocation = /^(?:📍\s*)?(?:my\s+)?current\s+location$/i.test(from.trim());
  const originLatitude = Number(searchParams.get('fromLat'));
  const originLongitude = Number(searchParams.get('fromLng'));
  const hasGpsOrigin = isExplicitCurrentLocation && searchParams.get('origin') === 'gps'
    && Number.isFinite(originLatitude) && originLatitude >= -90 && originLatitude <= 90
    && Number.isFinite(originLongitude) && originLongitude >= -180 && originLongitude <= 180;

  // Core planners state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [retryCount, setRetryCount] = useState(0);
  const [allRoutes, setAllRoutes] = useState<RouteResult[]>([]);
  const [routeInsights, setRouteInsights] = useState<RouteInsights | null>(null);
  const [flightSearch, setFlightSearch] = useState<FlightSearchInfo | null>(null);
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  // Filter settings state
  const [sortBy, setSortBy] = useState<'recommended' | 'cheapest' | 'fastest' | 'transfers' | 'earliest' | 'latest'>('recommended');
  const [maxPrice, setMaxPrice] = useState<number>(2000);
  const [filterModes, setFilterModes] = useState({
    train: true,
    bus: true,
    auto: true,
    cab: true,
    rapido: true,
    uber: true,
    walking: true,
    flight: true,
    airport_transfer: true
  });
  const [durations, setDurations] = useState({
    under1: true,
    hours1to2: true,
    hours2to4: true,
    over4: true
  });
  const [transfers, setTransfers] = useState({
    trans0: true,
    trans1: true,
    trans2: true,
    trans3plus: true
  });
  const [departureTimes, setDepartureTimes] = useState({
    morning: true,
    afternoon: true,
    evening: true,
    night: true
  });
  const [routeTypes, setRouteTypes] = useState({
    direct: true,
    multimodal: true
  });
  const [busTypes, setBusTypes] = useState({
    express: true,
    palleVelugu: true,
    deluxe: true,
    superLuxury: true,
    other: true
  });

  const busTypeOptions = [
    { id: 'express', label: 'Express' },
    { id: 'palleVelugu', label: 'Palle Velugu' },
    { id: 'deluxe', label: 'Deluxe' },
    { id: 'superLuxury', label: 'Super Luxury' },
    { id: 'other', label: 'Other available bus types' }
  ] as const;

  useEffect(() => {
    if (!from || !to) {
      navigate('/dashboard');
      return;
    }

    async function fetchRoutes() {
      setLoading(true);
      setError('');
      try {
        const plannerResponse = await searchMultiModalRoutes(
          from,
          to,
          date,
          1,
          hasGpsOrigin ? { latitude: originLatitude, longitude: originLongitude } : undefined
        );
        const results = plannerResponse.routes;
        setRouteInsights(plannerResponse.insights);
        setFlightSearch(plannerResponse.flightSearch);
        const isCurrentGpsOrigin = hasGpsOrigin && plannerResponse.originType === 'CURRENT_GPS_LOCATION';
        const displayRoutes = results.filter(route => {
          const rideSegments = route.segments.filter(segment => segment.mode === 'uber' || segment.mode === 'rapido');
          return isCurrentGpsOrigin || rideSegments.length === 0;
        });
        setAllRoutes(displayRoutes);
        if (displayRoutes.length > 0) {
          const localCurrencyPrices = displayRoutes
            .filter(route => !route.currency || route.currency === 'INR')
            .map(route => route.totalPrice);
          const highestPrice = localCurrencyPrices.length > 0 ? Math.max(...localCurrencyPrices) : 2000;
          setMaxPrice(highestPrice > 2000 ? highestPrice : 2000);
        } else {
          setError('No travel routes found matching these parameters.');
        }
      } catch (err) {
        console.error(err);
        setError('Failed to fetch travel routes. Please verify that your backend server is running.');
      } finally {
        setLoading(false);
      }
    }

    fetchRoutes();
  }, [from, to, date, navigate, retryCount, hasGpsOrigin, originLatitude, originLongitude]);

  const handleClearFilters = () => {
    setFilterModes({
      train: true,
      bus: true,
      auto: true,
      cab: true,
      rapido: true,
      uber: true,
      walking: true,
      flight: true,
      airport_transfer: true
    });
    setDurations({ under1: true, hours1to2: true, hours2to4: true, over4: true });
    setTransfers({ trans0: true, trans1: true, trans2: true, trans3plus: true });
    setDepartureTimes({ morning: true, afternoon: true, evening: true, night: true });
    setRouteTypes({ direct: true, multimodal: true });
    setBusTypes({ express: true, palleVelugu: true, deluxe: true, superLuxury: true, other: true });
    if (allRoutes.length > 0) {
      const localCurrencyPrices = allRoutes
        .filter(route => !route.currency || route.currency === 'INR')
        .map(route => route.totalPrice);
      const highestPrice = localCurrencyPrices.length > 0 ? Math.max(...localCurrencyPrices) : 2000;
      setMaxPrice(highestPrice > 2000 ? highestPrice : 2000);
    } else {
      setMaxPrice(2000);
    }
  };

  // Filter & sort calculations
  const filteredAndSortedRoutes = useMemo(() => {
    let result = [...allRoutes];

    // 0. Walking distance rule: If pure walking distance > 2.0 km or access leg > 2.5 km, do not display
    result = result.filter(r => {
      const isPureWalking = r.segments.length === 1 && r.segments[0].mode === 'walking';
      if (isPureWalking && r.segments[0].distanceKm > 2.0) return false;
      if (r.segments.some(seg => seg.mode === 'walking' && seg.distanceKm > 2.5)) return false;
      return true;
    });

    // 1. Price budget
    result = result.filter(r => r.priceIsPartial || (r.currency && r.currency !== 'INR') || r.totalPrice <= maxPrice);

    // 2. Modes filter
    result = result.filter(r =>
      r.segments.every(seg => filterModes[seg.mode as keyof typeof filterModes])
    );

    // Bus type filter applies to every bus leg in a journey.
    result = result.filter(r => r.segments.every(seg => {
      if (seg.mode !== 'bus') return true;
      const busType = (seg.busType || seg.serviceName || '').toLowerCase();
      if (busType.includes('express')) return busTypes.express;
      if (busType.includes('palle velugu')) return busTypes.palleVelugu;
      if (busType.includes('super luxury')) return busTypes.superLuxury;
      if (busType.includes('deluxe')) return busTypes.deluxe;
      return busTypes.other;
    }));

    // 3. Durations
    result = result.filter(r => {
      const mins = r.totalDurationMinutes;
      if (mins < 60) return durations.under1;
      if (mins >= 60 && mins <= 120) return durations.hours1to2;
      if (mins > 120 && mins <= 240) return durations.hours2to4;
      return durations.over4;
    });

    // 4. Transfers
    result = result.filter(r => {
      const t = r.totalTransfers;
      if (t === 0) return transfers.trans0;
      if (t === 1) return transfers.trans1;
      if (t === 2) return transfers.trans2;
      return transfers.trans3plus;
    });

    // 5. Route Types
    result = result.filter(r => {
      const isDirect = r.totalTransfers === 0;
      if (isDirect) return routeTypes.direct;
      return routeTypes.multimodal;
    });

    // 6. Departure slots
    result = result.filter(r => {
      const depStr = r.departureTimeRaw || (r.segments.find(s => s.departure)?.departure);
      if (!depStr) return true;
      let hour: number;
      if (depStr.includes(':')) {
        const parts = depStr.split(':');
        hour = parseInt(parts[0], 10);
        if (depStr.toLowerCase().includes('pm') && hour < 12) hour += 12;
        if (depStr.toLowerCase().includes('am') && hour === 12) hour = 0;
      } else {
        const parsed = new Date(depStr);
        hour = parsed.getHours();
      }
      if (Number.isNaN(hour)) return true;
      if (hour >= 6 && hour < 12) return departureTimes.morning;
      if (hour >= 12 && hour < 17) return departureTimes.afternoon;
      if (hour >= 17 && hour < 21) return departureTimes.evening;
      return departureTimes.night;
    });

    // 7. Sort implementation
    result.sort((a, b) => {
      if (sortBy === 'cheapest') {
        if (a.currency && b.currency && a.currency !== b.currency) return 0;
        return a.totalPrice - b.totalPrice;
      }
      if (sortBy === 'fastest') return a.totalDurationMinutes - b.totalDurationMinutes;
      if (sortBy === 'transfers') return a.totalTransfers - b.totalTransfers;

      if (sortBy === 'earliest') {
        const depA = a.departureTimeRaw || a.segments.find(s => s.departure)?.departure || '23:59';
        const depB = b.departureTimeRaw || b.segments.find(s => s.departure)?.departure || '23:59';
        return depA.localeCompare(depB);
      }

      if (sortBy === 'latest') {
        const arrA = a.arrivalTimeRaw || [...a.segments].reverse().find(s => s.arrival)?.arrival || '00:00';
        const arrB = b.arrivalTimeRaw || [...b.segments].reverse().find(s => s.arrival)?.arrival || '00:00';
        return arrB.localeCompare(arrA);
      }

      // Default: recommended tagging score rank
      const getTagWeight = (r: RouteResult) => {
        if (r.tag === 'best') return -100;
        if (r.tag === 'fastest') return -70;
        if (r.tag === 'budget' || r.tag === 'cheapest') return -50;
        return 0;
      };
      return getTagWeight(a) - getTagWeight(b);
    });

    // Estimated ride-hailing options (Uber/Rapido) are formula-based, so whatever the sort order they are
    // listed after the timetable-backed routes instead of competing with them.
    return [
      ...result.filter(r => !isRideHailingRoute(r)),
      ...result.filter(isRideHailingRoute)
    ];
  }, [allRoutes, sortBy, maxPrice, filterModes, busTypes, durations, transfers, departureTimes, routeTypes]);

  // Requirement: The route which is having less time is fastest, the route having lowest cost is budget route.
  // Only timetable-backed routes compete: estimated ride-hailing (Uber/Rapido) durations and fares are formulas.
  const { minDuration, minCost } = useMemo(() => {
    const trustedRoutes = filteredAndSortedRoutes.filter(r => !isRideHailingRoute(r));
    if (trustedRoutes.length === 0) {
      return { minDuration: null, minCost: null };
    }
    const durations = trustedRoutes.map(r => r.totalDurationMinutes);
    const costs = trustedRoutes.map(r => r.totalPrice);
    return {
      minDuration: Math.min(...durations),
      minCost: Math.min(...costs)
    };
  }, [filteredAndSortedRoutes]);

  // Formats date nicely
  const formatDateLabel = (dateStr: string) => {
    if (!dateStr) return '';
    const parsed = new Date(dateStr);
    if (isNaN(parsed.getTime())) return dateStr;
    return parsed.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
  };

  const formatDuration = (mins: number) => {
    const hours = Math.floor(mins / 60);
    const minutes = mins % 60;
    return `${hours > 0 ? `${hours}h ` : ''}${minutes}m`;
  };

  const formatPrice = (price: number, currency?: string | null) => new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency || 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price);



  return (
    <div className="min-h-screen bg-[#F1F4F3] text-[#1F2933] flex flex-col">
      <Navbar />

      <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-8 space-y-6">
        
        {/* Back Link to Dashboard */}
        <button
          onClick={() => navigate('/dashboard')}
          className="inline-flex items-center gap-1 text-xs font-black uppercase text-[#146B5B] hover:text-[#0f5447] transition mb-2"
        >
          <ChevronLeft className="h-4 w-4" /> Back to Search
        </button>

        {/* Route metadata header card */}
        <div className="bg-white border border-[#D9DED9] p-5 md:p-6 rounded-xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-[#1F2933]">
              {from} ➔ {to}
            </h1>
            <p className="text-sm font-semibold text-[#667085] mt-1">
              📅 {formatDateLabel(date)}
            </p>
          </div>

          {/* Action buttons: Filter & Sort */}
          {!loading && !error && (
            <div className="flex items-center gap-2.5 self-start md:self-center">
              <button
                onClick={() => setShowFilterPanel(true)}
                className="inline-flex items-center gap-2 rounded-xl border border-[#D9DED9] bg-white px-4 py-2.5 text-xs font-extrabold text-[#1F2933] hover:bg-gray-50 transition cursor-pointer"
              >
                <SlidersHorizontal className="h-4 w-4 text-[#146B5B]" />
                <span>Display Options</span>
              </button>

              <div className="relative">
                <button
                  onClick={() => setShowSortDropdown(!showSortDropdown)}
                  className="inline-flex items-center gap-2 rounded-xl border border-[#D9DED9] bg-white px-4 py-2.5 text-xs font-extrabold text-[#1F2933] hover:bg-gray-50 transition cursor-pointer"
                >
                  <ArrowUpDown className="h-4 w-4 text-[#146B5B]" />
                  <span>Sort</span>
                </button>

                {showSortDropdown && (
                  <div className="absolute right-0 mt-2 w-48 rounded-xl bg-white shadow-lg border border-[#D9DED9] z-35 overflow-hidden">
                    {[
                      { id: 'recommended', label: '⭐ Recommended' },
                      { id: 'cheapest', label: '💰 Budget Route' },
                      { id: 'fastest', label: '⚡ Fastest' },
                      { id: 'transfers', label: '🔄 Fewest Transfers' },
                      { id: 'earliest', label: '🌅 Earliest Departure' },
                      { id: 'latest', label: '🌙 Latest Arrival' }
                    ].map(opt => (
                      <button
                        key={opt.id}
                        onClick={() => {
                          setSortBy(opt.id as any);
                          setShowSortDropdown(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 text-xs font-bold transition hover:bg-gray-50 ${sortBy === opt.id ? 'bg-[#F4F2ED] text-[#146B5B]' : 'text-[#1F2933]'}`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {loading && <LoadingState label="Analyzing schedules and compiling optimal travel options..." />}

        {!loading && error && (
          <div className="bg-white border border-[#D9DED9] rounded-xl p-10 text-center">
            <p className="text-xs uppercase tracking-widest font-extrabold text-red-700">Search unavailable</p>
            <p className="mt-2 text-xl font-black text-[#1F2933]">{error}</p>
            <p className="mt-3 text-sm text-[#667085] leading-relaxed max-w-md mx-auto">
              Your search is still here. Check the connection, then try again.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3">
              <button
                type="button"
                onClick={() => setRetryCount(count => count + 1)}
                className="rounded-lg bg-[#146B5B] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#0f5447] transition"
              >
                Try again
              </button>
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="rounded-lg border border-[#D9DED9] px-5 py-2.5 text-sm font-bold text-[#1F2933] hover:bg-gray-50 transition"
              >
                Change search
              </button>
            </div>
          </div>
        )}

        {!loading && !error && (
          <div className="space-y-6">
            {/* Travel Options Section Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-1">
              <div>
                <h2 className="text-xl font-black text-[#1F2933]">
                  Travel Options ({filteredAndSortedRoutes.length})
                </h2>
                <p className="text-xs text-[#667085] mt-0.5 font-medium">
                  Showing available travel options one by one. Click "Show Details" for complete step-by-step navigation.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-700 bg-slate-50 border border-slate-200 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-2xs">
                  <span className="h-2 w-2 rounded-full bg-slate-400"></span>
                  Schedule &amp; fare confidence varies by route
                </span>
              </div>
            </div>

            {filteredAndSortedRoutes.length === 0 ? (
              <div className="bg-white border border-[#D9DED9] rounded-xl p-10 text-center">
                <p className="text-lg font-black text-[#1F2933]">No matching travel options found</p>
                <p className="mt-1 text-xs text-[#667085]">
                  Click on "Display Options" to adjust your preferences or widen your schedule filters.
                </p>
                <button
                  onClick={handleClearFilters}
                  className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-[#146B5B] px-4 py-2 text-xs font-bold text-white hover:bg-[#0f5447] transition"
                >
                  Reset all filters
                </button>
              </div>
            ) : (
              /* Travel Options displayed ONE BY ONE down the page */
              <div className="space-y-5" aria-label="Available Travel Options">
                {filteredAndSortedRoutes.map((route, index) => {
                  const isEstimatedRide = isRideHailingRoute(route);
                  const isFastest = !isEstimatedRide && minDuration !== null && route.totalDurationMinutes === minDuration;
                  const isBudget = !isEstimatedRide && minCost !== null && route.totalPrice === minCost;
                  return (
                    <div key={route.id} id={`route-${route.id}`}>
                      <RouteCard
                        route={route}
                        routeIndex={index + 1}
                        isFastest={isFastest}
                        isBudget={isBudget}
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </main>

      {/* FILTER DRAWER OVERLAY */}
      {showFilterPanel && (
        <div className="fixed inset-0 z-50 bg-[#1F2933]/55 backdrop-blur-sm flex justify-end items-end md:items-stretch animate-fadeIn">
          <div className="absolute inset-0" onClick={() => setShowFilterPanel(false)} />

          <div className="relative w-full md:max-w-md bg-white rounded-t-2xl md:rounded-t-none md:rounded-l-2xl shadow-xl p-6 overflow-y-auto flex flex-col max-h-[90vh] md:max-h-none z-10 animate-slideUp">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#D9DED9] pb-4 mb-5">
              <div className="flex items-center gap-2 text-[#1F2933]">
                <Filter className="h-5 w-5 text-[#146B5B]" />
                <h3 className="text-base font-black">Display Options</h3>
              </div>
              <button
                onClick={() => setShowFilterPanel(false)}
                className="p-2 hover:bg-gray-50 rounded-full transition"
              >
                <X className="h-4.5 w-4.5 text-[#667085]" />
              </button>
            </div>

            {/* Body */}
            <div className="space-y-6 flex-1 pr-1">
              
              {/* Route Types */}
              <div className="space-y-2">
                <h4 className="text-xs uppercase font-extrabold tracking-wider text-[#667085]">Route Type</h4>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-[#1F2933]">
                    <input
                      type="checkbox"
                      checked={routeTypes.direct}
                      onChange={() => setRouteTypes(prev => ({ ...prev, direct: !prev.direct }))}
                      className="w-4 h-4 rounded text-[#146B5B] border-[#D9DED9] focus:ring-[#146B5B]"
                    />
                    Direct Option
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-[#1F2933]">
                    <input
                      type="checkbox"
                      checked={routeTypes.multimodal}
                      onChange={() => setRouteTypes(prev => ({ ...prev, multimodal: !prev.multimodal }))}
                      className="w-4 h-4 rounded text-[#146B5B] border-[#D9DED9] focus:ring-[#146B5B]"
                    />
                    Multi-Modal Option
                  </label>
                </div>
              </div>

              {/* Modes */}
              <div className="space-y-2">
                <h4 className="text-xs uppercase font-extrabold tracking-wider text-[#667085]">Transportation Type</h4>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'train', label: ' Indian Railways (🚆)' },
                    { id: 'bus', label: ' Bus Service (🚌)' },
                    ...(hasGpsOrigin ? [
                      { id: 'uber', label: ' Uber Cabs (🚗)' },
                      { id: 'rapido', label: ' Rapido Bike (🛵)' }
                    ] : []),
                    { id: 'auto', label: ' Auto / Tuk-tuk (🛺)' },
                    { id: 'cab', label: ' Taxi / Cab (🚕)' },
                    { id: 'walking', label: ' Walking (🚶)' },
                    { id: 'flight', label: ' Flight (✈️)' },
                    { id: 'airport_transfer', label: ' Airport access (🚕)' }
                  ].map(mode => (
                    <label key={mode.id} className="flex items-center gap-2 cursor-pointer text-xs font-bold text-[#1F2933]">
                      <input
                        type="checkbox"
                        checked={filterModes[mode.id as keyof typeof filterModes]}
                        onChange={() => setFilterModes(prev => ({ ...prev, [mode.id]: !prev[mode.id as keyof typeof filterModes] }))}
                        className="w-4 h-4 rounded text-[#146B5B] border-[#D9DED9] focus:ring-[#146B5B]"
                      />
                      {mode.label}
                    </label>
                  ))}
                </div>
              </div>

              {/* Bus types */}
              <div className="space-y-2">
                <h4 className="text-xs uppercase font-extrabold tracking-wider text-[#667085]">Bus Type</h4>
                <div className="grid grid-cols-2 gap-2.5">
                  {busTypeOptions.map(opt => (
                    <label key={opt.id} className="flex items-center gap-2 cursor-pointer text-xs font-bold text-[#1F2933]">
                      <input
                        type="checkbox"
                        checked={busTypes[opt.id]}
                        onChange={() => setBusTypes(prev => ({ ...prev, [opt.id]: !prev[opt.id] }))}
                        className="w-4 h-4 rounded text-[#146B5B] border-[#D9DED9] focus:ring-[#146B5B]"
                      />
                      {opt.label}
                    </label>
                  ))}
                </div>
              </div>

              {/* Price range */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-extrabold text-[#667085]">
                  <span>PRICE RANGE BUDGET</span>
                  <span className="text-[#146B5B]">₹0 - ₹{maxPrice}</span>
                </div>
                <input
                  type="range"
                  min={100}
                  max={6000}
                  step={50}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                  className="w-full h-1 bg-[#D9DED9] rounded-lg appearance-none cursor-pointer accent-[#146B5B]"
                />
              </div>

              {/* Duration filter */}
              <div className="space-y-2">
                <h4 className="text-xs uppercase font-extrabold tracking-wider text-[#667085]">Journey Duration</h4>
                <div className="grid grid-cols-2 gap-2.5">
                  {[
                    { id: 'under1', label: '⏱ Under 1 hour' },
                    { id: 'hours1to2', label: '⏱ 1–2 hours' },
                    { id: 'hours2to4', label: '⏱ 2–4 hours' },
                    { id: 'over4', label: '⏱ More than 4 hours' }
                  ].map(opt => (
                    <label key={opt.id} className="flex items-center gap-2 cursor-pointer text-xs font-bold text-[#1F2933]">
                      <input
                        type="checkbox"
                        checked={durations[opt.id as keyof typeof durations]}
                        onChange={() => setDurations(prev => ({ ...prev, [opt.id]: !prev[opt.id as keyof typeof durations] }))}
                        className="w-4 h-4 rounded text-[#146B5B] border-[#D9DED9] focus:ring-[#146B5B]"
                      />
                      {opt.label}
                    </label>
                  ))}
                </div>
              </div>

              {/* Transfers filter */}
              <div className="space-y-2">
                <h4 className="text-xs uppercase font-extrabold tracking-wider text-[#667085]">Transfers</h4>
                <div className="grid grid-cols-2 gap-2.5">
                  {[
                    { id: 'trans0', label: '🔄 0 Transfers (Direct)' },
                    { id: 'trans1', label: '🔄 1 Transfer' },
                    { id: 'trans2', label: '🔄 2 Transfers' },
                    { id: 'trans3plus', label: '🔄 3+ Transfers' }
                  ].map(opt => (
                    <label key={opt.id} className="flex items-center gap-2 cursor-pointer text-xs font-bold text-[#1F2933]">
                      <input
                        type="checkbox"
                        checked={transfers[opt.id as keyof typeof transfers]}
                        onChange={() => setTransfers(prev => ({ ...prev, [opt.id]: !prev[opt.id as keyof typeof transfers] }))}
                        className="w-4 h-4 rounded text-[#146B5B] border-[#D9DED9] focus:ring-[#146B5B]"
                      />
                      {opt.label}
                    </label>
                  ))}
                </div>
              </div>

              {/* Departure times */}
              <div className="space-y-2">
                <h4 className="text-xs uppercase font-extrabold tracking-wider text-[#667085]">Departure Time</h4>
                <div className="grid grid-cols-2 gap-2.5">
                  {[
                    { id: 'morning', label: '🌅 Morning (6am-12pm)' },
                    { id: 'afternoon', label: '☀️ Afternoon (12pm-5pm)' },
                    { id: 'evening', label: '🌙 Evening (5pm-9pm)' },
                    { id: 'night', label: '🌃 Night (9pm-6am)' }
                  ].map(opt => (
                    <label key={opt.id} className="flex items-center gap-2 cursor-pointer text-xs font-bold text-[#1F2933]">
                      <input
                        type="checkbox"
                        checked={departureTimes[opt.id as keyof typeof departureTimes]}
                        onChange={() => setDepartureTimes(prev => ({ ...prev, [opt.id]: !prev[opt.id as keyof typeof departureTimes] }))}
                        className="w-4 h-4 rounded text-[#146B5B] border-[#D9DED9] focus:ring-[#146B5B]"
                      />
                      {opt.label}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="mt-8 pt-4 border-t border-[#D9DED9] flex gap-4 shrink-0">
              <button
                type="button"
                onClick={handleClearFilters}
                className="flex-1 py-3 border border-[#D9DED9] hover:bg-gray-50 text-[#1F2933] font-bold rounded-xl text-xs transition"
              >
                Clear All
              </button>
              <button
                type="button"
                onClick={() => setShowFilterPanel(false)}
                className="flex-1 py-3 bg-[#146B5B] hover:bg-[#0f5447] text-white font-extrabold rounded-xl text-xs transition shadow-sm"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

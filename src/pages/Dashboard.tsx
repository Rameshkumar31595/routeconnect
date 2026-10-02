import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import SearchCard from '../components/SearchCard';
import RouteBuddyMapBackground from '../components/RouteBuddyMapBackground';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [gpsOrigin, setGpsOrigin] = useState<{ latitude: number; longitude: number } | null>(null);
  const [validationError, setValidationError] = useState('');
  const [date, setDate] = useState(() => {
    return new Date().toISOString().split('T')[0];
  });

  const handleSearch = async () => {
    if (!from || !to) {
      setValidationError('Enter both a starting point and a destination to search.');
      return;
    }
    if (from.trim().toLowerCase() === to.trim().toLowerCase()) {
      setValidationError('Your starting point and destination are the same. Choose two different places.');
      return;
    }

    setValidationError('');

    let originCoordinates = gpsOrigin;
    if (!originCoordinates && /^(?:📍\s*)?(?:my\s+)?current location$/i.test(from.trim())) {
      if (!navigator.geolocation) {
        setValidationError('Geolocation is not supported by your browser. Enter a starting place instead.');
        return;
      }
      try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, { enableHighAccuracy: true, timeout: 10000 });
        });
        originCoordinates = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        };
      } catch (error) {
        const locationError = error as GeolocationPositionError;
        setValidationError(locationError.code === locationError.PERMISSION_DENIED
          ? 'Location permission was denied. Allow location access and try again.'
          : 'Unable to determine your current location. Try again or enter a starting place.');
        return;
      }
    }

    // Save search parameter logs to localStorage under my_trips
    try {
      const savedTrips = JSON.parse(localStorage.getItem('my_trips') || '[]');
      const newTrip = { from: from.trim(), to: to.trim(), date, id: Date.now() };
      const isDup = savedTrips.some((t: any) => 
        t.from.toLowerCase() === from.trim().toLowerCase() && 
        t.to.toLowerCase() === to.trim().toLowerCase() && 
        t.date === date
      );
      if (!isDup) {
        savedTrips.unshift(newTrip);
        localStorage.setItem('my_trips', JSON.stringify(savedTrips));
      }
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }

    // Navigate to Search Results page with parameters
    const params = new URLSearchParams({
      from: originCoordinates ? '📍 Current Location' : from.trim(),
      to: to.trim(),
      date
    });
    if (originCoordinates) {
      params.set('origin', 'gps');
      params.set('fromLat', String(originCoordinates.latitude));
      params.set('fromLng', String(originCoordinates.longitude));
    }
    navigate(`/search-results?${params.toString()}`);
  };

  const handleFromChange = (value: string) => {
    setFrom(value);
    if (!/^(?:📍\s*)?(?:my\s+)?current\s*location$/i.test(value.trim())) {
      setGpsOrigin(null);
    }
  };

  const handleSwap = () => {
    const temp = from;
    setFrom(to);
    setTo(temp);
    setGpsOrigin(null);
  };

  const isValid = from.trim().length > 0 && to.trim().length > 0 && from.trim().toLowerCase() !== to.trim().toLowerCase();

  return (
    <div className="route-buddy-dashboard min-h-screen text-[#1F2933] flex flex-col">
      <RouteBuddyMapBackground />
      <Navbar />

      <main className="relative z-10 flex-1 w-full max-w-7xl mx-auto px-4 py-12 md:py-20 flex flex-col justify-center space-y-8">
        <div className="text-center space-y-4 max-w-2xl mx-auto mb-4">
          <p className="text-xs uppercase tracking-[0.2em] font-extrabold text-[#146B5B]">
            {user ? `Welcome back, ${user.name}` : 'Multi-Modal Route Planner'}
          </p>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#1F2933] tracking-tight">
            Plan your next journey
          </h1>
        </div>

        {/* Search Control Card */}
        <div className="max-w-4xl mx-auto w-full">
          <SearchCard
            from={from}
            to={to}
            date={date}
            onFromChange={handleFromChange}
            onCurrentLocation={(latitude, longitude) => setGpsOrigin({ latitude, longitude })}
            onToChange={setTo}
            onDateChange={setDate}
            onSwapLocations={handleSwap}
            onSearch={handleSearch}
            loading={false}
            isValid={isValid}
          />
          {validationError && (
            <p className="mt-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700" role="alert">
              {validationError}
            </p>
          )}
        </div>
      </main>
    </div>
  );
}

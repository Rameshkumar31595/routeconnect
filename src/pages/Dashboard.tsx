import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import SearchCard from '../components/SearchCard';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [validationError, setValidationError] = useState('');
  const [date, setDate] = useState(() => {
    return new Date().toISOString().split('T')[0];
  });

  const handleSearch = () => {
    if (!from || !to) {
      setValidationError('Enter both a starting point and a destination to search.');
      return;
    }
    if (from.trim().toLowerCase() === to.trim().toLowerCase()) {
      setValidationError('Your starting point and destination are the same. Choose two different places.');
      return;
    }

    setValidationError('');

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
      from: from.trim(),
      to: to.trim(),
      date
    });
    navigate(`/search-results?${params.toString()}`);
  };

  const handleSwap = () => {
    const temp = from;
    setFrom(to);
    setTo(temp);
  };

  const isValid = from.trim().length > 0 && to.trim().length > 0 && from.trim().toLowerCase() !== to.trim().toLowerCase();

  return (
    <div className="min-h-screen bg-[#F4F2ED] text-[#1F2933] flex flex-col">
      <Navbar />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-12 md:py-20 flex flex-col justify-center space-y-8">
        <div className="text-center space-y-4 max-w-2xl mx-auto mb-4">
          <p className="text-xs uppercase tracking-[0.2em] font-extrabold text-[#146B5B]">
            Welcome back, {user?.name}
          </p>
          <h1 className="text-4xl md:text-5xl font-black text-[#1F2933] tracking-tight">
            Plan your next journey
          </h1>
        </div>

        {/* Search Control Card */}
        <div className="max-w-4xl mx-auto w-full">
          <SearchCard
            from={from}
            to={to}
            date={date}
            onFromChange={setFrom}
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

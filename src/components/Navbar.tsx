import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { MapPin, LogOut, User, Menu, X, Trash2, Bookmark, Briefcase } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

interface SavedTrip {
  id: number;
  from: string;
  to: string;
  date: string;
}

interface SavedRoute {
  id: string;
  from: string;
  to: string;
  price: number;
  duration: number;
  transfers: number;
  modes: string[];
}

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  
  // Modals state
  const [showMyTrips, setShowMyTrips] = useState(false);
  const [showSavedRoutes, setShowSavedRoutes] = useState(false);
  const [tripsList, setTripsList] = useState<SavedTrip[]>([]);
  const [routesList, setRoutesList] = useState<SavedRoute[]>([]);
  
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    setShowDropdown(false);
  };

  // Loads parameters dynamically when modal is opened
  const openMyTripsModal = () => {
    const list = JSON.parse(localStorage.getItem('my_trips') || '[]');
    setTripsList(list);
    setShowMyTrips(true);
    setShowMobileMenu(false);
  };

  const openSavedRoutesModal = () => {
    const list = JSON.parse(localStorage.getItem('saved_routes') || '[]');
    setRoutesList(list);
    setShowSavedRoutes(true);
    setShowMobileMenu(false);
  };

  const handleDeleteTrip = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = tripsList.filter(t => t.id !== id);
    localStorage.setItem('my_trips', JSON.stringify(updated));
    setTripsList(updated);
  };

  const handleDeleteRoute = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = routesList.filter(r => r.id !== id);
    localStorage.setItem('saved_routes', JSON.stringify(updated));
    setRoutesList(updated);
  };

  const handleSelectTrip = (trip: SavedTrip) => {
    setShowMyTrips(false);
    const params = new URLSearchParams({
      from: trip.from,
      to: trip.to,
      date: trip.date
    });
    navigate(`/search-results?${params.toString()}`);
  };

  const menuItems = [
    { name: 'Home', path: '/dashboard', icon: MapPin },
    { name: 'My Trips', path: '#my-trips', icon: Briefcase, action: openMyTripsModal },
    { name: 'Saved Routes', path: '#saved', icon: Bookmark, action: openSavedRoutesModal },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  return (
    <nav className="border-b border-[#D9DED9] bg-white shadow-sm sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-2 group shrink-0">
            <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-[#146B5B] text-white">
              <MapPin className="h-4.5 w-4.5" />
            </div>
            <span className="text-lg font-black text-[#1F2933]">RouteConnect</span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-6">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              if (item.action) {
                return (
                  <button
                    key={item.name}
                    onClick={item.action}
                    className="text-xs uppercase tracking-wider font-extrabold text-[#667085] hover:text-[#146B5B] transition"
                  >
                    {item.name}
                  </button>
                );
              }
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`text-xs uppercase tracking-wider font-extrabold transition ${isActive ? 'text-[#146B5B] border-b-2 border-[#146B5B] pb-1' : 'text-[#667085] hover:text-[#146B5B]'}`}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="md:hidden text-[#667085] hover:text-[#1F2933] transition"
          >
            {showMobileMenu ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

          {/* Desktop User Dropdown */}
          <div className="hidden md:flex items-center shrink-0">
            {user && (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-2 rounded-full bg-gray-50 px-4 py-2 text-sm font-semibold text-[#1F2933] border border-[#D9DED9] transition hover:bg-gray-100"
                >
                  <div className="flex items-center justify-center h-7 w-7 rounded-full bg-[#146B5B] text-white text-xs font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span>{user.name}</span>
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-56 rounded-lg bg-white shadow-lg border border-[#D9DED9] z-50 overflow-hidden">
                    <div className="px-4 py-3 border-b border-[#D9DED9] bg-gray-50">
                      <p className="text-sm font-semibold text-[#1F2933]">{user.name}</p>
                      <p className="text-xs text-[#667085] truncate">{user.email}</p>
                    </div>
                    <div className="py-1">
                      <button
                        onClick={() => {
                          navigate('/profile');
                          setShowDropdown(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-[#1F2933] hover:bg-gray-50 transition"
                      >
                        <User className="h-4 w-4 text-[#667085]" />
                        User Details
                      </button>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-red-600 hover:bg-red-50 transition"
                      >
                        <LogOut className="h-4 w-4" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Mobile menu panel */}
        {showMobileMenu && user && (
          <div className="md:hidden pb-4 border-t border-[#D9DED9]">
            <div className="mt-3 space-y-1">
              {menuItems.map((item) => {
                if (item.action) {
                  return (
                    <button
                      key={item.name}
                      onClick={item.action}
                      className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-bold text-[#667085] hover:bg-gray-50"
                    >
                      <item.icon className="h-4.5 w-4.5 text-[#146B5B]" />
                      {item.name}
                    </button>
                  );
                }
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setShowMobileMenu(false)}
                    className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-bold text-[#667085] hover:bg-gray-50 no-underline"
                  >
                    <item.icon className="h-4.5 w-4.5 text-[#146B5B]" />
                    {item.name}
                  </Link>
                );
              })}
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-bold text-red-650 text-red-600 hover:bg-red-50"
              >
                <LogOut className="h-4.5 w-4.5" />
                Logout
              </button>
            </div>
          </div>
        )}
      </div>

      {/* MY SAVED TRIPS MODAL OVERLAY */}
      {showMyTrips && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1F2933]/55 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="w-full max-w-md bg-white rounded-xl shadow-xl border border-[#D9DED9] overflow-hidden flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between bg-white border-b border-[#D9DED9] p-4 shrink-0">
              <div className="flex items-center gap-2">
                <Briefcase className="h-4.5 w-4.5 text-[#146B5B]" />
                <h3 className="text-base font-black text-[#1F2933]">My Saved Trips</h3>
              </div>
              <button
                onClick={() => setShowMyTrips(false)}
                className="p-1 rounded-full hover:bg-gray-50 transition"
              >
                <X className="h-4.5 w-4.5 text-[#667085]" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto space-y-3 flex-1">
              {tripsList.length === 0 ? (
                <div className="py-10 text-center space-y-1">
                  <p className="text-sm font-bold text-[#1F2933]">No trips saved yet</p>
                  <p className="text-xs text-[#667085]">Searched journeys will automatically appear here.</p>
                </div>
              ) : (
                tripsList.map((trip) => (
                  <div
                    key={trip.id}
                    onClick={() => handleSelectTrip(trip)}
                    className="p-3 bg-white hover:bg-gray-50 border border-[#D9DED9] rounded-lg flex items-center justify-between cursor-pointer transition"
                  >
                    <div>
                      <p className="text-sm font-bold text-[#1F2933]">{trip.from} ➔ {trip.to}</p>
                      <p className="text-xs text-[#667085] font-semibold mt-0.5">📅 {trip.date}</p>
                    </div>
                    <button
                      onClick={(e) => handleDeleteTrip(trip.id, e)}
                      className="p-2 text-[#667085] hover:text-red-600 rounded-md hover:bg-red-50 transition"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* SAVED ROUTES MODAL OVERLAY */}
      {showSavedRoutes && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1F2933]/55 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="w-full max-w-md bg-white rounded-xl shadow-xl border border-[#D9DED9] overflow-hidden flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between bg-white border-b border-[#D9DED9] p-4 shrink-0">
              <div className="flex items-center gap-2">
                <Bookmark className="h-4.5 w-4.5 text-[#146B5B]" />
                <h3 className="text-base font-black text-[#1F2933]">Saved Routes</h3>
              </div>
              <button
                onClick={() => setShowSavedRoutes(false)}
                className="p-1 rounded-full hover:bg-gray-50 transition"
              >
                <X className="h-4.5 w-4.5 text-[#667085]" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto space-y-3 flex-1">
              {routesList.length === 0 ? (
                <div className="py-10 text-center space-y-1">
                  <p className="text-sm font-bold text-[#1F2933]">No routes saved yet</p>
                  <p className="text-xs text-[#667085]">Pin route combinations under details inside Search Results.</p>
                </div>
              ) : (
                routesList.map((route) => (
                  <div
                    key={route.id}
                    className="p-3 bg-white border border-[#D9DED9] rounded-lg flex items-center justify-between transition"
                  >
                    <div>
                      <p className="text-sm font-bold text-[#1F2933]">{route.from} ➔ {route.to}</p>
                      <p className="text-xs text-[#667085] font-semibold mt-1">
                        ⏱ {Math.floor(route.duration / 60)}h {route.duration % 60}m • 🔄 {route.transfers} Transfers
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-black text-[#146B5B]">₹{route.price}</span>
                      <button
                        onClick={(e) => handleDeleteRoute(route.id, e)}
                        className="p-2 text-[#667085] hover:text-red-600 rounded-md hover:bg-red-50 transition"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

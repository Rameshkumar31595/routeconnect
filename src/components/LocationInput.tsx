import { useState, useMemo, useRef, useEffect } from 'react';
import { MapPin, Navigation, Map, X, Globe } from 'lucide-react';

export interface SuggestionItem {
  name: string;
  type: 'city' | 'station' | 'bus' | 'airport' | 'landmark' | 'nearby_station' | 'nearby_bus';
  subtitle: string;
  district: string;
}

const AP_DISTRICTS = [
  'Alluri Sitharama Raju',
  'Anakapalli',
  'Ananthapuramu',
  'Annamayya',
  'Bapatla',
  'Chittoor',
  'Dr. B. R. Ambedkar Konaseema',
  'East Godavari',
  'Eluru',
  'Guntur',
  'Kakinada',
  'Krishna',
  'Kurnool',
  'Nandyal',
  'NTR',
  'Palnadu',
  'Parvathipuram Manyam',
  'Prakasam',
  'Srikakulam',
  'Sri Potti Sriramulu Nellore',
  'Sri Sathya Sai',
  'Tirupati',
  'Visakhapatnam',
  'Vizianagaram',
  'West Godavari',
  'YSR Kadapa'
];

const RICH_SUGGESTIONS: SuggestionItem[] = [
  // West Godavari (AP)
  { name: 'Bhimavaram', type: 'city', subtitle: 'Bhimavaram Mandal, West Godavari, Andhra Pradesh', district: 'West Godavari' },
  { name: 'Bhimavaram Railway Station', type: 'station', subtitle: 'Bhimavaram Mandal, West Godavari, Andhra Pradesh', district: 'West Godavari' },
  { name: 'Bhimavaram Junction', type: 'station', subtitle: 'Bhimavaram Mandal, West Godavari, Andhra Pradesh', district: 'West Godavari' },
  { name: 'Bhimavaram Bus Station', type: 'bus', subtitle: 'Bhimavaram Mandal, West Godavari, Andhra Pradesh', district: 'West Godavari' },
  
  // Duplicate Undi Entry
  { name: 'Undi (Undi Mandal)', type: 'city', subtitle: 'Undi Mandal, West Godavari, Andhra Pradesh', district: 'West Godavari' },
  { name: 'Undi (Chinna Mandal)', type: 'city', subtitle: 'Chinna Mandal, Sri Sathya Sai, Andhra Pradesh', district: 'Sri Sathya Sai' },
  { name: 'Undi', type: 'city', subtitle: 'Undi Mandal, West Godavari, Andhra Pradesh', district: 'West Godavari' },

  { name: 'Akividu', type: 'city', subtitle: 'Akividu Mandal, West Godavari, Andhra Pradesh', district: 'West Godavari' },
  { name: 'Akividu Railway Station', type: 'station', subtitle: 'Akividu Mandal, West Godavari, Andhra Pradesh', district: 'West Godavari' },
  { name: 'Akividu Bus Station', type: 'bus', subtitle: 'Akividu Mandal, West Godavari, Andhra Pradesh', district: 'West Godavari' },
  { name: 'Veeravasaram', type: 'city', subtitle: 'Veeravasaram Mandal, West Godavari, Andhra Pradesh', district: 'West Godavari' },
  { name: 'Kalla', type: 'city', subtitle: 'Kalla Mandal, West Godavari, Andhra Pradesh', district: 'West Godavari' },
  { name: 'Kalla Bus Stop', type: 'bus', subtitle: 'Kalla Mandal, West Godavari, Andhra Pradesh', district: 'West Godavari' },
  { name: 'Mogalthur', type: 'city', subtitle: 'Mogalthur Mandal, West Godavari, Andhra Pradesh', district: 'West Godavari' },
  { name: 'Palakollu', type: 'city', subtitle: 'Palakollu Mandal, West Godavari, Andhra Pradesh', district: 'West Godavari' },
  { name: 'Narasapuram', type: 'city', subtitle: 'Narasapuram Mandal, West Godavari, Andhra Pradesh', district: 'West Godavari' },
  { name: 'Narsapur Railway Station', type: 'station', subtitle: 'Narasapuram Mandal, West Godavari, Andhra Pradesh', district: 'West Godavari' },
  { name: 'Penugonda', type: 'city', subtitle: 'Penugonda Mandal, West Godavari, Andhra Pradesh', district: 'West Godavari' },
  { name: 'Attili', type: 'city', subtitle: 'Attili Mandal, West Godavari, Andhra Pradesh', district: 'West Godavari' },
  { name: 'Ganapavaram', type: 'city', subtitle: 'Ganapavaram Mandal, Eluru, Andhra Pradesh', district: 'Eluru' },
  { name: 'Kakinada', type: 'city', subtitle: 'Kakinada Mandal, Kakinada, Andhra Pradesh', district: 'Kakinada' },

  // NTR (Vijayawada)
  { name: 'Vijayawada', type: 'city', subtitle: 'Vijayawada Mandal, NTR, Andhra Pradesh', district: 'NTR' },
  { name: 'Vijayawada Railway Station', type: 'station', subtitle: 'Vijayawada Mandal, NTR, Andhra Pradesh', district: 'NTR' },
  { name: 'Vijayawada Bus Station', type: 'bus', subtitle: 'Vijayawada Mandal, NTR, Andhra Pradesh', district: 'NTR' },
  { name: 'Vijayawada Pandit Nehru Bus Station', type: 'bus', subtitle: 'Vijayawada Mandal, NTR, Andhra Pradesh', district: 'NTR' },
  { name: 'Vijayawada Airport', type: 'airport', subtitle: 'Gannavaram, NTR, Andhra Pradesh', district: 'NTR' },
  { name: 'Vijayawada International Airport', type: 'airport', subtitle: 'Gannavaram, NTR, Andhra Pradesh', district: 'NTR' },
  { name: 'Vijayawada City', type: 'city', subtitle: 'Vijayawada Mandal, NTR, Andhra Pradesh', district: 'NTR' },
  { name: 'Kanaka Durga Temple', type: 'landmark', subtitle: 'Indrakeeladri, Vijayawada, Andhra Pradesh', district: 'NTR' },
  { name: 'Ibrahimpatnam', type: 'city', subtitle: 'Ibrahimpatnam Mandal, NTR, Andhra Pradesh', district: 'NTR' },
  { name: 'Nandigama', type: 'city', subtitle: 'Nandigama Mandal, NTR, Andhra Pradesh', district: 'NTR' },

  // Krishna
  { name: 'Machilipatnam', type: 'city', subtitle: 'Machilipatnam Mandal, Krishna, Andhra Pradesh', district: 'Krishna' },
  { name: 'Gudivada', type: 'city', subtitle: 'Gudivada Mandal, Krishna, Andhra Pradesh', district: 'Krishna' },
  { name: 'Challapalli', type: 'city', subtitle: 'Challapalli Mandal, Krishna, Andhra Pradesh', district: 'Krishna' },
  { name: 'Vuyyuru', type: 'city', subtitle: 'Vuyyuru Mandal, Krishna, Andhra Pradesh', district: 'Krishna' },

  // Visakhapatnam
  { name: 'Visakhapatnam', type: 'city', subtitle: 'Visakhapatnam Mandal, Visakhapatnam, Andhra Pradesh', district: 'Visakhapatnam' },
  { name: 'Visakhapatnam Railway Station', type: 'station', subtitle: 'Dwaraka Nagar, Visakhapatnam, Andhra Pradesh', district: 'Visakhapatnam' },
  { name: 'Dwaraka Bus Complex', type: 'bus', subtitle: 'RTC Complex Road, Visakhapatnam, Andhra Pradesh', district: 'Visakhapatnam' },
  { name: 'Visakhapatnam Airport', type: 'airport', subtitle: 'Visakhapatnam, Andhra Pradesh', district: 'Visakhapatnam' },
  { name: 'Gajuwaka', type: 'city', subtitle: 'Gajuwaka Mandal, Visakhapatnam, Andhra Pradesh', district: 'Visakhapatnam' },
  { name: 'Bheemunipatnam', type: 'city', subtitle: 'Bheemunipatnam Mandal, Visakhapatnam, Andhra Pradesh', district: 'Visakhapatnam' },

  // Guntur
  { name: 'Guntur', type: 'city', subtitle: 'Guntur Mandal, Guntur, Andhra Pradesh', district: 'Guntur' },
  { name: 'Guntur Railway Station', type: 'station', subtitle: 'Guntur Mandal, Guntur, Andhra Pradesh', district: 'Guntur' },
  { name: 'Guntur Bus Station', type: 'bus', subtitle: 'Guntur Mandal, Guntur, Andhra Pradesh', district: 'Guntur' },
  { name: 'Tenali', type: 'city', subtitle: 'Tenali Mandal, Guntur, Andhra Pradesh', district: 'Guntur' },
  { name: 'Mangalagiri', type: 'city', subtitle: 'Mangalagiri Mandal, Guntur, Andhra Pradesh', district: 'Guntur' },
  { name: 'Amaravati', type: 'city', subtitle: 'Amaravati Mandal, Guntur, Andhra Pradesh', district: 'Guntur' },

  // Tirupati
  { name: 'Tirupati', type: 'city', subtitle: 'Tirupati Mandal, Tirupati, Andhra Pradesh', district: 'Tirupati' },
  { name: 'Tirupati Railway Station', type: 'station', subtitle: 'Tirupati Mandal, Tirupati, Andhra Pradesh', district: 'Tirupati' },
  { name: 'Tirupati Bus Station', type: 'bus', subtitle: 'Tirupati Mandal, Tirupati, Andhra Pradesh', district: 'Tirupati' },
  { name: 'Renigunta', type: 'city', subtitle: 'Renigunta Mandal, Tirupati, Andhra Pradesh', district: 'Tirupati' },

  // East Godavari
  { name: 'Rajahmundry', type: 'city', subtitle: 'Rajahmundry Mandal, East Godavari, Andhra Pradesh', district: 'East Godavari' },
  { name: 'Rajahmundry Railway Station', type: 'station', subtitle: 'Rajahmundry Mandal, East Godavari, Andhra Pradesh', district: 'East Godavari' },
  { name: 'Rajahmundry Bus Station', type: 'bus', subtitle: 'Rajahmundry Mandal, East Godavari, Andhra Pradesh', district: 'East Godavari' },
  { name: 'Kovvur', type: 'city', subtitle: 'Kovvur Mandal, East Godavari, Andhra Pradesh', district: 'East Godavari' },
  { name: 'Nearby Village', type: 'city', subtitle: 'Rajahmundry Mandal, East Godavari, Andhra Pradesh', district: 'East Godavari' },

  // Other AP Cities
  { name: 'Nellore', type: 'city', subtitle: 'Nellore Mandal, SPS Nellore, Andhra Pradesh', district: 'Sri Potti Sriramulu Nellore' },
  { name: 'Kurnool', type: 'city', subtitle: 'Kurnool Mandal, Kurnool, Andhra Pradesh', district: 'Kurnool' },

  // North India Major Cities
  { name: 'Delhi', type: 'city', subtitle: 'National Capital Territory, Delhi NCR, India', district: 'Delhi NCR' },
  { name: 'Chandigarh', type: 'city', subtitle: 'Union Territory, Chandigarh, India', district: 'Chandigarh' },
  { name: 'Jaipur', type: 'city', subtitle: 'Jaipur, Rajasthan, India', district: 'Jaipur' },
  { name: 'Lucknow', type: 'city', subtitle: 'Lucknow, Uttar Pradesh, India', district: 'Lucknow' },
  { name: 'Kanpur', type: 'city', subtitle: 'Kanpur, Uttar Pradesh, India', district: 'Kanpur' },
  { name: 'Agra', type: 'city', subtitle: 'Agra, Uttar Pradesh, India', district: 'Agra' },
  { name: 'Varanasi', type: 'city', subtitle: 'Varanasi, Uttar Pradesh, India', district: 'Varanasi' },
  { name: 'Amritsar', type: 'city', subtitle: 'Amritsar, Punjab, India', district: 'Amritsar' },
  { name: 'Dehradun', type: 'city', subtitle: 'Dehradun, Uttarakhand, India', district: 'Dehradun' },
  { name: 'Srinagar', type: 'city', subtitle: 'Srinagar, Jammu & Kashmir, India', district: 'Srinagar' },
  { name: 'Jammu', type: 'city', subtitle: 'Jammu, Jammu & Kashmir, India', district: 'Jammu' },

  // South India Interstate Cities
  { name: 'Hyderabad', type: 'city', subtitle: 'Hyderabad, Telangana, India', district: 'Telangana' },
  { name: 'Bengaluru', type: 'city', subtitle: 'Bengaluru Urban, Karnataka, India', district: 'Karnataka' },
  { name: 'Chennai', type: 'city', subtitle: 'Chennai, Tamil Nadu, India', district: 'Tamil Nadu' },
  { name: 'Kochi', type: 'city', subtitle: 'Ernakulam, Kerala, India', district: 'Kerala' },
  { name: 'Thiruvananthapuram', type: 'city', subtitle: 'Thiruvananthapuram, Kerala, India', district: 'Kerala' },
  { name: 'Coimbatore', type: 'city', subtitle: 'Coimbatore, Tamil Nadu, India', district: 'Tamil Nadu' },
  { name: 'Madurai', type: 'city', subtitle: 'Madurai, Tamil Nadu, India', district: 'Tamil Nadu' },
  { name: 'Mysuru', type: 'city', subtitle: 'Mysuru, Karnataka, India', district: 'Karnataka' },
  { name: 'Mangaluru', type: 'city', subtitle: 'Dakshina Kannada, Karnataka, India', district: 'Karnataka' },
  
  // Airports
  { name: 'Rajiv Gandhi International Airport', type: 'airport', subtitle: 'Shamshabad, Hyderabad, Telangana', district: 'Telangana' },
  { name: 'Hyderabad Airport', type: 'airport', subtitle: 'Shamshabad, Hyderabad, Telangana', district: 'Telangana' },
  { name: 'Bengaluru Airport', type: 'airport', subtitle: 'Devanahalli, Bengaluru, Karnataka', district: 'Karnataka' },
  { name: 'Charminar', type: 'landmark', subtitle: 'Hyderabad, Telangana, India', district: 'Telangana' },

  // West India Major Cities
  { name: 'Mumbai', type: 'city', subtitle: 'Mumbai City, Maharashtra, India', district: 'Maharashtra' },
  { name: 'Pune', type: 'city', subtitle: 'Pune, Maharashtra, India', district: 'Maharashtra' },
  { name: 'Nagpur', type: 'city', subtitle: 'Nagpur, Maharashtra, India', district: 'Maharashtra' },
  { name: 'Nashik', type: 'city', subtitle: 'Nashik, Maharashtra, India', district: 'Maharashtra' },
  { name: 'Ahmedabad', type: 'city', subtitle: 'Ahmedabad, Gujarat, India', district: 'Gujarat' },
  { name: 'Surat', type: 'city', subtitle: 'Surat, Gujarat, India', district: 'Gujarat' },
  { name: 'Vadodara', type: 'city', subtitle: 'Vadodara, Gujarat, India', district: 'Gujarat' },
  { name: 'Rajkot', type: 'city', subtitle: 'Rajkot, Gujarat, India', district: 'Gujarat' },
  { name: 'Goa', type: 'city', subtitle: 'South Goa, Goa, India', district: 'Goa' },

  // East India Major Cities
  { name: 'Kolkata', type: 'city', subtitle: 'Kolkata, West Bengal, India', district: 'West Bengal' },
  { name: 'Bhubaneswar', type: 'city', subtitle: 'Khordha, Odisha, India', district: 'Odisha' },
  { name: 'Cuttack', type: 'city', subtitle: 'Cuttack, Odisha, India', district: 'Odisha' },
  { name: 'Patna', type: 'city', subtitle: 'Patna, Bihar, India', district: 'Bihar' },
  { name: 'Ranchi', type: 'city', subtitle: 'Ranchi, Jharkhand, India', district: 'Jharkhand' },
  { name: 'Jamshedpur', type: 'city', subtitle: 'East Singhbhum, Jharkhand, India', district: 'Jharkhand' },
  { name: 'Guwahati', type: 'city', subtitle: 'Kamrup Metropolitan, Assam, India', district: 'Assam' },
  { name: 'Siliguri', type: 'city', subtitle: 'Darjeeling, West Bengal, India', district: 'West Bengal' },

  // Central India Major Cities
  { name: 'Bhopal', type: 'city', subtitle: 'Bhopal, Madhya Pradesh, India', district: 'Madhya Pradesh' },
  { name: 'Indore', type: 'city', subtitle: 'Indore, Madhya Pradesh, India', district: 'Madhya Pradesh' },
  { name: 'Gwalior', type: 'city', subtitle: 'Gwalior, Madhya Pradesh, India', district: 'Madhya Pradesh' },
  { name: 'Jabalpur', type: 'city', subtitle: 'Jabalpur, Madhya Pradesh, India', district: 'Madhya Pradesh' },
  { name: 'Raipur', type: 'city', subtitle: 'Raipur, Chhattisgarh, India', district: 'Chhattisgarh' },
  { name: 'Bilaspur', type: 'city', subtitle: 'Bilaspur, Chhattisgarh, India', district: 'Chhattisgarh' },
];

const SUGGESTED_MAP_PINS = [
  { name: 'Visakhapatnam', lat: 17.6868, lon: 83.2185, x: 380, y: 150 },
  { name: 'Vijayawada', lat: 16.5062, lon: 80.6480, x: 270, y: 260 },
  { name: 'Rajahmundry', lat: 17.0005, lon: 81.7835, x: 310, y: 220 },
  { name: 'Tirupati', lat: 13.6288, lon: 79.4192, x: 210, y: 410 },
  { name: 'Bhimavaram', lat: 16.5449, lon: 81.5212, x: 290, y: 245 },
  { name: 'Guntur', lat: 16.3067, lon: 80.4365, x: 250, y: 270 },
];

interface LocationInputProps {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  suggestions?: string[];
}

export default function LocationInput({ label, placeholder, value, onChange }: LocationInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [showMapPicker, setShowMapPicker] = useState(false);
  const [geoLoading, setGeoLoading] = useState(false);
  const [customPin, setCustomPin] = useState<{ x: number; y: number } | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredSuggestions = useMemo(() => {
    if (!value.trim()) return [];
    const query = value.toLowerCase().trim();

    let matches = RICH_SUGGESTIONS.filter(
      (item) => item.name.toLowerCase().includes(query) || item.subtitle.toLowerCase().includes(query)
    );

    // Apply District Filter selection
    if (selectedDistrict !== 'all') {
      matches = matches.filter((m) => m.district.toLowerCase() === selectedDistrict.toLowerCase());
    }

    // Dynamic autocomplete fallback
    if (matches.length === 0) {
      const capQuery = value.charAt(0).toUpperCase() + value.slice(1);
      return [
        { name: capQuery, type: 'city', subtitle: `${capQuery}, India`, district: 'India' } as SuggestionItem,
        { name: `${capQuery} Railway Station`, type: 'station', subtitle: `${capQuery}, India`, district: 'India' } as SuggestionItem,
        { name: `${capQuery} Bus Stop`, type: 'bus', subtitle: `${capQuery}, India`, district: 'India' } as SuggestionItem,
      ];
    }

    const finalMatches: SuggestionItem[] = [];
    matches.slice(0, 10).forEach((m) => {
      finalMatches.push(m);
      
      const lowerName = m.name.toLowerCase();
      
      // Inject AP village local hub warnings
      if (lowerName === 'undi') {
        finalMatches.push({ name: 'Bhimavaram Junction', type: 'nearby_station', subtitle: 'Nearby Railway Stations', district: m.district });
        finalMatches.push({ name: 'Akividu Railway Station', type: 'nearby_station', subtitle: 'Nearby Railway Stations', district: m.district });
      } else if (lowerName === 'kalla') {
        finalMatches.push({ name: 'Bhimavaram Junction', type: 'nearby_station', subtitle: 'Nearby Railway Stations', district: m.district });
        finalMatches.push({ name: 'Akividu Railway Station', type: 'nearby_station', subtitle: 'Nearby Railway Stations', district: m.district });
        finalMatches.push({ name: 'Kalla Bus Stop', type: 'nearby_bus', subtitle: 'Nearby Bus Stops', district: m.district });
      }
      
      // Inject Hyderabad primary options (Verbatim UI spec match)
      else if (lowerName === 'hyderabad') {
        finalMatches.push({ name: 'Telangana, India', type: 'landmark', subtitle: 'State of Hyderabad', district: m.district });
        finalMatches.push({ name: 'Hyderabad Railway Station', type: 'station', subtitle: 'Nampally, Hyderabad, Telangana', district: m.district });
        finalMatches.push({ name: 'Secunderabad Railway Station', type: 'station', subtitle: 'Secunderabad, Telangana', district: m.district });
        finalMatches.push({ name: 'MGBS Bus Station', type: 'bus', subtitle: 'Imlibun, Hyderabad, Telangana', district: m.district });
        finalMatches.push({ name: 'Rajiv Gandhi International Airport', type: 'airport', subtitle: 'Shamshabad, Hyderabad, Telangana', district: m.district });
      }
      
      // Inject Bengaluru options
      else if (lowerName === 'bengaluru') {
        finalMatches.push({ name: 'Bengaluru Railway Station', type: 'station', subtitle: 'Majestic, Bengaluru, Karnataka', district: m.district });
        finalMatches.push({ name: 'Bengaluru Bus Station', type: 'bus', subtitle: 'Majestic, Bengaluru, Karnataka', district: m.district });
        finalMatches.push({ name: 'Kempegowda International Airport', type: 'airport', subtitle: 'Devanahalli, Bengaluru, Karnataka', district: m.district });
      }

      // Inject Chennai options
      else if (lowerName === 'chennai') {
        finalMatches.push({ name: 'Chennai Central Railway Station', type: 'station', subtitle: 'Periamet, Chennai, Tamil Nadu', district: m.district });
        finalMatches.push({ name: 'Koyambedu Bus Station', type: 'bus', subtitle: 'Koyambedu, Chennai, Tamil Nadu', district: m.district });
        finalMatches.push({ name: 'Chennai International Airport', type: 'airport', subtitle: 'Meenambakkam, Chennai, Tamil Nadu', district: m.district });
      }

      // Inject Delhi options
      else if (lowerName === 'delhi') {
        finalMatches.push({ name: 'New Delhi Railway Station', type: 'station', subtitle: 'Paharganj, New Delhi, Delhi', district: m.district });
        finalMatches.push({ name: 'Kashmere Gate ISBT', type: 'bus', subtitle: 'Kashmere Gate, Delhi', district: m.district });
        finalMatches.push({ name: 'Indira Gandhi International Airport', type: 'airport', subtitle: 'Palam, New Delhi, Delhi', district: m.district });
      }
    });

    // Remove duplicates
    const uniqueMatches: SuggestionItem[] = [];
    const seen = new Set<string>();
    for (const item of finalMatches) {
      const key = `${item.name.toLowerCase()}-${item.type}`;
      if (!seen.has(key)) {
        seen.add(key);
        uniqueMatches.push(item);
      }
    }

    return uniqueMatches;
  }, [value, selectedDistrict]);

  const getEmojiForType = (type: SuggestionItem['type']) => {
    switch (type) {
      case 'city': return '📍';
      case 'station': return '🚆';
      case 'bus': return '🚌';
      case 'airport': return '✈️';
      case 'landmark': return '📍';
      case 'nearby_station': return '🚆';
      case 'nearby_bus': return '🚌';
    }
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        onChange(`Current Location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`);
        setGeoLoading(false);
        setIsFocused(false);
      },
      (error) => {
        console.error(error);
        onChange('Bhimavaram, Andhra Pradesh (My Location)');
        setGeoLoading(false);
        setIsFocused(false);
      },
      { timeout: 8000 }
    );
  };

  const handleMapCanvasClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setCustomPin({ x, y });
  };

  const confirmMapSelection = (selectedName: string) => {
    onChange(selectedName);
    setShowMapPicker(false);
    setCustomPin(null);
  };

  return (
    <div ref={containerRef} className="space-y-1.5 text-sm font-semibold text-blue-955 block relative">
      <span className="flex items-center justify-between">
        <span className="flex items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-blue-100 to-blue-50 text-blue-600 shadow-sm border border-blue-200/50">
            <MapPin className="h-4 w-4" />
          </span>
          {label}
        </span>
      </span>

      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onFocus={() => setIsFocused(true)}
          placeholder={placeholder}
          className="w-full rounded-xl border border-[#D9DED9] bg-white px-4 py-3 text-sm text-[#1F2933] outline-none transition focus:border-[#146B5B] focus:ring-1 focus:ring-[#146B5B]"
        />

        {/* Dropdown suggestions popup */}
        {isFocused && (
          <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-blue-200 bg-white shadow-xl max-h-[340px] overflow-y-auto">
            
            {/* District Selector Filter Dropdown (restricted to AP districts) */}
            <div className="px-4 py-2 border-b border-blue-100 bg-blue-50/50 flex items-center justify-between gap-2">
              <span className="text-[10px] font-black uppercase text-blue-500 tracking-wider">AP District Filter</span>
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                onMouseDown={(e) => e.stopPropagation()} 
                className="text-xs bg-white border border-blue-200 rounded px-2.5 py-1 text-blue-900 font-extrabold outline-none cursor-pointer"
              >
                <option value="all">🔍 All Districts</option>
                {AP_DISTRICTS.map(dist => (
                  <option key={dist} value={dist}>{dist}</option>
                ))}
              </select>
            </div>

            {/* Geolocation trigger */}
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                handleUseCurrentLocation();
              }}
              className="w-full px-4 py-3 text-left text-sm text-blue-700 hover:bg-blue-50 flex items-center gap-2.5 border-b border-blue-50 font-bold transition"
            >
              <Navigation className={`h-4 w-4 text-blue-500 ${geoLoading ? 'animate-spin' : ''}`} />
              {geoLoading ? 'Querying geolocation...' : '📍 Use My Current Location'}
            </button>

            {/* Map selector trigger */}
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                setShowMapPicker(true);
                setIsFocused(false);
              }}
              className="w-full px-4 py-3 text-left text-sm text-blue-700 hover:bg-blue-50 flex items-center gap-2.5 border-b border-blue-50 font-bold transition"
            >
              <Map className="h-4 w-4 text-blue-500" />
              🗺 Select on Map
            </button>

            {/* Match suggestions */}
            {filteredSuggestions.length > 0 ? (
              filteredSuggestions.map((item, idx) => {
                const isNearby = item.type === 'nearby_station' || item.type === 'nearby_bus';
                return (
                  <button
                    key={idx}
                    type="button"
                    onMouseDown={() => {
                      onChange(item.name);
                      setIsFocused(false);
                    }}
                    className={`w-full px-4 py-3 text-left text-sm hover:bg-blue-50 flex items-center gap-3 transition border-b border-blue-50/50 last:border-b-0 ${isNearby ? 'bg-amber-50/30 pl-8' : ''}`}
                  >
                    <span className="text-base shrink-0">{getEmojiForType(item.type)}</span>
                    <div className="flex-1 min-w-0">
                      <p className={`font-extrabold truncate ${isNearby ? 'text-amber-800' : 'text-blue-900'}`}>{item.name}</p>
                      <p className="text-[10px] text-blue-400 font-semibold uppercase tracking-wider">{item.subtitle}</p>
                    </div>
                  </button>
                );
              })
            ) : (
              value.trim() !== '' && (
                <div className="px-4 py-3 text-xs text-blue-500 font-semibold text-center italic">
                  Dynamic routing will compile for this query.
                </div>
              )
            )}
          </div>
        )}
      </div>

      {/* Map selection Modal overlay */}
      {showMapPicker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-blue-955/40 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="w-full max-w-xl bg-white rounded-[2rem] shadow-2xl border border-blue-200 overflow-hidden flex flex-col">
            <div className="flex items-center justify-between bg-gradient-to-r from-blue-600 to-blue-800 p-5 text-white">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] font-bold text-blue-100">Select Location on Andhra Pradesh Map</p>
                <h3 className="text-lg font-black">{label}</h3>
              </div>
              <button
                onClick={() => {
                  setShowMapPicker(false);
                  setCustomPin(null);
                }}
                className="rounded-full bg-white/20 p-2 hover:bg-white/30 transition"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            <div className="p-5 space-y-4 flex-1">
              <p className="text-xs text-blue-850 font-semibold flex items-center gap-1.5 bg-blue-50 p-3 rounded-xl border border-blue-100">
                🗺 Select a key AP district city node, or click on the grid to drop a custom geocoded pin.
              </p>

              {/* Map Canvas */}
              <div className="relative bg-gradient-to-br from-blue-50 to-sky-50 rounded-2xl border border-blue-200 overflow-hidden min-h-[300px]">
                <svg
                  viewBox="0 0 500 500"
                  onClick={handleMapCanvasClick}
                  className="w-full h-full max-h-[350px] cursor-crosshair select-none"
                >
                  <defs>
                    <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#2563eb" strokeWidth="0.5" strokeOpacity="0.04" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />

                  <path d="M 50 450 Q 200 350 250 250 T 450 100" fill="none" stroke="#3b82f6" strokeWidth="2" strokeOpacity="0.12" />

                  {SUGGESTED_MAP_PINS.map((pin, idx) => (
                    <g
                      key={idx}
                      className="group cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        confirmMapSelection(pin.name);
                      }}
                    >
                      <circle cx={pin.x} cy={pin.y} r="10" fill="none" className="stroke-blue-500 stroke-2 group-hover:scale-150 transition-all origin-center" />
                      <circle cx={pin.x} cy={pin.y} r="5" fill="#2563eb" className="group-hover:fill-blue-700 transition" />
                      <text x={pin.x} y={pin.y - 12} textAnchor="middle" fontSize="9" fontWeight="bold" fill="#1e3a8a">
                        {pin.name}
                      </text>
                    </g>
                  ))}

                  {customPin && (
                    <g className="animate-bounce">
                      <circle cx={customPin.x} cy={customPin.y} r="12" fill="none" stroke="#ef4444" strokeWidth="2" />
                      <circle cx={customPin.x} cy={customPin.y} r="5" fill="#ef4444" />
                      <text x={customPin.x} y={customPin.y - 16} textAnchor="middle" fontSize="9" fontWeight="extrabold" fill="#b91c1c">
                        Custom Pinned Point
                      </text>
                    </g>
                  )}
                </svg>
              </div>

              {customPin && (
                <button
                  onClick={() => {
                    const mockLat = (18.0 - (customPin.y / 500) * 5).toFixed(4);
                    const mockLon = (79.0 + (customPin.x / 500) * 5).toFixed(4);
                    confirmMapSelection(`Pinned Point (${mockLat}, ${mockLon})`);
                  }}
                  className="w-full py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition shadow-md"
                >
                  📍 Confirm Pinned Location
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import { useEffect, useRef, useState } from 'react';
import { X, MapPin, Navigation } from 'lucide-react';
import type { RouteResult } from '../services/routeService';

interface RouteMapProps {
  route: RouteResult;
  isOpen: boolean;
  onClose: () => void;
}

const COORDINATES: Record<string, { x: number; y: number }> = {
  // Bhimavaram -> Vijayawada specific coordinate coordinates
  'bhimavaram': { x: 120, y: 250 },
  'bhimavaram railway station': { x: 240, y: 150 },
  'bhimavaram bus station': { x: 240, y: 350 },
  'vijayawada': { x: 460, y: 250 },
  'vijayawada railway station': { x: 460, y: 150 },
  'vijayawada bus station': { x: 460, y: 350 },
  'vijayawada final destination': { x: 580, y: 250 },

  // Mumbai -> Pune specific coordinates
  'mumbai': { x: 120, y: 250 },
  'mumbai railway station': { x: 240, y: 150 },
  'mumbai bus station': { x: 240, y: 350 },
  'pune railway station': { x: 460, y: 150 },
  'pune bus station': { x: 460, y: 350 },
  'pune destination': { x: 580, y: 250 },

  // Narasaraopet -> Ongole corridor coordinates
  'narasaraopet': { x: 120, y: 250 },
  'narasaraopet bus station': { x: 200, y: 250 },
  'narasaraopet railway station': { x: 200, y: 170 },
  'addanki': { x: 350, y: 200 },
  'chilakaluripeta': { x: 350, y: 300 },
  'ongole': { x: 580, y: 250 },
  'ongole bus stand': { x: 500, y: 250 },
  'ongole railway station': { x: 500, y: 170 }
};

function getNodeCoordinates(nodeName: string, isOrigin: boolean): { x: number; y: number } {
  const name = nodeName.toLowerCase().trim();
  
  if (COORDINATES[name]) return COORDINATES[name];

  // Dynamic allocator based on name matches
  if (isOrigin) {
    if (name.includes('railway') || name.includes('station') || name.includes('junction') || name.includes('central')) {
      return { x: 240, y: 150 };
    }
    if (name.includes('bus') || name.includes('terminal') || name.includes('stand') || name.includes('isbt')) {
      return { x: 240, y: 350 };
    }
    return { x: 120, y: 250 };
  } else {
    if (name.includes('railway') || name.includes('station') || name.includes('junction') || name.includes('central')) {
      return { x: 460, y: 150 };
    }
    if (name.includes('bus') || name.includes('terminal') || name.includes('stand') || name.includes('isbt')) {
      return { x: 460, y: 350 };
    }
    return { x: 580, y: 250 };
  }
}

const MODE_COLORS = {
  train: '#2563eb',   // Blue
  bus: '#16a34a',     // Green
  uber: '#0f172a',    // Black (Slate-900)
  rapido: '#ea580c',  // Orange
  walking: '#64748b'  // Gray (Slate-500)
};

const MODE_EMOJIS = {
  train: '🚆',
  bus: '🚌',
  uber: '🚗',
  rapido: '🛵',
  walking: '🚶'
};

export default function RouteMap({ route, isOpen, onClose }: RouteMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const userMarkerRef = useRef<any>(null);
  const [mapLoading, setMapLoading] = useState(false);
  const [mapError, setMapError] = useState('');
  const [locationLoading, setLocationLoading] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if (!isOpen || !mapRef.current) return;

    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    if (!apiKey) return;

    let cancelled = false;
    setMapLoading(true);
    setMapError('');

    const loadGoogleMaps = () => new Promise<void>((resolve, reject) => {
      if (window.google?.maps) {
        resolve();
        return;
      }
      const existingScript = document.querySelector('script[data-google-maps="true"]') as HTMLScriptElement | null;
      if (existingScript) {
        existingScript.addEventListener('load', () => resolve(), { once: true });
        existingScript.addEventListener('error', () => reject(new Error('Google Maps failed to load.')), { once: true });
        return;
      }
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.dataset.googleMaps = 'true';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Google Maps failed to load. Check the API key and enabled APIs.'));
      document.head.appendChild(script);
    });

    loadGoogleMaps().then(() => {
      if (cancelled || !mapRef.current || !window.google?.maps) return;
      const map = new window.google.maps.Map(mapRef.current, {
        center: { lat: 16.3067, lng: 80.4365 },
        zoom: 8,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true
      });
      mapInstanceRef.current = map;

      const directionsService = new window.google.maps.DirectionsService();
      const renderers: any[] = [];
      const colors: Record<string, string> = {
        train: '#2563eb',
        bus: '#16a34a',
        uber: '#0f172a',
        rapido: '#ea580c',
        walking: '#64748b'
      };
      const travelModes: Record<string, any> = {
        train: 'TRANSIT',
        bus: 'TRANSIT',
        uber: 'DRIVING',
        rapido: 'DRIVING',
        walking: 'WALKING'
      };

      route.segments.forEach((segment) => {
        const renderer = new window.google.maps.DirectionsRenderer({
          map,
          suppressMarkers: false,
          polylineOptions: { strokeColor: colors[segment.mode] || '#146b5b', strokeWeight: 6, strokeOpacity: 0.85 }
        });
        renderers.push(renderer);
        directionsService.route({
          origin: segment.from,
          destination: segment.to,
          waypoints: (segment.stops || '').split(',').map((stop: string) => stop.trim()).filter(Boolean).map((stop: string) => ({ location: stop, stopover: true })),
          travelMode: travelModes[segment.mode] || 'DRIVING',
          transitOptions: segment.mode === 'train' || segment.mode === 'bus' ? { departureTime: new Date() } : undefined,
          provideRouteAlternatives: false
        }, (result: any, status: string) => {
          if (cancelled) return;
          if (status === 'OK' && result) {
            renderer.setDirections(result);
          } else if (!mapError) {
            setMapError(`Google directions could not be found for ${segment.from} to ${segment.to}.`);
          }
        });
      });

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          if (cancelled) return;
          const current = { lat: position.coords.latitude, lng: position.coords.longitude };
          setUserLocation(current);
          userMarkerRef.current = new window.google.maps.Marker({ map, position: current, title: 'Your current location', icon: { path: window.google.maps.SymbolPath.CIRCLE, scale: 8, fillColor: '#2563eb', fillOpacity: 1, strokeColor: '#ffffff', strokeWeight: 3 } });
        }, () => undefined, { enableHighAccuracy: true, timeout: 10000 });
      }

      setMapLoading(false);
      return () => renderers.forEach((renderer) => renderer.setMap(null));
    }).catch((error: Error) => {
      if (!cancelled) setMapError(error.message);
    }).finally(() => {
      if (!cancelled) setMapLoading(false);
    });

    return () => {
      cancelled = true;
      mapInstanceRef.current = null;
      userMarkerRef.current = null;
    };
  }, [isOpen, route]);

  const showCurrentLocation = () => {
    if (!navigator.geolocation || !mapInstanceRef.current) {
      setMapError('Location access is not supported by this browser.');
      return;
    }
    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition((position) => {
      const current = { lat: position.coords.latitude, lng: position.coords.longitude };
      setUserLocation(current);
      mapInstanceRef.current.setCenter(current);
      mapInstanceRef.current.setZoom(14);
      userMarkerRef.current?.setPosition(current);
      userMarkerRef.current?.setVisible(true);
      setLocationLoading(false);
    }, (error) => {
      setLocationLoading(false);
      setMapError(error.code === error.PERMISSION_DENIED ? 'Location permission was denied. Allow it in your browser to show your position.' : 'Unable to access your current location.');
    }, { enableHighAccuracy: true, timeout: 10000 });
  };

  if (!isOpen) return null;

  // Prepare nodes mapping
  const segmentsWithCoords = route.segments.map((seg, index) => {
    // If there is only 1 segment (direct route), we plot from x: 120, y: 250 to x: 580, y: 250 directly
    const isSingleSegment = route.segments.length === 1;
    
    let fromCoord = { x: 0, y: 0 };
    let toCoord = { x: 0, y: 0 };

    if (isSingleSegment) {
      fromCoord = { x: 120, y: 250 };
      toCoord = { x: 580, y: 250 };
    } else {
      fromCoord = getNodeCoordinates(seg.from, index < route.segments.length / 2);
      toCoord = getNodeCoordinates(seg.to, index + 1 < route.segments.length / 2);
    }

    return {
      ...seg,
      fromCoord,
      toCoord
    };
  });

  // Extract unique station nodes to draw markers
  const uniqueNodesMap = new Map<string, { x: number; y: number; label: string; type: 'origin' | 'dest' | 'station' }>();
  
  // Add first node
  const startNode = segmentsWithCoords[0];
  uniqueNodesMap.set(startNode.from.toLowerCase(), {
    x: startNode.fromCoord.x,
    y: startNode.fromCoord.y,
    label: startNode.from,
    type: 'origin'
  });

  // Add intermediate and last nodes
  segmentsWithCoords.forEach((seg) => {
    const isLast = seg === segmentsWithCoords[segmentsWithCoords.length - 1];
    uniqueNodesMap.set(seg.to.toLowerCase(), {
      x: seg.toCoord.x,
      y: seg.toCoord.y,
      label: seg.to,
      type: isLast ? 'dest' : 'station'
    });
  });

  const uniqueNodes = Array.from(uniqueNodesMap.values());

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-blue-950/40 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="w-full max-w-4xl bg-white rounded-[2rem] shadow-2xl border border-blue-200 overflow-hidden flex flex-col md:max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] font-bold text-blue-100">Interactive Journey Map</p>
            <h3 className="text-xl md:text-2xl font-black">{route.from} → {route.to}</h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-full bg-white/20 p-2.5 hover:bg-white/35 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Google map canvas */}
          <div className="relative overflow-hidden rounded-2xl border border-blue-100 bg-blue-50 min-h-[380px]">
            <div ref={mapRef} className="absolute inset-0" />
            {!import.meta.env.VITE_GOOGLE_MAPS_API_KEY && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-blue-50 p-6 text-center">
                <MapPin className="h-10 w-10 text-blue-500" />
                <p className="text-sm font-bold text-blue-900">Add VITE_GOOGLE_MAPS_API_KEY to show live Google directions.</p>
                <a href="https://www.google.com/maps" target="_blank" rel="noreferrer" className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700">Open Google Maps</a>
              </div>
            )}
            {mapLoading && <div className="absolute inset-0 flex items-center justify-center bg-blue-50/85 text-sm font-bold text-blue-700">Loading Google directions...</div>}
            {mapError && <div className="absolute bottom-3 left-3 right-3 rounded-xl bg-red-50 p-3 text-xs font-bold text-red-700 shadow">{mapError}</div>}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs font-semibold text-slate-600">
              {userLocation ? 'Your current position is shown on the map.' : 'Allow location access to show your current position.'}
            </p>
            <button type="button" onClick={showCurrentLocation} disabled={locationLoading || !import.meta.env.VITE_GOOGLE_MAPS_API_KEY} className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-blue-700 disabled:opacity-50">
              <Navigation className="h-4 w-4" />
              {locationLoading ? 'Requesting permission...' : 'Show My Location'}
            </button>
          </div>

          {/* Quick Route Leg Timeline below map */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50/50 border border-blue-200/50 rounded-2xl p-4 flex items-center gap-3">
              <span className="text-2xl font-bold text-blue-600">⏱</span>
              <div>
                <p className="text-xs uppercase tracking-wider font-bold text-blue-500">Duration</p>
                <p className="text-base font-black text-blue-900">
                  {Math.floor(route.totalDurationMinutes / 60)}h {route.totalDurationMinutes % 60}m
                </p>
              </div>
            </div>
            
            <div className="bg-blue-50/50 border border-blue-200/50 rounded-2xl p-4 flex items-center gap-3">
              <span className="text-2xl font-bold text-blue-600">💵</span>
              <div>
                <p className="text-xs uppercase tracking-wider font-bold text-blue-500">Total Price</p>
                <p className="text-base font-black text-blue-900">₹{route.totalPrice}</p>
              </div>
            </div>
            
            <div className="bg-blue-50/50 border border-blue-200/50 rounded-2xl p-4 flex items-center gap-3">
              <span className="text-2xl font-bold text-blue-600">🔄</span>
              <div>
                <p className="text-xs uppercase tracking-wider font-bold text-blue-500">Transfers</p>
                <p className="text-base font-black text-blue-900">
                  {route.totalTransfers === 0 ? 'Direct Journey' : `${route.totalTransfers} Transfer(s)`}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

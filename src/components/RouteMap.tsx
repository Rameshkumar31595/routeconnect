import { X, MapPin } from 'lucide-react';
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
  'pune destination': { x: 580, y: 250 }
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
          {/* Map canvas */}
          <div className="relative bg-gradient-to-br from-blue-50/50 to-blue-100/30 rounded-2xl border border-blue-100 p-4 min-h-[350px] flex items-center justify-center overflow-hidden">
            <svg 
              viewBox="0 0 700 500" 
              className="w-full max-h-[380px] select-none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Grid Background Lines (Styling) */}
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#2563eb" strokeWidth="0.5" strokeOpacity="0.04" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" rx="16" />

              {/* Draw Route Paths */}
              {segmentsWithCoords.map((seg, idx) => {
                const color = MODE_COLORS[seg.mode as keyof typeof MODE_COLORS] || '#64748b';
                
                // Draw path line
                return (
                  <g key={`path-${idx}`}>
                    {/* Glow outline */}
                    <line 
                      x1={seg.fromCoord.x} 
                      y1={seg.fromCoord.y} 
                      x2={seg.toCoord.x} 
                      y2={seg.toCoord.y} 
                      stroke={color} 
                      strokeWidth="10" 
                      strokeLinecap="round"
                      strokeOpacity="0.12" 
                    />
                    
                    {/* Main track line */}
                    <line 
                      x1={seg.fromCoord.x} 
                      y1={seg.fromCoord.y} 
                      x2={seg.toCoord.x} 
                      y2={seg.toCoord.y} 
                      stroke={color} 
                      strokeWidth="4" 
                      strokeLinecap="round"
                      strokeDasharray={seg.mode === 'walking' ? '5,5' : undefined}
                      className={seg.mode !== 'walking' ? 'animate-dash' : undefined}
                    />

                    {/* Floating mode icon bubble halfway through the line */}
                    <g transform={`translate(${(seg.fromCoord.x + seg.toCoord.x) / 2}, ${(seg.fromCoord.y + seg.toCoord.y) / 2})`}>
                      <circle r="12" fill={color} className="shadow-md" />
                      <text 
                        textAnchor="middle" 
                        alignmentBaseline="middle" 
                        y="1" 
                        fontSize="12"
                      >
                        {MODE_EMOJIS[seg.mode as keyof typeof MODE_EMOJIS]}
                      </text>
                    </g>
                  </g>
                );
              })}

              {/* Draw Station and City Nodes */}
              {uniqueNodes.map((node, idx) => {
                const isStation = node.type === 'station';
                const isOrigin = node.type === 'origin';
                const isDest = node.type === 'dest';
                
                let ringColor = 'stroke-blue-500';
                let dotColor = 'fill-blue-600';
                if (isOrigin) {
                  ringColor = 'stroke-green-500';
                  dotColor = 'fill-green-600';
                } else if (isDest) {
                  ringColor = 'stroke-red-500';
                  dotColor = 'fill-red-600';
                }

                return (
                  <g key={`node-${idx}`} className="cursor-pointer">
                    {/* Outer pulsing ring for key nodes */}
                    {!isStation && (
                      <circle 
                        cx={node.x} 
                        cy={node.y} 
                        r="16" 
                        fill="none" 
                        className={`${ringColor} stroke-2 animate-ping opacity-35`} 
                      />
                    )}
                    
                    {/* Ring border */}
                    <circle 
                      cx={node.x} 
                      cy={node.y} 
                      r={isStation ? '8' : '10'} 
                      fill="#ffffff" 
                      stroke={isStation ? '#94a3b8' : '#1e3a8a'}
                      strokeWidth="3" 
                    />

                    {/* Center point dot */}
                    <circle 
                      cx={node.x} 
                      cy={node.y} 
                      r={isStation ? '4' : '5'} 
                      className={dotColor}
                    />

                    {/* Label Badge */}
                    <g transform={`translate(${node.x}, ${node.y + (isStation ? 22 : 26)})`}>
                      {/* Label Text shadow container for readability */}
                      <rect 
                        x={-Math.min(node.label.length * 4.5, 90)} 
                        y="-10" 
                        width={Math.min(node.label.length * 9, 180)} 
                        height="16" 
                        fill="#ffffff" 
                        rx="4" 
                        fillOpacity="0.85" 
                      />
                      <text 
                        textAnchor="middle" 
                        fontSize={isStation ? '9' : '11'} 
                        fontWeight="bold"
                        fill="#0f172a"
                      >
                        {node.label}
                      </text>
                    </g>
                  </g>
                );
              })}
            </svg>
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

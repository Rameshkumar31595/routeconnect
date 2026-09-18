export interface RouteSegment {
  mode: 'train' | 'bus' | 'uber' | 'rapido' | 'walking';
  provider: string;
  from: string;
  to: string;
  durationMinutes: number;
  distanceKm: number;
  price: number;
  departure: string | null;
  arrival: string | null;
  trainName?: string | null;
  trainNumber?: string | null;
  serviceName?: string | null;
  busType?: string | null;
  stops?: string | null;
}

export interface RouteResult {
  id: string;
  from: string;
  to: string;
  totalPrice: number;
  totalDurationMinutes: number;
  totalTransfers: number;
  tag: 'cheapest' | 'fastest' | 'best' | null;
  segments: RouteSegment[];
  routeName?: string;
  via?: string;
  highway?: string;
  villages?: string[];
  distanceKm?: number;
}

export async function searchRoutes(from: string, to: string, routeType: 'budget' | 'fast'): Promise<RouteResult[]> {
  // Backward compatibility with legacy direct routes search
  try {
    const params = new URLSearchParams({
      from: from.trim(),
      to: to.trim(),
      type: routeType,
    });

    const response = await fetch(`/api/routes?${params.toString()}`);
    if (!response.ok) {
      throw new Error('Failed to fetch routes from server');
    }

    const data = await response.json();
    // Map simple routes to multi-modal structure
    const mapped: RouteResult[] = (data.routes || []).map((r: any) => {
      const mode = r.transport.toLowerCase().includes('train') ? 'train' : 'bus';
      const durationMatch = r.duration.match(/(\d+)h\s*(\d*)m?/);
      let durationMinutes = 180;
      if (durationMatch) {
        durationMinutes = parseInt(durationMatch[1]) * 60 + (parseInt(durationMatch[2]) || 0);
      }
      
      const distanceVal = parseFloat(r.distance.replace(/[^\d.]/g, '')) || 100;
      const priceVal = routeType === 'budget' ? 180 : 350;

      return {
        id: r.id,
        from: r.from,
        to: r.to,
        totalPrice: priceVal,
        totalDurationMinutes: durationMinutes,
        totalTransfers: r.connections,
        tag: null,
        segments: [
          {
            mode,
            provider: r.transport,
            from: r.from,
            to: r.to,
            durationMinutes,
            distanceKm: distanceVal,
            price: priceVal,
            departure: '10:00',
            arrival: '13:00'
          }
        ]
      };
    });
    return mapped;
  } catch (error) {
    console.error('searchRoutes error:', error);
    return [];
  }
}

export async function searchMultiModalRoutes(
  from: string,
  to: string,
  date: string,
  time: string,
  passengers: number
): Promise<RouteResult[]> {
  const params = new URLSearchParams({
    from: from.trim(),
    to: to.trim(),
    date,
    time,
    passengers: passengers.toString(),
  });

  let response: Response;
  try {
    response = await fetch(`/api/planner?${params.toString()}`);
  } catch {
    throw new Error('The route planner is offline. Check your connection and try again.');
  }

  const contentType = response.headers.get('content-type') || '';
  if (!response.ok) {
    if (contentType.includes('application/json')) {
      const data = await response.json();
      throw new Error(data.error || 'The route planner could not complete this search.');
    }
    throw new Error('The route planner is unavailable. Check that the server is running and try again.');
  }

  if (!contentType.includes('application/json')) {
    throw new Error('The route planner returned an unexpected response.');
  }

  const data = await response.json();
  const routes: RouteResult[] = data.routes || [];
  // Ensure walking is only shown when distance is 1.0 km or less
  return routes.filter(route => !route.segments.some(seg => seg.mode === 'walking' && seg.distanceKm > 1.0));
}

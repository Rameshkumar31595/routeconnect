import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { ArrowLeft, Bus, MapPin, Route, Train } from 'lucide-react';

export default function About() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#E7F0EC] text-[#1F2933]">
      <Navbar />
      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate(-1)}
          className="mb-10 inline-flex items-center gap-2 text-sm font-bold text-[#146B5B] hover:text-[#0f5447] transition"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        <header className="max-w-2xl border-l-4 border-[#146B5B] pl-5">
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#146B5B]">About RouteConnect</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">A clearer way to plan the in-between parts.</h1>
          <p className="mt-5 text-base leading-7 text-[#667085]">
            RouteConnect brings the pieces of an Indian journey into one view, so you can compare a train or bus with the local ride that gets you to the station, and then onward to your destination.
          </p>
        </header>

        <section className="mt-12 grid gap-4 sm:grid-cols-3" aria-label="RouteConnect transport modes">
          <div className="border border-[#D9DED9] bg-white p-5">
            <Train className="h-5 w-5 text-[#146B5B]" />
            <h2 className="mt-4 font-black">Rail connections</h2>
            <p className="mt-2 text-sm leading-6 text-[#667085]">See train names, numbers, stops, timing, and estimated fare in the route details.</p>
          </div>
          <div className="border border-[#D9DED9] bg-white p-5">
            <Bus className="h-5 w-5 text-[#146B5B]" />
            <h2 className="mt-4 font-black">Bus alternatives</h2>
            <p className="mt-2 text-sm leading-6 text-[#667085]">Compare APSRTC services when a bus is the simpler connection for your journey.</p>
          </div>
          <div className="border border-[#D9DED9] bg-white p-5">
            <Route className="h-5 w-5 text-[#146B5B]" />
            <h2 className="mt-4 font-black">The whole journey</h2>
            <p className="mt-2 text-sm leading-6 text-[#667085]">Expand a result to inspect transfers, distances, local legs, and the route map.</p>
          </div>
        </section>

        <section className="mt-12 grid gap-8 border-t border-[#D9DED9] pt-10 md:grid-cols-[1fr_240px]">
          <div>
            <h2 className="text-2xl font-black">Built for useful comparisons</h2>
            <div className="mt-4 space-y-4 text-sm leading-7 text-[#667085]">
              <p>Search by city, village, station, bus stop, airport, or landmark. Suggestions include the surrounding district so similarly named places are easier to tell apart.</p>
              <p>Results are provided by the RouteConnect planner and are intended for comparison. Prices and schedules are estimates, so confirm the final details with the operator before travelling.</p>
            </div>
          </div>
          <aside className="border border-[#D9DED9] bg-white p-5">
            <MapPin className="h-5 w-5 text-[#146B5B]" />
            <h2 className="mt-4 font-black">Start with a place</h2>
            <p className="mt-2 text-sm leading-6 text-[#667085]">Return to the dashboard whenever you are ready to plan another journey.</p>
            <button
              onClick={() => navigate('/dashboard')}
              className="mt-5 text-sm font-extrabold text-[#146B5B] hover:text-[#0f5447] transition"
            >
              Open planner <span aria-hidden="true">-&gt;</span>
            </button>
          </aside>
        </section>
      </main>
    </div>
  );
}

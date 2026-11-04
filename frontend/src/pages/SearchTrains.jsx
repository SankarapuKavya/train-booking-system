
import { Link } from 'react-router-dom';
import { TrainFront, MapPin, CalendarDays, Search, ArrowLeftRight } from 'lucide-react';

export default function SearchTrains({
  stations = [],
  from,
  setFrom,
  to,
  setTo,
  date,
  setDate,
  travelClass,
  setTravelClass,
  searchTrains,
  loading
}) {
  const classes = [
    { value: 'Sleeper', label: 'Sleeper' },
    { value: '3A', label: 'AC 3 Tier' },
    { value: '2A', label: 'AC 2 Tier' },
    { value: '1A', label: 'First AC' }
  ];

  const swapStations = () => {
    setFrom(to);
    setTo(from);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="flex items-center justify-between bg-[#102a43] px-6 py-5 text-white">
        <Link to="/" className="flex items-center gap-2 text-2xl font-extrabold">
          <TrainFront className="text-amber-400" />
          RailWay.
        </Link>
        <Link to="/my-bookings" className="font-semibold hover:text-amber-300">
          My Bookings
        </Link>
      </nav>

      <main className="mx-auto max-w-5xl px-5 py-12">
        <p className="font-bold uppercase tracking-widest text-amber-600">
          Plan your journey
        </p>

        <h1 className="mt-2 text-3xl font-black text-slate-800">
          Search Trains
        </h1>

        <p className="mt-2 text-slate-500">
          Select your journey details to find available trains.
        </p>

        <form
          onSubmit={searchTrains}
          className="mt-8 grid gap-5 rounded-3xl bg-white p-6 shadow-lg md:grid-cols-2"
        >
          <label className="block">
            <span className="mb-2 flex items-center gap-2 font-bold text-slate-600">
              <MapPin size={18} /> From
            </span>
            <select
              required
              value={from}
              onChange={e => setFrom(e.target.value)}
              className="w-full rounded-xl border p-4"
            >
              <option value="">Select source station</option>
              {stations.map(s => (
                <option key={s.station_code} value={s.station_code}>
                  {s.city} - {s.station_name} ({s.station_code})
                </option>
              ))}
            </select>
          </label>

          <div>
            <span className="mb-2 block font-bold text-slate-600">To</span>
            <div className="flex gap-2">
              <select
                required
                value={to}
                onChange={e => setTo(e.target.value)}
                className="min-w-0 flex-1 rounded-xl border p-4"
              >
                <option value="">Select destination</option>
                {stations.map(s => (
                  <option key={s.station_code} value={s.station_code}>
                    {s.city} - {s.station_name} ({s.station_code})
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={swapStations}
                title="Swap stations"
                className="rounded-xl border px-4 hover:bg-slate-100"
              >
                <ArrowLeftRight />
              </button>
            </div>
          </div>

          <label>
            <span className="mb-2 flex items-center gap-2 font-bold text-slate-600">
              <CalendarDays size={18} /> Journey Date
            </span>
            <input
              type="date"
              required
              min={new Date().toLocaleDateString('en-CA')}
              value={date}
              onChange={e => setDate(e.target.value)}
              className="w-full rounded-xl border p-4"
            />
          </label>

          <label>
            <span className="mb-2 block font-bold text-slate-600">
              Travel Class
            </span>
            <select
              value={travelClass}
              onChange={e => setTravelClass(e.target.value)}
              className="w-full rounded-xl border p-4"
            >
              {classes.map(c => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </label>

          <button
            disabled={loading}
            className="flex items-center justify-center gap-2 rounded-xl bg-amber-400 p-4 font-extrabold text-slate-900 hover:bg-amber-300 disabled:opacity-50 md:col-span-2"
          >
            <Search size={20} />
            {loading ? 'Searching...' : 'Search Trains'}
          </button>
        </form>
      </main>
    </div>
  );
}

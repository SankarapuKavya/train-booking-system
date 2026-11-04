
import { Link } from 'react-router-dom';
import { TrainFront, Armchair, ArrowLeft, RefreshCw } from 'lucide-react';

export default function SeatSelection({
  selectedTrain,
  seats = [],
  selectedSeat,
  setSelectedSeat,
  seatLoading,
  loadSeats,
  date,
  travelClass
}) {
  if (!selectedTrain) {
    return (
      <main className="min-h-screen bg-slate-50 p-10 text-center">
        <h2 className="text-2xl font-bold">No train selected</h2>
        <p className="mt-2 text-slate-500">Please search and select a train first.</p>
        <Link to="/search" className="mt-5 inline-block rounded-xl bg-amber-400 px-6 py-3 font-bold">
          Search Trains
        </Link>
      </main>
    );
  }

  const availableCount = seats.filter(s => s.status === 'Available').length;

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="flex items-center justify-between bg-[#102a43] px-6 py-5 text-white">
        <Link to="/" className="flex items-center gap-2 text-2xl font-extrabold">
          <TrainFront className="text-amber-400" /> RailWay.
        </Link>
        <Link to="/search" className="font-semibold hover:text-amber-300">
          Search Trains
        </Link>
      </nav>

      <main className="mx-auto max-w-5xl px-5 py-12">
        <Link to="/search" className="flex items-center gap-2 text-sm font-bold text-blue-800">
          <ArrowLeft size={17} /> Back to search
        </Link>

        <div className="mt-6 rounded-3xl bg-white p-6 shadow-lg">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-amber-600">
                Choose your seat
              </p>
              <h1 className="mt-2 text-2xl font-black text-slate-800">
                {selectedTrain.train_name}
              </h1>
              <p className="mt-2 text-sm text-slate-500">
                Train #{selectedTrain.train_number} · {date} · {travelClass}
              </p>
            </div>

            <button
              onClick={() => loadSeats(selectedTrain)}
              className="flex items-center gap-2 rounded-xl border px-4 py-3 font-bold hover:bg-slate-50"
            >
              <RefreshCw size={17} /> Refresh
            </button>
          </div>

          <div className="mt-7 flex flex-wrap gap-5 text-sm font-bold text-slate-600">
            <span>🟢 Available ({availableCount})</span>
            <span>🔴 Booked</span>
            <span>🔵 Selected</span>
          </div>

          {seatLoading ? (
            <p className="py-12 text-center text-slate-500">Loading seats...</p>
          ) : (
            <div className="mt-7 grid grid-cols-3 gap-3 sm:grid-cols-5 md:grid-cols-6">
              {seats.map(seat => (
                <button
                  key={seat.journey_seat_id}
                  disabled={seat.status === 'Booked'}
                  onClick={() => setSelectedSeat(seat)}
                  className={`rounded-xl border p-4 text-sm font-extrabold ${
                    seat.status === 'Booked'
                      ? 'border-red-200 bg-red-50 text-red-400'
                      : selectedSeat?.journey_seat_id === seat.journey_seat_id
                        ? 'border-blue-800 bg-blue-800 text-white'
                        : 'border-green-200 bg-green-50 text-green-700 hover:border-green-500'
                  }`}
                >
                  <Armchair className="mx-auto mb-1" size={20} />
                  {seat.seat_number}
                </button>
              ))}
            </div>
          )}

          {selectedSeat && (
            <div className="mt-8 rounded-2xl bg-blue-50 p-5">
              <p className="font-bold text-blue-900">
                Selected seat: {selectedSeat.seat_number}
              </p>

              <Link
                to="/confirmation"
                className="mt-4 inline-block rounded-xl bg-amber-400 px-6 py-3 font-extrabold text-slate-900 hover:bg-amber-300"
              >
                Continue
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

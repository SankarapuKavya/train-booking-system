
import { Link } from 'react-router-dom';
import { TrainFront, UserRound, Mail, CalendarDays, Armchair, CheckCircle2 } from 'lucide-react';

export default function BookingConfirmation({
  selectedTrain,
  selectedSeat,
  date,
  travelClass,
  passenger,
  setPassenger,
  bookSeat,
  notice
}) {
  if (!selectedTrain || !selectedSeat) {
    return (
      <main className="min-h-screen bg-slate-50 p-10 text-center">
        <h2 className="text-2xl font-bold text-slate-800">
          No seat selected
        </h2>
        <p className="mt-2 text-slate-500">
          Please select a train and seat before continuing.
        </p>
        <Link
          to="/search"
          className="mt-5 inline-block rounded-xl bg-amber-400 px-6 py-3 font-bold"
        >
          Search Trains
        </Link>
      </main>
    );
  }

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

      <main className="mx-auto max-w-3xl px-5 py-12">
        <p className="font-bold uppercase tracking-widest text-amber-600">
          Almost there
        </p>
        <h1 className="mt-2 text-3xl font-black text-slate-800">
          Passenger Details
        </h1>

        <div className="mt-7 rounded-2xl bg-white p-6 shadow-lg">
          <h2 className="text-lg font-extrabold text-slate-800">
            Journey Summary
          </h2>

          <div className="mt-4 grid gap-4 rounded-xl bg-slate-50 p-4 sm:grid-cols-2">
            <p><strong>Train:</strong> {selectedTrain.train_name}</p>
            <p><strong>Train number:</strong> {selectedTrain.train_number}</p>
            <p><strong>Seat:</strong> {selectedSeat.seat_number}</p>
            <p><strong>Class:</strong> {travelClass}</p>
            <p><strong>Journey date:</strong> {date}</p>
          </div>

          <form onSubmit={bookSeat} className="mt-7 space-y-4">
            <h2 className="text-lg font-extrabold text-slate-800">
              Passenger Information
            </h2>

            <label className="block">
              <span className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-600">
                <UserRound size={17} /> Full Name
              </span>
              <input
                required
                maxLength="100"
                value={passenger.name}
                onChange={e => setPassenger({ ...passenger, name: e.target.value })}
                placeholder="Enter passenger name"
                className="w-full rounded-xl border p-4 outline-none focus:border-blue-500"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-bold text-slate-600">
                Age
              </span>
              <input
                required
                type="number"
                min="1"
                max="120"
                value={passenger.age}
                onChange={e => setPassenger({ ...passenger, age: e.target.value })}
                placeholder="Enter age"
                className="w-full rounded-xl border p-4 outline-none focus:border-blue-500"
              />
            </label>

            <label className="block">
              <span className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-600">
                <Mail size={17} /> Email Address
              </span>
              <input
                required
                type="email"
                maxLength="150"
                value={passenger.email}
                onChange={e => setPassenger({ ...passenger, email: e.target.value })}
                placeholder="Enter email address"
                className="w-full rounded-xl border p-4 outline-none focus:border-blue-500"
              />
            </label>

            {notice?.type === 'error' && (
              <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">
                {notice.text}
              </p>
            )}

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-400 p-4 font-extrabold text-slate-900 hover:bg-amber-300"
            >
              <CheckCircle2 size={20} />
              Confirm Booking
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

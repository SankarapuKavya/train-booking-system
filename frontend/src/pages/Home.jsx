
import { Link } from 'react-router-dom';
import { TrainFront, Search, Ticket, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="flex items-center justify-between bg-[#102a43] px-6 py-5 text-white">
        <Link to="/" className="flex items-center gap-2 text-2xl font-extrabold">
          <TrainFront className="text-amber-400" />
          RailWay<span className="text-amber-400">.</span>
        </Link>

        <div className="flex gap-5 text-sm font-semibold">
          <Link to="/" className="hover:text-amber-300">Home</Link>
          <Link to="/search" className="hover:text-amber-300">Book Tickets</Link>
          <Link to="/my-bookings" className="hover:text-amber-300">My Bookings</Link>
        </div>
      </nav>

      <main className="flex min-h-[80vh] items-center justify-center bg-gradient-to-br from-[#102a43] to-[#256080] px-6 py-16 text-center text-white">
        <div className="max-w-3xl">
          <TrainFront size={65} className="mx-auto mb-6 text-amber-400" />

          <p className="mb-4 font-bold uppercase tracking-[.25em] text-amber-300">
            Welcome to RailWay
          </p>

          <h1 className="text-4xl font-black leading-tight sm:text-6xl">
            Your Journey Starts Here
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-blue-100">
            Search trains, choose your preferred seats and manage your
            train bookings with ease.
          </p>

          <div className="mt-9 flex flex-wrap justify-center gap-4">
            <Link
              to="/search"
              className="flex items-center gap-2 rounded-xl bg-amber-400 px-7 py-4 font-extrabold text-slate-900 hover:bg-amber-300"
            >
              <Search size={20} />
              Book Tickets
              <ArrowRight size={18} />
            </Link>

            <Link
              to="/my-bookings"
              className="flex items-center gap-2 rounded-xl border border-white/40 px-7 py-4 font-bold hover:bg-white/10"
            >
              <Ticket size={20} />
              My Bookings
            </Link>
          </div>
        </div>
      </main>

      <footer className="bg-[#102a43] px-5 py-6 text-center text-sm text-blue-100">
        RailWay — Train Booking System Demo
      </footer>
    </div>
  );
}

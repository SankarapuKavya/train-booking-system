
import { Link } from 'react-router-dom';
import { TrainFront, Ticket, Search, XCircle } from 'lucide-react';

export default function MyBookings({
  myEmail,
  setMyEmail,
  fetchBookings,
  bookings = [],
  showBookings,
  cancelBooking,
  notice,
  formatDate
}) {
  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="flex items-center justify-between bg-[#102a43] px-6 py-5 text-white">
        <Link to="/" className="flex items-center gap-2 text-2xl font-extrabold">
          <TrainFront className="text-amber-400" />
          RailWay.
        </Link>

        <Link to="/search" className="font-semibold hover:text-amber-300">
          Book Tickets
        </Link>
      </nav>

      <main className="mx-auto max-w-4xl px-5 py-12">
        <p className="font-bold uppercase tracking-widest text-amber-600">
          Your tickets
        </p>

        <h1 className="mt-2 text-3xl font-black text-slate-800">
          My Bookings
        </h1>

        <p className="mt-2 text-slate-500">
          Enter the email address you used while booking.
        </p>

        <form
          onSubmit={fetchBookings}
          className="mt-7 flex flex-col gap-3 rounded-2xl bg-white p-5 shadow-sm sm:flex-row"
        >
          <input
            type="email"
            required
            value={myEmail}
            onChange={e => setMyEmail(e.target.value)}
            placeholder="Enter your booking email"
            className="min-w-0 flex-1 rounded-xl border p-4 outline-none focus:border-blue-500"
          />

          <button
            type="submit"
            className="flex items-center justify-center gap-2 rounded-xl bg-[#123b5d] px-6 py-4 font-bold text-white hover:bg-[#0b2b45]"
          >
            <Search size={19} />
            Find Bookings
          </button>
        </form>

        {notice && (
          <div className={`mt-5 rounded-xl p-4 text-sm ${
            notice.type === 'error'
              ? 'bg-red-50 text-red-700'
              : notice.type === 'success'
                ? 'bg-green-50 text-green-700'
                : 'bg-blue-50 text-blue-700'
          }`}>
            {notice.text}
          </div>
        )}

        {showBookings && (
          <section className="mt-8 space-y-4">
            {bookings.length === 0 ? (
              <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
                <Ticket size={45} className="mx-auto text-slate-300" />
                <h2 className="mt-4 font-bold text-slate-700">
                  No bookings found
                </h2>
                <p className="mt-2 text-sm text-slate-500">
                  Try the email address you used when booking.
                </p>
              </div>
            ) : (
              bookings.map(booking => (
                <article
                  key={booking.booking_id}
                  className="rounded-2xl bg-white p-5 shadow-sm"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <h2 className="text-lg font-extrabold text-slate-800">
                        {booking.train_name}
                      </h2>

                      <p className="mt-1 text-sm text-slate-500">
                        Train #{booking.train_number}
                      </p>
                    </div>

                    <span className={`rounded-full px-3 py-2 text-xs font-bold ${
                      booking.booking_status === 'Confirmed'
                        ? 'bg-green-50 text-green-700'
                        : 'bg-red-50 text-red-600'
                    }`}>
                      {booking.booking_status}
                    </span>
                  </div>

                  <div className="mt-5 grid gap-3 border-t pt-4 text-sm text-slate-600 sm:grid-cols-2">
                    <p><strong>Booking ID:</strong> #{booking.booking_id}</p>
                    <p><strong>Passenger:</strong> {booking.passenger_name}</p>
                    <p><strong>Seat:</strong> {booking.seat_number}</p>
                    <p><strong>Class:</strong> {booking.travel_class}</p>
                    <p><strong>Journey date:</strong> {formatDate(booking.journey_date)}</p>
                    <p><strong>Email:</strong> {booking.passenger_email}</p>
                  </div>

                  {booking.booking_status === 'Confirmed' && (
                    <button
                      onClick={() => cancelBooking(booking.booking_id)}
                      className="mt-5 flex items-center gap-2 rounded-xl border border-red-200 px-4 py-3 text-sm font-bold text-red-600 hover:bg-red-50"
                    >
                      <XCircle size={17} />
                      Cancel Booking
                    </button>
                  )}
                </article>
              ))
            )}
          </section>
        )}
      </main>
    </div>
  );
}

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Routes, Route, useNavigate } from 'react-router-dom';

import Home from './pages/Home';
import SearchTrains from './pages/SearchTrains';
import SeatSelection from './pages/SeatSelection';
import BookingConfirmation from './pages/BookingConfirmation';
import MyBookings from './pages/MyBookings';

const API = 'http://localhost:5000/api';

const today = new Date();
const localToday = new Date(
  today.getTime() - today.getTimezoneOffset() * 60000
).toISOString().slice(0, 10);

function App() {
  const navigate = useNavigate();

  // Search details
  const [stations, setStations] = useState([]);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState(localToday);
  const [travelClass, setTravelClass] = useState('Sleeper');

  // Train and seat details
  const [trains, setTrains] = useState([]);
  const [selectedTrain, setSelectedTrain] = useState(null);
  const [seats, setSeats] = useState([]);
  const [selectedSeat, setSelectedSeat] = useState(null);

  // Passenger details
  const [passenger, setPassenger] = useState({
    name: '',
    age: '',
    email: ''
  });

  // Booking details
  const [myEmail, setMyEmail] = useState('');
  const [bookings, setBookings] = useState([]);
  const [showBookings, setShowBookings] = useState(false);

  // Loading and messages
  const [loading, setLoading] = useState(false);
  const [seatLoading, setSeatLoading] = useState(false);
  const [notice, setNotice] = useState(null);

  // Load stations when the application starts
  useEffect(() => {
    axios.get(`${API}/trains/stations`)
      .then(({ data }) => {
        setStations(data);

        if (data.length > 0) {
          setFrom(
            data.find(s => s.station_code === 'CSMT')?.station_code ||
            data[0].station_code
          );

          setTo(
            data.find(s => s.station_code === 'NDLS')?.station_code ||
            data[1]?.station_code ||
            ''
          );
        }
      })
      .catch(() => {
        setNotice({
          type: 'error',
          text: 'Could not load stations. Please start the backend.'
        });
      });
  }, []);

  // Search trains
  const searchTrains = async (event) => {
    event?.preventDefault();

    if (!from || !to || from === to) {
      setNotice({
        type: 'error',
        text: 'Please select two different stations.'
      });
      return;
    }

    setLoading(true);
    setNotice(null);
    setTrains([]);
    setSelectedTrain(null);
    setSelectedSeat(null);
    setSeats([]);

    try {
      const { data } = await axios.get(`${API}/trains/search`, {
        params: { from, to, date, travelClass }
      });

      setTrains(data);

      if (data.length === 0) {
        setNotice({
          type: 'info',
          text: 'No trains found for this route. Try another station pair.'
        });
      }
    } catch (error) {
      setNotice({
        type: 'error',
        text: error.response?.data?.message || 'Train search failed.'
      });
    } finally {
      setLoading(false);
    }
  };

  // Load seats for the selected train
  const loadSeats = async (train) => {
    setSelectedTrain(train);
    setSelectedSeat(null);
    setSeats([]);
    setSeatLoading(true);
    setNotice(null);

    navigate('/seats');

    try {
      const { data } = await axios.get(`${API}/bookings/seats`, {
        params: {
          trainId: train.train_id,
          date,
          travelClass
        }
      });

      setSeats(data);
    } catch (error) {
      setNotice({
        type: 'error',
        text: error.response?.data?.message || 'Could not load seats.'
      });
    } finally {
      setSeatLoading(false);
    }
  };

  // Confirm booking
  const bookSeat = async (event) => {
    event.preventDefault();

    if (!selectedTrain || !selectedSeat) {
      setNotice({
        type: 'error',
        text: 'Please select a train and seat first.'
      });
      return;
    }

    try {
      const { data } = await axios.post(`${API}/bookings/book`, {
        passenger_name: passenger.name,
        passenger_age: Number(passenger.age),
        passenger_email: passenger.email,
        train_id: selectedTrain.train_id,
        journey_seat_id: selectedSeat.journey_seat_id,
        journey_date: date,
        travel_class: travelClass
      });

      setMyEmail(passenger.email);

      setNotice({
        type: 'success',
        text: `${data.message} Your booking ID is #${data.booking_id}.`
      });

      setPassenger({ name: '', age: '', email: '' });
      setSelectedSeat(null);

      navigate('/my-bookings');
    } catch (error) {
      setNotice({
        type: 'error',
        text: error.response?.data?.message || 'Booking failed. Please try again.'
      });

      await loadSeats(selectedTrain);
    }
  };

  // Find bookings using email
  const fetchBookings = async (event) => {
    event?.preventDefault();

    if (!myEmail.trim()) {
      setNotice({
        type: 'error',
        text: 'Please enter your booking email.'
      });
      return;
    }

    try {
      const { data } = await axios.get(`${API}/bookings/my-bookings`, {
        params: { email: myEmail.trim() }
      });

      setBookings(data);
      setShowBookings(true);

      setNotice(
        data.length
          ? null
          : { type: 'info', text: 'No bookings found for this email.' }
      );
    } catch (error) {
      setNotice({
        type: 'error',
        text: error.response?.data?.message || 'Could not load bookings.'
      });
    }
  };

  // Cancel a booking
  const cancelBooking = async (bookingId) => {
    if (!window.confirm(`Cancel booking #${bookingId}?`)) {
      return;
    }

    try {
      const { data } = await axios.post(
        `${API}/bookings/cancel/${bookingId}`,
        { email: myEmail.trim() }
      );

      setNotice({
        type: 'success',
        text: data.message
      });

      await fetchBookings();

      if (selectedTrain) {
        await loadSeats(selectedTrain);
      }
    } catch (error) {
      setNotice({
        type: 'error',
        text: error.response?.data?.message || 'Cancellation failed.'
      });
    }
  };

  // Display dates in a readable format
  const formatDate = (value) => {
    if (!value) return '';

    return new Date(`${String(value).slice(0, 10)}T00:00:00`)
      .toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
  };

  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route
        path="/search"
        element={
          <div>
            <SearchTrains
              stations={stations}
              from={from}
              setFrom={setFrom}
              to={to}
              setTo={setTo}
              date={date}
              setDate={setDate}
              travelClass={travelClass}
              setTravelClass={setTravelClass}
              searchTrains={searchTrains}
              loading={loading}
            />

            <div className="mx-auto max-w-6xl space-y-4 px-5 pb-12">
              {notice && (
                <p className={`rounded-xl p-4 ${
                  notice.type === 'error'
                    ? 'bg-red-50 text-red-700'
                    : 'bg-blue-50 text-blue-700'
                }`}>
                  {notice.text}
                </p>
              )}

              {trains.map(train => (
                <article
                  key={train.train_id}
                  className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-white p-5 shadow"
                >
                  <div>
                    <h2 className="text-lg font-bold text-slate-800">
                      {train.train_name}
                    </h2>
                    <p className="text-sm text-slate-500">
                      Train #{train.train_number}
                    </p>
                    <p className="mt-2 text-sm text-slate-600">
                      {train.source_station} → {train.destination_station}
                    </p>
                    <p className="text-sm text-slate-500">
                      {String(train.departure_time).slice(0, 5)} –{' '}
                      {String(train.arrival_time).slice(0, 5)}
                      {' · '}{train.duration_text}
                    </p>
                  </div>

                  <button
                    onClick={() => loadSeats(train)}
                    className="rounded-xl bg-[#123b5d] px-5 py-3 font-bold text-white hover:bg-[#0b2b45]"
                  >
                    View Seats
                  </button>
                </article>
              ))}
            </div>
          </div>
        }
      />

      <Route
        path="/seats"
        element={
          <SeatSelection
            selectedTrain={selectedTrain}
            seats={seats}
            selectedSeat={selectedSeat}
            setSelectedSeat={setSelectedSeat}
            seatLoading={seatLoading}
            loadSeats={loadSeats}
            date={date}
            travelClass={travelClass}
          />
        }
      />

      <Route
        path="/confirmation"
        element={
          <BookingConfirmation
            selectedTrain={selectedTrain}
            selectedSeat={selectedSeat}
            date={date}
            travelClass={travelClass}
            passenger={passenger}
            setPassenger={setPassenger}
            bookSeat={bookSeat}
            notice={notice}
          />
        }
      />

      <Route
        path="/my-bookings"
        element={
          <MyBookings
            myEmail={myEmail}
            setMyEmail={setMyEmail}
            fetchBookings={fetchBookings}
            bookings={bookings}
            showBookings={showBookings}
            cancelBooking={cancelBooking}
            notice={notice}
            formatDate={formatDate}
          />
        }
      />
    </Routes>
  );
}

export default App;
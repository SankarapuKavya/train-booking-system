
const db = require('../config/db');

// Generate seats automatically for the selected journey.
async function generateSeats(trainId, journeyDate, travelClass) {
  const seatCount = travelClass === '1A' ? 4 : 10;

  const seats = Array.from({ length: seatCount }, (_, index) => [
    trainId,
    journeyDate,
    travelClass,
    `${travelClass}-${String(index + 1).padStart(2, '0')}`
  ]);

  await db.query(
    `INSERT IGNORE INTO journey_seats
     (train_id, journey_date, travel_class, seat_number)
     VALUES ?`,
    [seats]
  );
}

exports.getSeats = async (req, res) => {
  try {
    const { train_id, journey_date, travel_class } = req.query;

    if (
      !Number.isInteger(Number(train_id)) ||
      !/^\d{4}-\d{2}-\d{2}$/.test(journey_date || '') ||
      !['Sleeper', '3A', '2A', '1A'].includes(travel_class)
    ) {
      return res.status(400).json({ message: 'Invalid journey details.' });
    }

    const [trains] = await db.execute(
      'SELECT train_id FROM trains WHERE train_id = ?',
      [Number(train_id)]
    );

    if (!trains.length) {
      return res.status(404).json({ message: 'Train not found.' });
    }

    await generateSeats(Number(train_id), journey_date, travel_class);

    const [seats] = await db.execute(
      `SELECT journey_seat_id, seat_number, status
       FROM journey_seats
       WHERE train_id = ? AND journey_date = ? AND travel_class = ?
       ORDER BY journey_seat_id`,
      [Number(train_id), journey_date, travel_class]
    );

    res.json(seats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Could not load seats.' });
  }
};

exports.bookSeat = async (req, res) => {
  const {
    passenger_name, passenger_age, passenger_email,
    train_id, journey_seat_id, journey_date, travel_class
  } = req.body;

  if (
    !String(passenger_name || '').trim() ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(passenger_email || '') ||
    !Number.isInteger(Number(passenger_age)) ||
    Number(passenger_age) < 1 || Number(passenger_age) > 120 ||
    !Number.isInteger(Number(train_id)) ||
    !Number.isInteger(Number(journey_seat_id)) ||
    !/^\d{4}-\d{2}-\d{2}$/.test(journey_date || '') ||
    !['Sleeper', '3A', '2A', '1A'].includes(travel_class)
  ) {
    return res.status(400).json({
      message: 'Please enter valid passenger and journey details.'
    });
  }

  let connection;

  try {
    connection = await db.getConnection();
    await connection.beginTransaction();

    const [seats] = await connection.execute(
      `SELECT journey_seat_id, status
       FROM journey_seats
       WHERE journey_seat_id = ?
         AND train_id = ?
         AND journey_date = ?
         AND travel_class = ?
       FOR UPDATE`,
      [journey_seat_id, train_id, journey_date, travel_class]
    );

    if (!seats.length || seats[0].status !== 'Available') {
      await connection.rollback();
      return res.status(409).json({
        message: 'Sorry, this seat is no longer available.'
      });
    }

    await connection.execute(
      `UPDATE journey_seats
       SET status = 'Booked'
       WHERE journey_seat_id = ?`,
      [journey_seat_id]
    );

    const [result] = await connection.execute(
      `INSERT INTO bookings
       (passenger_name, passenger_age, passenger_email,
        train_id, journey_seat_id, journey_date, travel_class)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        passenger_name.trim(),
        Number(passenger_age),
        passenger_email.trim(),
        train_id,
        journey_seat_id,
        journey_date,
        travel_class
      ]
    );

    await connection.commit();

    res.status(201).json({
      message: 'Your seat has been booked!',
      booking_id: result.insertId
    });

  } catch (error) {
    if (connection) await connection.rollback();
    console.error(error);
    res.status(500).json({ message: 'Booking failed. Please try again.' });
  } finally {
    if (connection) connection.release();
  }
};

exports.getBookings = async (req, res) => {
  try {
    const email = String(req.query.email || '').trim();

    if (!email) {
      return res.status(400).json({
        message: 'Enter the email used for booking.'
      });
    }

    const [rows] = await db.execute(
      `SELECT b.booking_id, b.passenger_name, b.passenger_age,
              b.passenger_email, b.journey_date, b.travel_class,
              b.booking_status, b.booking_time,
              t.train_number, t.train_name, js.seat_number
       FROM bookings b
       JOIN trains t ON t.train_id = b.train_id
       JOIN journey_seats js ON js.journey_seat_id = b.journey_seat_id
       WHERE b.passenger_email = ?
       ORDER BY b.booking_time DESC`,
      [email]
    );

    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Could not load bookings.' });
  }
};

exports.cancelBooking = async (req, res) => {
  let connection;

  try {
    const bookingId = req.params.id;
    const email = String(req.body.email || '').trim();

    if (!email) {
      return res.status(400).json({ message: 'Email is required.' });
    }

    connection = await db.getConnection();
    await connection.beginTransaction();

    const [rows] = await connection.execute(
      `SELECT booking_id, journey_seat_id, booking_status
       FROM bookings
       WHERE booking_id = ? AND passenger_email = ?
       FOR UPDATE`,
      [bookingId, email]
    );

    if (!rows.length) {
      await connection.rollback();
      return res.status(404).json({ message: 'Booking not found.' });
    }

    if (rows[0].booking_status === 'Cancelled') {
      await connection.rollback();
      return res.status(400).json({
        message: 'This booking is already cancelled.'
      });
    }

    await connection.execute(
      `UPDATE bookings
       SET booking_status = 'Cancelled'
       WHERE booking_id = ?`,
      [bookingId]
    );

    await connection.execute(
      `UPDATE journey_seats
       SET status = 'Available'
       WHERE journey_seat_id = ?`,
      [rows[0].journey_seat_id]
    );

    await connection.commit();

    res.json({
      message: 'Booking cancelled. The seat is available again.'
    });

  } catch (error) {
    if (connection) await connection.rollback();
    console.error(error);
    res.status(500).json({ message: 'Cancellation failed.' });
  } finally {
    if (connection) connection.release();
  }
};

const db = require('../config/db');

const validDate = (value) =>
  /^\d{4}-\d{2}-\d{2}$/.test(value || '') &&
  !Number.isNaN(Date.parse(`${value}T00:00:00`));

exports.getStations = async (_req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT station_id, station_code, station_name, city, state_name FROM stations ORDER BY city, station_name'
    );
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Could not load stations' });
  }
};

exports.searchTrains = async (req, res) => {
  try {
    const { from, to, date, travelClass = 'Sleeper' } = req.query;
    const classes = ['Sleeper', '3A', '2A', '1A'];
    if (!from || !to || from === to || !validDate(date) || !classes.includes(travelClass)) {
      return res.status(400).json({ message: 'Choose different stations, a valid date and a valid class.' });
    }

    const [rows] = await db.execute(
      `SELECT t.train_id, t.train_number, t.train_name,
              t.departure_time, t.arrival_time, t.duration_text,
              ss.station_name AS source_station,
              ss.city AS source_city,
              ds.station_name AS destination_station,
              ds.city AS destination_city,
              src.stop_order AS source_order, dst.stop_order AS destination_order,
              COUNT(js.journey_seat_id) AS seats_created,
              COALESCE(SUM(js.status = 'Available'), 0) AS available_seats
       FROM train_stops src
       JOIN train_stops dst ON dst.train_id = src.train_id
       JOIN trains t ON t.train_id = src.train_id
       JOIN stations ss ON ss.station_id = src.station_id
       JOIN stations ds ON ds.station_id = dst.station_id
       LEFT JOIN journey_seats js
         ON js.train_id = t.train_id AND js.journey_date = ? AND js.travel_class = ?
       WHERE ss.station_code = ? AND ds.station_code = ?
         AND src.stop_order < dst.stop_order
       GROUP BY t.train_id, t.train_number, t.train_name,
                t.departure_time, t.arrival_time, t.duration_text,
                ss.station_name, ss.city, ds.station_name, ds.city,
                src.stop_order, dst.stop_order
       ORDER BY t.departure_time`,
      [date, travelClass, from, to]
    );

    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Train search failed' });
  }
};

exports.getSeats = async (req, res) => {
  try {
    const { trainId, date, travelClass = 'Sleeper' } = req.query;
    const classes = ['Sleeper', '3A', '2A', '1A'];
    if (!/^\d+$/.test(trainId || '') || !validDate(date) || !classes.includes(travelClass)) {
      return res.status(400).json({ message: 'Invalid train, date or class.' });
    }

    const [trainRows] = await db.execute('SELECT train_id FROM trains WHERE train_id = ?', [trainId]);
    if (!trainRows.length) return res.status(404).json({ message: 'Train not found' });

    const seatCounts = { Sleeper: 20, '3A': 12, '2A': 8, '1A': 4 };
    const count = seatCounts[travelClass];
    const values = Array.from({ length: count }, (_, i) => [trainId, date, travelClass, `${travelClass}-${String(i + 1).padStart(2, '0')}`]);

    await db.query(
      `INSERT IGNORE INTO journey_seats (train_id, journey_date, travel_class, seat_number)
       VALUES ?`,
      [values]
    );

    const [seats] = await db.execute(
      `SELECT journey_seat_id, seat_number, status
       FROM journey_seats
       WHERE train_id = ? AND journey_date = ? AND travel_class = ?
       ORDER BY journey_seat_id`,
      [trainId, date, travelClass]
    );
    res.json(seats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Could not load seats' });
  }
};

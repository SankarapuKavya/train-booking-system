
const router = require('express').Router();

const bookingController = require('../controllers/bookingController');
const trainController = require('../controllers/trainController');

// Seat availability
router.get('/seats', trainController.getSeats);

// Booking operations
router.post('/book', bookingController.bookSeat);
router.get('/my-bookings', bookingController.getBookings);
router.post('/cancel/:id', bookingController.cancelBooking);

module.exports = router;

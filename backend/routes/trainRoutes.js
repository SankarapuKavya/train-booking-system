const router = require('express').Router();
const controller = require('../controllers/trainController');

router.get('/stations', controller.getStations);
router.get('/search', controller.searchTrains);
router.get('/seats', controller.getSeats);

module.exports = router;

const express = require('express');
const tourController = require('../controllers/tourController');

const router = express.Router(); // this is were we define a route for our API's endpoint.

// router.param('id', tourController.checkIdMiddleware);

router
  .route('/top-5-best-prices')
  .get(tourController.aliasTopTours, tourController.getAllTours);

router
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.createTour);
router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;

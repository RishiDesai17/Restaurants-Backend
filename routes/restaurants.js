const express = require('express');
const router = express.Router();
const RestaurantsController = require('../controllers/restaurants');
const checkAuth = require('../middleware/check-auth');

router.get('/', RestaurantsController.get_all_restaurants);

router.post('/',checkAuth, RestaurantsController.create_restaurant);

router.get('/:restaurantId', RestaurantsController.get_restaurant);

router.patch('/:restaurantId',checkAuth, RestaurantsController.update_restaurant);

router.delete('/:restaurantId',checkAuth, RestaurantsController.delete_restaurant);

module.exports = router;

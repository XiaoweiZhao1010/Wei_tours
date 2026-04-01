const express = require("express");
const authController = require("../controllers/authController");
const bookingController = require("../controllers/bookingController");

const router = express.Router();

router.use(authController.protect);

router.get("/me", bookingController.getMyBookings);
router.post("/checkout-session", bookingController.createCheckoutSession);
router.post("/", bookingController.createBooking);

module.exports = router;

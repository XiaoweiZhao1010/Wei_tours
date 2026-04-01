const Booking = require("../models/bookingModel");
const Tour = require("../models/tourModel");
const AppError = require("../utils/appError");
const { getStripe } = require("../utils/stripe");
const catchAsync = require("../utils/catchAsync");

exports.getMyBookings = catchAsync(async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate({
        path: "tour",
        select: "name imageCover price duration difficulty slug",
      })
      .sort("-createdAt");

    res.status(200).json({
      status: "success",
      results: bookings.length,
      data: { bookings },
    });
  } catch (err) {
    next(err);
  }
});

exports.createBooking = catchAsync(async (req, res, next) => {
  try {
    const { tourId } = req.body;
    if (!tourId) {
      return next(new AppError("Please provide a tourId", 400));
    }

    const tour = await Tour.findById(tourId);
    if (!tour) {
      return next(new AppError("No tour found with that ID", 404));
    }

    const booking = await Booking.create({
      tour: tourId,
      user: req.user.id,
      price: tour.price,
      paid: false,
    });

    const populated = await Booking.findById(booking._id).populate({
      path: "tour",
      select: "name imageCover price duration difficulty slug",
    });

    res.status(201).json({
      status: "success",
      data: { booking: populated },
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST body: { bookingId }
 * Returns { url, sessionId } — open `url` in the browser for Stripe Checkout.
 * Env: STRIPE_SECRET_KEY, FRONTEND_URL (optional CHECKOUT_SUCCESS_URL / CHECKOUT_CANCEL_URL, STRIPE_CURRENCY default usd).
 */
exports.createCheckoutSession = catchAsync(async (req, res, next) => {
  try {
    const stripe = getStripe();
    if (!stripe) {
      return next(
        new AppError(
          "Payments are not configured (missing STRIPE_SECRET_KEY)",
          503,
        ),
      );
    }

    const { bookingId } = req.body;
    if (!bookingId) {
      return next(new AppError("Please provide bookingId", 400));
    }

    const booking = await Booking.findById(bookingId).populate({
      path: "tour",
      select: "name",
    });
    if (!booking) {
      return next(new AppError("No booking found with that ID", 404));
    }
    if (String(booking.user) !== String(req.user.id)) {
      return next(new AppError("You can only pay for your own bookings", 403));
    }
    if (booking.paid) {
      return next(new AppError("This booking is already paid", 400));
    }

    const frontendBase = (
      process.env.FRONTEND_URL || "http://127.0.0.1:3000"
    ).replace(/\/$/, "");
    const successUrl =
      process.env.CHECKOUT_SUCCESS_URL ||
      `${frontendBase}/me/mybookings?checkout=success&session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl =
      process.env.CHECKOUT_CANCEL_URL ||
      `${frontendBase}/me/mybookings?checkout=cancelled`;

    const tourName = booking.tour?.name || "Tour";
    const unitAmount = Math.round(Number(booking.price) * 100);
    if (!Number.isFinite(unitAmount) || unitAmount < 50) {
      return next(
        new AppError(
          "Invalid booking amount (Stripe requires at least $0.50 USD equivalent)",
          400,
        ),
      );
    }

    const tourDocId =
      booking.tour && typeof booking.tour === "object" && booking.tour._id
        ? String(booking.tour._id)
        : String(booking.tour || "");

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: req.user.email,
      client_reference_id: String(booking._id),
      metadata: {
        bookingId: String(booking._id),
        userId: String(req.user.id),
        tourId: tourDocId,
      },
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: (process.env.STRIPE_CURRENCY || "usd").toLowerCase(),
            unit_amount: unitAmount,
            product_data: {
              name: `${tourName} — tour booking`,
              description: `Booking ${booking._id}`,
            },
          },
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
    });

    booking.stripeCheckoutSessionId = session.id;
    await booking.save({ validateBeforeSave: false });

    res.status(200).json({
      status: "success",
      data: {
        sessionId: session.id,
        url: session.url,
      },
    });
  } catch (err) {
    next(err);
  }
});

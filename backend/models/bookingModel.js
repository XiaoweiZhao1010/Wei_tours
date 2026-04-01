const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: "Tour",
      required: [true, "Booking must belong to a tour"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Booking must belong to a user"],
    },
    price: {
      type: Number,
      required: [true, "Booking must have a price"],
    },
    paid: {
      type: Boolean,
      default: false,
    },
    /** Latest Stripe Checkout Session id (set when user starts checkout) */
    stripeCheckoutSessionId: {
      type: String,
      default: undefined,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

bookingSchema.index({ tour: 1, user: 1 });

const Booking = mongoose.model("Booking", bookingSchema);
module.exports = Booking;

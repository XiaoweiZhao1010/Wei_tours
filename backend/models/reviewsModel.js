// review /rating/ createdAt / ref to tour and user
const mongoose = require("mongoose");
const Tour = require("./tourModel");
// const User = require("./userModel");
// const validator = require("validator");

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, "Review cannot be empty"],
      trim: true,
      validate: {
        validator: function (val) {
          return val.length > 0;
        },
      },
    },
    rating: {
      type: Number,
      min: [1, "Rating must be above 1.0"],
      max: [5, "Rating must be below 5.0"],
      required: [true, "Rating cannot be empty"],
    },
    createAt: {
      type: Date,
      default: Date.now(),
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: "Tour",
      required: [true, "Review must belong to a tour"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Review must belong to a user"],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name",
  });
  next();
});

reviewSchema.statics.calcAverageRatings = async function (tourId) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: "$tour",
        nRating: { $sum: 1 },
        avgRating: { $avg: "$rating" },
      },
    },
  ]);
  if (!stats) return;
  await Tour.findByIdAndUpdate(tourId, {
    ratingsQuantity: stats[0]?.nRating || 0,
    ratingsAverage: stats[0]?.avgRating || 4.5,
  });
};
reviewSchema.post("save", function () {
  // this points to current review
  this.constructor.calcAverageRatings(this.tour);
});

// reviewSchema.pre(/^findOneAnd/, async function (next) {
//   this.r = await this.clone().findOne();
//   next();
// });
// reviewSchema.post(/^findOneAnd/, async function (doc) {
//   // await this.findOne(); does NOT work here, query has already executed
//   if (doc) {
//     await doc.constructor.calcAverageRatings(doc.tour);
//   }
// });
reviewSchema.post(/^findOneAnd/, function (doc) {
  // doc is the document that was updated or deleted
  if (doc) {
    doc.constructor.calcAverageRatings(doc.tour);
  }
});

const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;
// Prevent duplicate reviews by the same user for the same tour
reviewSchema.index({ tour: 1, user: 1 }, { unique: true });
//post /tour/:tourId/reviews

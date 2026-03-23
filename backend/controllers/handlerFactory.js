const AppError = require("../utils/appError");
const APIFeatures = require("../utils/apiFeatures");

exports.deleteOne = (Model) => async (req, res, next) => {
  const doc = await Model.findByIdAndDelete(req.params.id);
  if (!doc) {
    return next(new AppError("No document found", 404));
  }
  res.status(204).json({
    status: "success",
    data: null,
  });
};
exports.updateOne = (Model, options) => async (req, res, next) => {
  const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!doc) {
    return next(new AppError("No document found", 404));
  }
  if (options) doc.populate(options);
  const modelName = Model.modelName.toLowerCase();
  res.status(200).json({
    status: "success",
    [modelName]: doc,
  });
};
exports.createOne = (Model) => async (req, res, next) => {
  const doc = await Model.create(req.body);
  res.status(201).json({
    status: "success",
    doc,
  });
};

exports.getOne = (Model, popOptions) => async (req, res, next) => {
  let query = Model.findById(req.params.id);
  if (popOptions) query = query.populate(popOptions);
  const doc = await query;
  if (!doc) {
    return next(new AppError("No document found", 404));
  }
  const modelName = Model.modelName.toLowerCase();
  res.status(200).json({
    status: "success",
    data: {
      [modelName]: doc,
    },
  });
};

exports.getAll = (Model) => async (req, res, next) => {
  // To allow for nested GET reviews on tour (hack)
  const tourId = req.params.tourId;
  let filter = {};
  if (tourId) filter = { tour: tourId };
  //execute query
  const features = new APIFeatures(Model.find(filter), req.query)
    .filter()
    .sort()
    .fieldLimiting()
    .paginate();
  const docs = await features.query;
  // .explain();
  //send response
  // debugger;
  res.status(200).json({
    status: "success",
    results: docs.length,
    data: {
      docs,
    },
  });
};

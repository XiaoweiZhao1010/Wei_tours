const User = require("../models/userModel");
const AppError = require("../utils/appError");
const factory = require("./handlerFactory");

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};
exports.updateMe = async (req, res, next) => {
  //Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        "This route is not for password updates. Please use /updatePassword instead",
        400,
      ),
    );
  }
  // Filter out unwanted fields names that are not allowed to be updated
  const filteredBody = filterObj(req.body, "name", "email");
  // Update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });
  // Update user document
  res.status(200).json({
    status: "success",
    updatedUser,
  });
};
exports.updateProfilePicture = async (req, res, next) => {
  console.log(req.file);
  if (!req.user) {
    return next(new AppError("User not authenticated", 404));
  }
  if (!req.file) {
    return next(new AppError("This route needs a file to proceed.", 400));
  }

  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      photo: req.file.filename,
    },
    {
      new: true,
      runValidators: true,
    },
  );
  res.json({
    status: "success",
    data: updatedUser,
  });
};

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};
exports.createUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not defined! Please use /signup instead",
  });
};
exports.getUser = factory.getOne(User); // For admin only
exports.getAllUsers = factory.getAll(User); // For admin only
// Do not update password with this
exports.deleteUser = factory.deleteOne(User); // For admin only
exports.updateUser = factory.updateOne(User); // For admin only
// Do not delete user, set active to false, for user to deactivate their account
exports.deleteMe = async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });
  res.status(204).json({
    status: "success",
    data: null,
  });
};

const express = require("express");
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");
const { upload } = require("../middleware/upload");
const router = express.Router();
// router.param('id', checkID);
router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.get("/logout", authController.logout);
router.post("/forgotPassword", authController.forgotPassword);
router.patch("/resetPassword/:token", authController.resetPassword);

router.use(authController.protect);

router.delete("/deleteMe", userController.deleteMe);
router.patch("/updatePassword", authController.updatePassword);
router.get("/me", userController.getMe, userController.getUser);
router.patch("/updateMe", userController.updateMe);
router.patch(
  "/updateProfilePicture",
  upload.single("photo"),
  userController.updateProfilePicture,
);
router.use(authController.restrictTo("admin"));

router.route("/").get(userController.getAllUsers);
router
  .route("/:id")
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;

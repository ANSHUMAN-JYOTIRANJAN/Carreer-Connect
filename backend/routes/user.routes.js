import { Router } from "express";
const router = Router();

import {
  register,
  login,
  uploadProfilePicture,
  updateUserProfile,
  getUserAndProfile,
  updateProfileData,
  getAlluserProfile,
  downLoadResume,
  sendConnectionRequest,
  getMyConnectionRequest,
  acceptConnectionRequest,
  whatIsMyConnections,
} from "../controllers/user.controller.js";
import multer from "multer";
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage });

router
  .route("/update_profile_picture")
  .post(upload.single("profile_picture"), uploadProfilePicture);
router.route("/register").post(register);
router.route("/login").post(login);
router.route("/user_update").post(updateUserProfile);
router.route("/get_user_and_profile").get(getUserAndProfile);
router.route("/update_profile_data").post(updateProfileData);
router.route("/user/get_all_profiles").get(getAlluserProfile);
router.route("/user/download_resume").get(downLoadResume);
router.route("/user/send_connection_request").post(sendConnectionRequest);
router.route("/user/getConnectionRequest").get(getMyConnectionRequest);
router.route("/user/user_connection_request").get(whatIsMyConnections);
router.route("/user/accept_connection_request").post(acceptConnectionRequest);
export default router;

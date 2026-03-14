import {Router} from "express";
import { runningCheck,
  createPost,
  getAllPost,
  deletePost ,
  increment_Likes,
  getCommentByPost,
  deleteComment
} from "../controllers/posts.controller.js";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = Router();

if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

const storage = multer.diskStorage({
    destination: (req, file,cb) => {
        cb(null, 'uploads/')
    },filename: (req, file, cb) => {
        cb(null, file.originalname)
    },
})

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype.startsWith("image/") ||
      file.mimetype.startsWith("video/")
    ) {
      cb(null, true);
    } else {
      cb(new Error("Only image or video allowed"), false);
    }
  },
});
router.route('/').get(runningCheck);
router.route('/Post').post(upload.array('media', 5), createPost);
router.route('/posts').get(getAllPost);
router.route('/delete_post').post(deletePost);
router.route('/comment').post(getCommentByPost);
router.route('/get_comments').post(getCommentByPost);
router.route('/delete_comment').post(deleteComment);
router.route('/increment_likes').post(increment_Likes);
export default router;

import Profile from "../models/profile.model.js";
import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import Post from "../models/posts.model.js";

export const runningCheck = async (req, res) => {
  return res.status(200).json({ message: "RUNNING" });
};

export const createPost = async (req, res) => {
  try {
    const { token, body } = req.body;

    if (!token) {
      return res.status(400).json({ message: "Token is required" });
    }
    const user = await User.findOne({ token: token });
    if (!user) {
      return res.status(404).json({ message: "User not Found" });
    }
    const newpost = new Post({
      userId: user._id,
      body: body || "",
      media: req.files?.map((f) => f.filename) ?? [],
      fileType: req.files?.map((f) => f.mimetype.split("/")[0]) ?? [],
    });

    await newpost.save();
    return res.status(201).json({ message: "Post created", post: newpost });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllPost = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("userId", "name username profilePicture")
      .sort({ createdAt: -1 });
    return res.status(200).json({ posts });
  } catch (error) {
    console.error("Get Posts Error:", error);
    return res.status(500).json({ message: error.message });
  }
};

export const deletePost = async (req, res) => {
  const { token, post_id } = req.body;
  try {
    const user = await User.findOne({ token: token }).select("_id");
    if (!user) {
      return res.status(404).json({ message: "User not Found" });
    }
    const post = await Post.findOne({ _id: post_id });
    if (!post) {
      return res
        .status(404)
        .json({ message: "Post not Found or Unauthorized" });
    }
    if (post.userId.toString() !== user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Unauthorized to delete this post" });
    }
    await Post.deleteOne({ _id: post_id });
    return res.status(200).json({ message: "Post deleted" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getCommentByPost = async (req, res) => {
  const { post_id } = req.body;
  try {
    const post = await Post.findOne({ _id: post_id });
    if (!post) {
      return res.status(404).json({ message: "Post not Found" });
    }
    return res.status(200).json({ comments: post.comments });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteComment = async (req, res) => {
  const { token, post_id, comment_id } = req.body;

  try {
    const user = await User.findOne({ token: token }).select("_id");
    if (!user) {
      return res.status(404).json({ message: "User not Found" });
    }
    const comment = await Post.findOne({ _id: comment_id });
    if (!comment) {
      return res.status(404).json({ message: "Comment not Found" });
    }
    if (comment.userId.toString() !== user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Unauthorized to delete this comment" });
    }
    await Comment.deleteOne({ _id: comment_id });
    return res.status(200).json({ message: "Comment deleted" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const increment_Likes = async (req, res) => {
  const { post_id } = req.body;
  try {
     const post = await Post.findOne({ _id: post_id });
     if(!post){
      return res.status(404).json({ message: "Post not Found" });
     }
      post.likes += 1;
      await post.save();
      return res.status(200).json({ message: "Likes incremented", post });
      
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

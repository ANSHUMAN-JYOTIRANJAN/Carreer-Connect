import Profile from "../models/profile.model.js";
import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import PDFDocument from "pdfkit";
import fs from "fs";
import connectionRequest from "../models/connection.model.js";
import Post from "../models/posts.model.js";
import Comment from "../models/comments.model.js";

const convertUserDataToPDF = (userData) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    const outputPath = crypto.randomBytes(32).toString("hex") + ".pdf";
    const stream = fs.createWriteStream("uploads/" + outputPath);

    doc.pipe(stream);

    if (userData.userId.profilePicture) {
      doc.image(`uploads/${userData.userId.profilePicture}`, {
        align: "center",
        width: 100,
      });
    }

    doc.fontSize(14).text(`Name: ${userData.userId.name}`);
    doc.fontSize(14).text(`Email: ${userData.userId.email}`);
    doc.fontSize(14).text(`Username: ${userData.userId.username}`);
    doc.fontSize(14).text(`Bio: ${userData.bio || "No bio available"}`);
    doc.fontSize(14).text(`Current Position: ${userData.currentPost}`);

    doc.fontSize(14).text("Past Work:");

    if (userData.pastWork && userData.pastWork.length > 0) {
      userData.pastWork.forEach((work) => {
        doc.text(`Company Name: ${work.company}`);
        doc.text(`Position: ${work.position}`);
        doc.text(`Years: ${work.startDate}`);
        doc.moveDown();
      });
    }

    doc.end();

    stream.on("finish", () => resolve(outputPath));
    stream.on("error", reject);
  });
};

export const register = async (req, res) => {
  try {
    const { name, email, password, username } = req.body;

    if (!name || !email || !password || !username)
      return res.status(400).json({ message: "All fields are required" });

    const user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists" });

    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashPassword,
      username,
    });

    await newUser.save();

    const profile = new Profile({
      userId: newUser._id,
    });
    await profile.save();

    return res.status(201).json({ message: "user Created" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "All fields are required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });
    const token = crypto.randomBytes(32).toString("hex");

    user.token = token;
    await user.save();

    return res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const uploadProfilePicture = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ message: "Token is required" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    const user = await User.findOne({ token: token });
    if (!user) return res.status(400).json({ message: "User not found" });

    user.profilePicture = req.file.filename;

    await user.save();
    return res.status(200).json({ message: "Profile picture updated" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
export const updateUserProfile = async (req, res) => {
  try {
    const { token, ...newUserData } = req.body;
    const user = await User.findOne({ token: token });
    if (!user) return res.status(400).json({ message: "User not found" });

    const { username, email } = newUserData;
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      if (existingUser && String(existingUser._id) !== String(user._id)) {
        return res
          .status(400)
          .json({ message: "Username or email already exists" });
      }
    }
    Object.assign(user, newUserData);
    await user.save();
    return res.status(200).json({ message: "User profile updated" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
export const getUserAndProfile = async (req, res) => {
  try {
    const { token } = req.query;
    const user = await User.findOne({ token: token });
    if (!user) return res.status(400).json({ message: "User not Found" });

    const userProfile = await Profile.findOne({ userId: user._id }).populate(
      "userId",
      "name email username profilePicture",
    );

    return res.status(200).json({ user, profile: userProfile });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
export const updateProfileData = async (req, res) => {
  try {
    const { token, ...newProfileData } = req.body;
    const userProfile = await User.findOne({ token: token });
    if (!userProfile)
      return res.status(400).json({ message: "User not Found" });

    const profile_to_update = await Profile.findOne({
      userId: userProfile._id,
    });
    if (!profile_to_update)
      return res.status(400).json({ message: "Profile not Found" });

    Object.assign(profile_to_update, newProfileData);

    await profile_to_update.save();
    return res.status(200).json({ message: "Profile updated" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getAlluserProfile = async (req, res) => {
  try {
    const profiles = await Profile.find().populate(
      "userId",
      "name username email profilePicture",
    );
    return res.json({ profiles });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const downLoadResume = async (req, res) => {
  try {
    const user_id = req.query.id;

    const userProfile = await Profile.findOne({ userId: user_id }).populate(
      "userId",
      "name username email profilePicture",
    );

    if (!userProfile)
      return res.status(400).json({ message: "Profile not found" });

    let outputPath = await convertUserDataToPDF(userProfile);

    return res.download(`uploads/${outputPath}`);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const sendConnectionRequest = async (req, res) => {
  const { token, connectionId } = req.body;
  try {
    const user = await User.findOne({ token: token });
    if (!user) return res.status(404).json({ message: "User not found" });
    const connectionUser = await User.findOne({ _id: connectionId });
    if (!connectionUser)
      return res.status(404).json({ message: "Connections User not found" });

    const existingRequest = await connectionRequest.findOne({
      userId: user._id,
      connectionId: connectionUser._id,
    });
    if (existingRequest) {
      return res.status(400).json({ message: "Request already sent" });
    }

    const request = new connectionRequest({
      userId: user._id,
      connectionId: connectionUser._id,
    });
    await request.save();
    return res.status(201).json({ message: "Connection request sent" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
export const getMyConnectionRequest = async (req, res) => {
  const { token } = req.query;

  try {
    const user = await User.findOne({ token: token });
    if (!user) return res.status(404).json({ message: "User not found" });
    const connection = await connectionRequest
      .find({ userId: user._id })
      .populate("userId", "name username email profilePicture");
    return res.status(200).json({ connections: connection });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const whatIsMyConnections = async (req, res) => {
  const { token } = req.query;
  try {
    const user = await User.findOne({
      token: token,
    });
    if (!user) return res.status(404).json({ message: "User not found" });
    const connections = await connectionRequest
      .find({ connectionId: user._id })
      .populate("userId", "name username email profilePicture");
    return res.status(200).json({ connections });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const acceptConnectionRequest = async (req, res) => {
  const { token, requestId, action_type } = req.body;
  try {
    const user = await User.findOne({ token: token });
    if (!user) return res.status(404).json({ message: "User not found" });
    const connectionReq = await connectionRequest.findOne({
      _id: requestId,
    });

    if (!connectionReq)
      return res.status(404).json({ message: "Connection request not found" });

    if (action_type === "accept") {
      connectionReq.status_accepted = true;
    } else {
      connectionReq.status_accepted = false;
    }

    await connectionReq.save();

    return res.json({ message: "Message Accepted" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
export const commonPost = async (req, res) => {
  const { token, post_id, comment } = req.body;

  try {
    if (!comment) {
      return res.status(400).json({ message: "Comment cannot be empty" });
    }

    const user = await User.findOne({ token: token }).select("_id");

    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }

    const postData = await Post.findOne({ _id: post_id });

    if (!postData) {
      return res.status(404).json({ message: "post not found" });
    }

    const newComment = new Comment({
      userId: user._id,
      postId: postData._id,
      comment: comment,
    });

    await newComment.save();

    return res.status(201).json({
      message: "comment added",
      comment: newComment,
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
import mongoose from "mongoose";
const { connection } = mongoose;
// import { ref } from "pdfkit";

const connectionRequest = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  connectionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  status_accepted: {
    type: Boolean,
    default: null,
  },
});

const connectionModel = mongoose.model("connection", connectionRequest);
export default connectionModel;
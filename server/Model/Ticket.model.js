import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema(
  {
    contestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Contest",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    ticketNo: {
      type: Number,
      unique: true,
    },
    isBonus: {
      type: Boolean,
      default: false,
    }, // True if earned with coins
  },
  { timestamps: true }
);

const Ticket = mongoose.model("Ticket", ticketSchema);

export default Ticket;

import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required!"],
      trim: true,
    },
    profileUrl: {
      type: String,
      default: null,
    },
    email: {
      type: String,
      required: [true, "Email is required!"],
      unique: [true, "Email must be unique!"],
      trim: true,
    },
    phoneNumber: {
      type: Number,
      required: [true, "Phone Number is required!"],
      unique: [true, "Phone Number must be unique!"],
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required!"],
      trim: true,
    },
    confirmPassword: {
      type: String,
      required: [true, "Password is required!"],
      trim: true,
      select: false,
    },
    firstPaid: {
      type: Boolean,
      default: false,
    },
    invitedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    referrals: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Referral",
      },
    ],
    coins: {
      type: Number,
      default: 0,
    },
    participatedContest: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Contest",
      default: [],
    },
    role: {
      type: String,
      enum: ["admin", "manager", "player"],
      default: "player",
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;

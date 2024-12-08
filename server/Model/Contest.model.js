import mongoose from "mongoose";

const contestSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
    },
    entryFee: {
      type: Number,
      required: true,
    },
    coinEntryFee: {
      type: Number,
      required: true,
    },
    prize: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["upcoming", "running", "finished"],
      default: "upcoming",
    },
    participantTickets: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Ticket",
      default: [],
    },
    ticketCount: {
      type: Number,
      default: 0,
    },
    winningTicket: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ticket",
      default: null,
    },
  },
  { timestamps: true }
);

// Middleware to automatically set contest status
contestSchema.pre("save", function (next) {
  const now = new Date();

  if (this.endDate <= now) {
    this.status = "finished";
  } else if (this.startDate <= now && this.endDate > now) {
    this.status = "running";
  } else if (this.startDate > now) {
    this.status = "upcoming";
  }

  next();
});

// Middleware to automatically set ticket count
contestSchema.pre("save", function (next) {
  if (this.participantTickets.length >= 1) {
    this.ticketCount = this.participantTickets.length;
  } else {
    this.ticketCount = 0;
  }

  next();
});

const Contest = mongoose.model("Contest", contestSchema);

export default Contest;

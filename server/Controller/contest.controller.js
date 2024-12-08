import cron from "node-cron";

// Model
import User from "../Model/User.model.js";
import Contest from "./../Model/Contest.model.js";
import Ticket from "../Model/Ticket.model.js";

// Utils
import { generateTicketsForContest } from "../Utils/NumberManager.js";
import { validateContestStatus } from "../Utils/StringManager.js";

// Lib
import { cloudinary } from "../app.js";
// import cloudinary from "../Lib/cloudinary.js";

const totalCoinOnRefer = 20;

const updateContestStatus = async () => {
  try {
    const now = new Date();

    // Find all contests that have started or ended
    const contests = await Contest.find({
      $or: [
        { startDate: { $lte: now }, status: { $ne: "running" } }, // Contest should start or is running
        { endDate: { $lte: now }, status: { $ne: "finished" } }, // Contest should end or is finished
      ],
    });

    contests.forEach(async (contest) => {
      if (contest.endDate <= now) {
        contest.status = "finished";
      } else if (contest.startDate <= now && contest.endDate > now) {
        contest.status = "running";
      } else if (contest.startDate > now) {
        contest.status = "upcoming";
      }

      await contest.save();
    });
  } catch (error) {
    console.error("Error updating contest statuses:", error);
  }
};

cron.schedule("* * * * *", updateContestStatus);

export const getAllContests = async (req, res) => {
  try {
    let allContests = await Contest.find();

    if (!allContests) {
      return res.status(404).json({
        status: "fail",
        message: "Contests doesn't exist",
      });
    }

    // ----For tickets for all contest,---- (but not neccssary, I guess for now, maybe future)

    // const contests = await Promise.all(
    //   allContests.map(async (contest) => {
    //     const allTickets = await Promise.all(
    //       contest.participantTickets.map(async (ticketId) => {
    //         return await getTicketById(ticketId);
    //       })
    //     );

    //     return { ...contest.toObject(), allTickets };
    //   })
    // );

    // Success
    res.status(200).json({
      status: "success",
      message: "Contest retrieved successfully",
      data: allContests,
    });
  } catch (error) {
    // Error
    res.status(500).json({
      status: "fail",
      message: error.message || "Internal server error!",
    });
  }
};

export const getContest = async (req, res) => {
  const { contest } = req;

  try {
    const allTickets = await Ticket.find({ contestId: contest._id });

    // Success
    res.status(200).json({
      status: "success",
      message: "Contest retrieved successfully",
      data: { ...contest.toObject(), allTickets },
    });
  } catch (error) {
    // Error
    res.status(500).json({
      status: "fail",
      message: error.message || "Internal server error!",
    });
  }
};

export const getParticipatedContest = async (req, res) => {
  const { user } = req;

  try {
    if (user.participatedContest.length === 0) {
      // Success (if No participated contests)
      return res.status(200).json({
        status: "success",
        message: "No participated contests found",
        data: [],
      });
    }

    const allParticipatedContest = await Promise.all(
      user.participatedContest.map(async (contestId) => {
        return await Contest.findById(contestId);
      })
    );

    // Success
    res.status(200).json({
      status: "success",
      message: "Participated contests retrieved successfully",
      data: allParticipatedContest,
    });
  } catch (error) {
    // Error
    res.status(500).json({
      status: "fail",
      message: error.message || "Internal server error!",
      error,
    });
  }
};

export const createContest = async (req, res) => {
  const { title, imageUrl, entryFee, prize, startDate, endDate } = req.body;

  if (!title || !imageUrl || !entryFee || !prize || !startDate || !endDate) {
    return res.status(400).json({
      status: "fail",
      message: "All fields are required!",
    });
  }

  try {
    const uploadResponse = await cloudinary.uploader.upload(imageUrl, {
      folder: "contests",
    });

    const contest = await Contest.create({
      ...req.body,
      imageUrl: uploadResponse.secure_url,
    });

    // Success
    res.status(201).json({
      status: "success",
      message: "New Contest created successfully!",
      data: contest,
    });
  } catch (error) {
    // Error
    console.log(error);

    res.status(500).json({
      status: "fail",
      message: error.message || "Internal server error!",
    });
  }
};

export const updateContest = async (req, res) => {
  const { contest } = req;

  try {
    const updatedContest = await Contest.findByIdAndUpdate(
      contest._id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    const allTickets = await Promise.all(
      updatedContest.participantTickets.map(async (ticketId) => {
        return await getTicketById(ticketId);
      })
    );

    // Success
    res.status(200).json({
      status: "success",
      message: "Updated successfullys",
      data: { ...updatedContest.toObject(), allTickets },
    });
  } catch (error) {
    // Error
    res.status(500).json({
      status: "fail",
      message: error.message || "Internal server error!",
    });
  }
};

export const deleteContest = async (req, res) => {
  const contest = req.contest;

  try {
    await contest.deleteOne();

    // Success
    res.status(200).json({
      status: "success",
      message: "Deleted successfully",
      data: null,
    });
  } catch (error) {
    // Error
    res.status(500).json({
      status: "fail",
      message: error.message || "Internal server error!",
    });
  }
};

// Tickets
export const getTicketById = async (req, res) => {
  try {
    res.status(200).json({
      status: "success",
      data: req.ticket,
      message: "Ticket retrieved Successfully!",
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: "Internal server error",
    });
  }
};

export const participateContest = async (req, res) => {
  const { user, contest } = req;
  const { amount } = req.body;

  if (!amount) {
    return res.status(400).json({
      status: "fail",
      message: "Invalid Amount!",
    });
  }

  if (amount < contest.entryFee) {
    return res.status(400).json({
      status: "fail",
      message: "Insufficient Amount!",
    });
  }

  const totalTickets = amount / contest.entryFee;

  try {
    if (!validateContestStatus(contest, res)) return;

    // After Payment successful

    // Generate Tickets
    const tickets = await generateTicketsForContest(
      user._id,
      contest._id,
      totalTickets
    );

    contest.participantTickets.push(...tickets.map((ticket) => ticket._id));
    await contest.save();
    // Push in User participated List
    if (!user.participatedContest.includes(contest._id)) {
      user.participatedContest.push(contest._id);
      await user.save();
    }

    // Reward Inviter for First Payment
    if (!user.firstPaid) {
      if (user.invitedBy) {
        await User.findByIdAndUpdate(user.invitedBy, {
          $inc: { coins: totalCoinOnRefer },
        });

        user.firstPaid = true;
        await user.save();
      }
    }

    // Success
    res.status(200).json({
      status: "success",
      message: user.participatedContest.includes(contest._id)
        ? `Successfully bought ${tickets.length} ticket(s)`
        : `Successfully Participated in the contest with ${tickets.length} ticket(s).`,
      data: tickets,
    });
  } catch (error) {
    // Error
    res.status(500).json({
      status: "fail",
      message: "Internal server error!",
    });
  }
};

export const exchangeCoins = async (req, res) => {
  const { user, contest } = req;
  const { coins } = req.body;

  if (!coins) {
    return res.status(400).json({
      status: "fail",
      message: "All fields are required!",
    });
  }

  try {
    if (coins > user.coins) {
      return res.status(400).json({
        status: "fail",
        message: "You don't have enough coins!",
      });
    }

    validateContestStatus(contest);

    if (!user.participatedContest.includes(contest._id)) {
      return res.status(401).json({
        status: "fail",
        message: "You haven't yet participated in this contest!",
      });
    }

    const totalTickets =
      (contest.coinEntryFee !== 0 && coins / contest.coinEntryFee) || 0;

    // After Payment successful
    const tickets = await generateTicketsForContest(
      user._id,
      contest._id,
      totalTickets
    );

    // Cut the coins from User
    user.coins -= coins;
    await user.save();

    // Add ticktes in Contest
    contest.participantTickets.push(...tickets.map((ticket) => ticket._id));
    await contest.save();

    // Suceess
    res.status(200).json({
      status: "success",
      message: `Successfully exchanged ${coins} coins with ${totalTickets} ticket(s).`,
      data: tickets,
    });
  } catch (error) {
    // Error
    res.status(500).json({
      status: "fail",
      message: error.message || "Internal server error!",
    });
  }
};

import Contest from "../Model/Contest.model.js";
import Ticket from "../Model/Ticket.model.js";

export const contestParam = async (req, res, next, contestId) => {
  try {
    const contest = await Contest.findById(contestId);

    if (!contest) {
      return res.status(404).json({
        status: "fail",
        message: "Contest doesn't exist!",
      });
    }

    req.contest = contest;

    next();
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Internal server error!",
    });
  }
};

export const ticketParam = async (req, res, next, ticketId) => {
  try {
    const ticket = await Ticket.findById(ticketId);

    if (!ticket) {
      return res.status(404).json({
        status: "fail",
        message: "Ticket doesn't exist!",
      });
    }

    req.ticket = ticket;
    next();
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Internal server error!",
    });
  }
};

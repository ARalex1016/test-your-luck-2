import crypto from "crypto";

// Model
import Ticket from "../Model/Ticket.model.js";

const generateUniqueTicketNo = async () => {
  let isUnique = false;
  let ticketNo;

  while (!isUnique) {
    // Generate a random 4-digit number (0000 to 9999)
    ticketNo = crypto.randomInt(1000, 10000);

    // Check if the ticket already exists in the database
    const existingTicket = await Ticket.findOne({ ticketNo });
    if (!existingTicket) {
      isUnique = true; // Set flag if the ticket is unique
    }
  }

  return ticketNo;
};

export const generateTicketsForContest = async (
  userId,
  contestId,
  totalTickets
) => {
  const tickets = [];

  for (let i = 0; i < totalTickets; i++) {
    const ticketNo = await generateUniqueTicketNo();

    const ticket = await Ticket.create({
      contestId,
      userId,
      ticketNo,
    });

    tickets.push(ticket);
  }

  return tickets;
};

export const getTicketByIdFunc = async (ticketId) => {
  const ticket = await Ticket.findById(ticketId);

  return ticket ? ticket.ticketNo : null;
};

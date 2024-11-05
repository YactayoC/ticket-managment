import moment from "moment";
import { Ticket } from "../interfaces/Ticket";

export const formatTicket = (ticket: Ticket): Ticket => {
  const formattedDate = formatDateWithMoment(new Date());

  return {
    ...ticket,
    id: new Date().getTime(),
    user: formatTicketName(ticket.user),
    po: formatTicketName(ticket.po),
    folder: formatTicketLink(ticket.link, ticket.user),
    ticketId: ticket.link.split("/").pop() || "",
    createdAt: `${formattedDate} ${ticket.createdAt}`,
  };
};

const formatTicketName = (user: string) => {
  const capitalize = (str: string) =>
    str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

  const parts = user
    .trim()
    .split(" ")
    .filter((part) => part !== "");

  if (parts.length === 1) {
    return capitalize(parts[0]);
  }

  if (parts.length === 2) {
    const firstName = capitalize(parts[0]);
    const lastName = capitalize(parts[1]);

    return `${firstName} ${lastName}`;
  }

  if (parts.length === 3) {
    const firstName = capitalize(parts[0]);
    const firstLastName = capitalize(parts[1]);

    return `${firstName} ${firstLastName}`;
  }

  const firstName = capitalize(parts[0]);
  const firstLastName = capitalize(parts[2]);

  return `${firstName} ${firstLastName}`;
};

const formatTicketLink = (link: string, user: string) => {
  const ticketId = link.split("/").pop()?.replace("-", "_") || "";

  const formattedUser = formatTicketName(user).replace(" ", "");
  return `${ticketId}_${formattedUser}`;
};

const formatDateWithMoment = (date: Date) => {
  return moment(date).format("DD/MM/YYYY");
};

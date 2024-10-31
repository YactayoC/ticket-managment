import { Ticket } from "../interfaces/Ticket";

export const formatTicket = (ticket: Ticket): Ticket => {
  return {
    ...ticket,
    id: new Date().getTime(),
    user: formatTicketName(ticket.user),
    po: formatTicketName(ticket.po),
    folder: formatTicketLink(ticket.link, ticket.user),
    ticketId: ticket.link.split("/").pop() || "",
  };
};

const formatTicketName = (user: string) => {
  const capitalize = (str: string) =>
    str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

  const parts = user.split(" ");

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

export interface Ticket {
  id: number | null;
  createdAt: string;
  link: string;
  user: string;
  po: string;
  ticketId: string;
  folder: string;
  status: TicketStatus;
  runtaskFile: string;
  configFile: string;
  description: string;
}

export type TicketStatus = "Creado" | "Ejecutado" | "Finalizado" | "Cancelado";

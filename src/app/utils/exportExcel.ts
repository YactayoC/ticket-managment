import * as XLSX from "xlsx";
import { Ticket } from "../interfaces/Ticket";

export const exportTableToExcel = (tickets: Ticket[]) => {
  const ws_data = [
    [
      "Fecha Creación",
      "Ticket ID",
      "Link",
      "Usuario",
      "PO",
      "Carpeta",
      "Estado",
    ],
    ...tickets.map((ticket) => [
      ticket.createdAt,
      ticket.link.split("/").pop(),
      { t: "s", v: ticket.link, l: { Target: ticket.link } },
      ticket.user,
      ticket.po,
      ticket.folder,
      ticket.status,
    ]),
  ];

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(ws_data);

  const range = XLSX.utils.decode_range(ws["!ref"] as string);
  for (let R = range.s.r; R <= range.e.r; ++R) {
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const cell = ws[XLSX.utils.encode_cell({ r: R, c: C })];
      if (cell) {
        cell.s = {
          font: {
            name: "Arial",
            sz: 11,
          },
        };
      }
    }
  }

  XLSX.utils.book_append_sheet(wb, ws, "Tickets");
  XLSX.writeFile(wb, "Tickets.xlsx");
};

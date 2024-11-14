import React from "react";
import { Box, IconButton, MenuItem, Select, Typography } from "@mui/material";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { Delete, PlayArrow } from "@mui/icons-material";
import Link from "next/link";
import { Ticket, TicketStatus } from "../interfaces/Ticket";

interface Props {
  tickets: Ticket[];
  handleDelete: (id: number) => void;
  handleStartTicket: (ticket: Ticket) => void;
  setTickets: (id: number, newStatus: TicketStatus) => void;
}

const TableTickets = (props: Props) => {
  const { tickets, handleDelete, handleStartTicket, setTickets } = props;

  const handleStatusChange = (id: number, newStatus: TicketStatus) => {
    setTickets(id, newStatus);
  };

  const columns: GridColDef[] = [
    {
      field: "link",
      headerName: "Link",
      width: 200,
      renderCell: (params) => (
        <Link href={params.value} target="_blank" rel="noopener">
          {params.row.ticketId}
        </Link>
      ),
    },
    { field: "createdAt", headerName: "Created At", width: 150 },
    { field: "ticketId", headerName: "Ticket ID", width: 150 },
    { field: "user", headerName: "User", width: 150 },
    { field: "po", headerName: "PO", width: 150 },
    { field: "folder", headerName: "Folder", width: 250 },
    {
      field: "status",
      headerName: "Status",
      width: 200,
      renderCell: (params: GridRenderCellParams) => (
        <Select
          value={params.value}
          onChange={(e) => handleStatusChange(params.row.id, e.target.value)}
          displayEmpty
          fullWidth
        >
          <MenuItem value="Creado">Creado</MenuItem>
          <MenuItem value="Ejecutado">Ejecutado</MenuItem>
          <MenuItem value="Cancelado">Cancelado</MenuItem>
          <MenuItem value="Finalizado">Finalizado</MenuItem>
        </Select>
      ),
    },
    {
      field: "Acciones",
      headerName: "Acciones",
      width: 200,
      renderCell: (params) => (
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <IconButton onClick={() => handleDelete(params.row.id)}>
            <Delete />
          </IconButton>
          <IconButton onClick={() => handleStartTicket(params.row)}>
            <PlayArrow />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Box style={{ height: "75vh", width: "100%" }}>
      {tickets.length > 0 ? (
        <DataGrid
          rows={tickets}
          columns={columns}
          pageSizeOptions={[5, 10]}
          checkboxSelection={false}
          disableRowSelectionOnClick
          getRowClassName={(params) => {
            if (params.row.status === "Creado") return "status-creado";
            if (params.row.status === "Ejecutado") return "status-ejecucion";
            if (params.row.status === "Cancelado") return "status-observacion";
            if (params.row.status === "Finalizado") return "status-finalizado";
            return "";
          }}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 5,
              },
            },
          }}
          sx={{
            "& .status-creado": {
              backgroundColor: "#F3F4F6",
              "&:hover": {
                backgroundColor: "#e0e0e0",
              },
            },
            "& .status-ejecucion": {
              backgroundColor: "#FFF9C4",
              "&:hover": {
                backgroundColor: "#ffe08b",
              },
            },
            "& .status-observacion": {
              backgroundColor: "#F2DEDE",
              "&:hover": {
                backgroundColor: "#e6bcbc",
              },
            },
            "& .status-finalizado": {
              backgroundColor: "#DFF0D8",
              "&:hover": {
                backgroundColor: "#b2d8b2",
              },
            },
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "#e0e0e0",
              color: "#333",
              fontWeight: "bold",
            },
          }}
        />
      ) : (
        <Typography variant="h6" align="center">
          No hay tickets creados
        </Typography>
      )}
    </Box>
  );
};

export default TableTickets;

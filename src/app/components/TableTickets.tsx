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
        <Link
          href={params.value}
          target="_blank"
          rel="noopener"
          style={{
            textDecoration: "none",
            color: "#1A73E8",
            fontWeight: 500,
          }}
        >
          {params.row.ticketId}
        </Link>
      ),
    },
    { field: "createdAt", headerName: "Created At", width: 150 },
    { field: "ticketId", headerName: "Ticket ID", width: 150 },
    { field: "dependency", headerName: "Dependency", width: 150 },
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
          sx={{
            backgroundColor: "#f8f9fa",
            borderRadius: 2,
            "& .MuiSelect-select": {
              padding: "6px 8px",
              fontSize: "0.875rem",
            },
          }}
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
      width: 150,
      renderCell: (params) => (
        <Box sx={{ display: "flex", gap: 1 }}>
          <IconButton
            onClick={() => handleDelete(params.row.id)}
            sx={{
              color: "#D32F2F",
              "&:hover": { color: "#B71C1C" },
            }}
          >
            <Delete />
          </IconButton>
          <IconButton
            onClick={() => handleStartTicket(params.row)}
            sx={{
              color: "#388E3C",
              "&:hover": { color: "#2E7D32" },
            }}
          >
            <PlayArrow />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Box
      style={{ height: "75vh", width: "100%" }}
      sx={{
        backgroundColor: "#fff",
        borderRadius: 3,
        boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.1)",
        padding: 2,
      }}
    >
      {tickets.length > 0 ? (
        <DataGrid
          rows={tickets}
          columns={columns}
          pageSizeOptions={[10, 20]}
          checkboxSelection={false}
          disableRowSelectionOnClick
          getRowClassName={(params) => {
            if (params.row.status === "Creado") return "status-creado";
            if (params.row.status === "Ejecutado") return "status-ejecucion";
            if (params.row.status === "Cancelado") return "status-cancelado";
            if (params.row.status === "Finalizado") return "status-finalizado";
            return "";
          }}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
              },
            },
          }}
          sx={{
            "& .status-creado": {
              backgroundColor: "#E3F2FD",
              "&:hover": {
                backgroundColor: "#BBDEFB",
              },
            },
            "& .status-ejecucion": {
              backgroundColor: "#FFF8E1",
              "&:hover": {
                backgroundColor: "#FFECB3",
              },
            },
            "& .status-cancelado": {
              backgroundColor: "#FFEBEE",
              "&:hover": {
                backgroundColor: "#FFCDD2",
              },
            },
            "& .status-finalizado": {
              backgroundColor: "#E8F5E9",
              "&:hover": {
                backgroundColor: "#C8E6C9",
              },
            },
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "#F5F5F5",
              color: "#333",
              fontWeight: 500,
              textTransform: "uppercase",
              fontSize: "0.875rem",
            },
            "& .MuiDataGrid-cell": {
              fontSize: "0.875rem",
              color: "#424242",
            },
            "& .MuiDataGrid-footerContainer": {
              backgroundColor: "#F5F5F5",
            },
          }}
        />
      ) : (
        <Typography
          variant="h6"
          align="center"
          sx={{
            color: "#757575",
            marginTop: 2,
            fontWeight: 500,
          }}
        >
          No hay tickets creados
        </Typography>
      )}
    </Box>
  );
};

export default TableTickets;

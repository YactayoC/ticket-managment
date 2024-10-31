"use client";
import React, { useState, useEffect, useCallback } from "react";
import {
  Container,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  FormHelperText,
  Box,
  SelectChangeEvent,
} from "@mui/material";
import { Add, DownloadRounded, Search } from "@mui/icons-material";
import { useForm, Controller } from "react-hook-form";
import { Ticket, TicketStatus } from "./interfaces/Ticket";
import TableTickets from "./components/TableTickets";
import { exportTableToExcel } from "./utils/exportExcel";
import { formatTicket } from "./utils/formatTicket";

const getTicketsFromLocalStorage = () => {
  const savedTickets = localStorage.getItem("tickets");
  return savedTickets ? JSON.parse(savedTickets) : [];
};

export default function TicketList() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<Ticket[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [open, setOpen] = useState(false);
  const [openStartTicket, setOpenStartTicket] = useState(false);
  const [currentTicket, setCurrentTicket] = useState<Ticket | null>(null);

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<Ticket>();

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    reset();
  };

  const onSubmit = (data: Ticket) => {
    const dataTicketFormat = formatTicket(data);
    const newTicket: Ticket = {
      ...data,
      ...dataTicketFormat,
      id:
        tickets.length > 0
          ? Math.max(...tickets.map((ticket) => ticket.id!)) + 1
          : 1,
    };
    setTickets([...tickets, newTicket]);
    reset();
    handleClose();
  };

  const handleDelete = useCallback(
    (id: number | null) => {
      if (id !== null) {
        const updatedTickets = tickets.filter((ticket) => ticket.id !== id);
        setTickets(updatedTickets);
      }
    },
    [tickets]
  );

  const handleStartTicket = useCallback((ticket: Ticket) => {
    setCurrentTicket(ticket);
    setOpenStartTicket(true);
  }, []);

  const handleCloseStartTicket = () => {
    setOpenStartTicket(false);
    setCurrentTicket(null);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleStatusFilterChange = (
    event: SelectChangeEvent<string | number>
  ) => {
    if (event.target.value === "Todos") {
      setStatusFilter("");
      return;
    }
    setStatusFilter(event.target.value as string);
  };

  const handleStatusChange = (id: number, newStatus: TicketStatus) => {
    const updatedTickets: Ticket[] = tickets.map((ticket) =>
      ticket.id === id ? { ...ticket, status: newStatus } : ticket
    );
    setTickets(updatedTickets);
  };

  useEffect(() => {
    const storedTickets = getTicketsFromLocalStorage();
    setTickets(storedTickets);
  }, []);

  useEffect(() => {
    localStorage.setItem("tickets", JSON.stringify(tickets));
  }, [tickets]);

  useEffect(() => {
    setFilteredTickets(
      tickets.filter(
        (ticket) =>
          ticket.ticketId.toLowerCase().includes(searchTerm.toLowerCase()) &&
          (statusFilter === "" || ticket.status === statusFilter)
      )
    );
  }, [tickets, searchTerm, statusFilter]);

  return (
    <Container sx={{ padding: 4, backgroundColor: "#f9f9f9", borderRadius: 2 }}>
      <Typography variant="h4" gutterBottom>
        Tickets
      </Typography>

      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
        sx={{
          backgroundColor: "#fff",
          padding: 2,
          borderRadius: 1,
          boxShadow: "0px 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <TextField
          variant="outlined"
          placeholder="Buscar por código de ticket"
          InputProps={{
            startAdornment: <Search />,
          }}
          size="small"
          value={searchTerm}
          onChange={handleSearchChange}
          sx={{ width: "40%" }}
        />

        <FormControl variant="outlined" size="small" sx={{ width: "20%" }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={statusFilter}
            onChange={handleStatusFilterChange}
            label="Status"
          >
            <MenuItem value="Todos">Todos</MenuItem>
            <MenuItem value="Creado">Creado</MenuItem>
            <MenuItem value="Ejecutado">Ejecutado</MenuItem>
            <MenuItem value="Finalizado">Finalizado</MenuItem>
            <MenuItem value="Cancelado">Cancelado</MenuItem>
          </Select>
        </FormControl>

        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <Button
            variant="contained"
            startIcon={<Add />}
            color="primary"
            onClick={handleOpen}
          >
            Agregar Ticket
          </Button>
          <Button
            variant="contained"
            startIcon={<DownloadRounded />}
            color="success"
            onClick={() => exportTableToExcel(tickets)}
          >
            Exportar Excel
          </Button>
        </Box>
      </Box>

      <TableTickets
        tickets={filteredTickets}
        handleDelete={handleDelete}
        handleStartTicket={handleStartTicket}
        setTickets={handleStatusChange}
      />

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Create Ticket</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name="createdAt"
              control={control}
              rules={{ required: "Created At is required" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Fecha de creación"
                  fullWidth
                  margin="normal"
                  error={!!errors.ticketId}
                  helperText={errors.ticketId?.message}
                />
              )}
            />
            <Controller
              name="user"
              control={control}
              rules={{ required: "User is required" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="User"
                  fullWidth
                  margin="normal"
                  error={!!errors.user}
                  helperText={errors.user?.message}
                />
              )}
            />
            <Controller
              name="po"
              control={control}
              rules={{ required: "PO is required" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="PO"
                  fullWidth
                  margin="normal"
                  error={!!errors.po}
                  helperText={errors.po?.message}
                />
              )}
            />
            <Controller
              name="status"
              control={control}
              rules={{ required: "Status is required" }}
              render={({ field }) => (
                <FormControl fullWidth margin="normal" error={!!errors.status}>
                  <InputLabel>Status</InputLabel>
                  <Select {...field} label="Status">
                    <MenuItem value="Creado">Creado</MenuItem>
                    <MenuItem value="Ejecutado">Ejecutado</MenuItem>
                    <MenuItem value="Finalizado">Finalizado</MenuItem>
                    <MenuItem value="Cancelado">Cancelado</MenuItem>
                  </Select>
                  {errors.status && (
                    <FormHelperText>{errors.status.message}</FormHelperText>
                  )}
                </FormControl>
              )}
            />
            <Controller
              name="link"
              control={control}
              rules={{ required: "Link is required" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Link"
                  fullWidth
                  margin="normal"
                  error={!!errors.link}
                  helperText={errors.link?.message}
                />
              )}
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSubmit(onSubmit)} color="primary">
            Create
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openStartTicket} onClose={handleCloseStartTicket}>
        <DialogTitle>Iniciar Ticket</DialogTitle>
        <DialogContent>
          <Typography>Iniciar el ticket: {currentTicket?.ticketId}</Typography>
          <Typography>User: {currentTicket?.user}</Typography>
          <Typography>Status: {currentTicket?.status}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseStartTicket} color="secondary">
            Close
          </Button>
          <Button color="primary">Confirm Start</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

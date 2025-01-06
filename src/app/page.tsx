"use client";
import React, { useState, useEffect, useCallback } from "react";
import {
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
import {
  Add,
  ClearRounded,
  DownloadRounded,
  Search,
} from "@mui/icons-material";
import { useForm, Controller } from "react-hook-form";
import { Ticket, TicketStatus } from "./interfaces/Ticket";
import TableTickets from "./components/TableTickets";
import { exportTableToExcel } from "./utils/exportExcel";
import { formatTicket } from "./utils/formatTicket";
import SnackbarTicket from "./components/SnackbarTicket";
import { useRouter } from "next/navigation";

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
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const router = useRouter();

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
    const isDuplicateLink = tickets.some((ticket) => ticket.link === data.link);

    if (isDuplicateLink) {
      setSnackbarMessage(
        "El link ya existe. Por favor, ingrese un link único."
      );
      setOpenSnackbar(true);
      return;
    }

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

  const onSubmitStart = (data: Ticket) => {
    const baseConfigFile = data.configFile.split(".")[0];
    // const baseConfigFileExtension = data.configFile.split(".")[1];
    const baseRuntaskFile = data.runtaskFile.split(".")[0];
    // const baseRuntaskFileExtension = data.runtaskFile.split(".")[1];

    // if (baseConfigFileExtension !== "conf" || !baseConfigFileExtension) {
    //   setSnackbarMessage("Config file debe ser de tipo .config");
    //   setOpenSnackbar(true);
    //   return;
    // }

    // if (baseRuntaskFileExtension !== "runtask" || !baseRuntaskFileExtension) {
    //   setSnackbarMessage("Runtask file debe ser de tipo .runtask");
    //   setOpenSnackbar(true);
    //   return;
    // }

    if (baseConfigFile !== baseRuntaskFile) {
      setSnackbarMessage(
        "Config file y Runtask file deben tener el mismo nombre base."
      );
      setOpenSnackbar(true);
      return;
    }

    const ticket = tickets.find((ticket) => ticket.id === currentTicket?.id);

    if (ticket) {
      const updatedTickets = tickets.map((ticket) =>
        ticket.id === currentTicket?.id
          ? {
              ...ticket,
              configFile: data.configFile,
              runtaskFile: data.runtaskFile,
            }
          : ticket
      );
      setTickets(updatedTickets);

      const ticketSelected = updatedTickets.find(
        (ticket) => ticket.id === currentTicket?.id
      );

      localStorage.setItem("selectedTicket", JSON.stringify(ticketSelected));
      handleCloseStartTicket();

      router.push("/ticket");
    }
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

  const handleDeleteAllTickets = () => {
    setTickets([]);
  };

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
    if (tickets.length > 0) {
      localStorage.setItem("tickets", JSON.stringify(tickets));
    }
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

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";

      exportTableToExcel(tickets);
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [tickets]);

  return (
    <Box
      sx={{
        maxWidth: "85%",
        margin: "0 auto",
      }}
    >
      <Box
        sx={{
          padding: 4,
          backgroundColor: "#f9f9f9",
          borderRadius: 2,
        }}
      >
        <Typography variant="h4" gutterBottom>
          Tickets
        </Typography>

        <Box
          display="flex"
          flexWrap="wrap"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
          sx={{
            backgroundColor: "#fff",
            padding: 2,
            borderRadius: 1,
            boxShadow: "0px 2px 8px rgba(0,0,0,0.1)",
            gap: 2,
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
            sx={{
              flex: "1 1 300px",
              minWidth: "200px",
            }}
          />

          <FormControl
            variant="outlined"
            size="small"
            sx={{
              flex: "1 1 200px",
              minWidth: "150px",
            }}
          >
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

          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 1,
              alignItems: "center",
              justifyContent: "flex-end",
              flex: "1 1 auto",
            }}
          >
            <Button
              variant="contained"
              startIcon={<Add />}
              color="primary"
              onClick={handleOpen}
              sx={{ flex: "1 1 auto", minWidth: "120px" }}
            >
              Agregar Ticket
            </Button>
            <Button
              variant="contained"
              startIcon={<DownloadRounded />}
              color="success"
              onClick={() => exportTableToExcel(tickets)}
              sx={{ flex: "1 1 auto", minWidth: "120px" }}
            >
              Exportar Excel
            </Button>
            <Button
              variant="contained"
              startIcon={<ClearRounded />}
              color="error"
              onClick={() => handleDeleteAllTickets()}
              sx={{ flex: "1 1 auto", minWidth: "120px" }}
            >
              Limpiar Tickets
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
                name="link"
                control={control}
                defaultValue=""
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
              <Controller
                name="dependency"
                control={control}
                defaultValue="Creado"
                render={({ field }) => (
                  <FormControl
                    fullWidth
                    margin="normal"
                    error={!!errors.status}
                  >
                    <InputLabel>Dependencia</InputLabel>
                    <Select {...field} label="Status">
                      {tickets.map((ticket) => (
                        <MenuItem key={ticket.id} value={ticket.ticketId}>
                          {ticket.ticketId}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.status && (
                      <FormHelperText>{errors.status.message}</FormHelperText>
                    )}
                  </FormControl>
                )}
              />
              <Controller
                name="createdAt"
                control={control}
                defaultValue=""
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
                defaultValue=""
                rules={{ required: "User is required" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Usuario"
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
                defaultValue=""
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
                defaultValue="Creado"
                render={({ field }) => (
                  <FormControl
                    fullWidth
                    margin="normal"
                    error={!!errors.status}
                  >
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
            <Typography>
              Iniciar el ticket: {currentTicket?.ticketId}
            </Typography>
            <Typography>Usuario: {currentTicket?.user}</Typography>
            <Typography>Status: {currentTicket?.status}</Typography>
            <form onSubmit={handleSubmit(onSubmitStart)}>
              <Controller
                name="configFile"
                control={control}
                defaultValue={currentTicket?.configFile || ""}
                rules={{ required: "Config file es requerido" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Config File"
                    fullWidth
                    margin="normal"
                    error={!!errors.configFile}
                    helperText={errors.configFile?.message}
                  />
                )}
              />
              <Controller
                name="runtaskFile"
                control={control}
                defaultValue={currentTicket?.runtaskFile || ""}
                rules={{ required: "Runtask file es requerido" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Runtask File"
                    fullWidth
                    margin="normal"
                    error={!!errors.runtaskFile}
                    helperText={errors.runtaskFile?.message}
                  />
                )}
              />
            </form>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseStartTicket} color="secondary">
              Cerrar
            </Button>
            <Button color="primary" onClick={handleSubmit(onSubmitStart)}>
              Confirmar Inicio
            </Button>
          </DialogActions>
        </Dialog>

        <SnackbarTicket
          openSnackbar={openSnackbar}
          setOpenSnackbar={setOpenSnackbar}
          snackbarMessage={snackbarMessage}
        />
      </Box>
    </Box>
  );
}

"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Ticket } from "../interfaces/Ticket";
import {
  Container,
  Typography,
  Box,
  Paper,
  Divider,
  Card,
  CardContent,
  Button,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const TicketPage = () => {
  const [ticket, setTicket] = useState<Ticket>({} as Ticket);
  const router = useRouter();

  useEffect(() => {
    const storedTicket = localStorage.getItem("selectedTicket");
    if (storedTicket) {
      setTicket(JSON.parse(storedTicket));
    }
  }, []);

  if (!ticket) {
    return (
      <Container>
        <Typography variant="h6" color="error" align="center" sx={{ mt: 4 }}>
          No hay información del ticket.
        </Typography>
      </Container>
    );
  }

  const configFileName = ticket.configFile;
  const runtaskFileName = ticket.runtaskFile;
  const commands = `
cp /home/bt53329/${configFileName} /prod/bcp/udv/repro/malla/
cp /home/bt53329/${runtaskFileName} /prod/bcp/udv/repro/malla/

chmod 750 /prod/bcp/udv/repro/malla/${configFileName}
chmod 750 /prod/bcp/udv/repro/malla/${runtaskFileName}
chown dsadmbcp_prod:dstage /prod/bcp/udv/repro/malla/${configFileName}
chown dsadmbcp_prod:dstage /prod/bcp/udv/repro/malla/${runtaskFileName}

cd /prod/bcp/udv/repro/

nohup java -cp udv_int_reproceso_lhcl.jar com.bcp.coe.recursivo.RunProgram /prod/bcp/udv/repro/malla/${runtaskFileName} > /home/bt53329/${ticket.folder}.log &
  `;

  return (
    <Container maxWidth="md" sx={{ mt: 6 }}>
      <Card sx={{ backgroundColor: "#fdfdfd", boxShadow: 2, borderRadius: 3 }}>
        <CardContent>
          <Typography variant="h4" align="center" color="primary" gutterBottom>
            Detalles del Ticket
          </Typography>
          <Divider sx={{ mb: 3 }} />

          <Box
            sx={{ mb: 2, p: 3, backgroundColor: "#f9f9f9", borderRadius: 2 }}
          >
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Información General
            </Typography>
            <Typography variant="body2">
              <strong>ID del Ticket:</strong> {ticket.ticketId}
            </Typography>
            <Typography variant="body2">
              <strong>Usuario:</strong> {ticket.user}
            </Typography>
            <Typography variant="body2">
              <strong>PO:</strong> {ticket.po}
            </Typography>
            <Typography variant="body2">
              <strong>Status:</strong> {ticket.status}
            </Typography>
          </Box>

          <Box
            sx={{ mb: 2, p: 3, backgroundColor: "#f9f9f9", borderRadius: 2 }}
          >
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Archivos de Configuración
            </Typography>
            <Typography variant="body2">
              <strong>Config File:</strong> {configFileName}
            </Typography>
            <Typography variant="body2">
              <strong>Runtask File:</strong> {runtaskFileName}
            </Typography>
          </Box>

          <Box sx={{ p: 3, backgroundColor: "#f9f9f9", borderRadius: 2 }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Comandos Generados
            </Typography>
            <Paper
              elevation={0}
              sx={{ padding: 2, backgroundColor: "#f0f0f0" }}
            >
              <Typography
                variant="body2"
                style={{ whiteSpace: "pre-wrap", color: "#333" }}
              >
                {commands}
              </Typography>
            </Paper>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<ArrowBackIcon />}
              onClick={() => router.push("/")}
            >
              Volver
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default TicketPage;

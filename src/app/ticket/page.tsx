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
  Button,
  TextField,
  IconButton,
} from "@mui/material";
import { ArrowBack, ContentCopyOutlined } from "@mui/icons-material";

const TicketPage = () => {
  const [ticket, setTicket] = useState<Ticket>({} as Ticket);
  const router = useRouter();

  const handleCopy = () => {
    navigator.clipboard.writeText(commands).then(() => {
      alert("Comandos copiados al portapapeles");
    });
  };

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
      <Card
        sx={{
          backgroundColor: "#ffffff",
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
          borderRadius: 3,
          overflow: "hidden",
          padding: 3,
        }}
      >
        {/* Header */}
        <Typography
          variant="h4"
          align="center"
          sx={{
            fontWeight: "bold",
            mb: 2,
            color: "#063c77",
            letterSpacing: 1,
          }}
        >
          Detalles del Ticket
        </Typography>
        <Divider sx={{ mb: 3 }} />

        {/* Información General */}
        <Box
          sx={{
            mb: 3,
            p: 3,
            backgroundColor: "#f8f9fa",
            borderRadius: 2,
            boxShadow: "inset 0 1px 4px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: "bold", mb: 2, color: "#333" }}
          >
            Información General
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            <strong>ID del Ticket:</strong> {ticket.ticketId}
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            <strong>Usuario:</strong> {ticket.user}
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            <strong>PO:</strong> {ticket.po}
          </Typography>
          <Typography variant="body2">
            <strong>Status:</strong> {ticket.status}
          </Typography>
        </Box>

        {/* Archivos de Configuración */}
        <Box
          sx={{
            mb: 3,
            p: 3,
            backgroundColor: "#f8f9fa",
            borderRadius: 2,
            boxShadow: "inset 0 1px 4px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: "bold", mb: 2, color: "#333" }}
          >
            Archivos de Configuración
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            <strong>Config File:</strong> {configFileName}
          </Typography>
          <Typography variant="body2">
            <strong>Runtask File:</strong> {runtaskFileName}
          </Typography>
        </Box>

        {/* Comandos Generados */}
        <Box
          sx={{
            p: 3,
            backgroundColor: "#f8f9fa",
            borderRadius: 2,
            boxShadow: "inset 0 1px 4px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: "bold", mb: 2, color: "#333" }}
          >
            Comandos Generados
          </Typography>
          <Paper
            elevation={0}
            sx={{
              padding: 2,
              backgroundColor: "#f0f0f0",
              borderRadius: 2,
              border: "1px solid #e0e0e0",
            }}
          >
            <Box display="flex" alignItems="center">
              <TextField
                value={commands}
                multiline
                fullWidth
                variant="outlined"
                InputProps={{
                  readOnly: true,
                  style: { whiteSpace: "pre-wrap", color: "#333" },
                }}
              />
              <IconButton
                onClick={handleCopy}
                sx={{
                  ml: 1,
                  color: "#063c77",
                  "&:hover": { color: "#0554a8" },
                }}
              >
                <ContentCopyOutlined />
              </IconButton>
            </Box>
          </Paper>
        </Box>

        {/* Botón de Volver */}
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#063c77",
              "&:hover": { backgroundColor: "#0554a8" },
              borderRadius: 2,
              textTransform: "none",
              fontWeight: "bold",
            }}
            startIcon={<ArrowBack />}
            onClick={() => router.push("/")}
          >
            Volver
          </Button>
        </Box>
      </Card>
    </Container>
  );
};

export default TicketPage;

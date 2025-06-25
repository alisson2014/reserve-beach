import { styled } from "@mui/material";

export const FormLoginCard = styled("form")(({ theme }) => ({
  background: "rgba(65, 64, 64, 0.65)",
  borderRadius: "20px",
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.6)",
  backdropFilter: "blur(10px)",
  WebkitBackdropFilter: "blur(10px)",
  color: "white",
  display: "flex",
  flexDirection: "column",
  gap: "16px",
  width: '100%',
  padding: theme.spacing(3),
  [theme.breakpoints.up('sm')]: {
      maxWidth: '434px',
      padding: '40px',
  },
}));
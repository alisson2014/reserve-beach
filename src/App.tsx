import { JSX } from "react";
import { RouterProvider } from "react-router-dom";
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import router from "./routes";
import theme from "./theme";
import "./theme/reset.css";
import { AuthProvider, ToastProvider } from "./contexts";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

export default function App(): JSX.Element {
  return (
    <ThemeProvider theme={theme} defaultMode="dark">
      <CssBaseline />
      <ToastProvider>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <AuthProvider>
            <RouterProvider router={router} />  
          </AuthProvider>
        </LocalizationProvider>
      </ToastProvider>
    </ThemeProvider>
  );
};
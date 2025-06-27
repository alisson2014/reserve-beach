import { JSX } from "react";
import { RouterProvider } from "react-router-dom";
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import router from "./routes";
import theme from "./theme";
import "./theme/reset.css";
import { ToastProvider } from "./contexts";
import AuthProvider from "./contexts/AuthContext";

export default function App(): JSX.Element {
  return (
    <ThemeProvider theme={theme} defaultMode="dark">
      <CssBaseline />
      <ToastProvider>
        <AuthProvider>
          <RouterProvider router={router} />  
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
};
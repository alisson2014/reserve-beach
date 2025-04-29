import { JSX } from "react";
import { RouterProvider } from "react-router-dom";
import { ThemeProvider } from '@mui/material/styles';
import router from "./routes";
import theme from "./theme";
import "./theme/reset.css";

export default function App(): JSX.Element {
  return (
    <ThemeProvider theme={theme}>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
};
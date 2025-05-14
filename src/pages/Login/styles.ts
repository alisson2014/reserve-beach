import { Link } from "react-router-dom";
import { styled } from "@mui/material";

export const CustomLink = styled(Link)({
  color: "white",
  textDecoration: "none",
  "&:hover": {
    textDecoration: "underline",
    color: "white",
  },
});
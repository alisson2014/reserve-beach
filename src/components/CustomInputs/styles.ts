import { styled } from "@mui/material";
import { InputLabel, Input } from "@mui/material";

export const StyledInputLabel = styled(InputLabel)({
  color: "white",
  "&.Mui-focused:not(.Mui-error)": {
    color: "white",
  },
});

export const StyledInput = styled(Input)({
  "&:before": {
    borderBottomColor: "white",
  },
  "&:hover:not(.Mui-disabled):before": {
    borderBottomColor: "white", 
  },
  "&:after": {
    borderBottomColor: "white", 
  },
  "& .MuiInputBase-input": {
    caretColor: "white", 
    color: "white", 
  },
});
import { Box, styled } from "@mui/material";

export const BackgroundBox = styled(Box)(({ theme }) => ({
    backgroundImage: "url(/images/fundo_login.png)",
    backgroundSize: "cover",
    backgroundPosition: "center",
    width: "100%",
    minHeight: "100vh", 
    display: "flex",
    flexDirection: "column",   
    justifyContent: "center", 
    alignItems: "center", 
    padding: theme.spacing(2),
    [theme.breakpoints.up('md')]: {
        flexDirection: "row",
        justifyContent: "space-around",
    },
}));
import { JSX } from "react";
import { HomeTitle } from "../../components";
import { Box, Typography } from "@mui/material";

export default function Home(): JSX.Element {
    return (
        <Box 
            sx={{ 
                display: "flex", 
                flexDirection: "column",
                alignItems: "center", 
                gap: 2,
                height: "100vh"
            }}
        >
            <HomeTitle />
            <Typography variant="subtitle1">Welcome </Typography>
        </Box>
    );
};
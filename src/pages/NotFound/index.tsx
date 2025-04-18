import { JSX } from "react";
import { Link } from "react-router-dom";
import { Box, Button, Typography } from "@mui/material";

export default function NotFound(): JSX.Element {
    return (
        <Box 
            sx={{ 
                display: "flex", 
                flexDirection: "column",
                alignItems: "center", 
                justifyContent: "center",
                gap: 4,
                height: "100vh"
            }}
        >
            <Typography variant="h1">404 - Not Found</Typography>
            <Link to="/">
                <Button variant="outlined" color="secondary" title="Turn Back to home" size="large">Go Back Home</Button>
            </Link>
        </Box>
    );
};
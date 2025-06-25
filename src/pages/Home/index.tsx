import { JSX } from "react";
import { HomeTitle } from "../../components";
import { Box, Typography } from "@mui/material";
import { useAuth } from "../../contexts";

export default function Home(): JSX.Element {
    const { isAuthenticated, user, logout } = useAuth();

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
            {isAuthenticated ? (
                <div>
                    <span>Olá, {user?.name}!</span>
                    <button onClick={logout}>Sair</button>
                </div>
            ) : (
                <span>Você não está logado.</span>
            )}
        </Box>
    );
};
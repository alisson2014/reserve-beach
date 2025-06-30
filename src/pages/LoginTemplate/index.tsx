import { JSX, useCallback } from "react";
import { LoginTemplateProps } from "./types";
import { BackgroundBox } from "./styles";
import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function LoginTemplate({ children }: LoginTemplateProps): JSX.Element {
    const navigate = useNavigate();

    const redirectToHome = useCallback((): void => {
        navigate('/home');
    }, [navigate]);

    return (
        <BackgroundBox>
            <Box
                component="img"
                src="/images/logo.png"
                alt="Logo Reserve Beach"
                title="Ir para a página inicial"
                onClick={redirectToHome}
                sx={theme => ({
                    width: '210px',
                    marginBottom: '24px',
                    cursor: 'pointer',
                    [theme.breakpoints.up('sm')]: {
                        width: '400px'
                    },
                })}
            />
            {children}
        </BackgroundBox>
    );
};
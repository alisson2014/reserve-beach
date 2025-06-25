import { JSX } from "react";
import { LoginTemplateProps } from "./types";
import { BackgroundBox } from "./styles";
import { Box } from "@mui/material";

export default function LoginTemplate({ children }: LoginTemplateProps): JSX.Element {
    return (
        <BackgroundBox>
            <Box
                component="img"
                src="/images/logo.png"
                alt="Logo Reserve Beach"
                title="Logo Reserve Beach"
                sx={theme => ({
                    width: '210px',
                    marginBottom: '24px',
                    [theme.breakpoints.up('sm')]: {
                        width: '400px'
                    },
                })}
            />
            {children}
        </BackgroundBox>
    );
};
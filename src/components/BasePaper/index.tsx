import { JSX, ReactNode } from "react";
import { Paper } from "@mui/material";

export default function BasePaper({ children }: { children: ReactNode }): JSX.Element {
    return (
        <Paper sx={{ p: { xs: 2, sm: 3 }, width: '100%', overflow: 'hidden' }}>
            {children}
        </Paper>
    );
}
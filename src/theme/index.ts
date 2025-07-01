import { createTheme } from '@mui/material/styles';
import { grey } from '@mui/material/colors';

const theme = createTheme({
    palette: {
        background: {
            paper: grey[300],
            default: grey[100],
        }
    },
    colorSchemes: {
        dark: {
            palette: {}
        }
    }, 
    typography: {
        fontFamily: "'Metropolis', sans-serif",
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                },
            },
        },
    },
});

export default theme;
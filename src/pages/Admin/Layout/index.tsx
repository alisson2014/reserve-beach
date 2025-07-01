import { useState, JSX, useCallback } from 'react';
import { Outlet, useMatches, useNavigate } from 'react-router-dom';
import {
    Drawer,
    Box,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Toolbar,
    ListItemIcon,
    AppBar,
    IconButton,
    Typography,
    Divider,
    useColorScheme
} from '@mui/material';
import SportsTennisIcon from '@mui/icons-material/SportsTennis';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PaymentsIcon from '@mui/icons-material/Payments';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import MenuIcon from '@mui/icons-material/Menu';
import GroupIcon from '@mui/icons-material/Group';
import { useAuth } from '../../../contexts';
import { HandleTitle } from './types';
import { SwitchThemeButton } from '../../../components';

const drawerWidth = 256;

export default function Layout(): JSX.Element {
    const { mode, setMode } = useColorScheme();

    const { logout } = useAuth();
    const matches = useMatches();
    const navigate = useNavigate();
    
    const matchWithTitle = matches
        .slice()
        .reverse()
        .find(m => (m as HandleTitle).handle?.title) as HandleTitle | undefined;
    const currentTitle = matchWithTitle?.handle?.title || 'Painel Admin';

    const [mobileOpen, setMobileOpen] = useState<boolean>(false);

    const handleDrawerToggle = useCallback(() => setMobileOpen(prev => !prev), []);

    const redirectTo = useCallback((path: string): void => {
        navigate(path);
        setMobileOpen(false);
    }, [navigate]);

    const drawerContent = (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Toolbar sx={{ justifyContent: 'center' }}>
                <Box
                    component="img"
                    src="/images/logo.png"
                    alt="Logo Reserve Beach"
                    title="Logo Reserve Beach"
                    sx={theme => ({
                        width: '80px',
                        [theme.breakpoints.up('sm')]: {
                            width: '128px'
                        },
                    })}
                />
            </Toolbar>
            <Box sx={{ flexGrow: 1 }}>
                <List>
                    <ListItem disablePadding>
                        <ListItemButton title="Ir para dashboard geral" onClick={() => redirectTo('/admin')}>
                            <ListItemIcon>
                                <DashboardIcon />
                            </ListItemIcon>
                            <ListItemText primary="Dashboard" />
                        </ListItemButton>
                    </ListItem>

                    <ListItem disablePadding>
                        <ListItemButton title="Ir para o gerenciamento de quadras" onClick={() => redirectTo('/admin/courts')}>
                            <ListItemIcon>
                                <SportsTennisIcon />
                            </ListItemIcon>
                            <ListItemText primary="Quadras" />
                        </ListItemButton>
                    </ListItem>

                    <ListItem disablePadding>
                        <ListItemButton title="Ir para o gerenciamento de pagamentos" onClick={() => redirectTo('/admin/payments')}>
                            <ListItemIcon>
                                <PaymentsIcon />
                            </ListItemIcon>
                            <ListItemText primary="Pagamento" />
                        </ListItemButton>
                    </ListItem>

                    <ListItem disablePadding>
                        <ListItemButton title="Visualizar usuários cadastrados" onClick={() => redirectTo('/admin/profile')}>
                            <ListItemIcon>
                                <GroupIcon />
                            </ListItemIcon>
                            <ListItemText primary="Usuários" />
                        </ListItemButton>
                    </ListItem>
                </List>
            </Box>
            <Divider />
            <List>
                <ListItem disablePadding>
                    <ListItemButton title="Sair" onClick={logout}>
                        <ListItemIcon>
                            <ExitToAppIcon />
                        </ListItemIcon>
                        <ListItemText primary="Sair" />
                    </ListItemButton>
                </ListItem>   
            </List>
        </Box>
    );

    return (
        <Box sx={{ display: 'flex' }}>
            <AppBar
                position="fixed"
                sx={{
                    width: { md: `calc(100% - ${drawerWidth}px)` },
                    ml: { md: `${drawerWidth}px` },
                }}
            >
                <Toolbar sx={{ backgroundColor: mode === 'light' ? 'grey.300' : 'inherit' }}>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { md: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div" sx={{ color: mode === 'light' ? 'text.primary' : 'inherit' }}>
                        {currentTitle}
                    </Typography>
                    <Box sx={{ flexGrow: 1 }} />
                    <SwitchThemeButton value={mode === 'light' ? 'dark' : 'light'} onClick={() => setMode(mode === 'light' ? 'dark' : 'light')} />
                </Toolbar>
            </AppBar>

            <Box
                component="nav"
                sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
                aria-label="mailbox folders"
            >
                <Drawer
                    variant="temporary"
                    color='dark'
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true, 
                    }}
                    sx={{
                        display: { xs: 'block', md: 'none' }
                    }}
                >
                    {drawerContent}
                </Drawer>

                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', md: 'block' },
                        '& .MuiDrawer-paper': {
                            boxSizing: 'border-box',
                            width: drawerWidth,
                        },
                    }}
                    open
                >
                    {drawerContent}
                </Drawer>
            </Box>

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    width: { md: `calc(100% - ${drawerWidth}px)` },
                }}
            >
                <Toolbar />
                <Outlet />
            </Box>
        </Box>
    );
}
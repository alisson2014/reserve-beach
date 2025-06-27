import { useState, JSX, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
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
    Divider
} from '@mui/material';
import SportsTennisIcon from '@mui/icons-material/SportsTennis';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PaymentsIcon from '@mui/icons-material/Payments';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import MenuIcon from '@mui/icons-material/Menu';
import GroupIcon from '@mui/icons-material/Group';
import { useAuth } from '../../../contexts';

const drawerWidth = 256;
const routeTitles: { [key: string]: string } = {
    '/admin': 'Dashboard',
    '/admin/courts': 'Quadras',
};

export function Layout(): JSX.Element {
    const { logout } = useAuth();

    const [mobileOpen, setMobileOpen] = useState<boolean>(false);
    const [currentTitle, setCurrentTitle] = useState<string>('Painel Admin');

    const location = useLocation();

    const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

    useEffect(() => {
        const path = location.pathname;
        const title = routeTitles[path] || 'Painel Admin';
        setCurrentTitle(title);
    }, [location]);

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
                        <ListItemButton component={Link} to="/admin" title="Ir para dashboard geral">
                            <ListItemIcon>
                                <DashboardIcon />
                            </ListItemIcon>
                            <ListItemText primary="Dashboard" />
                        </ListItemButton>
                    </ListItem>

                    <ListItem disablePadding>
                        <ListItemButton component={Link} to="/admin/courts" title="Ir para o gerenciamento de quadras">
                            <ListItemIcon>
                                <SportsTennisIcon />
                            </ListItemIcon>
                            <ListItemText primary="Quadras" />
                        </ListItemButton>
                    </ListItem>

                    <ListItem disablePadding>
                        <ListItemButton component={Link} to="/admin/profile" title="Ir para o gerenciamento de pagamentos">
                            <ListItemIcon>
                                <PaymentsIcon />
                            </ListItemIcon>
                            <ListItemText primary="Pagamento" />
                        </ListItemButton>
                    </ListItem>

                    <ListItem disablePadding>
                        <ListItemButton component={Link} to="/admin/profile" title="Visualizar usuários cadastrados">
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
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { md: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div">
                        {currentTitle}
                    </Typography>
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
                    width: { md: `calc(100% - ${drawerWidth}px)` }
                }}
            >
                <Outlet />
            </Box>
        </Box>
    );
}
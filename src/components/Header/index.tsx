import { JSX, useCallback, useState } from "react";
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    IconButton,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Box,
    Menu,
    MenuItem,
    Divider,
} from "@mui/material";
import { Link } from 'react-router-dom';
import {
    Home as HomeIcon,
    CalendarMonth as CalendarMonthIcon,
    ShoppingCart as ShoppingCartIcon,
    AccountCircle as AccountCircleIcon,
    Menu as MenuIcon,
    Logout as LogoutIcon
} from "@mui/icons-material";
import { useAuth } from "../../contexts";

const navLinks = [
    { text: "Home", icon: <HomeIcon />, path: "/home", title: "Página Inicial" },
    { text: "Agendamentos", icon: <CalendarMonthIcon />, path: "/schedules", title: "Agendamentos" },
    { text: "Carrinho", icon: <ShoppingCartIcon />, path: "/cart", title: "Carrinho de Compras" },
];

export default function Header(): JSX.Element {
    const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
    const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

    const { logout, isAuthenticated } = useAuth();

    const handleOpenUserMenu = useCallback((event: React.MouseEvent<HTMLElement>): void => {
        setAnchorElUser(event.currentTarget);
    }, []);

    const handleCloseUserMenu = useCallback((): void => {
        setAnchorElUser(null);
    }, []);

    const handleDrawerToggle = useCallback((): void => {
        setDrawerOpen(prev => !prev);
    }, []);

    const drawer = (
        <Box onClick={handleDrawerToggle} sx={{ width: 250 }} role="presentation">
            <List>
                {navLinks.map((item) => (
                    <ListItem key={item.text} title={item.title} aria-label={item.title} disablePadding>
                        <ListItemButton component={Link} to={item.path}>
                            <ListItemIcon>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.text} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    );

    return (
        <>
            <AppBar position="static">
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="Abrir menu"
                        title="Abrir menu"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { sm: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>

                    <Box sx={{ display: { xs: 'none', sm: 'block', flexGrow: 1 } }}>
                        {navLinks.map((item) => (
                            <Button
                                key={item.text}
                                color="inherit"
                                startIcon={item.icon}
                                component={Link}
                                to={item.path}
                                title={item.title} 
                                aria-label={item.title}
                                sx={{ mx: 1 }}
                            >
                                {item.text}
                            </Button>
                        ))}
                    </Box>

                    <Box sx={{ flexGrow: 0 }}>
                        {isAuthenticated ? (
                            <>                            
                                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0, color: 'white' }}>
                                    <AccountCircleIcon fontSize="large" />
                                </IconButton>
                                <Menu
                                    sx={{ mt: '45px' }}
                                    id="menu-appbar"
                                    anchorEl={anchorElUser}
                                    anchorOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    keepMounted
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    open={Boolean(anchorElUser)}
                                    onClose={handleCloseUserMenu}
                                >
                                    <MenuItem onClick={handleCloseUserMenu}>
                                        <Typography textAlign="center">Meu Perfil</Typography>
                                    </MenuItem>
                                    <Divider />
                                    <MenuItem 
                                        onClick={() => {
                                            logout();
                                            handleCloseUserMenu();
                                        }}
                                    >
                                        <ListItemIcon>
                                            <LogoutIcon fontSize="small" />
                                        </ListItemIcon>
                                        <Typography textAlign="center">Sair</Typography>
                                    </MenuItem>
                                </Menu>
                            </>
                        ) : (
                            <>                            
                                <Button
                                    color="inherit"
                                    component={Link}
                                    to="/login"
                                    title="Realizar login"
                                    aria-label="Realizar login"
                                >
                                    Entrar
                                </Button>
                                <Button
                                    color="inherit"
                                    component={Link}
                                    to="/register"
                                    title="Realizar cadastro"
                                    aria-label="Realizar cadastro"
                                >
                                    Cadastrar 
                                </Button>
                            </>
                        )}
                    </Box>
                </Toolbar>
            </AppBar>

            <Drawer
                anchor="left"
                open={drawerOpen}
                onClose={handleDrawerToggle}
            >
                {drawer}
            </Drawer>
        </>
    );
};
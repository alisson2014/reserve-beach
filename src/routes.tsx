import { createBrowserRouter } from 'react-router-dom';
import { Cart, CourtScheduling, Home, Login, NotFound, PrivateRoute, Register, Unauthorized } from './pages';
import { Dashboard, Layout as AdminLayout, ManageCourts, AddCourt } from './pages/Admin';
import Layout from './pages/Layout';

const router = createBrowserRouter([
    { 
        path: "/", 
        element: <Layout />,
        children: [
            {
                index: true,
                element: <Home />
            },
            {
                path: "home",
                element: <Home />
            },
            {
                path: "courts/:id",
                element: <CourtScheduling />
            },
            {
                path: "cart",
                element: <Cart />
            }
        ]
    },
    { 
        path: "/login", 
        element: <Login />
    },
    { 
        path: "/register", 
        element: <Register />
    },
    {
        path: "/unauthorized",
        element: <Unauthorized />
    },
    {
        path: "/admin",
        element: (
            <PrivateRoute roles={['ROLE_ADMIN', 'ROLE_SUPER_ADMIN']}>
                <AdminLayout />
            </PrivateRoute>
        ),
        handle: { title: "Painel Admin" },
        children: [
            {
                index: true,
                element: <Dashboard />,
                handle: { title: "Dashboard" }
            },
            {
                path: "courts",
                children: [
                    {
                        index: true,
                        element: <ManageCourts />,
                        handle: { title: "Gerenciamento de Quadras" }
                    },
                    {
                        path: "add",
                        element: <AddCourt />,
                        handle: { title: "Adicionar Nova Quadra" }
                    },
                    {
                        path: ":id/edit",
                        element: <AddCourt />,
                        handle: { title: "Editar Quadra" }
                    }
                ]
            },
        ]
    },
    { path: "*", element: <NotFound /> }
]);

export default router;
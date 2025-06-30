import { createBrowserRouter } from 'react-router-dom';
import { Home, Login, NotFound, PrivateRoute, Register, Unauthorized } from './pages';
import { Dashboard, Layout, ManageCourts, AddCourt } from './pages/Admin';

const router = createBrowserRouter([
    { 
        path: "/", 
        element: <Home />
    },
    {
        path: "/home",
        element: <Home />
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
                <Layout />
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
                        handle: { title: "Gerenciamento de Quadra" }
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
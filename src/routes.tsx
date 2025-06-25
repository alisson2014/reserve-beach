import { createBrowserRouter } from 'react-router-dom';
import { Home, Login, NotFound, PrivateRoute, Register } from './pages';
import { Dashboard, Layout, ManageCourts } from './pages/Admin';

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
        path: "/admin",
        element: (
            <PrivateRoute roles={['ROLE_ADMIN', 'ROLE_SUPER_ADMIN']}>
                <Layout />
            </PrivateRoute>
        ),
        children: [
            {
                index: true,
                element: <Dashboard />
            },
            {
                path: "courts",
                element: <ManageCourts />
            }
        ]
    },
    { path: "*", element: <NotFound /> }
]);

export default router;
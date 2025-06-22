import { createBrowserRouter } from 'react-router-dom';
import { Home, Login, NotFound, PrivateRoute, Register } from './pages';

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
        path: "/private",
        element: (
            <PrivateRoute>
                <h1>Private</h1>
            </PrivateRoute>
        )
    },
    { path: "*", element: <NotFound /> }
]);

export default router;
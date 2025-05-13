import { createBrowserRouter } from 'react-router-dom';
import { Home, Login, NotFound, Register } from './pages';

const router = createBrowserRouter([
    { path: "/", element: <Home /> },
    { path: "/login", element: <Login />},
    { path: "/register", element: <Register />},
    { path: "*", element: <NotFound /> }
    
]);

export default router;
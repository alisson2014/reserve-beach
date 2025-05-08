import { createBrowserRouter } from 'react-router-dom';
import { Home, Login, NotFound } from './pages';

const router = createBrowserRouter([
    { path: "/", element: <Home /> },
    { path: "/login", element: <Login />},
    { path: "*", element: <NotFound /> }
    
]);

export default router;
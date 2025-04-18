import { createBrowserRouter } from 'react-router-dom';
import { Home, NotFound } from './pages';

const router = createBrowserRouter([
    { path: "/", element: <Home /> },
    { path: "*", element: <NotFound /> }
]);

export default router;
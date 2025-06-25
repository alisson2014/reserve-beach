import { JSX } from "react";
import { Link, Outlet } from 'react-router-dom';

const styles = {
    container: {
        display: 'flex',
    },
    sidebar: {
        width: '220px',
        background: '#f4f4f4',
        padding: '20px',
        height: '100vh',
    },
    content: {
        flex: 1,
        padding: '20px',
    },
    navLink: {
        display: 'block',
        margin: '10px 0',
        textDecoration: 'none',
        color: '#333',
    }
};

export function Layout(): JSX.Element {
    return (
        <div style={styles.container}>
            <aside style={styles.sidebar}>
                <h2>Painel Admin</h2>
                <nav>
                    <Link to="/admin" style={styles.navLink}>Dashboard</Link>
                    <Link to="/admin/courts" style={styles.navLink}>Gerenciar Quadras</Link>
                </nav>
            </aside>
            <main style={styles.content}>
                <Outlet />
            </main>
        </div>
    );
};
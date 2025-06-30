import { JSX } from "react";
import { Outlet } from 'react-router-dom';
import { Header } from "../../components";

export default function Layout(): JSX.Element {
    return (
        <>
            <Header />
            <Outlet />
        </>
    );
};
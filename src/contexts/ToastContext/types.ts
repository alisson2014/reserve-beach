import { ReactNode } from "react";
import { AlertProps } from "@mui/material";

export type ShowToastFunction = (message: string, severity?: AlertProps["severity"]) => void;
export type CloseToastFunction = () => void;    

export interface IToast {
    open: boolean;
    message: string;
    severity: AlertProps["severity"];
};

export interface ToastProviderProps {
    children: ReactNode;
};

export interface ToastContextType {
    toast: IToast;
    showToast: ShowToastFunction;
    closeToast: () => void;
};
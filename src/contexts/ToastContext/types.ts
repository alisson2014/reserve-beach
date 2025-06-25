import React from "react";

export type ToastSeverity = 'success' | 'error' | 'warning' | 'info';

export interface IToast {
    open: boolean;
    message: string;
    severity: ToastSeverity;
};

export interface ToastProviderProps {
    children: React.ReactNode;
};

export interface ToastContextType {
    toast: IToast;
    showToast: (message: string, severity?: ToastSeverity) => void;
    closeToast: () => void;
};
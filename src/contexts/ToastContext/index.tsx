import { JSX, useState } from 'react';
import { Snackbar, Alert } from "@mui/material";
import { IToast, ToastProviderProps, ToastSeverity } from './types';
import { ToastContext } from './useToast';

export default function ToastProvider({ children }: ToastProviderProps): JSX.Element {
    const [toast, setToast] = useState<IToast>({
        open: false,
        message: '',
        severity: 'success',
        autoHideDuration: 3500,
    });

    const showToast = (message: string, severity: ToastSeverity = 'success'): void => setToast({ open: true, message, severity });

    const closeToast = (): void => setToast(prev => ({ ...prev, open: false }));

    return (
        <ToastContext.Provider value={{ toast, showToast, closeToast }}>
            {children}
            {toast.open && (
                <Snackbar open={toast.open} autoHideDuration={toast.autoHideDuration} onClose={closeToast}>
                    <Alert onClose={closeToast} severity={toast.severity} variant="filled" sx={{ width: '100%' }}>
                        {toast.message}
                    </Alert>
                </Snackbar>
            )}
        </ToastContext.Provider>
    );
};
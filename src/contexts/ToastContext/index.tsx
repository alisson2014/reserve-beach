import { JSX, useCallback, useMemo, useState } from 'react';
import { Snackbar, Alert } from "@mui/material";
import { CloseToastFunction, IToast, ShowToastFunction, ToastProviderProps } from './types';
import { ToastContext } from './useToast';

export default function ToastProvider({ children }: ToastProviderProps): JSX.Element {
    const [toast, setToast] = useState<IToast>({
        open: false,
        message: '',
        severity: 'success'
    });

    const showToast: ShowToastFunction = useCallback((message, severity = 'success') => {
        setToast({ open: true, message, severity });
    }, []);

    const closeToast: CloseToastFunction = useCallback(() => setToast(prev => ({ ...prev, open: false })), []);
    
    const value = useMemo(() => ({ 
        toast, 
        showToast, 
        closeToast 
    }), [toast, showToast, closeToast]);

    return (
        <ToastContext.Provider value={value}>
            {children}
            {toast.open && (
                <Snackbar open={toast.open} autoHideDuration={3000} onClose={closeToast}>
                    <Alert onClose={closeToast} severity={toast.severity} variant="filled" sx={{ width: '100%' }}>
                        {toast.message}
                    </Alert>
                </Snackbar>
            )}
        </ToastContext.Provider>
    );
};
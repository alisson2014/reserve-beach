import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogProps, DialogTitle } from "@mui/material";
import { JSX } from "react";

type ConfirmDialogProps = DialogProps & {
    dialogTitle: string;
    dialogContentText?: string;
    handleDisagree?: () => void;
    handleAgree?: () => void;
};

export default function ConfirmDialog({ 
    dialogTitle, 
    dialogContentText, 
    handleDisagree, 
    handleAgree, 
    ...props 
}: ConfirmDialogProps): JSX.Element {
    return (
        <Dialog {...props}>
            <DialogTitle id="alert-dialog-title">{dialogTitle}</DialogTitle>
            {dialogContentText && (
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">{dialogContentText}</DialogContentText>
                </DialogContent>
            )}
            <DialogActions>
                <Button onClick={handleDisagree} color="error">Não</Button>
                <Button onClick={handleAgree} autoFocus>Sim</Button>
            </DialogActions>
        </Dialog>
    );
};
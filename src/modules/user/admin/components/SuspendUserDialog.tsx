import { useState } from "react";
import AdminPageDialog from "./AdminPageDialog";
import { Button, Stack, TextField, Typography } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { PickerValue } from "@mui/x-date-pickers/internals";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useAdminResponse } from "../hooks/useAdmin";
import Resources from "../AdminPageResources.json"

export type SuspendUserDialogProps = {
    useAdminResponse: useAdminResponse;
    openState: {
        open: boolean;
        setOpen: (open: boolean) => void;
    };
};

const SuspendUserDialog = ({ useAdminResponse, openState: { open, setOpen } }: SuspendUserDialogProps) => {
    const [username, setUsername] = useState("");
    const [period, setPeriod] = useState(0);
    const { error, suspendUser } = useAdminResponse;

    const handleSuspend = async () => {
        await suspendUser(username, period);
        if (!error) {
            setUsername("");
            setPeriod(0);
            setOpen(false);
        }
    };

    const handleDateChanged = (value: PickerValue) => {
        if (!value) {
            return;
        }
        const now = new Date();
        setPeriod(value.getTime() - now.getTime());
    }

    return (
        <AdminPageDialog
            title={Resources.SuspendDialog.Title}
            openState={{
                open: open,
                setOpen: setOpen
            }}
        >
            <Stack gap={Resources.Page.NormalFormGap}>
                <TextField
                    label={Resources.SuspendDialog.UsernameInputLabel}
                    value={username}
                    onChange={e => setUsername(e.target.value)} />
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                        label={Resources.SuspendDialog.DatePickerLabel}
                        onChange={handleDateChanged}
                    />
                </LocalizationProvider>
                {!error && <Typography color="error">{error}</Typography>}
                <Button onClick={handleSuspend}>Suspend</Button>
            </Stack>
        </AdminPageDialog>
    );
}

export default SuspendUserDialog;

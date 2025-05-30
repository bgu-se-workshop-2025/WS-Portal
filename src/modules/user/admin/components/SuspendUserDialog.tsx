import { useState } from "react";
import AdminPageDialog from "./AdminPageDialog";
import { Button, Stack, TextField, Typography } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { PickerValue } from "@mui/x-date-pickers/internals";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import useAdmin from "../hooks/useAdmin";

export type SuspendUserDialogProps = {
    openState: {
        open: boolean;
        setOpen: (open: boolean) => void;
    };
};

const SuspendUserDialog = ({ openState: { open, setOpen } }: SuspendUserDialogProps) => {
    const [username, setUsername] = useState("");
    const [period, setPeriod] = useState(0);
    const { error, suspendUser } = useAdmin();

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
            title="Suspend User" openState={{
                open: open,
                setOpen: setOpen
            }} >
            <Stack gap={2}>
                <TextField
                    label="Username"
                    value={username}
                    onChange={e => setUsername(e.target.value)} />
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                        label="Until?"
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

import { useState } from "react";
import AdminPageDialog from "./AdminPageDialog";
import { Button, TextField } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { PickerValue } from "@mui/x-date-pickers/internals";

export type SuspendUserDialogProps = {
    openState: {
        open: boolean;
        setOpen: (open: boolean) => void;
    };
};

const SuspendUserDialog = () => {
    const [username, setUsername] = useState("");
    const [period, setPeriod] = useState(0);
    const [open, setOpen] = useState(true);

    const handleSuspend = () => {
        // Logic to suspend the user
        console.log(`Suspending user: ${username} for ${period} days`);
        // Reset fields after suspension
        setUsername("");
        setPeriod(0);
    };

    const handleDateChanged = (value: PickerValue) => {
        if (!value) {
            return;
        }
        const now = new Date().getMilliseconds();
        setPeriod(value.getMilliseconds() - now);
    }

    return <AdminPageDialog
        title="Suspend User" openState={{
            open: open,
            setOpen: setOpen
        }} >
        <TextField
            label="Username"
            value={username}
            onChange={e => setUsername(e.target.value)} />
        <DatePicker
            label="Until?"
            onChange={handleDateChanged}
        />
        <Button onClick={handleSuspend} />
    </AdminPageDialog>
}

export default SuspendUserDialog;

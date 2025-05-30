import { useState } from "react";
import AdminPageDialog from "./AdminPageDialog";
import { Button, Stack, TextField } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { PickerValue } from "@mui/x-date-pickers/internals";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

export type SuspendUserDialogProps = {
    openState: {
        open: boolean;
        setOpen: (open: boolean) => void;
    };
};

const SuspendUserDialog = ({ openState: { open, setOpen } }: SuspendUserDialogProps) => {
    const [username, setUsername] = useState("");
    const [period, setPeriod] = useState(0);

    const handleSuspend = () => {
        // Logic to suspend the user
        console.log(`Suspending user: ${username} for ${period} milliseconds`);
        // Reset fields after suspension
        setUsername("");
        setPeriod(0);
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
            {(() => {
                try {
                    return (
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
                            <Button onClick={handleSuspend}>Suspend</Button>
                        </Stack>
                    );
                } catch (error) {
                    console.error("Error in SuspendUserDialog:", error);
                    return <div>Error occurred. Check the console for details.</div>;
                }
            })()}
        </AdminPageDialog>
    );
}

export default SuspendUserDialog;

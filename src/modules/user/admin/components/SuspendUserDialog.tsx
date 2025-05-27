import { useState } from "react";

export type SuspendUserDialogProps = {
    openState: {
        open: boolean;
        setOpen: (open: boolean) => void;
    };
};

const SuspendUserDialog = () => {
    const [username, setUsername] = useState("");
    const [period, setPeriod] = useState(0);

    const handleSuspend = () => {
        // Logic to suspend the user
        console.log(`Suspending user: ${username} for ${period} days`);
        // Reset fields after suspension
        setUsername("");
        setPeriod(0);
    };
}

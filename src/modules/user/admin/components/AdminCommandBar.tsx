import { Button, Stack } from "@mui/material"
import { useState } from "react";

const AdminCommandBar = () => {
    const [openSuspendDialog, setOpenSuspendDialog] = useState(false);
    const [openElevateDialog, setOpenElevateDialog] = useState(false);

    const handleSuspendClick = () => {
        setOpenSuspendDialog(true);
    };

    const handleElevateClick = () => {
        setOpenElevateDialog(true);
    };

    return <Stack
        direction="row"
        justifyContent="space-between"
    >
        <Button onClick={handleSuspendClick}>Suspend User</Button>
        <Button onClick={handleElevateClick}>Elevate User</Button>
    </Stack>
}

export default AdminCommandBar;
import { Button, Stack } from "@mui/material"
import { useState } from "react";
import SuspendUserDialog from "./SuspendUserDialog";
import ElevateUserDialog from "./ElevateUserDialog";

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
        marginY={1}
        gap={4}
    >
        <Button variant="outlined" onClick={handleSuspendClick}>Suspend User</Button>
        <SuspendUserDialog openState={{
            open: openSuspendDialog,
            setOpen: setOpenSuspendDialog
        }} />
        <Button variant="outlined" onClick={handleElevateClick}>Elevate User</Button>
        <ElevateUserDialog openState={{
            open: openElevateDialog,
            setOpen: setOpenElevateDialog
        }} />
    </Stack>
}

export default AdminCommandBar;
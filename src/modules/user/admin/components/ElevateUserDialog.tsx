import { Button, Stack, TextField, Typography } from "@mui/material";
import AdminPageDialog from "./AdminPageDialog";
import useAdmin from "../hooks/useAdmin";
import { useState } from "react";
import Resources from "../AdminPageResources.json"

export type ElevateUserDialogProps = {
    openState: {
        open: boolean;
        setOpen: (open: boolean) => void;
    }
}

const ElevateUserDialog = ({ openState: { open, setOpen } }: ElevateUserDialogProps) => {
    const { error, elevateUser } = useAdmin();
    const [username, setUsername] = useState("");

    const handleElevateUser = async () => {
        if (username.trim().length === 0) {
            return;
        }
        await elevateUser(username);
        if (!error) {
            setOpen(false);
        }
    }

    return <AdminPageDialog
        title={Resources.ElevateDialog.Title}
        openState={{ open, setOpen }}
    >
        <Stack gap={Resources.Page.NormalFormGap}>
            <TextField
                label={Resources.ElevateDialog.UsernameInputLabel}
                value={username}
                onChange={e => setUsername(e.target.value)}
            />
            {!error && <Typography color="error">{error}</Typography>}
            <Button onClick={handleElevateUser}>Elevate</Button>
        </Stack>
    </AdminPageDialog>
}

export default ElevateUserDialog;
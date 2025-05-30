import { Close } from "@mui/icons-material";
import { Button, Dialog, Divider, Stack, Typography } from "@mui/material";
import { JSX } from "react";

export type AdminPageDialogProps = {
    children: JSX.Element[];
    title: string;
    openState: {
        open: boolean;
        setOpen: (open: boolean) => void;
    }
}

const AdminPageDialog = ({
    children,
    title,
    openState: {
        open,
        setOpen
    }
}: AdminPageDialogProps) => {
    return <Dialog open={open}>
        <Stack>
            <Stack
                direction="row"
                justifyContent="space-between"
            >
                <Typography variant="h4">{title}</Typography>
                <Button onClick={() => setOpen(false)}>
                    <Close />
                </Button>
            </Stack>
            <Divider />
            {children}
        </Stack>
    </Dialog>
}

export default AdminPageDialog;
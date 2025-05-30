import { Stack, Typography } from "@mui/material";
import AdminCommandBar from "../components/AdminCommandBar";
import Resources from "../AdminPageResources.json";
import SuspendedUsersTable from "../components/SuspendedUsersTable";

const AdminPage = () => {
    return <Stack
        padding={Resources.Page.LargePadding}
        gap={Resources.Page.NormalFormGap}
    >
        <Typography variant="h3">System Management</Typography>
        <AdminCommandBar />
        <SuspendedUsersTable />
    </Stack>
}

export default AdminPage;
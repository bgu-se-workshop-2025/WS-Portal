import { Stack, Typography } from "@mui/material";
import AdminCommandBar from "../components/AdminCommandBar";
import Resources from "../AdminPageResources.json";
import SuspendedUsersTable from "../components/SuspendedUsersTable";
import useAdmin from "../hooks/useAdmin";

const AdminPage = () => {
    const useAdminResponse = useAdmin();
    return <Stack
        padding={Resources.Page.LargePadding}
        gap={Resources.Page.NormalFormGap}
    >
        <Typography variant="h3">System Management</Typography>
        <AdminCommandBar useAdminResponse={useAdminResponse} />
        <SuspendedUsersTable useAdminResponse={useAdminResponse} />
    </Stack>
}

export default AdminPage;
import { Stack, Typography } from "@mui/material";
import AdminCommandBar from "../components/AdminCommandBar";

const AdminPage = () => {
    return <Stack padding={4}>
        <Typography variant="h3">System Management</Typography>
        <AdminCommandBar />
    </Stack>
}

export default AdminPage;
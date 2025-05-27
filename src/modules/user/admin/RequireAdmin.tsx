import { Outlet, useNavigate } from "react-router-dom"
import useAdmin from "./hooks/useAdmin";
import { CircularProgress, Stack } from "@mui/material";
import { useEffect } from "react";

const RequireAdmin = () => {
    const navigate = useNavigate();
    const { result, loading, error, isAdmin } = useAdmin();

    useEffect(() => {
        if (isAdmin) {
            isAdmin();
        }
    }, []);

    if (loading) {
        return <Stack alignItems="center" justifyContent="center">
            <CircularProgress />
        </Stack>
    } else if (error || !result) {
        navigate("/login", { replace: true });
    }
    return <Outlet />
}

export default RequireAdmin;
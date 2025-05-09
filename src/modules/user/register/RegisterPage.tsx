import { useNavigate } from "react-router-dom";
import PaneLayout from "./components/PaneLayout/PaneLayout"
import RegisterPageResources from "./RegisterPageResources.json"
import { Button, Typography } from "@mui/material";

const RegisterPage = () => {
    const navigate = useNavigate();

    const handleLogin = () => {
        navigate("/login");
    }

    return (
        <PaneLayout.Container>
            <PaneLayout.Pane>
                <Typography variant="h2">{RegisterPageResources.SidePanel.Title}</Typography>
                <Typography variant="body1">

                </Typography>
                <Button
                    onClick={handleLogin}
                    variant="outlined"
                    color="inherit"
                    sx={RegisterPageResources.Styles.Button}>
                    {RegisterPageResources.SidePanel.Button}
                </Button>
            </PaneLayout.Pane>
            <PaneLayout.Pane main>
                <Typography variant="h2">Register a new user</Typography>
            </PaneLayout.Pane>
        </PaneLayout.Container>
    );
}

export default RegisterPage
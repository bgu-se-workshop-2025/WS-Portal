import { useNavigate } from "react-router-dom";
import PaneLayout from "./components/PaneLayout/PaneLayout"
import RegisterPageResources from "./RegisterPageResources.json"
import { Button, Typography } from "@mui/material";
import FormTextField from "./components/FormTextField/FormTextField";
import { isValidEmailAddress, isValidPassword, isValidStringProperty, isValidUsername } from "./utils/formValidationsUtil";

const RegisterPage = () => {
    const navigate = useNavigate();

    const handleLogin = () => {
        navigate("/login");
    }

    const handleRegister = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const firstName = formData.get(RegisterPageResources.Main.Form.FirstName.Id);
        const lastName = formData.get(RegisterPageResources.Main.Form.LastName.Id);
        const username = formData.get(RegisterPageResources.Main.Form.Username.Id);
        const email = formData.get(RegisterPageResources.Main.Form.Email.Id);
        const password = formData.get(RegisterPageResources.Main.Form.Password.Id);

        const valid = (
            Array.from(formData.values()).reduce((acc, value) => acc && typeof (value) === "string", true) &&
            isValidStringProperty(firstName as string) &&
            isValidStringProperty(lastName as string) &&
            isValidUsername(username as string) &&
            isValidEmailAddress(email as string) &&
            isValidStringProperty(password as string)

        );

        if (!valid) {
            return
        }

        event.currentTarget.reset();
    }

    return (
        <PaneLayout.Container>
            <PaneLayout.Pane>
                <Typography
                    variant="h2"
                    sx={RegisterPageResources.Styles.MarginBottom}
                >
                    {RegisterPageResources.SidePanel.Title}
                </Typography>
                <Typography variant="body1">
                    {RegisterPageResources.SidePanel.Body}
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
                <Typography
                    variant="h2"
                    sx={RegisterPageResources.Styles.MarginBottom}
                >
                    {RegisterPageResources.Main.Title}
                </Typography>
                <form onSubmit={handleRegister}>
                    <FormTextField
                        id={RegisterPageResources.Main.Form.FirstName.Id}
                        label={RegisterPageResources.Main.Form.FirstName.Label}
                        placeholder={RegisterPageResources.Main.Form.FirstName.Placeholder}
                        required
                        validation={isValidStringProperty}
                    />
                    <FormTextField
                        id={RegisterPageResources.Main.Form.LastName.Id}
                        label={RegisterPageResources.Main.Form.LastName.Label}
                        placeholder={RegisterPageResources.Main.Form.LastName.Placeholder}
                        required
                        validation={isValidStringProperty}
                    />
                    <FormTextField
                        id={RegisterPageResources.Main.Form.Username.Id}
                        label={RegisterPageResources.Main.Form.Username.Label}
                        placeholder={RegisterPageResources.Main.Form.Username.Placeholder}
                        required
                        validation={isValidUsername}
                        infoPop={RegisterPageResources.Main.Form.Username.Info}
                    />
                    <FormTextField
                        id={RegisterPageResources.Main.Form.Email.Id}
                        label={RegisterPageResources.Main.Form.Email.Label}
                        placeholder={RegisterPageResources.Main.Form.Email.Placeholder}
                        required
                        validation={isValidEmailAddress}
                        infoPop={RegisterPageResources.Main.Form.Email.Info}
                    />
                    <FormTextField
                        id={RegisterPageResources.Main.Form.Password.Id}
                        label={RegisterPageResources.Main.Form.Password.Label}
                        placeholder={RegisterPageResources.Main.Form.Password.Placeholder}
                        type="password"
                        required
                        validation={isValidPassword}
                        infoPop={RegisterPageResources.Main.Form.Password.Info}
                    />
                    <Button variant="contained" type="submit" sx={RegisterPageResources.Styles.Button}>
                        {RegisterPageResources.Main.Form.Button.Content}
                    </Button>
                </form>
            </PaneLayout.Pane>
        </PaneLayout.Container>
    );
}

export default RegisterPage
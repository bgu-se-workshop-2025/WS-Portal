import React from "react";
import { Box, Typography, Button } from "@mui/material";
import LoginTextField from "./components/LoginTextField";
import { resources } from "./LoginPageResources.json"

const LoginPage: React.FC = () => {
    return (
        <Box
            id="LoginPage"
            sx={{
                display: "flex",
                flexDirection: "row",
                height: "100vh",
                padding: 0,
                margin: 0,
            }}
        >
            <Box
                sx={{
                    width: "60%",
                    backgroundColor: "white",
                    color: "black",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Typography variant="h2" sx={{ my: "2rem" }}>{resources.content.loginText}</Typography>
                <LoginTextField id="username" label="Username" />
                <LoginTextField id="password" label="Password" type="password" />
                <Button variant="contained" sx={{ my: "1rem", width: "30rem", height: "3rem", borderRadius: "1rem" }}>Sign In</Button>
            </Box>
            <Box
                sx={{
                    width: "40%",
                    backgroundColor: "#3f51b5",
                    color: "white",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Typography variant="h2" sx={{ my: "1rem" }}>New Here?</Typography>
                <Typography variant="body1">
                    Sign up and discover the greatest workshop project in the world!
                </Typography>
                <Button variant="contained" color="inherit" sx={{ my: "1rem", width: "15rem", height: "3rem", borderRadius: "1rem", color: "#3f51b5" }}>Sign Up</Button>
            </Box>
        </Box>
    );
};

export default LoginPage;

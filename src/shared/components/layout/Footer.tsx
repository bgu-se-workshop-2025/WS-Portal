import { Box, Typography } from "@mui/material";

import { Resources } from "../layout/Resources.json";

const Footer: React.FC = () => {
    return (
        <Box sx={{ ...Resources.Styles.Footer }}>
            <Typography variant="body2" color="text.secondary" align="center">
                {Resources.Content.Footer.FooterText}
            </Typography>
        </Box>
    );
};

export default Footer;

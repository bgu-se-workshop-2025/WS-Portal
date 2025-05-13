import { SharedResources } from "../../../../../shared/Resources.json";
import PanelLayoutResources from "./PaneLayoutResources.json";
import { Box, Typography } from "@mui/material";
import { ReactNode } from "react";

const Container = ({ children }: { children: ReactNode }) => {
    return <Box
        sx={{
            ...PanelLayoutResources.Styles.Container,
            ...SharedResources.Styles.FullScreenHeight,
        }}
    >
        {children}
    </Box>
}

const Pane = ({
    children,
    main = false
}: {
    children: ReactNode,
    main?: boolean
}) => {

    const PaneStyle = main ?
        PanelLayoutResources.Styles.MainContainer :
        PanelLayoutResources.Styles.SideContainer;

    return <Box
        sx={{
            ...PaneStyle,
            ...SharedResources.Styles.FlexboxCol,
            ...SharedResources.Styles.AlignCenter,
        }}
    >
        {children ?? <Typography variant="h2">Whoa.. Nothing is here</Typography>}
    </Box>
}

const PaneLayout = {
    Container,
    Pane
};

export default PaneLayout;
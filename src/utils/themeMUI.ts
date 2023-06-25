import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
    palette: {
        // mode: "dark",
        primary: {
            main: "#90caf9",
        },
        secondary: {
            main: "#003554",
        },
    },
    typography: {
        fontFamily: "Quicksand,Roboto,sans-serif,Segoe UI,Arial",
    },
});

export const lightTheme = createTheme({
    palette: {
        primary: {
            main: "#90caf9",
        },
        secondary: {
            main: "#003554",
        },
    },
    typography: {
        fontFamily: "Quicksand,Roboto,sans-serif,Segoe UI,Arial",
    },
});

const colorsTailwind = {
    "primary": "#90caf9",
    "l-secondary": "#003554",
    "l-utility-dark": "#00043A",
    "l-tools-bg": "#E9ECEF",
    "l-divider": "#7D7D7D",
    "l-workscreen-bg": "#F4F4F4",
    "l-workspace-bg": "#FAFAFA",
    "d-100-body-bg": "#292e4c",
    "d-200-cards": "#373d65",
    "d-300-chips": "#454c7f",
    "d-400-sibebar": "#525c98",
    "d-500-divider": "#666fac",
    "d-600-lightest": "#8c93c0",
    "d-700-text": "#bfc3dc"
};

export const darkTheme = createTheme({
    palette: {
        mode: "dark",
        primary: {
            main: colorsTailwind["d-500-divider"],
        },
        secondary: {
            main: colorsTailwind["d-600-lightest"],
        },
        text: {
            primary: "#bfc3dc"
        }
    },
    typography: {
        fontFamily: "Quicksand, Roboto,sans-serif,Segoe UI,Arial",
    },
});

import { createTheme } from "@mui/system";

export const theme = createTheme({
    palette: {
        primary: {
            main: '#3F8AE0'
        },
        secondary: {
            main: '#326eb3'
        },
        background: {
            color: {
                primary: "rgb(34, 34, 34) none repeat scroll 0% 0%",
                secondary: "rgb(51, 51, 51) none repeat scroll 0% 0%",
                overMenu: "rgb(51, 51, 51, 0.8) none repeat scroll 0% 0%",
            }
        },
        text: {
            color: {
                primary: "rgb(189, 189, 189)",
                disabled: "rgb(189, 189, 189, 0.6)",
                hover: "rgb(230, 230, 230)"
            }
        },
        border: {
            valid: {
                color: "mediumseagreen",
                style: "solid",
                width: "5px",
            },
            invalid: {
                color: "firebrick",
                style: "solid",
                width: "5px",
            },
            overMenu: {
                color: "rgb(51, 51, 51, 0.8)",
                style: "solid",
                width: "5px",
            },
        }
    },    //custom theme variables
    shape: {
        borderRadius: "12px"
    }
});

import Box from "@mui/material/Box";
import NewPass from "./components/NewPass";
import styles from "./LoginMUI.module.css";

export default function NewPassword() {
    return (
        <Box className={styles.container}>
            <NewPass />
            <Box className={styles.backgroundImageBox}></Box>
        </Box>
    );
}

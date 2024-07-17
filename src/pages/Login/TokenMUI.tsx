
import Box from "@mui/material/Box";
import Token from "./components/Token";
import styles from "./LoginMUI.module.css";

export default function TokenFunc() {
    return (
        <Box className={styles.container}>
            <Token />
            <Box className={styles.backgroundImageBox}></Box>
        </Box>
    );
}

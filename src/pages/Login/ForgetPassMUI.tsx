
import Box from "@mui/material/Box";
import ForgetPass from "./components/ForgetPass";
import styles from "./LoginMUI.module.css";

export default function ForgetPassword() {
    return (
        <Box className={styles.container}>
            <ForgetPass />
            <Box className={styles.backgroundImageBox}></Box>
        </Box>
    );
}


import Box from "@mui/material/Box";
import LoginForm from "./components/LoginForm";
import styles from "./LoginMUI.module.css";

export default function SignIn() {
    return (
        <Box className={styles.container}>
            <LoginForm />
            <Box className={styles.backgroundImageBox}></Box>
        </Box>
    );
}

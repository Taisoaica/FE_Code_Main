
import Box from "@mui/material/Box";
import SignUpForm from "./components/SignUpForm";
import styles from "./SignUpMUI.module.css";

export default function SignUp() {
  return (
    <Box className={styles.container}>
      <SignUpForm />
      <Box className={styles.backgroundImageBox}></Box>
    </Box>

    
  );
}

import {
  Button,
  Box,
  Grid,
  Link,
  TextField,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import styles from './ForgetPass.module.css';
import { handleForgetPass } from "../../../utils/api/AuthenticateUtils";
import { ArrowBack } from "@mui/icons-material";
import React from "react";

const ForgetPass = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/');
  };


  const [email, setEmail] = React.useState("");

  const validateEmail = (inputEmail: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(inputEmail);
  };

  return (
    <Box component="form"
      onSubmit={(event) => handleForgetPass(event, email, navigate)}
      noValidate
      className={styles.form}
    >
      <Box className={styles.buttonBox}>
        <button type="button" className={styles.backButton} onClick={handleBack}>
          <ArrowBack />
        </button>
      </Box>

      <Box className={styles.formContainer}>
        <Box className={styles.centerText}>
          Quên mật khẩu
        </Box>
        
        <TextField
          className={styles.input}
          required
          fullWidth
          id="email"
          label="Email"
          name="email"
          placeholder="abc@domain.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={!!email && !validateEmail(email)}
          helperText={
            email && !validateEmail(email)
              ? "Địa chỉ email không hợp lệ"
              : ""
          }
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ width: "100%" }}
        >
          Gửi token
        </Button>

        <Grid item lg={12}>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            Đã có tài khoản?
            <Box ml={1}>
              <Link href="/login" variant="body2" sx={{ fontSize: "17px" }}>
                Đăng nhập
              </Link>
            </Box>
          </Box>
        </Grid>
      </Box>
    </Box>
  );
};

export default ForgetPass;

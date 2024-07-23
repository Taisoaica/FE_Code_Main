import {
  Button,
  Box,
  Grid,
  Link,
  TextField,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import styles from './SignUpForm.module.css'
import { handleRegister } from "../../../utils/api/AuthenticateUtils";
import { ArrowBack, Visibility, VisibilityOff } from "@mui/icons-material";
import React from "react";

const SignUpForm = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/');
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      handleRegister(event, () => {
        navigate(-1);
      });
    } catch (error) {
      console.error("Register error:", error);
    }
  };

  //add eye-icon to password
  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  //validate username and password
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [email, setEmail] = React.useState("");

  const validateUsername = (inputUsername: string): boolean => {

    const regex = /^(?=[A-Za-z])(?=.*[A-Z])(?=.*[a-z])[A-Za-z0-9_]{8,30}$/
  
    //const regex = /^(?=[A-Za-z])(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z0-9_]{8,30}$/
    return regex.test(inputUsername);
  };

  const validatePassword = (inputPassword: string): boolean => {
    const regex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z0-9_]{8,30}$/
    return regex.test(inputPassword);
  };

  const validateEmail = (inputEmail: string): boolean => {
    const regex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/
    return regex.test(inputEmail);
  };

  return (
    <Box component="form"
      onSubmit={(event) => handleSubmit(event)}
      noValidate
      className={styles.form}
    >
      <Box className={styles.buttonBox}>
        <button type="button" className={styles.backButton} onClick={handleBack}>
          <ArrowBack />
        </button>
      </Box>

      <Box className={styles.formContainer}>
        <Box className={styles.centerText} >
          Tạo tài khoản
        </Box>
        <TextField
          className={styles.input}
          required
          fullWidth
          id="username"
          label="Tên tài khoản"
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          error={!!username && !validateUsername(username)}
          helperText={
            username && !validateUsername(username)
              ? "Tên đăng nhập phải bắt đầu bằng một ký tự chữ cái, có từ 8 đến 30 ký tự, và bao gồm ít nhất một chữ hoa, một chữ thường."
              : ""
          }
        />
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
        <TextField
          required
          className={styles.input}
          fullWidth
          name="password"
          label="Mật khẩu"
          type={showPassword ? "text" : "password"}
          id="password"
          autoComplete="off"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={!!password && !validatePassword(password)}
          helperText={
            password && !validatePassword(password)
              ? "Mật khẩu phải dài từ 8-30 ký tự, bao gồm ít nhất một chữ hoa, một chữ thường và một số."
              : ""
          }
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          onClick={() => handleSubmit}
          sx={{ width: "100%" }}
        >
          Đăng kí
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

export default SignUpForm;

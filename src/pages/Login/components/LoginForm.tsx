import { Button, Box, Checkbox, Link, Divider, TextField, } from "@mui/material";
import FormControlLabel from "@mui/material/FormControlLabel";
import { useLocation, useNavigate } from "react-router-dom";
import axios, { AxiosRequestConfig } from "axios";
import { useEffect } from "react";
import { connection_path } from "../../../constants/developments";
import { GoogleLogin } from "@react-oauth/google";
import * as React from "react";
import { InputAdornment, IconButton } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import styles from "./LoginForm.module.css";

import { handleLogin, handleGoogleOnSuccess, handleGoogleOnFailure } from "../../../utils/api/AuthenticateUtils";
import { ArrowBack } from "@mui/icons-material";

const LoginForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const redirectPath = queryParams.get('redirect') || '/'; 
  
  const handleBack = () => {
    navigate('/');
  }

  //add eye icon into the password field
  const [showPassword, setShowPassword] = React.useState(false);


  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  

  return (
    <Box
      component="form"
      onSubmit={(event) => handleLogin(event, navigate, redirectPath)}
      noValidate
    // className={styles.form}
    >
      <Box className={styles.buttonBox}>
        <button type="button" className={styles.backButton} onClick={handleBack}>
          <ArrowBack />
        </button>
      </Box>
      <Box className={styles.centerText} >
        Đăng nhập
      </Box>
      <Box className={styles.formContainer}>
        <TextField
          className={styles.input}
          required
          fullWidth
          id="username"
          name="username"
          label="Tên tài khoản"
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

        <Box className={styles.passwordBox}>
          <FormControlLabel
            control={<Checkbox />}
            label="Ghi nhớ mật khẩu"
          />
          <Link href="#" variant="body2" sx={{ fontSize: "17px" }}>
            Quên mật khẩu?
          </Link>
        </Box>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ width: "100%" }}
        >
          Đăng nhập
        </Button>
        <Box sx={{ textAlign: 'center' }}>Hoặc đăng nhập bằng tài khoản khác</Box>
        <Divider sx={{ backgroundColor: "black" }} />
        <Box sx={{ margin: '0 auto' }}>
          <GoogleLogin
            onSuccess={(response) => handleGoogleOnSuccess(response, navigate)}
            onError={() => handleGoogleOnFailure(navigate)}
            data-width="100%"
          />
        </Box>
        <Divider sx={{ backgroundColor: "black" }} />
        <Box className={styles.loginLinkContainer}>
          <Box>
            Bạn chưa có tài khoản?
          </Box>
          <Link href="/signup" variant="body2" sx={{ fontSize: "17px" }}>
            Đăng ký ngay
          </Link>
        </Box>
      </Box>
    </Box >
  );
};


export default LoginForm;

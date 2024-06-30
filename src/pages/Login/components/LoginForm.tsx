import { Button, Box, Checkbox, Link, Divider, TextField, } from "@mui/material";
import FormControlLabel from "@mui/material/FormControlLabel";
import { useNavigate } from "react-router-dom";
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

  const handleBack = () => {
    navigate(-1);
  }

  //    ===================== Nên đưa ra một thư mục khác ==========================

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    //    Dữ liệu về form
    const data = new FormData(event.currentTarget);

    //    Dữ liệu sau khi điền vào form
    const payload = {
      userName: data.get("username"),
      password: data.get("password"),
    };

    //    Chuỗi kết nối tới server backend
    //!   LƯU Ý: KHÔNG THAY ĐỔI TRỰC TIẾP CHUỖI KẾT NỐI TẠI ĐÂY (Fix cứng)
    //==  Chỉ thay đổi dữ liệu của "connection_path" trong file src/constants/developments

    const api_url: string =
      connection_path.base_url + connection_path.auth.login;

    const configuration: AxiosRequestConfig = {
      method: "POST",
      url: api_url,
      data: payload,
    };

    await axios(configuration)
      .then((response) => {
        if (
          response.status === 200 &&
          response.data.accessToken !== undefined
        ) {
          localStorage.setItem("accessToken", response.data.accessToken);
          localStorage.setItem("refreshToken", response.data.refreshToken);
          //  Thành công thì cho về trang người dùng
          navigate("/");
        } else {
          alert("Không đăng nhập thành công");
        }
      })
      .catch((error) => {
        alert("Đăng nhập thất bại, vui lòng thử lại sau.");
        console.log(error);
      });
  }

  // const handleGoogleOnSuccess = async (response: GoogleCredentialResponse) => {
  //   const api_url: string =
  //     connection_path.base_url + connection_path.auth.googleAuth;
  //   const configuration: AxiosRequestConfig = {
  //     method: "POST",
  //     url: api_url,
  //     data: { googleToken: response.credential },
  //     headers: { "Content-Type": "application/json" },
  //   };
  //   const axiosResponse: AxiosResponse<{
  //     accessToken: string;
  //     refreshToken: string;
  //     error: string;
  //     message: string;
  //   }> = await axios(configuration);

  //   console.log(axiosResponse);

  //   if (axiosResponse.data.accessToken !== undefined) {
  //     localStorage.setItem("accessToken", axiosResponse.data.accessToken);
  //     localStorage.setItem("refreshToken", axiosResponse.data.refreshToken);
  //     navigate("/");
  //   }
  // };
  // const handleGoogleOnFailure = () => {
  //   navigate("/error404")
  // };

  //#   Kiểm tra xem người dùng đã login hay chưa (nên có ở các trang / component yêu cầu phải login)
  useEffect(() => {
    const usertoken = localStorage.getItem("accessToken");
    if (usertoken != null) {
      //!   Chưa update server nên hiện tại chưa hỗ trợ kiểm tra login bên phía Backend.

      // Prepare for API fetching
      //const api_url: string = connection_path.base_url + connection_path.api + connection_path.endpoints.checkAuth;
      //const configuration: AxiosRequestConfig = { method: "POST",  url: api_url,  data:{token: usertoken}};

      //const response: AxiosResponse<{result: string}> = await axios(configuration);

      //#   Nếu đã login rồi thì không phải login lại nữa mà về trang chủ.
      //if (response.data.result === 'valid') {

      navigate("/user/profile");
      //}
    }
  });



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
      onSubmit={(event) => handleLogin(event, navigate)}
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
          onClick={() => handleSubmit}
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

import {
    Button,
    Box,
    TextField,
    InputAdornment,
    IconButton,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import styles from './ForgetPass.module.css'
import { ArrowBack, Visibility, VisibilityOff } from "@mui/icons-material";
import React from "react";
import { handleResetPass } from "../../../utils/api/AuthenticateUtils";


const NewPass = () => {
    const navigate = useNavigate();

    const handleBack = () => {
        navigate('/');
    }

    const [password, setPassword] = React.useState("");

    //add eye-icon to password
    const [showPassword, setShowPassword] = React.useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (
        event: React.MouseEvent<HTMLButtonElement>
    ) => {
        event.preventDefault();
    };


    const validatePassword = (inputPassword: string): boolean => {
        const regex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z0-9_]{8,30}$/
        return regex.test(inputPassword);
    };

    return (
        <Box component="form"
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
                    Mật khẩu mới
                </Box>

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
                    sx={{ width: "100%" }}
                >
                    Đổi mật khẩu
                </Button>


            </Box>
        </Box>

    );
};

export default NewPass;

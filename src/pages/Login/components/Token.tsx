import {
    Button,
    Box,
    TextField,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import styles from './ForgetPass.module.css'
import { tokenForPass } from "../../../utils/api/AuthenticateUtils";
import { ArrowBack } from "@mui/icons-material";
import React from "react";

const Token = () => {
    const navigate = useNavigate();

    const handleBack = () => {
        navigate('/');
    }

    const [token, setToken] = React.useState("");




    return (
        <Box component="form"
            onSubmit={(event) => tokenForPass(event, token, navigate)}
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
                    Nhập token
                </Box>

                <h6>Nhập mã OTP vừa được gửi đến số 0765015213</h6>

                <TextField
                    className={styles.input}
                    required
                    fullWidth
                    id="token"
                    label="Token"
                    name="token"
                    placeholder="Enter your token"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                />


                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    sx={{ width: "100%" }}
                >
                    Xác nhận
                </Button>


            </Box>
        </Box>

    );
};

export default Token;

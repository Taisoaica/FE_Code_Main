import React from 'react';
import UserLayout from '../../components/UserLayout';
import { Box, SvgIcon, Typography, Button } from '@mui/material';
import SearchOffRoundedIcon from '@mui/icons-material/SearchOffRounded';
import { useNavigate } from 'react-router-dom';


const ErrorPage = () => {
    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate('/'); 
    };

    return (
        <UserLayout>
            <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                minHeight="100vh"
                bgcolor="#f5f5f5"
                p={3}
            >
                <Box mb={3}>
                    <SvgIcon
                        component={SearchOffRoundedIcon}
                        sx={{ fontSize: 80, color: 'error.main' }}
                        aria-hidden="true"
                    />
                </Box>
                <Typography variant="h4" color="textPrimary" gutterBottom>
                    Trang không tìm thấy.
                </Typography>
                <Typography variant="body1" color="textSecondary" mb={3}>
                    Trang bạn đang tìm không tìm thấy hay không tồn tại.
                </Typography>
                <Button variant="contained" color="primary" onClick={handleGoBack}>
                    Về trang chủ
                </Button>
            </Box>
        </UserLayout>
    );
};

export default ErrorPage;

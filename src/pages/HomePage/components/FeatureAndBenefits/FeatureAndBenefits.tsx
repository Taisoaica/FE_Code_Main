// src/FeaturesAndBenefits.js
import { Container, Grid, Typography, Box } from '@mui/material';
import { Security, Speed, Accessibility } from '@mui/icons-material';

const features = [
    {
        icon: <Speed fontSize="inherit" color='primary' />,
        title: "Tiết kiệm thời gian",
        description: "Đặt lịch hẹn trực tuyến dễ dàng và nhanh chóng, không phải chờ đợi."
    },
    {
        icon: <Security fontSize="inherit" color='primary' />,
        title: "Bảo mật thông tin",
        description: "Cam kết bảo vệ và giữ kín mọi thông tin cá nhân của khách hàng theo các tiêu chuẩn bảo mật cao nhất."
    },
    {
        icon: <Accessibility fontSize="inherit" color='primary' />,
        title: "Dễ sử dụng",
        description: "Giao diện thân thiện, dễ sử dụng, phù hợp với mọi đối tượng người dùng."
    },
];

const FeaturesAndBenefits = () => {
    return (
        <Container>
            <Box sx={{ textAlign: 'center', fontSize: '38px', fontWeight: 800, marginBottom: '20px' }}>
                Các tiện ích
            </Box>
            <Grid container spacing={3}>
                {features.map((feature, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <Box textAlign="center" p={2} sx={{ backgroundColor: '#ffffff', height: '100%', borderRadius: '10px' }}>
                            <Box sx={{ fontSize: '50px' }}>
                                {feature.icon}
                            </Box>
                            <Typography variant="h5" gutterBottom sx={{ color: '#153448' }}>
                                {feature.title}
                            </Typography>
                            <Typography variant="body1" sx={{ color: '#153448' }}>
                                {feature.description}
                            </Typography>
                        </Box>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default FeaturesAndBenefits;
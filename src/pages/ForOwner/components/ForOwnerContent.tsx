import React from 'react';
import { Box, Divider, Button } from '@mui/material';
import styles from './ForOwnerContent.module.css';
import Hero from './Hero/Hero';

const ForOwnerContent: React.FC = () => {
    return (
        <>
            <Hero />
            <Box className={styles.container}>
                <Box className={styles.firstContent}>
                    <Box sx={{ textAlign: 'center', gridRow: 1, paddingTop: '20px' }}>
                        <Box sx={{ fontWeight: 800, fontSize: '38px' }}>
                            Phần mềm quản lí phòng khám đa năng
                        </Box>
                        <Box sx={{ fontSize: '22px' }}>
                            Giúp quản lý phòng khám một cách khoa học, chính thống theo các yêu cầu của Bộ Y Tế.
                        </Box>
                    </Box>
                    <Box className={styles.content1}>
                        <Box>
                            <Box className={styles.imageBox}>
                                <img src="/icon/hospital.png" alt="placeholder" />
                            </Box>
                            <Box sx={{ fontSize: '22px', fontWeight: 700 }}>
                                Quản lí phòng khám
                            </Box>
                            <Box sx={{ fontSize: '20px' }}>
                                Đầy đủ các tính năng:  quản lí lịch hẹn, bệnh nhân, bác sĩ, dịch vụ, slot khám, ...
                            </Box>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                            <Box className={styles.imageBox}>
                                <img src="/icon/analytics.png" alt="placeholder" />
                            </Box>
                            <Box sx={{ fontSize: '22px', fontWeight: 700 }}>
                                Báo cáo thống kê
                            </Box>
                            <Box sx={{ fontSize: '20px' }}>
                                Thống kê doanh thu, số lượng bệnh nhân, số lượng lịch hẹn, ...
                            </Box>
                        </Box>
                        <Box>
                            <Box>
                                <img src="/icon/folder.png" alt="placeholder" />
                            </Box>
                            <Box sx={{ fontSize: '22px', fontWeight: 700 }}>
                                Bảo mật thông tin
                            </Box>
                            <Box sx={{ fontSize: '20px' }}>
                                Cam kết bảo mật theo hạ tầng ISO 27001:2013, đạo luật HIPAA, thành viên VNISA.
                            </Box>
                        </Box>

                        <Box>
                            <Box className={styles.imageBox}>
                                <img src="/icon/team-management.png" alt="placeholder" />
                            </Box>
                            <Box sx={{ fontSize: '22px', fontWeight: 700 }}>
                                Quản lí bệnh nhân
                            </Box>
                            <Box sx={{ fontSize: '20px' }}>
                                Quản lí lịch hẹn, hồ sơ bệnh án của bệnh nhân
                            </Box>
                        </Box>
                        <Box />
                        <Box>
                            <Box sx={{ fontSize: '22px', fontWeight: 700 }}>
                                Cổng dược quốc gia
                            </Box>
                            <Box sx={{ fontSize: '20px' }}>
                                Theo QĐ 318/QĐ-QLD
                            </Box>
                        </Box>
                    </Box>
                </Box>

                <Box sx={{ textAlign: 'center', gridRow: 1, paddingTop: '50px' }}>
                    <Box sx={{ fontWeight: 800, fontSize: '38px' }}>
                        Nền tảng quản lý phòng khám hiện đại
                    </Box>
                    <Box sx={{ fontSize: '22px' }}>
                        Giải pháp toàn diện cho phòng khám của bạn
                    </Box>
                </Box>
                <Box className={styles.secondContent}>
                    <Box sx={{ gridColumn: 1 }}></Box>
                    <Box className={styles.stackedBoxesContainer}>
                        <Box className={styles.secImageBox}>
                            <img src="/icon/calendar.png" />
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <Box>
                                    <Box sx={{ fontWeight: 700, fontSize: '30px' }}>
                                        Quản lí lịch hẹn
                                    </Box>
                                </Box>
                                <Box>
                                    <Box sx={{ fontSize: '24px' }}>
                                        Đặt khám tiện lợi không chờ đợi.
                                        Lịch khám bệnh nhân được thống kê ngay trên ứng dụng.
                                    </Box>
                                </Box>
                            </Box>
                        </Box>
                        <Divider sx={{ backgroundColor: 'black', width: '90%', margin: '1em auto' }} />
                        <Box className={styles.secImageBox}>
                            <img src="/icon/help-desk.png" />
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <Box>
                                    <Box sx={{ fontWeight: 700, fontSize: '30px' }}>
                                        Tư vấn trực tuyến
                                    </Box>
                                </Box>
                                <Box>
                                    <Box sx={{ fontSize: '24px' }}>
                                        Bệnh nhân có thể chat với bác sĩ.
                                    </Box>
                                </Box>
                            </Box>
                        </Box>
                        <Divider sx={{ backgroundColor: 'black', width: '90%', margin: '1em auto' }} />
                        <Box className={styles.secImageBox}>
                            <img src="/icon/bell.png" />
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <Box>
                                    <Box sx={{ fontWeight: 700, fontSize: '30px' }}>
                                        Nhắc hẹn tự động
                                    </Box>
                                </Box>
                                <Box>
                                    <Box sx={{ fontSize: '24px' }}>
                                        Nhắc đi khám, tái khám, uống thuốc
                                    </Box>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                </Box>

                <Box className={styles.thirdContent}>
                    <Box className={styles.thirdContentHeader}>
                        Tìm kiếm giải pháp quản lí thông minh ?
                    </Box>
                    <Button href="/for-owner/clinic-register" variant="contained" sx={{ backgroundColor: '#00bfa5', color: 'white', fontSize: '20px', padding: '10px 20px' }}>
                        Đăng kí ngay
                    </Button>
                </Box>
            </Box >
        </>
    );
};

export default ForOwnerContent;

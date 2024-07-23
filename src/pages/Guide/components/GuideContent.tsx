import { Box, Paper, Typography } from "@mui/material"
import styles from './GuideContent.module.css';


const GuideContent = () => {
    return (
        <Box className={styles.container}>

            <Box sx={{ textAlign: 'center', gridRow: 1, paddingTop: '20px' }}>
                <Box sx={{ fontWeight: 700, fontSize: '38px', color: '#00b5f1' }}>
                    Hướng dẫn đặt khám nhanh
                </Box>
                <Box sx={{ fontSize: '18px' }}>
                    Trải nghiệm dịch vụ chăm sóc sức khỏe tối ưu và đặt lịch khám một cách dễ dàng, nhanh chóng với SmileCare
                </Box>
                <hr />
            </Box>


            <Box className={styles.paperContainer}>
                <Paper elevation={5} square={false} className={styles.paper}>
                    <Box sx={{ fontSize: '20px', fontWeight: 700, paddingBottom: '10px' }}>
                        CHỌN THÔNG TIN ĐẶT KHÁM
                    </Box>
                    <Typography>
                        <ul>
                            <li>Tạo hoặc đăng nhập tài khoản trên website</li>
                            <li>Nhấn vào đặt khám ngay trên menu hoặc ở banner</li>
                            <li>Chọn một trong những cơ sở để đặt khám</li>
                            <li>Chọn thông tin khám: Chuyên khoa, bác sĩ, ngày khám, giờ khám</li>
                            <li>Thanh toán phí khám</li>
                        </ul>
                    </Typography>
                    <Box sx={{ fontSize: '20px', fontWeight: 700, paddingBottom: '10px' }}>
                        THANH TOÁN PHÍ KHÁM
                    </Box>
                    <ul>
                        <li>
                            Chọn phương thức thanh toán: Quét mã QR, Chuyển khoản 24/7, Thẻ khám bệnh, Thẻ thanh toán quốc tế, Thẻ ATM nội địa hoặc Ví điện tử.
                        </li>
                        <li>
                            Kiểm tra thông tin thanh toán (phí khám bệnh, phí tiện ích và tổng tiền) và xác nhận thanh toán.
                        </li>
                        <li>
                            Thực hiện thanh toán trên Ví điện tử hoặc Ứng dụng Ngân hàng hoặc Cổng thanh toán.
                        </li>
                    </ul>
                    <Box sx={{ fontSize: '20px', fontWeight: 700, paddingBottom: '10px' }}>
                        CẬP NHẬT THÔNG TIN CÁ NHÂN
                    </Box>
                    <ul>
                        <li>Tạo hoặc đăng nhập tài khoản trên website hoặc ứng dụng di động.</li>
                        <li>Nhấn vào biểu tượng người dùng ở góc bên phải trên cùng</li>
                        <li>Chọn mục Tài Khoản</li>
                        <li>Cập nhật thông tin cá nhân ở mục hồ sơ</li>
                        <li>Xem lịch sử thanh toán và lịch khám sắp tới ở các mục tương ứng</li>
                    </ul>
                </Paper>

                <Box className={styles.contact}>
                    <img src="/contact.webp" alt="" />
                    <div>
                    <img src="/chat-img/phone.png" alt="" />
                    
                    <h2>Các hình thức hỗ trợ: 
                        <h1>1900-2115</h1>

                    </h2>
                    
                    
                    
                        
                        
                    </div>
                </Box>
            </Box>


        </Box>
    )
}

export default GuideContent
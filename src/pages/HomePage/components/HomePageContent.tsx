import { Box, Button, Divider } from "@mui/material";
import Carousel from "../../../components/Carousel/Carousel";
import Accordion from "./Accordion/Accordion";
import FeaturesAndBenefits from "./FeatureAndBenefits/FeatureAndBenefits";
import { useNavigate } from 'react-router-dom';
import Hero from "../../../components/Hero/Hero";
import styles from './HomePageContent.module.css';
import decodeToken from "../../../utils/decoder/accessTokenDecoder";

const HomePageContent = () => {
  const navigate = useNavigate();

  const handleBookingClick = () => {
    navigate('/clinics');
  };

  return (
    <>
      <Hero />
      <Box className={styles.container}>
        <Button
          variant="contained"
          onClick={handleBookingClick}
          className={styles.bookingButtonHero}
        >
          Đặt lịch ngay
        </Button>
        <Box className={styles.clinicHeader}>
          <Box>
            Các phòng khám nổi bật
          </Box>
          <Button
            variant="contained"
            href="/clinics"
            className={styles.viewAllButton}
          >
            Xem tất cả &gt;&gt;
          </Button>
        </Box>
        <Box className={styles.carousel}>
          <Carousel />
        </Box>

        {/* <Box className={styles.firstContent}>
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
                Số lượng bệnh nhân, số lượng lịch hẹn, ...
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
        </Box> */}


        <Box className={styles.faqContent}>
          <Box sx={{
            textAlign: 'center',
            fontSize: '36px', fontWeight: 800
          }}>
            Câu hỏi thường gặp
          </Box>
        </Box>

        <Box className={styles.faqContainer}>
          <Box className={styles.faqContent}>
            <Accordion />
          </Box>
        </Box>

        <Box className={styles.featuresAndBenefitsContainer}>
          <FeaturesAndBenefits />
        </Box>

      </Box>

      {/* <Box className={styles.thirdContent}>
        <Box className={styles.thirdContentHeader}>
          Tìm kiếm giải pháp quản lí thông minh ?
        </Box>
        <Button href="/for-owner/clinic-register" variant="contained" sx={{ backgroundColor: '#00bfa5', color: 'white', fontSize: '20px', padding: '10px 20px' }}>
          Đăng kí ngay
        </Button>
      </Box> */}
    </>
  );
};

export default HomePageContent;

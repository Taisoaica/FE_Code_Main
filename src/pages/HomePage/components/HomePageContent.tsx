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

        <Box className={styles.faqContent} sx={{ marginTop: '80px' }}>
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

        <Box className={styles.featuresAndBenefitsContainer}  sx={{marginTop: '20px'}}>
          <FeaturesAndBenefits />
        </Box>

      </Box>
    </>
  );
};

export default HomePageContent;

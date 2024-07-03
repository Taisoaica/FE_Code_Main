import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './Carousel.css';
import { Box, CardContent, Card, Typography, Divider, Button } from '@mui/material';
import Slider from "react-slick";
import { getAllClinics } from "../../utils/api/MiscUtils";
import { ClinicToDisplay } from "../../utils/interfaces/ClinicRegister/Clinic";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchClinicImages } from "../../utils/UploadFireBase";

const settings = {
    dots: true,
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    centerMode: true,
    centerPadding: "60px",
};


const Carousel = () => {
    const navigate = useNavigate();
    const [items, setItems] = useState<ClinicToDisplay[]>([]);
    const [images, setImages] = useState({});
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchClinics = async () => {
            try {
                const clinics = (await getAllClinics('', 100, 0)).content;
                const verifiedClinics = clinics.filter(clinic => clinic.status === 'verified');

                setItems(verifiedClinics);

                // Fetch images for each clinic
                const imagesPromises = clinics.map(async (clinic) => {
                    const imageUrls = await fetchClinicImages(`clinics/${clinic.id}/logo/`);
                    return { [clinic.id]: imageUrls };
                });

                const imagesResults = await Promise.all(imagesPromises);
                const imagesMap = imagesResults.reduce((acc, img) => ({ ...acc, ...img }), {});
                setImages(imagesMap);

            } catch (err) {
                if (err instanceof Error) {
                    setError(err);
                } else {
                    console.error("An unexpected error occurred:", err);
                    setError(new Error("Failed to fetch clinic data"));
                }
            } finally {
                setLoading(false);
            }
        };

        fetchClinics();
    }, []);


    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    const handleDetailButtonClick = (id: number) => {
        navigate(`/clinic/${id}`)
    }

    const handleBookingButtonClick = (id: number) => {
        navigate(`/booking/${id}`)
    }

    return (
        <Slider {...settings} >
            {items.map((item, index) => (
                <Card key={index} sx={{ backgroundColor: '#fff', margin: '1em', borderRadius: '10px', border: '.5px solid #000', height: '450px' }}>
                    <CardContent sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
                        <Box>
                            <img
                                src={images[item.id] ? images[item.id][0] : ''}
                                alt={item.name}
                                style={{ width: '100%', height: '130px', objectFit: 'cover', borderTopLeftRadius: '10px', borderTopRightRadius: '10px' }}
                            />                            <Divider sx={{ backgroundColor: 'black', width: '90%', margin: '1em auto' }} />
                            <Box sx={{ minHeight: '80px' }}>
                                <Typography variant="h5" component="div" sx={{ textAlign: 'left', marginBottom: '0.5em' }}>
                                    {item.name}
                                </Typography>
                                <Typography variant="body1" component="div" sx={{ textAlign: 'left', maxHeight: '80px', overflow: 'hidden' }}>
                                    Địa chỉ : {item.address}
                                </Typography>
                            </Box>
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1em' }}>
                            <Button variant="outlined" onClick={() => handleDetailButtonClick(item.id)} sx={{ borderRadius: '5px', width: '100%' }}>Xem chi tiết</Button>
                            <Button variant="contained" onClick={() => handleBookingButtonClick(item.id)} sx={{ backgroundColor: '#00aeeb', color: '#fff', borderRadius: '5px', width: '100%' }}>Đặt lịch ngay</Button>
                        </Box>
                    </CardContent>
                </Card>
            ))}
        </Slider>
    )
}

export default Carousel;

import React, { useEffect, useLayoutEffect, useState } from 'react';
import { Avatar, Box, Breadcrumbs, Button, Divider, Link, Typography } from '@mui/material';
import ImageList from './ImageList/ImageList';
import ClinicServices from './ClinicServices/ClinicServices';
import { useParams } from 'react-router-dom';
import styles from './ClinicDetailContent.module.css';
import { fetchClinicImages } from '../../../utils/UploadFireBase';
import { ClinicInfoModel } from '../../../utils/interfaces/ClinicRegister/Clinic';
import { getClinicInformation } from '../../../utils/api/MiscUtils';  // Adjust the path as per your file structure

const ClinicDetailContent = () => {
    const { id } = useParams<{ id: string }>();
    const [images, setImages] = useState<string[]>([]);
    const [logo, setLogo] = useState<string>(''); // Placeholder for logo URL
    const [clinic, setClinic] = useState<ClinicInfoModel>();
    const [loading, setLoading] = useState<boolean>(true);
    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!id) return;
                setLoading(true); // Start loading
                const response = await fetch(`https://localhost:7163/api/clinic/${id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch clinic information');
                }
                const clinicInfo = await response.json();
                fetchImages('carousel', 1);
                fetchImages('logo', 1);
                setClinic(clinicInfo.content); // Update state with clinicInfo.content
                // fetchImages('carousel', clinicInfo.Id);
                // fetchImages('logo', clinicInfo.Id);
            } catch (error) {
                console.error('Error fetching clinic information:', error);
                // Handle error state if needed
            } finally {
                setLoading(false); // Finish loading
            }
        };

        fetchData();
    }, [id]);


    const fetchImages = async (folderName: string, clinicId: number) => {
        const folderPath = `clinics/${clinicId}/${folderName}/`;
        try {
            const imageUrls = await fetchClinicImages(folderPath);
            if (folderName === 'carousel') {
                setImages(imageUrls);
            } else if (folderName === 'logo') {
                setLogo(imageUrls[0]); // Assuming logo imageUrls has only one URL
            }
        } catch (error) {
            console.error(`Error fetching images from ${folderName}:`, error);
        }
    };

    if (loading) {
        return (
            <Typography variant="h4" sx={{ paddingTop: '5em', paddingBottom: '5em' }}>
                Loading...
            </Typography>
        );
    }

    return (
        <Box className={styles.container}>
            <Box className={styles.breadcrumbs}>
                <Breadcrumbs>
                    <Link underline="hover" color="inherit" href="/">
                        Trang chủ
                    </Link>
                    <Typography color="text.primary">Trang phòng khám</Typography>
                </Breadcrumbs>
            </Box>

            <Divider className={styles.divider} />

            {clinic && (
                <>
                    <Box className={styles.clinicHeader}>
                        <div className={styles.avatar}>
                            <img
                                src={logo}
                                alt={`${clinic.Name} Logo`}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        </div>
                        <Typography variant="h4" component="div" gutterBottom className={styles.clinicName}>
                            {clinic.Name}Phong kham Asia
                        </Typography>
                    </Box>

                    <Divider className={styles.divider} />

                    <Box className={styles.imageList}>
                        <ImageList images={images} />
                    </Box>
                    <Box className={styles.imageList} style={{ textAlign: 'right' }}>
                        <Button variant="contained" href={`/booking/1`} className={styles.button}>
                            Đặt lịch ngay
                        </Button>
                    </Box>

                    <Box className={styles.detailSection}>
                        <Box className={styles.sectionContent}>
                            <Typography variant="h4" className={styles.sectionTitle}>
                                Giới thiệu chi tiết
                            </Typography>
                            <Typography variant="body1" className={styles.sectionContent}>
                                {clinic.Description}
                            </Typography>
                        </Box>
                        <Box className={styles.sectionContent}>
                            <Typography variant="h6" className={styles.sectionTitle}>
                                Thời gian khám:
                            </Typography>
                            <Typography variant="body1" className={styles.sectionContent}>
                                {clinic.OpenHour} - {clinic.CloseHour} 07:00 - 17:00
                            </Typography>
                        </Box>

                        <Box className={styles.sectionContent}>
                            <Typography variant="h6" className={styles.sectionTitle}>
                                Địa chỉ:
                            </Typography>
                            <Typography variant="body1" className={styles.sectionContent}>
                                {clinic.Address} 130/13 Test Street
                            </Typography>
                        </Box>

                        <Box className={styles.sectionBottom}>
                            <Typography variant="h6" className={styles.sectionTitle}>
                                Dịch vụ nổi bật:
                            </Typography>
                            {/* <ClinicServices services={} /> */}
                        </Box>
                    </Box>
                </>
            )}
        </Box>
    );
};

export default ClinicDetailContent;

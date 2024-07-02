import { useEffect, useState } from 'react';
import { Box, Breadcrumbs, Button, Link, Typography } from '@mui/material';
import UseMultipleStepForm from '../../../components/UseMultipleStepForm/UseMultipleStepForm';
// import ServicesForm from './ServicesForm/ServicesForm';
import CertificationForm from './CertificationForm/CertificationForm';
import BasicForm from './BasicForm/BasicForm';
import styles from './ClinicRegisterContent.module.css';
import { Service, Clinic, Slot } from '../../../utils/interfaces/ClinicRegister/Clinic';
// import { ArrowBack, ArrowForward } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { ClinicRegistrationModel } from '../../../utils/interfaces/ClinicRegister/Clinic';
import { handleClinicRegister } from '../../../utils/api/ClinicRegister';
import OwnerRegisterForm from './OwnerRegisterForm/OwnerRegisterForm';
import { ArrowBack } from '@mui/icons-material';

const ClinicRegisterContent = () => {
    const navigator = useNavigate();

    const [formData, setFormData] = useState<ClinicRegistrationModel>({
        OwnerId: 0,
        OwnerUserName: '',
        OwnerPassword: '',
        OwnerEmail: '',
        OwnerFullName: '',
        Name: '',
        Description: '',
        Address: '',
        Phone: '',
        Email: '',
        OpenHour: '',
        CloseHour: '',
        ClinicServices: [],
    });



    const payload: ClinicRegistrationModel = {
        OwnerUserName: formData.OwnerUserName,
        OwnerPassword: formData.OwnerPassword,
        OwnerEmail: formData.OwnerEmail,
        OwnerFullName: formData.OwnerFullName,
        Name: formData.Name,
        Description: formData.Description,
        Address: formData.Address,
        Phone: formData.Phone,
        Email: formData.Email,
        OpenHour: formData.OpenHour,
        CloseHour: formData.CloseHour,
        ClinicServices: [],
    };


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            await handleClinicRegister(payload, navigator);
            alert('Đăng ký thành công');
        }
        catch (error) {
            alert('Đăng ký thất bại');
        }
    }

    const handleBack = () => {
        if (currentStep === 1) {
            setFormData(prev => ({ ...prev, name: '', description: '', address: '', phone: '', email: '', openHour: '', closeHour: '', clinicServices: [], clinicSlots: [], clinicMedia: [] }));
        } else if (currentStep === 2) {
            setFormData(prev => ({ ...prev, clinicServices: [] }));
        }
        else if (currentStep === 3) {
            setFormData(prev => ({ ...prev, clinicSlots: [] }));
        }
        else if (currentStep === 4) {
            setFormData(prev => ({ ...prev, clinicMedia: [] }));
        }
        back();
    };

    const { steps, currentStep, step, isFirstStep, isFinalStep, next, back } =
        UseMultipleStepForm([
            <BasicForm setFormData={setFormData} formData={formData} onStepComplete={() => next()} />,
            // <ServicesForm formData={formData} services={services} onStepComplete={() => next()} setFormData={setFormData} />,
            <OwnerRegisterForm formData={formData} setFormData={setFormData} onStepComplete={() => next()} />,
            <CertificationForm/>
        ]);

    return (
        <Box className={styles.container} component="form" onSubmit={handleSubmit}>
            <Box className={styles.breadcrumbsContainer}>
                <Breadcrumbs separator={<Typography sx={{ color: '#FFFFFF', mx: 1, fontWeight: 'bold' }}>/</Typography>}>
                    <Link underline="hover" href="/" sx={{ fontSize: 22, color: ' #F8F8F8' }}>
                        Trang chủ
                    </Link>
                    <Box sx={{ fontSize: 24, color: ' #F8F8F8' }}>Đăng ký phòng khám</Box>
                </Breadcrumbs>
            </Box>

            <Box className={styles.contentBox}>
                <Box className={styles.content}>
                    <Box className={styles.formContainer}>
                        {step}
                    </Box>
                </Box>

                <Box className={styles.buttonContainer}>
                    {!isFirstStep && (
                        <Button variant="text" className={styles.backButton} onClick={handleBack}>
                            <ArrowBack />
                            Quay lại
                        </Button>
                    )}
                    {isFinalStep && <Button variant="contained" color="primary" type="submit">Xác nhận</Button>}
                </Box>
            </Box>
        </Box>
    );
}

export default ClinicRegisterContent;


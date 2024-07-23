import React, { useState } from 'react';
import { Row, Col, Button, FormGroup, Label, Input, FormFeedback } from 'reactstrap';
import { ClinicRegistrationModel, setClinicRegistrationModel } from '../../../../utils/interfaces/ClinicRegister/Clinic';
import styles from './OwnerRegisterForm.module.css';
// import { handleOwnerRegister } from '../../../../utils/api/ClinicRegister';
// import { Email, Password } from '@mui/icons-material';

interface BasicFormProps {
    formData: ClinicRegistrationModel;
    setFormData: setClinicRegistrationModel;
    onStepComplete: () => void;
}

const OwnerRegisterForm = ({ formData, setFormData, onStepComplete }: BasicFormProps) => {

    const [localFormData, setLocalFormData] = useState<ClinicRegistrationModel>();

    const [errors, setErrors] = useState({
        OwnerUserName: '',
        OwnerFullName: '',
        OwnerPassword: '',
        OwnerEmail: ''
    });

    const validate = () => {
        const newErrors = {
            OwnerUserName: '',
            OwnerFullName: '',
            OwnerPassword: '',
            OwnerEmail: ''
        };
        let isValid = true;

        if (!localFormData?.OwnerUserName) {
            newErrors.OwnerUserName = 'Tên đăng nhập là bắt buộc.';
            isValid = false;
        } else if (
            !/^(?=[A-Za-z])(?=.*[A-Z])(?=.*[a-z])[A-Za-z0-9_]{8,30}$/.test(localFormData.OwnerUserName)
        ) {
            newErrors.OwnerUserName =
                'Tên đăng nhập phải bắt đầu bằng một ký tự chữ cái, có từ 8 đến 30 ký tự, và bao gồm ít nhất một chữ hoa, một chữ thường';
            isValid = false;
        }
        if (!localFormData?.OwnerEmail) {
            newErrors.OwnerEmail = 'Email là bắt buộc.';
            isValid = false;
        } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(localFormData.OwnerEmail)) {
            newErrors.OwnerEmail = 'Địa chỉ email không hợp lệ.';
            isValid = false;
        } else if (!localFormData.OwnerEmail.endsWith('@gmail.com')) {
            newErrors.OwnerEmail = 'Địa chỉ email phải kết thúc bằng @gmail.com.';
        }
        if (!localFormData?.OwnerPassword) {
            newErrors.OwnerPassword = 'Mật khẩu là bắt buộc.';
            isValid = false;
        } else if (!/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z0-9_]{8,30}$/.test(localFormData.OwnerPassword)) {
            newErrors.OwnerPassword = 'Mật khẩu phải dài từ 8-30 ký tự, bao gồm ít nhất một chữ hoa, một chữ thường và một số.';
            isValid = false;
        }
        setErrors(newErrors);
        return isValid;
    };
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;

        setLocalFormData((prevData: ClinicRegistrationModel | undefined) => {
            return { ...prevData, [name]: value };
        });
    };

    const handleSubmit = async (event: React.FormEvent) => {
        if (validate()) {
            onStepComplete();
            setFormData({
                ...formData,
                OwnerUserName: localFormData?.OwnerUserName,
                OwnerFullName: localFormData?.OwnerFullName,
                OwnerPassword: localFormData?.OwnerPassword,
                OwnerEmail: localFormData?.OwnerEmail
            });
        }
    }

    return (
        <div className={styles.container}>
            <Row className={styles.headingBox}>
                <Col>
                    <h2 className={styles.heading}>Đăng kí tài khoản phòng khám</h2>
                    <p className={styles.subHeading}>Nhập thông tin chi tiết</p>
                </Col>
            </Row>
            <div className={styles.formContent} >
                <FormGroup>
                    <Label for="username" sm={3} className={styles.label}>Tên đăng nhập:</Label>
                    <Col sm={9}>
                        <Input
                            type="text"
                            name="OwnerUserName"
                            id="username"
                            className={styles.input}
                            value={localFormData?.OwnerUserName}
                            onChange={handleChange}
                            invalid={!!errors.OwnerUserName}
                        />
                        <FormFeedback>{errors.OwnerUserName}</FormFeedback>
                    </Col>
                </FormGroup>

                <FormGroup>
                    <Label for="fullname" sm={3} className={styles.label}>Tên chủ phòng khám:</Label>
                    <Col sm={9}>
                        <Input
                            type="text"
                            name="OwnerFullName"
                            id="fullname"
                            className={styles.input}
                            value={localFormData?.OwnerFullName}
                            onChange={handleChange}
                            invalid={!!errors.OwnerFullName}
                        />
                        <FormFeedback>{errors.OwnerFullName}</FormFeedback>
                    </Col>
                </FormGroup>

                <FormGroup>
                    <Label for="email" sm={3} className={styles.label}>Email:</Label>
                    <Col sm={9}>
                        <Input
                            type="email"
                            name="OwnerEmail"
                            id="email"
                            className={styles.input}
                            value={localFormData?.OwnerEmail}
                            onChange={handleChange}
                            invalid={!!errors.OwnerEmail}
                        />
                        <FormFeedback>{errors.OwnerEmail}</FormFeedback>
                    </Col>
                </FormGroup>

                <FormGroup>
                    <Label for="password" sm={3} className={styles.label}>Mật khẩu:</Label>
                    <Col sm={9}>
                        <Input
                            type="password"
                            name="OwnerPassword"
                            id="password"
                            className={styles.input}
                            value={localFormData?.OwnerPassword}
                            onChange={handleChange}
                            invalid={!!errors.OwnerPassword}
                        />
                        <FormFeedback>{errors.OwnerPassword}</FormFeedback>
                    </Col>
                </FormGroup>

                <FormGroup row className={styles.buttonContainer}>
                    <Col sm={{ size: 9, offset: 3 }}>
                        <Button color="primary" className={styles.button} onClick={handleSubmit}>Đăng kí</Button>
                    </Col>
                </FormGroup>
            </div>
        </div>
    );
};

export default OwnerRegisterForm;

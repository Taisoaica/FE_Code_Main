import React, { useState } from 'react';
import { ClinicRegistrationModel, setClinicRegistrationModel } from '../../../../utils/interfaces/ClinicRegister/Clinic';
import { Row, Col, Button, Form, FormGroup, Label, Input, FormFeedback } from 'reactstrap';
import styles from './BasicForm.module.css';

interface BasicFormProps {
    formData: ClinicRegistrationModel;
    setFormData: setClinicRegistrationModel;
    onStepComplete: () => void;
}

const BasicForm = ({ formData, setFormData, onStepComplete }: BasicFormProps) => {
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [localFormData, setLocalFormData] = useState<ClinicRegistrationModel>(formData);
    
    const handleSubmit = () => {
        if (validate()) {
            if (localFormData.OpenHour === undefined || localFormData.CloseHour === undefined) return;
            console.log(localFormData.OpenHour)
            const formattedOpenHour = localFormData.OpenHour //formatTime(localFormData.OpenHour);
            const formattedCloseHour = localFormData.CloseHour //formatTime(localFormData.CloseHour);

            const updatedFormData: ClinicRegistrationModel = {
                ...localFormData,
                OpenHour: formattedOpenHour,
                CloseHour: formattedCloseHour,
            };

            setFormData(updatedFormData);
            onStepComplete();
        }
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setLocalFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};

        if (!localFormData.Name) {
            newErrors.name = 'Tên phòng khám là bắt buộc.';
        }
        if (!localFormData.Address) {
            newErrors.address = 'Địa chỉ là bắt buộc.';
        }
        if (!localFormData.Phone) {
            newErrors.phone = 'Số điện thoại là bắt buộc.';
        } else if (!/^\d{10}$/.test(localFormData.Phone)) {
            newErrors.phone = 'Số điện thoại phải có đúng 10 chữ số.';
        }
        if (!localFormData.Email) {
            newErrors.email = 'Địa chỉ email là bắt buộc.';
        } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(localFormData.Email)) {
            newErrors.email = 'Địa chỉ email không hợp lệ.';
        } else if (!localFormData.Email.endsWith('@gmail.com')) {
            newErrors.email = 'Địa chỉ email phải kết thúc bằng @gmail.com.';
        }
        if (!localFormData.OpenHour) {
            newErrors.openHour = 'Giờ mở cửa là bắt buộc.';
        } else if (!/^(\d|0\d|1\d|2[0-3]):([0-5]\d)$/.test(localFormData.OpenHour)) {
            newErrors.openHour = 'Giờ mở cửa không hợp lệ.';
        }
        if (!localFormData.CloseHour) {
            newErrors.closeHour = 'Giờ đóng cửa là bắt buộc.';
        } else if (!/^(\d|0\d|1\d|2[0-3]):([0-5]\d)$/.test(localFormData.CloseHour)) {
            newErrors.closeHour = 'Giờ đóng cửa không hợp lệ.';
        }

       
        const openHour = new Date(`1970-01-01T${localFormData.OpenHour}:00`);
        const closeHour = new Date(`1970-01-01T${localFormData.CloseHour}:00`);
        const sixHoursLater = new Date(openHour.getTime() + 6 * 60 * 60 * 1000);

        if (closeHour <= openHour) {
            newErrors.closeHour = 'Giờ đóng cửa phải sau giờ mở cửa.';
            newErrors.openHour = 'Giờ mở cửa phải trước giờ đóng cửa.';
        } else if (closeHour < sixHoursLater) {
            newErrors.closeHour = 'Giờ đóng cửa phải ít nhất 6 giờ sau giờ mở cửa.';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    return (
        <div className={styles.container}>
            <Row className={styles.headingBox}>
                <Col>
                    <h2 className={styles.heading}>Đăng kí SmileCare ngay cho phòng khám!</h2>
                    <p className={styles.subHeading}>Nhập thông tin cơ bản của phòng khám</p>
                </Col>
            </Row>
            <Form className={styles.formContent} noValidate>
                <FormGroup row>
                    <Label for="name" sm={3} className={styles.label}>Tên phòng khám:</Label>
                    <Col sm={9}>
                        <Input
                            type="text"
                            name="Name"
                            id="name"
                            className={styles.input}
                            value={localFormData.Name}
                            onChange={handleChange}
                            invalid={!!errors.name}
                        />
                        <FormFeedback>{errors.name}</FormFeedback>
                    </Col>
                </FormGroup>

                <FormGroup row>
                    <Label for="address" sm={3} className={styles.label}>Địa chỉ:</Label>
                    <Col sm={9}>
                        <Input
                            type="text"
                            name="Address"
                            id="address"
                            className={styles.input}
                            value={localFormData.Address}
                            onChange={handleChange}
                            invalid={!!errors.address}
                        />
                        <FormFeedback>{errors.address}</FormFeedback>
                    </Col>
                </FormGroup>

                <FormGroup row>
                    <Label for="phone" sm={3} className={styles.label}>Số điện thoại:</Label>
                    <Col sm={9}>
                        <Input
                            type="text"
                            name="Phone"
                            id="phone"
                            className={styles.input}
                            value={localFormData.Phone}
                            onChange={handleChange}
                            invalid={!!errors.phone}
                        />
                        <FormFeedback>{errors.phone}</FormFeedback>
                    </Col>
                </FormGroup>

                <FormGroup row>
                    <Label for="email" sm={3} className={styles.label}>Địa chỉ email:</Label>
                    <Col sm={9}>
                        <Input
                            type="email"
                            name="Email"
                            id="email"
                            className={styles.input}
                            value={localFormData.Email}
                            onChange={handleChange}
                            invalid={!!errors.email}
                        />
                        <FormFeedback>{errors.email}</FormFeedback>
                    </Col>
                </FormGroup>

                <FormGroup row className={styles.inputGrid}>
                    <Label for="open-hour" sm={3} className={styles.label}>Giờ mở cửa:</Label>
                    <Col sm={3}>
                        <Input
                            type="time"
                            name="OpenHour"
                            id="open-hour"
                            className={styles.input}
                            value={localFormData.OpenHour}
                            onChange={handleChange}
                            invalid={!!errors.openHour}
                        />
                        <FormFeedback>{errors.openHour}</FormFeedback>
                    </Col>
                    <Label for="close-hour" sm={3} className={styles.label}>Giờ đóng cửa:</Label>
                    <Col sm={3}>
                        <Input
                            type="time"
                            name="CloseHour"
                            id="close-hour"
                            className={styles.input}
                            value={localFormData.CloseHour}
                            onChange={handleChange}
                            invalid={!!errors.closeHour}
                        />
                        <FormFeedback>{errors.closeHour}</FormFeedback>
                    </Col>
                </FormGroup>

                <FormGroup row className={styles.buttonContainer}>
                    <Col sm={{ size: 9, offset: 3 }}>
                        <Button color="primary" className={styles.button} onClick={handleSubmit}>Gửi</Button>
                    </Col>
                </FormGroup>
            </Form>
        </div>
    );
};

export default BasicForm;

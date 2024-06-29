import React, { useState } from 'react';
import styles from './UserModal.module.css'; 

interface UserModalProps {
    isOpen: boolean;
    onClose: () => void;
    onRegister: (formData: any) => void;
}

const UserModal = ({ isOpen, onClose, onRegister }: UserModalProps) => {
    const initialFormData = {
        username: '',
        password: '',
        email: '',
        clinicOwner: false,
        clinic: null,
    };

    const [formData, setFormData] = useState(initialFormData);

    const handleChange = (e: { target: { name: any; value: any; type: any; checked: any; }; }) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log('Form submitted with:', formData);
        setFormData(initialFormData);
        onRegister(formData);
        onClose();
    };

    return (
        <div className={`${styles.modal} ${isOpen ? styles.open : ''}`}>
            <div className={styles.modalContent}>
                <div className={styles.headerBox}>
                    <h2>Thêm người dùng</h2>
                    <span className={styles.close} onClick={onClose}>&times;</span>
                </div>
                <form onSubmit={handleSubmit} className={styles.formGrid}>
                    <div className={styles.formRow}>
                        <label htmlFor="username">Tên tài khoản:</label>
                        <input type="text" id="username" name="username" value={formData.username} onChange={handleChange} />
                    </div>
                    <div className={styles.formRow}>
                        <label htmlFor="password">Mật khẩu:</label>
                        <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} />
                    </div>
                    <div className={styles.formRow}>
                        <label htmlFor="email">Email:</label>
                        <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} />
                    </div>
                    <div className={styles.formRow}>
                        <label htmlFor="clinicOwner">Chủ phòng khám ?</label>
                        <input type="checkbox" id="clinicOwner" name="clinicOwner" checked={formData.clinicOwner} onChange={handleChange} />
                    </div>
                    <button className={styles.addButton} type="submit">Thêm</button>
                </form>
            </div>
        </div>
    );
};

export default UserModal;

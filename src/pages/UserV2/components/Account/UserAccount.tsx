import styles from './UserAccount.module.css';
import { default_data, IUserAccount } from '../../../../utils/interfaces/User/UserDefinition';
import { Dispatch, SetStateAction, useLayoutEffect, useState } from 'react';
import SimpleButton from '../../../../components/User/Components/Buttons/SimpleButton';
import StatusBadge from '../../../../components/User/StatusBadge/StatusBadge';
import ImagePlaceholder from '../../../../assets/img_placeholder.jpg';
import ChangePassword from '../../../../components/User/Layouts/ChangePassword/ChangePassword';
import { getUserData, putUserData } from '../../../../utils/api/UserAccountUtils';



const UserAccount = () => {
    const [userData, setUserData]: [IUserAccount, Dispatch<SetStateAction<IUserAccount>>] = useState(default_data);
    const [disabled, setDisabled]: [boolean, Dispatch<SetStateAction<boolean>>] = useState(true);
    const [userDataToSend, setUserDataToSend]: [IUserAccount, Dispatch<SetStateAction<IUserAccount>>] = useState(default_data);

    const saveUserData = async () => {
        const userId = localStorage.getItem('id');
        const dataToSend = {
            ...default_data,
            ...userData,
            joinedDate: userData.joinedDate ? new Date(userData.joinedDate).toISOString() : "",
        };
        if (userId !== null) {
            dataToSend.id = parseInt(userId, 10); // Explicitly use base 10 for parsing
        } else {
            // Handle invalid or missing IDs gracefully
            console.warn("Invalid or missing user ID in localStorage.");

            // Option 1: Set a default or fallback value
            // dataToSend.id = 0; // Or some other sensible default

            // Option 2: Remove the 'id' property if it's problematic
            delete dataToSend.id;
        }
        try {
            await putUserData(dataToSend)
            setDisabled(true);
        } catch (error) {
            console.error('Error updating user data:', error);
        }
    };

    const updateUserData = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = event.currentTarget;
        if (type === 'radio') {
            setUserData(prevData => ({ ...prevData, [name]: value }));
        } else {
            setUserData(prevData => ({ ...prevData, [name]: value }));
        }
        console.log(userData);
    };

    const changePicture = () => {
        // [Vẫn đang tìm hiểu] 
    };

    const fetchUserData = async () => {
        try {
            const usersData = await getUserData();
            console.log(usersData);
            const normalizedData = {
                ...usersData,
                insurance: usersData.insurance || '',
            };
            setUserData(normalizedData);
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    useLayoutEffect(() => {
        console.log(userData);
        fetchUserData();
    }, []);

    return (
        <div className={styles.mainContentRightContainer}>
            <div className={styles.MainSection}>
                <h2 className={styles.MediumHeader}>Tài khoản</h2>
                <div className={styles.InfoBoard}>
                    <div className={styles.ProfileInfo}>
                        <div className={styles.ProfileImagePlaceholder}>
                            <span className={styles.ProfileImage}>
                                <img src={ImagePlaceholder} onClick={changePicture} alt="Profile" />
                            </span>
                            <span className={styles.ProfileGeneralInfo}>
                                <h2>{userData.fullname ?? "--"}</h2>
                                <p className={styles.PatientCode}>Mã bệnh nhân: {userData.id ?? "--"}</p>
                                <StatusBadge state_number={userData.status?.state_number ?? 0} message={userData.status?.message ?? "Không xác định"} />
                            </span>
                        </div>

                        <h3 className={styles.SectionHeader}>Thông tin chung</h3>
                        <table className={styles.InformationTable}>
                            <tbody>
                                <tr className={styles.TableRow}>
                                    <td className={`${styles.TableData} ${styles.FieldName}`}>Tên đăng nhập</td>
                                    <td className={`${styles.TableData} ${styles.FieldValue}`}>
                                        <input type='text' name='username' placeholder='vd: NguyenQuang6202' disabled={disabled} onChange={updateUserData} value={userData.username} />
                                    </td>
                                </tr>

                                <tr className={styles.TableRow}>
                                    <td className={`${styles.TableData} ${styles.FieldName}`}>Số điện thoại</td>
                                    <td className={`${styles.TableData} ${styles.FieldValue}`}>
                                        <input type='text' name='phone' placeholder='vd: 090xxxxxxx' disabled={disabled} onChange={updateUserData} value={userData.phone || ''} />
                                    </td>
                                </tr>
                                <tr className={styles.TableRow}>
                                    <td className={`${styles.TableData} ${styles.FieldName}`}>Email</td>
                                    <td className={`${styles.TableData} ${styles.FieldValue}`}>
                                        <input type='text' name="email" placeholder='vd: example@gmail.com' disabled={disabled} onChange={updateUserData} value={userData.email || ''} />
                                    </td>
                                </tr>

                                <tr className={styles.TableRow}>
                                    <td className={`${styles.TableData} ${styles.FieldName}`}>Mã bảo hiểm y tế</td>
                                    <td className={`${styles.TableData} ${styles.FieldValue}`}>
                                        <input type='text' name='insurance' placeholder='vd: AN10XXXXXXXX' disabled={disabled} onChange={updateUserData} value={userData.insurance || ''} />
                                    </td>
                                </tr>

                                <tr className={styles.TableRow}>
                                    <td className={`${styles.TableData} ${styles.FieldName}`}>Họ và tên</td>
                                    <td className={`${styles.TableData} ${styles.FieldValue}`}>
                                        <input type='text' name='fullname' placeholder='vd: Trần Văn A' disabled={disabled} onChange={updateUserData} value={userData.fullname || ''} />
                                    </td>
                                </tr>

                                <tr className={styles.TableRow}>
                                    <td className={`${styles.TableData} ${styles.FieldName}`}>Ngày sinh</td>
                                    <td className={`${styles.TableData} ${styles.FieldValue}`}>
                                        <input type='date' name='birthdate' placeholder={Date.now().toString()} disabled={disabled} onChange={updateUserData} value={userData.birthdate || ''} />
                                    </td>
                                </tr>

                                <tr className={styles.TableRow}>
                                    <td className={`${styles.TableData} ${styles.FieldName}`}>Giới tính</td>
                                    <td className={`${styles.TableData} ${styles.FieldValue}`}>
                                        <fieldset disabled={disabled}>
                                            <label><input type="radio" name='sex' value="Nam" onChange={updateUserData} checked={userData.sex === "Nam"} /> Nam</label>
                                            <label><input type="radio" name='sex' value="Nữ" onChange={updateUserData} checked={userData.sex === "Nữ"} /> Nữ</label>
                                            <label><input type="radio" name='sex' value="" onChange={updateUserData} checked={userData.sex === ""} /> Khác</label>
                                        </fieldset>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        {!disabled && <SimpleButton buttonType='button' message='Hoàn tất' callback={saveUserData} />}
                        {disabled && <SimpleButton buttonType='button' message='Cập nhật thông tin tài khoản' callback={() => { setDisabled(false) }} />}
                    </div>

                    <hr className={styles.Line} />
                    <ChangePassword username={userData.username} callbacks={() => { }} />
                </div>
            </div>
        </div>
    );
};

export default UserAccount;

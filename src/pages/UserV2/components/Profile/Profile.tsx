import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import styles from './Profile.module.css'
import SimpleButton from '../../../../components/User/Components/Buttons/SimpleButton';
import { default_data, IUserAccount, UserInfo } from '../../../../utils/interfaces/User/UserDefinition';
import { getUserData } from '../../../../utils/api/UserAccountUtils';


interface ProfileProps {
    setActiveIndex: Dispatch<SetStateAction<number | null>>;

}

const Profile = ({ setActiveIndex }: ProfileProps) => {

    const [data, setData]: [IUserAccount | null, Dispatch<SetStateAction<IUserAccount>>] = useState(default_data);

    type AvatarState = {
        file: File | null;
        url: string;
    };
    const [avatar, setAvatar] = useState<AvatarState>({
        file: null,
        url: ""
    });


    const handleAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setAvatar({
                file: e.target.files[0],
                url: URL.createObjectURL(e.target.files[0])
            });
        }
    };

    //-------------------Fetching data from database-------------------

    const fetchUserData = () => {
        try {
            getUserData().then((user: IUserAccount) => {
                setData(user);
            });
        } catch (error) {
            console.error('Failed to fetch user:', error);
        }
    }

    useEffect(() => {
        fetchUserData();
    }, []);

    return (
        <div className={styles.mainContentRightContainer}>
            <h1 className={styles.mainContentMiddleTitleHeading}>Hồ sơ</h1>
            <div className={styles.mainContentContainerBox}>
                <div className={styles.mainContentContainerBoxRowProfileGeneralAlignLeft}>
                    <label htmlFor="file" className={styles.userProfileImagePlaceholder}>
                        <img src="../../../../public/placeholder.png" alt="" style={{ width: '12em', height: '12em', borderRadius: '50%', objectFit: 'cover' }} />
                        <p style={{ textAlign: 'center', width: '100%', padding: '5px' }}> Upload an image</p>
                    </label>
                    <input type="file" id="file" style={{ display: "none" }} onChange={handleAvatar} />

                    <span className={styles.userProfileGeneralInfo}>
                        <h2 style={{ margin: '0', fontSize: '2em', fontWeight: 'bold', textAlign: 'left' }}>{data.username}</h2>
                        <p style={{ fontSize: '1em', textAlign: 'left' }}>Mã bệnh nhân: {data.id}</p>
                    </span>
                </div>


                <div className={styles.MainContentContainerBoxRow}>
                    <h2 style={{
                        width: '100%',
                        padding: '1em 0 0 0',
                        fontSize: '2em',
                        textAlign: 'left',
                    }}>Thông tin cơ bản</h2>
                    <table style={{ width: '100%', fontSize: '1.5rem', color: 'rgb(105, 105, 105)' }}>
                        <tbody>
                            <tr style={{ padding: '0.5em 1em', width: '50%' }}>
                                <td className={styles.tableFieldName}>Họ và tên</td>
                                <td className={styles.tableFieldValue}>{data.fullname ?? "--"}</td>
                            </tr>
                            <tr style={{ padding: '0.5em 1em', width: '50%' }}>
                                <td className={styles.tableFieldName}>Số điện thoại</td>
                                <td className={styles.tableFieldValue}>{data.phone ?? "--"}</td>
                            </tr>
                            <tr style={{ padding: '0.5em 1em', width: '50%' }}>
                                <td className={styles.tableFieldName}>Giới tính</td>
                                <td className={styles.tableFieldValue}>{data.sex ?? "--"}</td>
                            </tr>
                            <tr style={{ padding: '0.5em 1em', width: '50%' }}>
                                <td className={styles.tableFieldName}>Ngày sinh</td>
                                <td className={styles.tableFieldValue}>{data.birthdate ?? "--"}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className={styles.MainContentContainerBoxRow}>
                    <h2 style={{
                        width: '100%',
                        padding: '1em 0 0 0',
                        fontSize: '2em',
                        textAlign: 'left',
                    }}>Thông tin bổ sung</h2>
                    <table style={{ width: '100%', fontSize: '1.5rem', color: 'rgb(105, 105, 105)' }}>
                        <tbody>
                            <tr style={{ padding: '0.5em 1em', width: '50%' }}>
                                <td className={styles.tableFieldName} >Mã BHYT</td>
                                <td className={styles.tableFieldValue} >{data.insurance ?? "--"}</td>
                            </tr>
                            <tr style={{ padding: '0.5em 1em', width: '50%' }}>
                                <td className={styles.tableFieldName} >Email</td>
                                <td className={styles.tableFieldValue}>{data.email ?? "--"}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className={styles.MainContentContainerBoxRow}>
                    <SimpleButton buttonType='button' callback={() => setActiveIndex(3)} message='Chỉnh sửa thông tin cá nhân' />
                </div>
            </div>
        </div >
    )
}

export default Profile
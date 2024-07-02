import React, { useState } from 'react';
import {
  Container,
  Row,
  Col,
  Button,
  Label,
  Input,
  FormGroup,
  Card,
  CardBody,
  CardTitle,
} from 'reactstrap';
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import ImageUpload from "../ImageUpload";
import ServiceList from "../ServiceList";
import { useEffect } from 'react';
import { ClinicToDisplay } from '../../../../../utils/interfaces/ClinicRegister/Clinic';
import { getClinicGeneralInfo, updateClinicGeneralInfo } from '../../../../../utils/api/ClinicOwnerUtils';
import styles from './ClinicInfo.module.css';
import { fetchClinicImages } from '../../../../../utils/UploadFireBase';
import { getAllClinics } from '../../../../../utils/api/MiscUtils';

interface ClinicInfoProps {
  logoUpdated: boolean;
}

const ClinicInfo = ({ logoUpdated }: ClinicInfoProps) => {
  const [clinicInfo, setClinicInfo] = useState<ClinicToDisplay>({
    id: 0,
    name: '',
    description: '',
    address: '',
    phone: '',
    email: '',
    openHour: '',
    working: '',
    closeHour: '',
    status: '',
    ownerId: 0,
  });

  const [textAreaContent, setTextAreaContent] = useState('');
  const [isDesDialogOpen, setIsDesDialogOpen] = useState(false);
  const [editorData, setEditorData] = useState('');
  // const [imageSrc, setImageSrc] = useState('');
  const [logo, setLogo] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [carouselImages, setCarouselImages] = useState([]);

  const ownerId = localStorage.getItem('id');

  useEffect(() => {

    const fetchClinicInfo = async () => {
      try {
        const { content } = await getAllClinics('', 100, 1);

        const ownerClinic = content.find(clinic => clinic.ownerId.toString() === ownerId);

        if (ownerClinic) {
          const clinicId: number = ownerClinic.id;
          localStorage.setItem('clinicId', clinicId.toString());
          const data = await getClinicGeneralInfo(clinicId);
          if (data) {
            setClinicInfo(data);
            setTextAreaContent(data.description);
            setEditorData(data.description);
          }
        } else {
          console.error('No clinic found for this owner.');
        }

      } catch (error) {
        console.error(error);
      }
    };

    fetchClinicInfo();
  }, []);

  useEffect(() => {
    const clinicId = localStorage.getItem('clinicId');
    const fetchImages = async (folderName: string) => {
      const folderPath = `clinics/${clinicId}/${folderName}/`;
      console.log(folderPath);
      try {
        const imageUrls = await fetchClinicImages(folderPath);
        if (folderName === 'carousel') {
          setImages(imageUrls);
        } else if (folderName === 'logo') {

          setLogo(imageUrls[0]);
        }
      } catch (error) {
        console.error(`Error fetching images from ${folderName}:`, error);
      }
    };

    fetchImages('carousel');
    fetchImages('logo');
  }, [logoUpdated]);


  const handleInputDoubleClick = () => {
    setIsDesDialogOpen(true);
  };

  const handleEditorChange = (event: any, editor: { getData: () => any }) => {
    const data = editor.getData();
    setEditorData(data);
  };

  const handleTextAreaChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
    setTextAreaContent(e.target.value);
  };

  const handleDesSave = () => {
    setIsDesDialogOpen(false);
    setTextAreaContent(editorData);
    setClinicInfo({
      ...clinicInfo,
      description: editorData,
    })
  };

  const handleInputChange = (e: { target: { name: string; value: string; }; }) => {
    setClinicInfo({
      ...clinicInfo,
      [e.target.name]: e.target.value,
    })
  }

  function formatTime(time: string): string {
    const [hours, minutes] = time.split(':');

    return `${hours}:${minutes}`;
  }

  const [isEditable, setIsEditable] = useState(false);

  const handleEditClick = async () => {
    if (isEditable) {
      await handleConfirmClick();
    }
    setIsEditable(!isEditable);
  };

  const handleConfirmClick = async () => {
    try {
      await updateClinicGeneralInfo(clinicInfo);
    } catch {
      console.error('Error updating service');
    }
  };


  return (
    <div className={styles.mainContainer}>
      <div className={styles.main}>
        <h1 className={styles.title}>Thông tin phòng khám</h1>
        <div className={styles.headerContainer}>
          <div className={styles.imgBox}>
            <label htmlFor="file-input">
              <img src={logo} />
            </label>
          </div>
        </div>
        <div className={styles.content}>
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label htmlFor="clinicName">Tên phòng khám</Label>
                <Input type="text" id="clinicName" name="name" value={clinicInfo.name} disabled={!isEditable} onChange={handleInputChange} />
              </FormGroup>
              <FormGroup>
                <Label htmlFor="clinicAddress">Địa chỉ</Label>
                <Input type="text" id="clinicAddress" name="address" value={clinicInfo.address} disabled={!isEditable} onChange={handleInputChange} />
              </FormGroup>
              <FormGroup>
                <Label htmlFor="clinicPhone">Số điện thoại</Label>
                <Input type="text" id="clinicPhone" name="phone" value={clinicInfo.phone} disabled={!isEditable} onChange={handleInputChange} />
              </FormGroup>
              <FormGroup>
                <Label htmlFor="clinicEmail">Email</Label>
                <Input type="text" id="clinicEmail" name="email" value={clinicInfo.email} disabled={!isEditable} onChange={handleInputChange} />
              </FormGroup>
              <Row>
                <Col md={6}>
                  <FormGroup>
                    <Label htmlFor="openHour">Giờ mở cửa</Label>
                    <Input type="text" id="openHour" name="open_hour" value={formatTime(clinicInfo.openHour)} disabled={!isEditable} onChange={handleInputChange} />
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label htmlFor="closeHour">Giờ đóng cửa</Label>
                    <Input type="text" id="closeHour" name="close_hour" value={formatTime(clinicInfo.closeHour)} disabled={!isEditable} onChange={handleInputChange} />
                  </FormGroup>
                </Col>
              </Row>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label>Mô tả</Label>
                <Input
                  type="textarea"
                  value={textAreaContent}
                  onChange={handleTextAreaChange}
                  onDoubleClick={handleInputDoubleClick}
                  disabled={!isEditable}
                />
                <Dialog
                  open={isDesDialogOpen}
                  onClose={() => setIsDesDialogOpen(false)}
                  maxWidth="md"
                  fullWidth
                >
                  <DialogTitle>Sửa mô tả</DialogTitle>
                  <DialogContent>
                    <CKEditor
                      editor={ClassicEditor}
                      data={editorData}
                      onChange={handleEditorChange}
                    />
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={() => setIsDesDialogOpen(false)} color="secondary">
                      Hủy
                    </Button>
                    <Button onClick={handleDesSave} color="primary">
                      Lưu
                    </Button>
                  </DialogActions>
                </Dialog>
              </FormGroup>
              <div className={styles.buttonContainer}>
                <Button color="primary" className={styles.editButton} variant="contained" onClick={handleEditClick}>
                  {isEditable ? 'Lưu' : 'Chỉnh sửa'}
                </Button>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
};

export default ClinicInfo;

// <div className={styles.galleryContainer}>
//           <div className={styles.imageUploadContainer}>
//             <div className={styles.uploadTitle}>Đăng tải ảnh</div>
//             <ImageUpload />
//           </div>
//           <div className={styles.gallery}>
//             <div>Hình ảnh trong carousel</div>
//             <div className={styles.imgContainer}>
//               {images.map((imgSrc, index) => (
//                 <div key={index} className={styles.imageWrapper}>
//                   <img src={imgSrc} alt={`Uploaded ${index}`} className={styles.uploadedImg} />
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
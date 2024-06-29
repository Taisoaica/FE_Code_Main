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
import { getClinicGeneralInfo } from '../../../../../utils/api/ClinicOwnerUtils';
import styles from './ClinicInfo.module.css';
import { fetchClinicImages } from '../../../../../utils/UploadFireBase';

const ClinicInfo = () => {
  const [clinicInfo, setClinicInfo] = useState<ClinicToDisplay>({
    id: 0,
    name: '',
    description: '',
    address: '',
    phone: '',
    email: '',
    openHour: '',
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

  useEffect(() => {
    const clinicId = '1';
    const fetchClinicInfo = async () => {
      try {
        const data = await getClinicGeneralInfo(clinicId);
        if (data) {
          setClinicInfo(data);
          setTextAreaContent(data.description);
          setEditorData(data.description);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchClinicInfo();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    // if (!clinicId) return; 

    const fetchImages = async (folderName: string) => {
      const folderPath = `clinics/1/${folderName}/`;
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
  }, []);


  const handleInputDoubleClick = () => {
    setIsDesDialogOpen(true);
  };

  const handleEditorChange = (event: any, editor: { getData: () => any }) => {
    const data = editor.getData();
    console.log(data);
    setEditorData(data);
  };

  const handleTextAreaChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
    setTextAreaContent(e.target.value);
  };

  const handleDesSave = () => {
    setIsDesDialogOpen(false);
    setTextAreaContent(editorData);
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
            <input
              style={{ cursor: 'pointer' }}
              id="file-input"
              type="file"
              accept="image/png, image/gif, image/jpeg"
              hidden
            />
          </div>
        </div>
        <div className={styles.content}>
          <Row>
            <Col>
              <FormGroup>
                <Label htmlFor="clinicName">Tên phòng khám</Label>
                <Input type="text" id="clinicName" name="name" value={clinicInfo.name} />
              </FormGroup>
              <FormGroup>
                <Label htmlFor="clinicAddress">Địa chỉ</Label>
                <Input type="text" id="clinicAddress" name="address" value={clinicInfo.address} />
              </FormGroup>
              <FormGroup>
                <Label htmlFor="clinicPhone">Số điện thoại</Label>
                <Input type="text" id="clinicPhone" name="phone" value={clinicInfo.phone} />
              </FormGroup>
              <FormGroup>
                <Label htmlFor="clinicEmail">Email</Label>
                <Input type="text" id="clinicEmail" name="email" value={clinicInfo.email} />
              </FormGroup>
              <Row>
                <Col md={6}>
                  <FormGroup>
                    <Label htmlFor="openHour">Giờ mở cửa</Label>
                    <Input type="text" id="openHour" name="open_hour" value={clinicInfo.openHour} />
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label htmlFor="closeHour">Giờ đóng cửa</Label>
                    <Input type="text" id="closeHour" name="close_hour" value={clinicInfo.closeHour} />
                  </FormGroup>
                </Col>
              </Row>
              <FormGroup>
                <Label>Mô tả</Label>
                <Input
                  type="textarea"
                  value={textAreaContent}
                  onChange={handleTextAreaChange}
                  onDoubleClick={handleInputDoubleClick}
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
                      config={{
                      }}
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
            </Col>
          </Row>
        </div>
        <div className={styles.buttonContainer}>
          <Button color="primary" className={styles.editButton} variant="contained">
            Chỉnh sửa
          </Button>
        </div>
        <div className={styles.galleryContainer}>
          <div className={styles.imageUploadContainer}>
            <div className={styles.uploadTitle}>Đăng tải ảnh</div>
            <ImageUpload />
          </div>
          <div className={styles.gallery}>
            <div>Hình ảnh trong carousel</div>
            <div className={styles.imgContainer}>
              {images.map((imgSrc, index) => (
                <div key={index} className={styles.imageWrapper}>
                  <img src={imgSrc} alt={`Uploaded ${index}`} className={styles.uploadedImg} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClinicInfo;

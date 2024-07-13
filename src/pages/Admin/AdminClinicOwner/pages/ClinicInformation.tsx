import * as React from "react";
import { styled } from "@mui/material/styles";
import MuiDrawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import {
  Button,
  FormControl,
  CircularProgress,
  Grid,
  Paper,
  FormGroup,
  TextField,
  Divider
} from '@mui/material';
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { fetchClinicImages, uploadClinicImages } from "../../../../utils/UploadFireBase";
import { useEffect, useState } from "react";
import ClinicInfo from "../components/ClinicInfo/ClinicInfo";
import { NestedListItems } from "../components/NestedListMenu";
import CustomFileInput from "../components/CustomFileInput";
import { CloudUpload as CloudUploadIcon } from '@mui/icons-material';
import styles from './ClinicInformation.module.css';
import { MdClose } from "react-icons/md";
import { getStorage, ref } from "firebase/storage";
import { deleteFile } from "../../../../utils/UploadFireBase";
import { Carousel } from "reactstrap";
import ConfirmationDialog from "../../../../components/ConfirmationDialog/ConfirmationDialog";
import { fetchDentistInfo } from "../../../../utils/api/ClinicOwnerUtils";


const drawerWidth: number = 270;

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
    ...(!open && {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9),
      },
    }),
  },
}));

export default function ClinicInformation() {
  const [open, setOpen] = React.useState(true);
  const toggleDrawer = () => {
    setOpen(!open);
  };

  const [logo, setLogo] = useState<string>('');
  const [logoUpdated, setLogoUpdated] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [logoFiles, setLogoFiles] = useState<{ file: File }[]>([]);
  const [carouselFiles, setCarouselFiles] = useState<{ file: File }[]>([]);
  const [uploading, setUploading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [clinicId, setClinicId] = useState<string>();

  const fetchImages = async (folderName: string) => {
    const id = await fetchDentistInfo();
    const clinicId = id.content.clinicId;
    setClinicId(id.content.clinicId);
    const folderPath = `clinics/${clinicId}/${folderName}/`;
    try {
      const imageUrls = await fetchClinicImages(folderPath);
      if (folderName === 'carousel') {
        setImages(imageUrls);
      } else if (folderName === 'logo') {
        setLogo(imageUrls[0] || '');
      }
    } catch (error) {
      console.error(`Error fetching images from ${folderName}:`, error);
    } finally {
      setLoading(false);
    }
  };



  useEffect(() => {

    fetchImages('carousel');
    fetchImages('logo');
  }, []);

  console.log(clinicId)

  const handleLogoChange = (files: File[]) => {
    const updatedFiles = files.map((file) => ({ file }));
    setLogoFiles(updatedFiles);
  };


  const handleCarouselChange = (files: File[]) => {
    const updatedFiles = files.map((file) => ({ file }));
    setCarouselFiles(updatedFiles);
  };

  const handleLogoUpload = async () => {
    if (logoFiles.length === 0) return;

    setUploading(true);
    try {
      for (const { file } of logoFiles) {
        const downloadURL = await uploadClinicImages(file, 'logo', clinicId);
        setLogo(downloadURL);
        setLogoFiles([]);
      }
      alert('Logo uploaded successfully!');
      setLogoUpdated(!logoUpdated);
    } catch (error) {
      console.error('Failed to upload logo:', error);
    } finally {
      setUploading(false);
      await fetchClinicImages('logo');
    }
  };

  const handleCarouselUpload = async () => {
    if (carouselFiles.length === 0) return;

    setUploading(true);
    try {
      for (const { file } of carouselFiles) {
        const downloadURL = await uploadClinicImages(file, 'carousel', clinicId);
        setImages((prevImages) => [...prevImages, downloadURL]);
        setCarouselFiles([]);
      }
      alert('Carousel images uploaded successfully!');
      setCarouselFiles([]);
    } catch (error) {
      alert(error);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteFile = (index: number, fileType: 'logo' | 'carousel') => {
    if (fileType === 'logo') {
      setLogoFiles([]);
    } else {
      setCarouselFiles(prevFiles => {
        const newFiles = [...prevFiles];
        newFiles.splice(index, 1);
        return newFiles;
      });
    }
  };

  const handleOpenDialog = (index: number) => {
    setSelectedImageIndex(index);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedImageIndex(null);
  };

  const handleConfirmDelete = async () => {
    if (selectedImageIndex === null) return;

    const imageUrl = images[selectedImageIndex];
    const fileName = decodeURIComponent(imageUrl.split('/').pop()?.split('?')[0] || '');

    if (!fileName) {
      alert('Failed to extract file name from image URL.');
      return;
    }

    const fileRef = ref(getStorage(), imageUrl);

    try {
      await deleteFile(fileRef);
      setImages(images.filter((_, i) => i !== selectedImageIndex));
      alert('File deleted successfully.');
    } catch (error) {
      alert(error);
    } finally {
      handleCloseDialog();
    }
  };

  return (
    <Box sx={{ display: "flex", height: '100%' }}>
      <AppBar position="absolute" open={open}>
        <Toolbar
          sx={{
            pr: "24px",
          }}
        >
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={toggleDrawer}
            sx={{
              marginRight: "36px",
              ...(open && { display: "none" }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            component="h1"
            variant="h6"
            color="inherit"
            noWrap
            sx={{ flexGrow: 1 }}
          >
            Trang thông tin phòng khám
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <Toolbar
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            px: [1],
          }}
        >
          <IconButton onClick={toggleDrawer}>
            <ChevronLeftIcon />
          </IconButton>
        </Toolbar>
        <Divider />
        <NestedListItems />
      </Drawer>
      <Box
        component="main"
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === "light"
              ? theme.palette.grey[100]
              : theme.palette.grey[900],
          flexGrow: 1,
          marginTop: 5.5,
          height: '100%',
          color: '#0d47a1',
          background: 'linear-gradient(to left, #e3f2fd, #f8fbff)'
        }}
      >
        <Box sx={{ p: 3 }}>
          <ClinicInfo logoUpdated={logoUpdated} />
          <Box className={styles.mainContainer}>
            <Box className={styles.main}>
              <h1 className={styles.title}>Quản lí hình ảnh</h1>
              <Box className={styles.content}>
                <Paper className={styles.uploadContainer}>
                  <div className={styles.uploadTitle}>Đăng tải logo mới</div>
                  <FormControl fullWidth className={styles.form}>
                    <div className={styles.img}>
                      {logo ? <img src={logo} alt="Logo" /> : <span>Chọn logo</span>}
                    </div>
                    <CustomFileInput
                      id="logo"
                      onFileChange={handleLogoChange}
                      uploading={uploading}
                      handleDeleteFile={(index) => handleDeleteFile(index, 'logo')}
                      uploadedFiles={logoFiles}
                      progress={progress}
                      multiple={false}
                    />
                    <Button
                      onClick={handleLogoUpload}
                      variant="contained"
                      color="primary"
                      className={styles.uploadButton}
                    >
                      Đăng tải logo mới
                    </Button>

                  </FormControl>
                </Paper>
                <Paper className={styles.uploadContainer}>
                  <div className={styles.uploadTitle}>Đăng tải ảnh cho carousel</div>
                  <FormControl fullWidth className={styles.form}>
                    <div className={styles.imageGallery}>
                      {images.length > 0 ? (
                        images.map((image, index) => (
                          <div key={index} className={styles.imageItem}>
                            <img key={index} src={image} alt={`Carousel Image ${index}`} />
                            <div
                              className={styles.deleteIcon}
                              onClick={() => handleOpenDialog(index)}
                            >
                              <MdClose />
                            </div>
                          </div>
                        ))
                      ) : (
                        <span>Chưa có ảnh nào trong carousel</span>
                      )}
                    </div>
                    <ConfirmationDialog
                      open={dialogOpen}
                      onClose={handleCloseDialog}
                      onConfirm={handleConfirmDelete}
                      title="Xác nhận xóa"
                      message="Bạn có chắc muốn xóa hình này?"
                      confirmText="Xóa"
                      cancelText="Hủy"
                    />
                    <CustomFileInput
                      id="carousel"
                      onFileChange={handleCarouselChange}
                      uploading={uploading}
                      handleDeleteFile={(index) => handleDeleteFile(index, 'carousel')}
                      uploadedFiles={carouselFiles}
                      progress={progress}
                      multiple={true}
                    />
                    <Button
                      onClick={handleCarouselUpload}
                      variant="contained"
                      color="primary"
                      className={styles.uploadButton}
                    >
                      Đăng tải hình ảnh mới
                    </Button>
                  </FormControl>
                </Paper>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

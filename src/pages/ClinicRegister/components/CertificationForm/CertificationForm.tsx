import React, { useEffect, useState } from 'react';
import { Box, Typography, Stack, CircularProgress, Alert, Button, Link, Dialog, DialogContentText, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { MdClose, MdCloudUpload } from "react-icons/md";
import styles from './CertificationForm.module.css';
import { storage } from '../../../../../firebase';
import { v4 } from 'uuid';
import { getDownloadURL, listAll, ref, uploadBytes, UploadResult } from 'firebase/storage';

import { uploadClinicImages } from '../../../../utils/UploadFireBase'


const CertificationForm = () => {

    //----------------------------------State variables----------------------------------
    const [uploadedFiles, setUploadedFiles] = useState<{ file: File; imageUrl: string }[]>([]);
    const [uploadSuccess, setUploadSuccess] = useState(false); // State to track upload success
    const [uploadError, setUploadError] = useState(false); // State to track upload error
    const [dragging, setDragging] = useState(false); // State to track drag over zone
    const [progress, setProgress] = useState(0); //For circular progress bar
    const [uploading, setUploading] = useState(false); // State to track upload progress
    const [openDialog, setOpenDialog] = useState(false); // State to control the visibility of the dialog
    const [dialogMessage, setDialogMessage] = useState(""); // State to store the dialog message
    const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);
    //----------------------------------State variables----------------------------------


    //----------------------------------Action handlers----------------------------------
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const filesArray = Array.from(event.target.files);
            const newFiles = filesArray
                .filter(file => !uploadedFiles.some(uploadedFile => uploadedFile.file.name === file.name))
                .map(file => ({
                    file: file,
                    imageUrl: URL.createObjectURL(file) 
                }));

            setUploadedFiles(prevFiles => [...prevFiles, ...newFiles]);
            setUploadSuccess(false);
            setUploadError(false);
        }
    };

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setDragging(true);
    };

    const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setDragging(false);
    };

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setDragging(false);

        const files = event.dataTransfer.files;
        const newFiles = Array.from(files);

        if (newFiles.length > 0) {
            const uploadPromises = newFiles.map(async (file) => {
                const imageUrl = URL.createObjectURL(file);
                return { file, imageUrl };
            });

            Promise.all(uploadPromises)
                .then((fileObjects) => {
                    setUploadedFiles((prevFiles) => [...prevFiles, ...fileObjects]);
                    setUploadSuccess(false);
                    setUploadError(false);
                })
                .catch((error) => {
                    console.error('Error uploading files:', error);
                    setUploadError(true);
                });
        }
    };


    const handleDeleteFile = (index: number) => {
        const updatedFiles = [...uploadedFiles];
        updatedFiles.splice(index, 1);
        setUploadedFiles(updatedFiles);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };
    //----------------------------------Action handlers----------------------------------

    // Upload files to Firebase Storage
    //--------------------------------------------------------------------
    const handleUpload = async () => {
        if (uploadedFiles.length === 0) return;

        setUploading(true);

        const uploadInterval = setInterval(() => {
            setProgress(prevProgress => (prevProgress >= 100 ? 100 : prevProgress + 10));
        }, 500);
        setTimeout(() => {
            clearInterval(uploadInterval);
            setUploading(false);
        }, 5000);


        setUploadError(false);
        setUploadSuccess(false);

        try {
            const uploadPromises = uploadedFiles.map(async ({ file }) => {
                const imageUrl = await uploadClinicImages(file, 'carousel');
                return imageUrl;
            });

            const urls = await Promise.all(uploadPromises);

            setUploadedUrls(urls);

            setUploadedFiles([]);
            setDialogMessage("Đăng ảnh thành công");
            setUploadSuccess(true);
        } catch (error) {
            setDialogMessage("Đăng ảnh thất bại");
            setUploadError(true);
            console.error("Error uploading files", error);
        } finally {
            setUploading(false);
            setOpenDialog(true);
        }
    };
    //--------------------------------------------------------------------

    // Reset uploaded files when upload is successful
    useEffect(() => {
        if (uploadSuccess) {
            setUploadedFiles([]);
        }
    }, [uploadSuccess]);

    return (
        <Box>
            <Box className={styles.headingBox}>
                <Box className={styles.heading}>Để chúng tôi đại diện bạn</Box>
                <Box className={styles.subHeading}>Một số hình ảnh cho phòng khám của bạn</Box>
            </Box>
            <Box className={styles.container}>
                <Box
                    className={`${styles.upload} ${dragging ? styles.dragging : ''}`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => { document.getElementById('file-input')?.click() }}
                >
                    <Stack direction="column" alignItems="center" spacing={2}>
                        {uploadedFiles.length === 0 ? (
                            <Typography variant="body1" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                <MdCloudUpload style={{ fontSize: 48, marginBottom: 8, color: '#1976d3' }} />
                                <Box sx={{ fontSize: '18px', fontWeight: 400 }}>Kéo thả hay
                                    <a
                                        href="#"
                                        onClick={(event) => event.preventDefault()}
                                        style={{ color: '#1976d3', textDecoration: 'underline', cursor: 'pointer', paddingLeft: '3px', paddingRight: '3px' }}
                                    >
                                        chọn
                                    </a>
                                    file
                                </Box>
                            </Typography>
                        ) : (
                            <Button onClick={(event) => {
                                event.stopPropagation();
                                handleUpload();
                            }} variant="contained" color="primary" disabled={uploading}>
                                {uploading ? 'Đang tải...' : 'Đăng ảnh'}
                            </Button>
                        )}
                        <input
                            id="file-input"
                            type="file"
                            accept="image/png, image/gif, image/jpeg"
                            multiple
                            hidden
                            disabled={uploading}
                            onChange={handleFileChange}
                        />
                    </Stack>
                </Box>
                <Box>
                    {uploadedFiles.map((file, index) => (
                        <Box key={index} className={styles.uploadedFile}>
                            <Typography variant="body1" component="span">
                                {file.file.name}
                            </Typography>
                            <Box className={styles.uploadProgress}>
                                {uploading && <CircularProgress variant="determinate" value={progress} />}
                                <Button
                                    className={styles.delBtn}
                                    onClick={() => handleDeleteFile(index)}
                                >
                                    <MdClose />
                                </Button>
                            </Box>
                        </Box>
                    ))}
                </Box>
                <Dialog open={openDialog} onClose={handleCloseDialog}>
                    <DialogTitle>{"Thông báo"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            {dialogMessage}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDialog} color="primary">
                            Đóng
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </Box>
    );
};

export default CertificationForm;

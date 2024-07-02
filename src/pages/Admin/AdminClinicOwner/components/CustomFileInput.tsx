import React, { useId, useState } from 'react';
import { MdCloudUpload, MdClose } from 'react-icons/md';
import styles from './CustomFileInput.module.css';
import { Box, Button, Typography, CircularProgress } from '@mui/material';

interface CustomFileInputProps {
    onFileChange: (file: File[]) => void;
    id: string;
    uploading: boolean;
    handleDeleteFile: (index: number) => void;
    uploadedFiles: { file: File }[];
    progress: number;
    multiple?: boolean;
}

const CustomFileInput: React.FC<CustomFileInputProps> = ({
    onFileChange,
    id,
    uploading,
    handleDeleteFile,
    uploadedFiles,
    progress,
    multiple
}) => {
    const [fileNames, setFileNames] = useState<string[]>([]);

    const addFilesToArray = (filesArray: File[]) => {
        if (multiple) {
            filesArray.forEach(file => {
                if (!uploadedFiles.some(f => f.file.name === file.name)) {
                    uploadedFiles.push({ file });
                }
            });
        } else {
            if (uploadedFiles.length === 0) {
                uploadedFiles.push({ file: filesArray[0] });
            } else {
                uploadedFiles[0] = { file: filesArray[0] };
            }
        }
        setFileNames(uploadedFiles.map(fileObj => fileObj.file.name));
        onFileChange(uploadedFiles.map(fileObj => fileObj.file));
    };


    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const filesArray = Array.from(event.target.files);
            setFileNames(filesArray.map(file => file.name));
            addFilesToArray(filesArray);
        }
    };

    const handleChooseFileClick = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        event.preventDefault();
        const fileInput = document.getElementById(`fileInput-${id}`) as HTMLInputElement;
        fileInput.click();
    };

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
    };

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        if (event.dataTransfer.files && event.dataTransfer.files[0]) {
            const filesArray = Array.from(event.dataTransfer.files);
            setFileNames(filesArray.map(file => file.name));
            onFileChange(filesArray);
            if (multiple) {
                filesArray.forEach(file => uploadedFiles.push({ file }));
            } else {
                if (uploadedFiles.length === 0) {
                    uploadedFiles.push({ file: event.dataTransfer.files[0] });
                } else {
                    uploadedFiles[0] = { file: event.dataTransfer.files[0] };
                }
            }
        }
    };

    const handleFileDelete = (index: number) => {
        handleDeleteFile(index);
        setFileNames(uploadedFiles.map(fileObj => fileObj.file.name));
    };

    return (
        <Box>
            <div className={styles.imgBox}>
                <Box
                    className={styles.fileInputContainer}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                >
                    <input
                        type="file"
                        id={`fileInput-${id}`}
                        accept="image/*"
                        multiple={multiple}
                        onChange={handleFileChange}
                        className={styles.hiddenFileInput}
                    />
                    <MdCloudUpload style={{ fontSize: 48, marginBottom: 8, color: '#1976d3' }} />
                    <Box sx={{ fontSize: '18px', fontWeight: 400 }}>
                        Kéo thả hay
                        <a
                            href="#"
                            onClick={handleChooseFileClick}
                            style={{
                                color: '#1976d3',
                                textDecoration: 'underline',
                                cursor: 'pointer',
                                paddingLeft: '3px',
                                paddingRight: '3px'
                            }}
                        >
                            chọn
                        </a>
                        file
                    </Box>
                </Box>

            </div>
            <Box mt={2}>
                {uploadedFiles.map((file, index) => (
                    <Box key={index} className={styles.uploadedFile}>
                        <Typography variant="body1" component="span">
                            {file.file.name}
                        </Typography>
                        <Box className={styles.uploadProgress}>
                            <Button
                                className={styles.delBtn}
                                onClick={() => handleFileDelete(index)}
                            >
                                {uploading ? <CircularProgress variant="determinate" value={progress} /> : <MdClose />}
                            </Button>
                        </Box>
                    </Box>
                ))}
            </Box>
        </Box>
    );
};

export default CustomFileInput;

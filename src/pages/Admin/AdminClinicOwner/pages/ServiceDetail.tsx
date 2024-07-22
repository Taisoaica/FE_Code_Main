import * as React from "react";
import { ThemeProvider, createTheme, styled } from "@mui/material/styles";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./ServiceDetail.module.css";
import { Row, Col, FormGroup, Label, Input, Button } from 'reactstrap';

import { useEffect, useState } from "react";
import { NestedListItems } from "../components/NestedListMenu";
import Box from "@mui/material/Box";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';

import { getClinicServiceById, updateClinicService } from "../../../../utils/api/ClinicOwnerUtils";
import { ClinicServiceInfoModel } from "../../../../utils/api/BookingRegister";

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

const defaultTheme = createTheme();

const ServiceDetail = () => {
    const [open, setOpen] = React.useState(true);
    const location = useLocation();
    const serviceId: string = location.pathname.split("/").pop() || "";
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>('');
    const [textAreaContent, setTextAreaContent] = useState<string>('');
    const [isDesDialogOpen, setIsDesDialogOpen] = useState(false);
    const [editorData, setEditorData] = useState<string>('');
    const [isEditable, setIsEditable] = useState(false);


    const [serviceInfo, setServiceInfo] = useState<ClinicServiceInfoModel>({
        clinicId: 0,
        clinicServiceId: "",
        name: "",
        description: "",
        price: 0,
        categoryId: 0,
        available: false,
        removed: false
    });

    const navigate = useNavigate();

    const fetchServiceInfo = async () => {
        setLoading(true);
        try {
            const sanitizedId = serviceId.replace(/%7D/g, '');
            const data = await getClinicServiceById(sanitizedId);
            console.log(data);
            if (typeof data === "string") {
                setError(data);
            } else {
                setServiceInfo(data);
                setTextAreaContent(data.description);
                setEditorData(data.description);
            }
        } catch (error) {
            setError(error as string);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchServiceInfo();
    }, []);

    const toggleDrawer = () => {
        setOpen(!open);
    };

    const handleBackClick = () => {
        navigate(-1);
    };

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
        setServiceInfo({
            ...serviceInfo,
            description: editorData
        })
    };

    const handleInputChange = (e: { target: { name: any; value: any; }; }) => {
        setServiceInfo({
            ...serviceInfo,
            [e.target.name]: e.target.value
        });
    }

    const handleEditClick = async () => {
        if (isEditable) {
            await handleConfirmClick();
        }
        setIsEditable(!isEditable);
    };

    const handleConfirmClick = async () => {
        try {
            await updateClinicService(serviceInfo);
        } catch {
            console.error('Error updating service');
        }
    };

    return (
        <ThemeProvider theme={defaultTheme}>
            <Box sx={{ display: "flex" }}>
                <AppBar position="absolute" open={open}>
                    <Toolbar
                        sx={{
                            pr: "24px", // keep right padding when drawer closed
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
                            Trang chi tiết phòng khám
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
                    pt={10}
                    sx={{
                        backgroundColor: (theme) =>
                            theme.palette.mode === "light"
                                ? theme.palette.grey[100]
                                : theme.palette.grey[900],
                        flexGrow: 1,
                        height: "100vh",
                        overflow: "auto",
                    }}
                >
                    <Box className={styles.mainContainer}>
                        <div className={styles.content}>
                            <Row>
                                <Col md={6}>
                                    <FormGroup>
                                        <Label htmlFor="serviceName">Tên dịch vụ</Label>
                                        <Input type="text"
                                            id="serviceName"
                                            name="name"
                                            onChange={handleInputChange}
                                            value={serviceInfo?.name}
                                            disabled={!isEditable} />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label htmlFor="servicePrice">Giá</Label>
                                        <Input type="text"
                                            id="servicePrice"
                                            name="price"
                                            onChange={handleInputChange}
                                            value={serviceInfo?.price} disabled={!isEditable} />
                                    </FormGroup>
                                    {/* <FormGroup>
                                        <Label>Mô tả</Label>
                                        <Input
                                            type="textarea"
                                            id="serviceDescription"
                                            name="description"
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
                                    </FormGroup> */}
                                </Col>
                                <Col md={6}>
                                    {/* <FormGroup>
                                        <Label htmlFor="categoryId">ID Danh mục</Label>
                                        <Input type="text" id="categoryId" name="categoryId" value={serviceInfo?.categoryId} disabled />
                                    </FormGroup> */}
                                    {/* <FormGroup>
                                        <Label htmlFor="serviceAvailable">Trạng thái</Label>
                                        <Input
                                            type="text"
                                            id="serviceAvailable"
                                            name="available"
                                            value={serviceInfo?.available ? 'Còn hàng' : 'Hết hàng'}
                                            disabled={!isEditable}
                                        />
                                    </FormGroup> */}
                                    {/* <FormGroup>
                                        <Label htmlFor="serviceRemoved">Đã bị xóa</Label>
                                        <Input
                                            type="text"
                                            id="serviceRemoved"
                                            name="removed"
                                            value={serviceInfo?.removed ? 'Đã xóa' : 'Còn hoạt động'}
                                            disabled={!isEditable}
                                        />
                                    </FormGroup> */}
                                </Col>
                            </Row>
                            <div className={styles.buttonContainer}>
                                <Button color="secondary" className={styles.backButton} onClick={handleBackClick}>Trở về</Button>
                                <Button color="primary" className={styles.editButton} onClick={handleEditClick}>
                                    {isEditable ? 'Lưu' : 'Chỉnh sửa'}
                                </Button>
                            </div>
                        </div>
                    </Box>
                </Box>
            </Box>
        </ThemeProvider>
    )
}

export default ServiceDetail
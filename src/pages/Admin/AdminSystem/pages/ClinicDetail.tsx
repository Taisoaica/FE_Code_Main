import * as React from "react";
import { ThemeProvider, createTheme, styled } from "@mui/material/styles";
import MuiDrawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { Button, Col, FormGroup, Input, Label, Row } from 'reactstrap';
import { mainListItems } from "../components/listItems";
import styles from "./ClinicDetail.module.css";
import { useLocation, useNavigate } from "react-router-dom";

import { ClinicInfoModel } from "../../../../utils/api/SystemAdminUtils";
import { getClinicInformation } from "../../../../utils/api/MiscUtils";
import { verifyClinicStatus } from "../../../../utils/api/SystemAdminUtils";
import { useEffect, useState } from "react";

const drawerWidth: number = 240;

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


const ClinicDetail = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [clinicInfo, setClinicInfo] = useState<ClinicInfoModel | null>(null)
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>('');

    const clinicId: string = location.pathname.split("/").pop() || "";

    const [open, setOpen] = React.useState(true);


    const toggleDrawer = () => {
        setOpen(!open);
    };

    function formatTime(time: string): string {
        const [hours, minutes] = time.split(':');

        return `${hours}:${minutes}`;
    }

    const handleBackClick = () => {
        navigate(-1);
    };

    const fetchClinics = async () => {
        setLoading(true);
        try {
            const data = await getClinicInformation(clinicId);
            if (typeof data === "string") {
                setError(data);
            } else {
                setClinicInfo(data);
            }
        } catch (error) {
            setError(error as string)
        } finally {
            setLoading(false);
        }

    }

    const handleConfirmClick = async () => {
        if (clinicInfo && clinicInfo.status !== 'verified') {
            try {
                await verifyClinicStatus(clinicInfo.id);
                // Refresh the clinic info or navigate to another page if needed
                setClinicInfo({ ...clinicInfo, status: 'verified' });
            } catch (error) {
                setError(`Error verifying clinic status: ${error}`);
            }
        }
    };

    useEffect(() => {
        fetchClinics();
    }, []);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    if (!clinicInfo) {
        return <p>No clinic information available.</p>;
    }


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
                    <List component="nav">
                        {mainListItems}
                    </List>
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
                                        <Label htmlFor="clinicName">Tên phòng khám</Label>
                                        <Input type="text" id="clinicName" name="name" value={clinicInfo.name} disabled />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label htmlFor="clinicAddress">Địa chỉ</Label>
                                        <Input type="text" id="clinicAddress" name="address" value={clinicInfo.address} disabled />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label htmlFor="clinicPhone">Số điện thoại</Label>
                                        <Input type="text" id="clinicPhone" name="phone" value={clinicInfo.phone} disabled />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label htmlFor="clinicEmail">Email</Label>
                                        <Input type="text" id="clinicEmail" name="email" value={clinicInfo.email} disabled />
                                    </FormGroup>
                                    <Row>
                                        <Col md={6}>
                                            <FormGroup>
                                                <Label htmlFor="openHour">Giờ mở cửa</Label>
                                                <Input type="text" id="openHour" name="open_hour" value={formatTime(clinicInfo.openHour)} disabled />
                                            </FormGroup>
                                        </Col>
                                        <Col md={6}>
                                            <FormGroup>
                                                <Label htmlFor="closeHour">Giờ đóng cửa</Label>
                                                <Input type="text" id="closeHour" name="close_hour" value={formatTime(clinicInfo.closeHour)} disabled />
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                    {/* <FormGroup>
                                        <Label>Mô tả</Label>
                                        <Input
                                            type="textarea"
                                            value={clinicInfo.description}
                                            onChange={handleTextAreaChange}
                                            onDoubleClick={handleInputDoubleClick}
                                        />
                                        <Dialog
                                            open={open}
                                            onClose={() => setOpen(false)}
                                            maxWidth="md"
                                            fullWidth
                                        >
                                            <DialogTitle>Sửa mô tả</DialogTitle>
                                            <DialogContent>
                                                <CKEditor
                                                    editor={ClassicEditor}
                                                    data={clinicInfo.description}
                                                    onChange={handleEditorChange}
                                                />
                                            </DialogContent>
                                            <DialogActions>
                                                <Button onClick={() => setOpen(false)} color="secondary">
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
                                    <FormGroup>
                                        <Label htmlFor="clinicStatus">Trạng thái hoạt động</Label>
                                        <Input
                                            type="text"
                                            id="clinicStatus"
                                            name="status"
                                            value={clinicInfo.working ? 'Đang làm việc' : 'Không làm việc'}
                                            disabled
                                        />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label htmlFor="clinicVerification">Trạng thái xác nhận</Label>
                                        <Input
                                            type="text"
                                            id="clinicVerification"
                                            name="verification"
                                            value={clinicInfo.status === 'verified' ? 'Đã xác nhận' : 'Chưa xác nhận'}
                                            disabled
                                        />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label htmlFor="clinicOwnerId">ID Chủ phòng khám</Label>
                                        <Input type="text" id="clinicOwnerId" name="ownerId" value={clinicInfo.ownerId} disabled />
                                    </FormGroup>
                                    {/* Add more fields as needed */}
                                </Col>
                            </Row>
                            <div className={styles.buttonContainer}>
                                <Button color="secondary" className={styles.backButton} onClick={handleBackClick}>Trở về</Button>
                                <Button color="primary" className={styles.editButton} variant="contained">Chỉnh sửa</Button>
                                {clinicInfo.status !== 'verified' && (
                                    <Button
                                        color="primary"
                                        className={styles.confirmButton}
                                        variant="contained"
                                        onClick={handleConfirmClick}
                                    >
                                        Xác nhận
                                    </Button>
                                )}
                            </div>
                        </div>
                    </Box>
                </Box>
            </Box>
        </ThemeProvider>
    )
}

export default ClinicDetail
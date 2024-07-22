import * as React from "react";
import { styled } from "@mui/material/styles";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";

import styles from "./AccountPage.module.css";

import {
    Box,
    Typography,
} from "@mui/material";
import {
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Input,
    FormGroup,
    Label,
    Tooltip,
    CardBody,
    Card,
    Container,
    Form,
    CardTitle,
} from "reactstrap";
import { MdRemove } from "react-icons/md";
import './CalendarThree.css';
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin, { DateClickArg } from "@fullcalendar/interaction";
import { useEffect, useRef, useState } from "react";
import viLocale from '@fullcalendar/core/locales/vi';

import { ClinicSlotRegistrationModel, Weekdays } from "../../../../utils/interfaces/AdminClinicOwner/Slots";
import { ClinicSlotInfoModel } from "../../../../utils/interfaces/ClinicRegister/Clinic";
import { ClinicSlotUpdateModel } from "../../../../utils/interfaces/ClinicRegister/Clinic";
import { getDentistInfo, registerSlots, getAllClinicSlots, updateClinicSlot, enableSlot, getClinicGeneralInfo } from "../../../../utils/api/ClinicOwnerUtils";
import { NestedListItems } from "../components/NestedListMenu";
import { EventContentArg } from "@fullcalendar/core/index.js";
import { DentistInfoViewModel } from "../../../../utils/api/BookingRegister";

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

const AccountPage = () => {
    const [open, setOpen] = useState(true);
    const [dentist, setDentist] = useState<DentistInfoViewModel>();
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [editMode, setEditMode] = useState(false);

    const fetchData = async () => {
        const dentist = await getDentistInfo();
        setDentist(dentist.content);
    }

    useEffect(() => {
        fetchData();
    }, []);

    const toggleDrawer = () => {
        setOpen(!open);
    };

    const handleButtonClick = () => {
        if (editMode) {
            // Handle save logic here
            console.log('Saving changes...');
            setEditMode(false); // Switch back to view mode
        } else {
            setEditMode(true); // Switch to edit mode
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
                        Trang thiết lập slot khám
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
                    minHeight: "100vh",
                    overflow: "auto",
                }}
            >
                <div className={styles.mainContainer}>
                    <div>
                        <Card>
                            <CardBody>
                                <CardTitle tag="h4">Thông tin tài khoản</CardTitle>
                                <Form >
                                    <FormGroup>
                                        <Label for="fullname">Họ tên</Label>
                                        <Input
                                            type="text"
                                            id="fullname"
                                            name="fullname"
                                            value={dentist?.fullname}
                                            placeholder="Nhập họ và tên"
                                        />
                                    </FormGroup>

                                    <FormGroup>
                                        <Label for="email">Email</Label>
                                        <Input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={dentist?.email}
                                            placeholder="Nhập email"
                                        />
                                    </FormGroup>

                                    <FormGroup>
                                        <Label for="phone">Số điện thoại</Label>
                                        <Input
                                            type="text"
                                            id="phone"
                                            name="phone"
                                            value={dentist?.phone}
                                            placeholder="Nhập số điện thoại"
                                        />
                                    </FormGroup>
                                    <Button type="submit" color="primary">
                                        {editMode ? 'Lưu' : 'Thay đổi'}  
                                    </Button>
                                </Form>

                            </CardBody>
                        </Card>
                    </div>
                </div>
            </Box>
        </Box >
    );
};

export default AccountPage;
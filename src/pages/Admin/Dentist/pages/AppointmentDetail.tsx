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
import styles from "./AppointmentDetail.module.css";
import { Row, Col, FormGroup, Label, Input, Button, ModalFooter, ModalBody, Modal, ModalHeader, Card, CardBody, CardText, CardTitle } from 'reactstrap';

import { useEffect, useState } from "react";
import { NestedListItems } from "../components/NestedListMenu";
import Box from "@mui/material/Box";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { AppointmentViewModel, fetchDentistInfo, getAllClinicSlots } from "../../../../utils/api/ClinicOwnerUtils";
import { getAllDentistAppointments, finishAppointment, noteAppointment, createRecurringAppointment } from "../../../../utils/api/DentistUtils";
import { cancelAppointment } from "../../../../utils/api/MiscUtils";
import { ClinicSlotInfoModel } from "../../../../utils/interfaces/ClinicRegister/Clinic";

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
const AppointmentDetail = () => {
    const [isEditable, setIsEditable] = useState(false);
    const [loading, setLoading] = useState(true);
    const [appointment, setAppointment] = useState<AppointmentViewModel>();
    const [open, setOpen] = React.useState(true);
    const [note, setNote] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [recurringCount, setRecurringCount] = useState(1);
    const [timeSpan, setTimeSpan] = useState(30);
    const [repeatType, setRepeatType] = useState<'daily' | 'weekly' | 'monthly'>('monthly');
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [selectedSlot, setSelectedSlot] = useState<string>('');
    const [availableSlots, setAvailableSlots] = useState<ClinicSlotInfoModel[]>([]);
    const urlPath = window.location.href;
    const appointmentId = urlPath.split('/').pop();
    const [canEditOrCancel, setCanEditOrCancel] = useState(false);
    const navigate = useNavigate();

    const fetchAppointment = async (appointmentId) => {
        try {
            setLoading(true);

            const dentistInfo = await fetchDentistInfo();

            const dentistId = dentistInfo.content.dentistId;

            const appointments = await getAllDentistAppointments(dentistId);
            const appointment = appointments.find(app => app.bookId === appointmentId);
            setCanEditOrCancel(appointment.bookingStatus !== 'canceled' && appointment.bookingStatus !== 'completed');
            setAppointment(appointment);
            setNote(appointment.dentistNote);
        } catch (error) {
            console.error("Error fetching appointment:", error);
        } finally {
            setLoading(false);
        }
    }

    const fetchAvailableSlots = async (date: string) => {
        try {
            const dentistInfo = await fetchDentistInfo();

            const clinicId = dentistInfo.content.clinicId;

            const slots = await getAllClinicSlots(clinicId);

            setAvailableSlots(slots);
        } catch (error) {
            console.error("Error fetching available slots:", error);
        }
    };

    useEffect(() => {
        if (appointmentId) {
            fetchAppointment(appointmentId);
        }
    }, [appointmentId]);

    useEffect(() => {
        fetchAvailableSlots(selectedDate);
    }, [selectedDate])

    const toggleModal = () => {
        setModalOpen(!modalOpen);
        if (!modalOpen) {
            setRecurringCount(1);
            setTimeSpan(30);
            setRepeatType('monthly');
            setSelectedDate('');
            setSelectedSlot('');
        }
    };

    const handleCreateRecurringAppointment = async () => {
        const dentistInfo = await fetchDentistInfo();

        const dentistId = dentistInfo.content.dentistId;

        const appointmentData = {
            timeSlotId: selectedSlot,
            appointmentType: "checkup",
            appointmentDate: selectedDate,
            customerId: appointment.customerId,
            dentistId: dentistId,
            clinicId: appointment.clinicId,
            serviceId: appointment.serviceId,
            orginialAppointment: appointment.bookId
        };

        const recurringSettings = {
            MaxRecurring: recurringCount,
            TimeSpan: timeSpan,
            RepeatType: repeatType
        };

        try {
            const result = await createRecurringAppointment(appointmentData, recurringSettings);
            if (result) {
                alert('Recurring appointments created successfully.')

            }
            console.log('Recurring appointments created:', result);

            toggleModal();
        } catch (error) {
            console.error('Failed to create recurring appointments:', error);
        }
    };

    const toggleDrawer = () => {
        setOpen(!open);
    };

    const handleInputChange = (e) => {
        if (e.target.name === 'note') {
            setNote(e.target.value);
        }
    };

    const formatTime = (time: string) => {
        const [hours, minutes] = time.split(':');
        return `${hours}:${minutes}`;
    };

    const formatDateToDDMMYYYY = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };


    const handleEditClick = async () => {
        if (isEditable) {
            try {
                const response = await noteAppointment(appointmentId, note);
                await fetchAppointment(appointmentId);
            } catch (error) {
                console.error('Failed to save the note:', error);
            }
        }
        setIsEditable(!isEditable);
    };

    const handlePatientDetailClick = (appointment: AppointmentViewModel) => { 
        console.log(appointment);
        navigate(`/patient/${appointment.customerId}`);
    }
    
    const flattenedSlots = availableSlots.flat();

    const getStatusText = (status: string) => {
        switch (status) {
            case 'booked':
                return 'Đã đặt lịch';
            case 'pending':
                return 'Đang chờ xác nhận';
            case 'completed':
                return 'Đã hoàn thành';
            case 'canceled':
                return 'Đã hủy';
            case 'finished':
                return 'Đã hoàn thành'
            default:
                return status;
        }
    }

    const getType = (type: string) => {
        switch (type) {
            case 'treatment':
                return 'Chữa trị'
            case 'checkup':
                return 'Khám'
            default:
                return type;
        }
    }

    const handleBackClick = () => {
        navigate(-1);
    };

    const handleConfirmClick = async () => {
        const result = await finishAppointment(appointmentId);
        if (result) {
            await fetchAppointment(appointmentId);
            console.log('Appointment finished successfully.');
        } else {
            console.error('Failed to finish the appointment.');
        }
    }

    const handleCancelClick = async () => {
        await cancelAppointment(appointmentId);
        await fetchAppointment(appointmentId);
    }

    const getDayName = (weekday: number) => {
        const days = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
        return days[weekday];
    };

    return (
        <ThemeProvider theme={defaultTheme}>
            <Box sx={{ display: "flex" }}>
                <AppBar position="absolute" open={open}>
                    <Toolbar sx={{ pr: "24px" }}>
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
                            Trang chi tiết lịch hẹn
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
                    {loading ? (
                        <div>Loading...</div>
                    ) : appointment ? (
                        <Box className={styles.mainContainer}>
                            <Card className={styles.card}>
                                <CardBody>
                                    <CardTitle tag="h3" className={styles.cardTitle}>Chi tiết lịch hẹn</CardTitle>
                                    <Row>
                                        <Col md={6}>
                                            <CardText className={styles.sectionTitle}>Thông tin lịch hẹn</CardText>
                                            <FormGroup>
                                                <Label htmlFor="appointmentDate">Ngày hẹn</Label>
                                                <Input
                                                    type="text"
                                                    id="appointmentDate"
                                                    name="appointmentDate"
                                                    value={formatDateToDDMMYYYY(appointment.appointmentDate)}
                                                    disabled
                                                />
                                            </FormGroup>
                                            <FormGroup>
                                                <Label htmlFor="appointmentTime">Thời gian</Label>
                                                <Input
                                                    type="text"
                                                    id="appointmentTime"
                                                    name="appointmentTime"
                                                    value={`${formatTime(appointment.appointmentTime)} - ${formatTime(appointment.expectedEndTime)}`}
                                                    disabled
                                                />
                                            </FormGroup>
                                            <FormGroup>
                                                <Label htmlFor="appointmentType">Loại hẹn</Label>
                                                <Input
                                                    type="text"
                                                    id="appointmentType"
                                                    name="type"
                                                    value={getType(appointment.appointmentType)}
                                                    disabled
                                                />
                                            </FormGroup>
                                        </Col>
                                        <Col md={6}>
                                            <CardText className={styles.sectionTitle}>Thông tin bệnh nhân</CardText>
                                            <FormGroup>
                                                <Label htmlFor="customerId">Bệnh nhân</Label>
                                                <Input
                                                    type="text"
                                                    id="customerId"
                                                    name="customerId"
                                                    value={appointment.customerFullName || ''}
                                                    disabled
                                                />
                                            </FormGroup>
                                            <FormGroup>
                                                <Label htmlFor="status">Trạng thái</Label>
                                                <Input
                                                    type="text"
                                                    id="status"
                                                    name="status"
                                                    value={getStatusText(appointment.bookingStatus)}
                                                    disabled
                                                />
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                    <FormGroup>
                                        <Label htmlFor="note">Ghi chú</Label>
                                        <Input
                                            type="textarea"
                                            id="note"
                                            name="note"
                                            value={note}
                                            disabled={!isEditable}
                                            onChange={handleInputChange}
                                        />
                                    </FormGroup>
                                    <div className={styles.buttonContainer}>
                                        <Button color="secondary" className={styles.backButton} onClick={handleBackClick}>
                                            Trở về
                                        </Button>
                                        {canEditOrCancel && (
                                            <>
                                                <Button color="primary" className={styles.editButton} onClick={handleEditClick}>
                                                    {appointment.isEditable ? 'Lưu' : 'Thêm ghi chú'}
                                                </Button>
                                                <Button color="primary" className={styles.cancelButton} onClick={handleCancelClick}>
                                                    Hủy lịch khám
                                                </Button>
                                                <Button color="primary" onClick={toggleModal} className={styles.repeatButton}>
                                                    Đặt lịch định kì
                                                </Button>
                                                <Button color="primary" onClick={() => handlePatientDetailClick(appointment)} className={styles.detailButton}>
                                                    Xem lịch đã đặt của bệnh nhân
                                                </Button>
                                                {(appointment.bookingStatus !== 'pending' && appointment.bookingStatus !== 'finished') && (
                                                    <Button color="primary" className={styles.confirmButton} onClick={handleConfirmClick}>
                                                        Hoàn thành lịch khám
                                                    </Button>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </CardBody>
                            </Card>
                        </Box>
                    ) : (
                        <div>Appointment not found</div>
                    )}
                </Box>
            </Box>
            {availableSlots.length > 0 ?
                <Modal isOpen={modalOpen} toggle={toggleModal} centered style={{ marginTop: '50px' }}>
                    <ModalHeader toggle={toggleModal}>Đặt Lịch Hẹn Định Kỳ</ModalHeader>
                    <ModalBody>
                        <FormGroup>
                            <Label for="selectedDate">Ngày bắt đầu:</Label>
                            <Input
                                type="date"
                                min={selectedDate}
                                id="selectedDate"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="selectedSlot">Chọn khung giờ:</Label>
                            <Input
                                type="select"
                                id="selectedSlot"
                                value={selectedSlot}
                                onChange={(e) => setSelectedSlot(e.target.value)}
                            >
                                <option value="">Chọn khung giờ</option>
                                {flattenedSlots.map((slot) => (
                                    <option key={slot.clinicSlotId} value={slot.clinicSlotId}>
                                        {`${formatTime(slot.startTime)} - ${formatTime(slot.endTime)} (${getDayName(slot.weekday)})`}
                                    </option>
                                ))}
                            </Input>
                        </FormGroup>
                        <FormGroup>
                            <Label for="recurringCount">Số lần lặp lại:</Label>
                            <Input
                                type="number"
                                id="recurringCount"
                                min={1}
                                value={recurringCount}
                                onChange={(e) => setRecurringCount(Number(e.target.value))}
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="timeSpan">Khoảng thời gian:</Label>
                            <Input
                                type="number"
                                id="timeSpan"
                                min={1}
                                value={timeSpan}
                                onChange={(e) => setTimeSpan(Number(e.target.value))}
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="repeatType">Loại lặp lại:</Label>
                            <Input
                                type="select"
                                id="repeatType"
                                value={repeatType}
                                onChange={(e) => setRepeatType(e.target.value as 'daily' | 'weekly' | 'monthly')}
                            >
                                <option value="daily">Hằng ngày</option>
                                <option value="weekly">Hằng tuần</option>
                                <option value="monthly">Hằng tháng</option>
                            </Input>
                        </FormGroup>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={handleCreateRecurringAppointment}>
                            Đặt lịch định kỳ
                        </Button>
                        <Button color="secondary" onClick={toggleModal}>
                            Hủy
                        </Button>
                    </ModalFooter>
                </Modal> : ''}
        </ThemeProvider >
    )
}

export default AppointmentDetail;
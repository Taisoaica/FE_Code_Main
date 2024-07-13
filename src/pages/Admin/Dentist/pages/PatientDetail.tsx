import { styled } from "@mui/material/styles";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import styles from "./PatientDetail.module.css";
import {
  Box,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Card, CardContent } from "@mui/material";
import { AppointmentViewModel } from "../../../../utils/api/ClinicOwnerUtils";
import { getAllDentistAppointments, getDentistAppointmentsWithFilter } from "../../../../utils/api/DentistUtils";
import { NestedListItems } from "../components/NestedListMenu";
import { useNavigate } from "react-router-dom";
import { Button } from "reactstrap";

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

const PatientDetail = () => {
  const [open, setOpen] = useState(true);
  const [appointments, setAppointments] = useState<AppointmentViewModel[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [appointmentsPerPage] = useState(3);
  const urlPath = window.location.href;
  const patientId = urlPath.split('/').pop();

  const navigate = useNavigate();

  const fetchAppointment = async () => {
    try {
      const appointments = await getAllDentistAppointments();
      if (appointments) {
        const filteredAppointments = appointments.filter(appointment => appointment.customerId === Number(patientId));
        setAppointments(filteredAppointments);
      } else {
        console.log("error");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAppointment();
  }, []);

  const formatDateToDDMMYYYY = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    return `${hours}:${minutes}`;
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'Chờ xác nhận';
      case 'booked': return 'Đã đặt';
      case 'finished': return 'Hoàn tất';
      case 'canceled': return 'Đã hủy';
      case 'no-show': return 'Vắng mặt';
      default: return '';
    }
  };

  const getStatusClassName = (status) => {
    switch (status) {
      case 'pending': return styles.statusPending;
      case 'booked': return styles.statusBooked;
      case 'finished': return styles.statusFinished;
      case 'canceled': return styles.statusCanceled;
      case 'no-show': return styles.statusNoShow;
      default: return '';
    }
  };

  const handleRowClick = (appointmentId) => {
    navigate(`/dentist/${appointmentId}`);
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const indexOfLastAppointment = currentPage * appointmentsPerPage;
  const indexOfFirstAppointment = indexOfLastAppointment - appointmentsPerPage;
  const currentAppointments = appointments.slice(indexOfFirstAppointment, indexOfLastAppointment);

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
            Trang thông tin các lịch hẹn của bệnh nhân
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
          <NestedListItems />
        </List>
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
          overflow: 'auto',
        }}
      >
        <Box className={styles.mainContainer}>
          <div className={styles.greeting}>
            Thông tin các lịch hẹn của bệnh nhân
          </div>
          <Box className={styles.tableContainer}>
            <div className={styles.tableHeader}>Danh sách lịch hẹn</div>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th style={{ width: '10%' }}>Ngày</th>
                  <th style={{ width: '10%' }}>Slot</th>
                  <th style={{ width: '30%' }}>Tên khách hàng</th>
                  <th style={{ width: '30%' }}>Dịch vụ</th>
                  <th style={{ width: '20%' }}>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {currentAppointments.length > 0 ? (
                  currentAppointments.map((appointment) => (
                    <tr
                      key={appointment.bookId}
                      className={styles.tableRow}
                      onClick={() => handleRowClick(appointment.bookId)}
                    >
                      <td>{formatDateToDDMMYYYY(appointment.appointmentDate)}</td>
                      <td>{formatTime(appointment.appointmentTime)} - {formatTime(appointment.expectedEndTime)}</td>
                      <td>{appointment.customerFullName}</td>
                      <td>{appointment.selectedServiceName}</td>
                      <td>
                        <Button className={getStatusClassName(appointment.bookingStatus)}>
                          {getStatusText(appointment.bookingStatus)}
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center' }}>
                      {appointments.length === 0 ? 'Chưa có lịch hẹn nào' : 'Không tìm thấy kết quả'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <Pagination
              appointmentsPerPage={appointmentsPerPage}
              totalAppointments={appointments.length}
              paginate={setCurrentPage}
              currentPage={currentPage}
            />
          </Box>
          <Box className={styles.buttonContainer}>
            <Button color="primary" onClick={handleBackClick}>
              Trở về
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

const Pagination = ({ appointmentsPerPage, totalAppointments, paginate, currentPage }) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalAppointments / appointmentsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <nav>
      <ul className={styles.pagination}>
        {pageNumbers.map(number => (
          <li key={number} className={currentPage === number ? styles.active : ''}>
            <a onClick={() => paginate(number)} href="#!" aria-current={currentPage === number ? 'page' : undefined}>
              {number}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};


export default PatientDetail
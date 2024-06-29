import * as React from "react";
import { styled } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
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
import { mainListItems } from "../components/listItems";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

import styles from "./AppointmentSchedule.module.css";
import BookingDialog from "./BookingDialog";

const mockBookings = [
  
  {
    bookingId: 'BK001',
    customer: 'Nguyễn Văn A',
    doctor: 'Dr. Nguyễn Thị B',
    appointmentDate: '2024-06-25',
    slotStartTime: '09:00 AM',
    createdAt: '2024-06-20',
    service: 'Tẩy trắng răng',
    status: 'Đang chờ xác nhận',
  },
  {
    bookingId: 'BK002',
    customer: 'Trần Thị C',
    doctor: 'Dr. Lê Văn D',
    appointmentDate: '2024-06-26',
    slotStartTime: '10:30 AM',
    createdAt: '2024-06-21',
    service: 'Lấy cắp mô nha chu',
    status: 'Đã xác nhận',
  },
  {
    bookingId: 'BK003',
    customer: 'Phạm Văn E',
    doctor: 'Dr. Nguyễn Thị B',
    appointmentDate: '2024-06-27',
    slotStartTime: '02:00 PM',
    createdAt: '2024-06-22',
    service: 'Chữa viêm lợi',
    status: 'Đã hoàn thành',
  },
  {
    bookingId: 'BK004',
    customer: 'Lê Thị F',
    doctor: 'Dr. Lê Văn D',
    appointmentDate: '2024-06-28',
    slotStartTime: '08:30 AM',
    createdAt: '2024-06-23',
    service: 'Niềng răng',
    status: 'Đã hủy',
  },
];

const mockDentists = [
  {
    dentistId: 'D001',
    name: 'Dr. Nguyễn Thị B',
    appointmentsToday: 5,
    status: 'Hoạt động',
  },
  {
    dentistId: 'D002',
    name: 'Dr. Lê Văn D',
    appointmentsToday: 3,
    status: 'Xin vắng',
  },
  {
    dentistId: 'D003',
    name: 'Dr. Trần Văn E',
    appointmentsToday: 7,
    status: 'Hoạt động',
  },
  {
    dentistId: 'D004',
    name: 'Dr. Phạm Thị F',
    appointmentsToday: 2,
    status: 'Xin vắng',
  },
];

const suggestedCheckups = [
  {
    patient: 'Nguyễn Văn A',
    date: '2024-06-25',
    doctor: 'Dr. Nguyễn Thị B',
    startTime: '09:00 AM',
    suggestedSchedule: 'Đề xuất 6 tháng/lần',
    status: 'Đang chờ xác nhận',
  },
  {
    patient: 'Trần Thị C',
    date: '2024-06-26',
    doctor: 'Dr. Lê Văn D',
    startTime: '10:30 AM',
    suggestedSchedule: 'Đề xuất 1 năm/lần',
    status: 'Đã xác nhận',
  },
];

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

export default function AppointmentSchedule() {
  const [open, setOpen] = React.useState(true);
  const toggleDrawer = () => {
    setOpen(!open);
  };

  const navigator = useNavigate();


  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  //----------------------------------------------------------------------

  //----------------------------------------------------------------------
  //Action handlers
  const handleStatusButtonClick = (booking: React.SetStateAction<null>) => {
    setSelectedBooking(booking);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  function getStatusStyle(status: string) {
    switch (status) {
      case 'Hoạt động':
        return styles.active;
      case 'Xin vắng':
        return styles.inactive;
      case 'Đang chờ xác nhận':
        return styles.waiting;
      case 'Đã xác nhận':
        return styles.confirmed;
      case 'Đã hoàn thành':
        return styles.completed;
      case 'Đã hủy':
        return styles.cancelled;
      default:
        return '';
    }
  }

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
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
            Trang lịch hẹn khám
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
        <List component="nav">{mainListItems}</List>
      </Drawer>
      <Box
        component="main"
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === "light"
              ? theme.palette.grey[100]
              : theme.palette.grey[900],
          flexGrow: 1,
          height: "100%",
          marginTop: 8,
        }}
      >
        <Box className={styles.mainContainer}>
          <div className={styles.content}>
            <div className={styles.tableContainer}>
              <div className={styles.title}>Danh sách lịch hẹn</div>
              <Box className={styles.toolbar}>
                <Box className={styles.searchbar}>
                  <input type="text" placeholder="Tìm kiếm tên người dùng" className={styles.searchInput} />
                  <button className={styles.searchButton}>Tìm kiếm</button>
                </Box>
                <Box className={styles.utilities}>
                  <select className={styles.filterSelect}>
                    <option value="">Filter</option>
                    <option value="role1">Role 1</option>
                    <option value="role2">Role 2</option>
                  </select>

                </Box>
              </Box>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Booking ID</th>
                    <th>Khách hàng</th>
                    <th>Bác sĩ</th>
                    <th>Ngày hẹn</th>
                    <th>Slot(thời gian bắt đầu)</th>
                    <th>Ngày tạo</th>
                    <th>Dịch vụ</th>
                    <th>
                      <Box className={styles.tooltip}>
                        Trạng thái
                        <span className={styles.tooltiptext}>Nhấn để cập nhật trạng thái</span>
                        <span className={styles.tooltipicon}>!</span>
                      </Box>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {mockBookings.map((booking: any) => (
                    <tr key={booking.bookingId} className={styles.tableRow} >
                      <td>{booking.bookingId}</td>
                      <td>{booking.customer}</td>
                      <td>{booking.doctor}</td>
                      <td>{booking.appointmentDate}</td>
                      <td>{booking.slotStartTime}</td>
                      <td>{booking.createdAt}</td>
                      <td>{booking.service}</td>
                      <td>
                        <button className={`${styles.statusButton} ${getStatusStyle(booking.status)}`}
                          onClick={() => handleStatusButtonClick(booking)}
                        >
                          {booking.status}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className={styles.row2}>
              <div className={styles.column1}>
                <div className={styles.tableContainer}>
                  <div className={styles.title}>Danh sách nha sĩ</div>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>Nha sĩ ID</th>
                        <th>Tên</th>
                        <th>Số lịch hẹn hôm nay</th>
                        <th>
                          <Box className={styles.tooltip}>
                            Trạng thái
                            <span className={styles.tooltiptext}>Nhấn để cập nhật trạng thái</span>
                            <span className={styles.tooltipicon}>!</span>
                          </Box>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockDentists.map((dentist: any) => (
                        <tr key={dentist.dentistId} className={styles.tableRow} >
                          <td>{dentist.dentistId}</td>
                          <td>{dentist.name}</td>
                          <td>{dentist.appointmentsToday}</td>
                          <td>
                            <button className={`${styles.statusButton} ${getStatusStyle(dentist.status)}`}>
                              {dentist.status}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className={styles.column2}>
                <div className={styles.tableContainer}>
                  <div className={styles.title}>Đề xuất lịch khám định kì</div>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>Bệnh nhân</th>
                        <th>Ngày lên lịch</th>
                        <th>Bác sĩ</th>
                        <th>Thời gian bắt đầu</th>
                        <th>Đề xuất lịch khám</th>
                        <th>
                          <Box className={styles.tooltip}>
                            Trạng thái
                            <span className={styles.tooltiptext}>Nhấn để cập nhật trạng thái</span>
                            <span className={styles.tooltipicon}>!</span>
                          </Box>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {suggestedCheckups.map((checkup, index) => (
                        <tr key={index}>
                          <td>{checkup.patient}</td>
                          <td>{checkup.date}</td>
                          <td>{checkup.doctor}</td>
                          <td>{checkup.startTime}</td>
                          <td>{checkup.suggestedSchedule}</td>
                          <td>
                            <button className={`${styles.statusButton} ${getStatusStyle(checkup.status)}`}>
                              {checkup.status}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </Box>
      </Box>
      <BookingDialog isOpen={isDialogOpen} onClose={handleCloseDialog} booking={selectedBooking} />
    </Box>
  );
}

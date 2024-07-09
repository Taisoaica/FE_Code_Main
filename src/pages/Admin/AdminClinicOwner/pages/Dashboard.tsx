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


import { mainListItems } from "../components/listItems";
import styles from "./Dashboard.module.css";

import {
  Box,
  Link,
  Typography,
} from "@mui/material";

import Scheduler from "../components/Scheduler/Scheduler";
import ClinicInfo from "../components/ClinicInfo/ClinicInfo";
import { useEffect, useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import { NestedListItems } from "../components/NestedListMenu";
import { getAllClinics } from "../../../../utils/api/SystemAdminUtils";
import { DentistInfoViewModel } from "../../../../utils/api/BookingRegister";
import { fetchClinicStaff } from "../../../../utils/api/ClinicOwnerUtils";

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

const Dashboard = () => {
  const [open, setOpen] = useState(true);
  const calendarRef = useRef<FullCalendar>(null);
  const [fullname, setFullname] = useState('');
  const [clinicOpenHour, setClinicOpenHour] = useState('');
  const [clinicCloseHour, setClinicCloseHour] = useState('');
  const [loading, setLoading] = useState(true);
  const [staff, setStaff] = useState<DentistInfoViewModel[]>();


  const toggleDrawer = () => {
    setOpen(!open);
  };

  const ownerId = localStorage.getItem('id');
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { content } = await getAllClinics(1, 100, '');

        const ownerClinic = content.find(clinic => clinic.ownerId.toString() === ownerId);
        if (ownerClinic) {
          localStorage.setItem('clinic', JSON.stringify(ownerClinic));
          setClinicOpenHour(ownerClinic.openHour);
          setClinicCloseHour(ownerClinic.closeHour);
        } else {
          console.error('No clinic found for the given ownerId');
        }

        // const userDetails = localStorage.getItem('userDetails');
        // if (userDetails) {
        //   const user = JSON.parse(userDetails);
        //   setFullname(user.fullname);
        // } else {
        //   console.error('No userDetails found in local storage');
        // }

        const data = await fetchClinicStaff();
        setStaff(data.filter(user => !user.isOwner && user.isActive));

        setLoading(false);
      } catch (error) {
        console.error('Error fetching clinics or user details:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [ownerId]);

  console.log(staff, 'Hi')
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
          {/* <Box className={styles.logoBox}>
            <Link href="/"><img src="../../../../../public/Logo.png" /></Link>
          </Box> */}
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
        {/* <List component="nav">
          {mainListItems}
        </List> */}
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
        <div className={styles.mainContainer} >
          <div className={styles.greeting}>
            <h1>Xin chào {fullname}</h1>
            <div>
              Chào mừng bạn trở lại! Dưới đây là tổng quan nhanh về các hoạt động và số liệu thống kê của phòng khám của bạn.
            </div>
          </div>

          <Divider sx={{
            margin: '20px auto',
            width: '90%',
            borderBottomWidth: 2,
            backgroundColor: 'black'
          }} />

          <div className={styles.contentWrapper}>
            <Box className={styles.content1}>
              <Box>
                <Box sx={{ fontSize: '22px', fontWeight: 700 }}>
                  Lịch hẹn trong tuần này
                </Box>
                <Box sx={{ fontSize: '20px' }}>
                  5 lịch hẹn
                </Box>
              </Box>
              <Box>
                <Box sx={{ fontSize: '22px', fontWeight: 700 }}>
                  Lịch hẹn đã hoàn thành
                </Box>
                <Box sx={{ fontSize: '20px' }}>
                  15 lịch hẹn
                </Box>
              </Box>
              <Box>
                <Box sx={{ fontSize: '22px', fontWeight: 700 }}>
                  Lịch hẹn đã hủy
                </Box>
                <Box sx={{ fontSize: '20px' }}>
                  2 lịch hẹn
                </Box>
              </Box>
            </Box>

            {/* <Box className={styles.annualAppointments}>
              <Box sx={{ fontSize: '22px', fontWeight: 700, marginBottom: '10px' }}>
                Yêu cầu đặt lịch hẹn định kỳ
              </Box>
              <ul className={styles.annualAppointmentsList}>
                <li>
                  <span className={styles.appointmentService}>Khám Răng Định Kỳ</span>
                  <span className={styles.appointmentDetails}>Lặp lại mỗi 2 tháng</span>
                </li>
                <li>
                  <span className={styles.appointmentService}>Tẩy Trắng Răng Định Kỳ</span>
                  <span className={styles.appointmentDetails}>Lặp lại mỗi 3 tháng</span>
                </li>
                <li>
                  <span className={styles.appointmentService}>Nhổ Răng Khôn Định Kỳ</span>
                  <span className={styles.appointmentDetails}>Lặp lại mỗi 6 tháng</span>
                </li>
                <li>
                  <span className={styles.appointmentService}>Nhổ Răng Khôn Định Kỳ</span>
                  <span className={styles.appointmentDetails}>Lặp lại mỗi 6 tháng</span>
                </li>
                <li>
                  <span className={styles.appointmentService}>Nhổ Răng Khôn Định Kỳ</span>
                  <span className={styles.appointmentDetails}>Lặp lại mỗi 6 tháng</span>
                </li>
              </ul>
            </Box>

            <Box className={styles.topServices}>
              <Box sx={{ fontSize: '22px', fontWeight: 700, marginBottom: '10px' }}>
                Dịch vụ được đặt nhiều nhất
              </Box>
              <ul className={styles.servicesList}>
                <li>
                  <span className={styles.serviceName}>Khám Răng</span>
                  <span className={styles.serviceCount}>25 khách</span>
                </li>
                <li>
                  <span className={styles.serviceName}>Tẩy Trắng Răng</span>
                  <span className={styles.serviceCount}>18 khách</span>
                </li>
                <li>
                  <span className={styles.serviceName}>Nhổ Răng Khôn</span>
                  <span className={styles.serviceCount}>15 khách</span>
                </li>
              </ul>
            </Box> */}

            <div className={styles.calendarContainer}>
              <Divider sx={{
                margin: '20px auto',
                width: '100%',
                borderBottomWidth: 2,
                backgroundColor: 'black'
              }} />
              {loading ? <p>Loading....</p> : <Scheduler openHour={clinicOpenHour} closeHour={clinicCloseHour} availableStaff={staff} />}
            </div>
          </div>
        </div>
      </Box>
    </Box>
  );
};

export default Dashboard;

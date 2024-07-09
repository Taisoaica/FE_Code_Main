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
import { useEffect, useState } from "react";

import styles from "./AppointmentSchedule.module.css";
import BookingDialog from "./BookingDialog";
import { NestedListItems } from "../components/NestedListMenu";
import { getAllCustomer, getAllDentist, getAllUsers, UserInfoModel } from "../../../../utils/api/SystemAdminUtils";
import { fetchClinicStaff } from "../../../../utils/api/ClinicOwnerUtils";
import { getClinicAppointments, AppointmentViewModel, getAllClinicSlots } from "../../../../utils/api/ClinicOwnerUtils";
import { ClinicSlotInfoModel } from "../../../../utils/interfaces/ClinicRegister/Clinic";
import { Button } from "reactstrap";
import { DentistInfoViewModel } from "../../../../utils/api/BookingRegister";
import { slots } from "../../data";

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

export default function AppointmentSchedule() {
  const [open, setOpen] = React.useState(true);
  const toggleDrawer = () => {
    setOpen(!open);
  };

  const clinic = localStorage.getItem('clinic');
  const clinicId = clinic ? JSON.parse(clinic).id : null;
  
  // const [fromDate, setFromDate] = useState<Date>();
  // const [toDate, setToDate] = useState<Date>();
  // const [fromTime, setFromTime] = useState<string>('');
  // const [toTime, setToTime] = useState<string>('');
  const [pageSize, setPageSize] = useState<number>(10);
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [isFiltering, setIsFiltering] = useState<boolean>(false);

  const [appointmentsWithTimes, setAppointmentsWithTimes] = useState<AppointmentViewModel[]>([]);
  const [users, setUsers] = useState<{ [key: number]: UserInfoModel }>({});
  const [dentists, setDentists] = useState<{ [key: number]: UserInfoModel }>({});
  const [clinicSlots, setClinicSlots] = useState<ClinicSlotInfoModel[][]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    return `${hours}:${minutes}`;
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const formatDateToSend = (date: Date) => {
    return date.toLocaleDateString("en-US");
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'booked':
        return 'Đã đặt lịch';
      case 'pending':
        return 'Đang chờ xác nhận';
      case 'completed':
        return 'Đã hoàn thành';
      default:
        return status;
    }
  }

  const statusClass = (appointment: AppointmentViewModel) => {
    switch (appointment.status) {
      case 'booked':
        return styles.booked;
      case 'pending':
        return styles.pending;
      case 'completed':
        return styles.completed;
      default:
        return '';
    }
  }

  const onFilter = () => { 
    setIsFiltering(!isFiltering);
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedSlots = await getAllClinicSlots(clinicId);
        setClinicSlots(fetchedSlots);

        // const defaultFromDate = fromDate || new Date();
        // const defaultToDate = toDate || new Date();
        // defaultToDate.setFullYear(defaultToDate.getFullYear() + 1);

        const fetchedAppointments = await getClinicAppointments(
          clinicId,
          // formatDateToSend(defaultFromDate), 
          // formatDateToSend(defaultToDate),
        );


        const appointmentsWithSlotTimes = fetchedAppointments.map(appointment => {
          const matchingSlot = fetchedSlots.flat().find(slot => slot.clinicSlotId === appointment.clinicSlotId);
          return {
            ...appointment,
            slotStartTime: matchingSlot?.startTime,
            slotEndTime: matchingSlot?.endTime
          };
        });

        setAppointmentsWithTimes(appointmentsWithSlotTimes);
        const allUsers = await getAllUsers();
        const allDentists = await getAllDentist();

        const userLookup = allUsers.reduce((acc, user) => {
          acc[user.id] = user;
          return acc;
        }, {} as { [key: number]: UserInfoModel });

        const dentistLookup = allDentists.reduce((acc, dentist) => {
          acc[dentist.dentistId] = dentist;
          return acc;
        }, {} as { [key: number]: UserInfoModel });

        setUsers(userLookup);
        setDentists(dentistLookup);

      } catch (error) {
        setError('Failed to fetch data.');
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    console.log("Is request")
    fetchData();
  }, [isFiltering]);


  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
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
          height: "100vh",
          marginTop: 5.5,
          overflow: "auto",
        }}
      >
        <Box className={styles.mainContainer}>
          <div className={styles.tableContainer}>
            <h2 className={styles.title}>Danh sách lịch hẹn</h2>
            {/* <Box className={styles.toolbar}>
              <input
                type="date"
                value={fromDate?.toISOString().split('T')[0] || ''}
                onChange={(e) => setFromDate(new Date(e.target.value))}
              />
              <input
                type="date"
                value={toDate?.toISOString().split('T')[0] || ''}
                onChange={(e) => setToDate(new Date(e.target.value))}
              />
              <input
                type="time"
                value={fromTime}
                onChange={(e) => setFromTime(e.target.value)}
              />
              <input
                type="time"
                value={toTime}
                onChange={(e) => setToTime(e.target.value)}
              />
             
              <button onClick={() => onFilter()}>Áp dụng bộ lọc</button>
            </Box> */}
            {loading && <div>Loading...</div>}
            {error && <div>{error}</div>}
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Khách hàng</th>
                  <th>Bác sĩ</th>
                  <th>Ngày hẹn</th>
                  <th>Slot</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {appointmentsWithTimes.map((appointment: AppointmentViewModel) => (
                  <tr key={appointment.id} className={styles.tableRow}>
                    <td>{users[appointment.customerId]?.fullname}</td>
                    <td>{dentists[appointment.dentistId]?.fullname}</td>
                    <td>{formatDate(appointment.appointmentDate)}</td>
                    {/* <td>{formatTime(appointment.slotStartTime)} - {formatTime(appointment.slotEndTime)}</td> */}
                    <td>{formatTime(appointment.slotStartTime)} - {formatTime(appointment.slotEndTime)}</td>
                    <td>
                      <Button className={`${styles.status} ${statusClass(appointment)}`}>
                        {getStatusText(appointment.status)}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* <Box className={styles.pagination}>
              <button onClick={() => { setPageIndex(prev => Math.max(1, prev - 1)); }}>Trang trước</button>
              <span>Trang {pageIndex}</span>
              <button onClick={() => { setPageIndex(prev => prev + 1); }}>Trang sau</button>
            </Box> */}
          </div>
        </Box>
      </Box>
      <BookingDialog isOpen={isDialogOpen} onClose={handleCloseDialog} booking={selectedBooking} />
    </Box>
  );
}
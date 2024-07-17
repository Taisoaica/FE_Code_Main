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
import { AppointmentViewModelFetch, fetchClinicStaff, getDentistInfo } from "../../../../utils/api/ClinicOwnerUtils";
import { getClinicAppointments, AppointmentViewModel, getAllClinicSlots } from "../../../../utils/api/ClinicOwnerUtils";
import { ClinicSlotInfoModel } from "../../../../utils/interfaces/ClinicRegister/Clinic";
import { Button } from "reactstrap";
import { DentistInfoViewModel } from "../../../../utils/api/BookingRegister";
import { slots } from "../../data";
import { MenuItem, Select } from "@mui/material";

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
  const [currentPage, setCurrentPage] = useState(1);
  const [appointmentsPerPage] = useState(5);
  const [sortBy, setSortBy] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [customers, setCustomers] = useState<string[]>([]);
  const [dentists, setDentists] = useState<string[]>([]);
  const [customerFilter, setCustomerFilter] = useState('Tất cả');
  const [dentistFilter, setDentistFilter] = useState('Tất cả');
  const [dateFilter, setDateFilter] = useState<'all' | 'thisWeek' | 'nextWeek' | 'nextMonth'>('all');
  const [appointmentsWithTimes, setAppointmentsWithTimes] = useState<AppointmentViewModel[]>([]);
  const [originalAppointments, setOriginalAppointments] = useState<AppointmentViewModel[]>([]);
  const [clinicSlots, setClinicSlots] = useState<ClinicSlotInfoModel[][]>([]);
  const [noAppointmentsMessage, setNoAppointmentsMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const handleSortChange = (event) => {
    const newSortBy = event.target.value as string;
    setSortBy(newSortBy);

    if (newSortBy === 'all') {
      setAppointmentsWithTimes([...appointmentsWithTimes]);
    } else {
      const sortedAppointments = [...appointmentsWithTimes].sort((a, b) => {
        if (newSortBy === 'date') {
          return new Date(a.appointmentDate).getTime() - new Date(b.appointmentDate).getTime();
        } else if (newSortBy === 'status') {
          return a.bookingStatus.localeCompare(b.bookingStatus);
        }
        return 0;
      });
      setAppointmentsWithTimes(sortedAppointments);
    }
  };

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


  const getStatusText = (status: string) => {
    switch (status) {
      case 'booked':
        return 'Đã đặt lịch';
      case 'pending':
        return 'Đang chờ xác nhận';
      case 'finished':
        return 'Đã hoàn thành';
      default:
        return status;
    }
  }

  const getStatusClassName = (status: string) => {
    switch (status) {
      case 'pending':
        return styles.statusPending;
      case 'booked':
        return styles.statusBooked;
      case 'finished':
        return styles.statusFinished;
      case 'canceled':
        return styles.statusCanceled;
      case 'no show':
        return styles.statusNoShow;
      default:
        return '';
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dentistInfo = await getDentistInfo();
        const clinicId = dentistInfo.content.clinicId;

        const fetchedSlots = await getAllClinicSlots(clinicId);
        setClinicSlots(fetchedSlots);

        const fetchedAppointments = await getClinicAppointments(
          clinicId,
        );

        const appointmentsWithSlotTimes = fetchedAppointments.map(appointment => {
          const matchingSlot = fetchedSlots.flat().find(slot => slot.clinicSlotId === appointment.clinicSlotId);
          return {
            ...appointment,
            slotStartTime: matchingSlot?.startTime,
            slotEndTime: matchingSlot?.endTime
          };
        });

        const uniqueCustomers = Array.from(new Set(appointmentsWithSlotTimes.map(a => a.customerFullName)));
        const uniqueDentists = Array.from(new Set(appointmentsWithSlotTimes.map(a => a.dentistFullname)));

        setCustomers(['Tất cả', ...uniqueCustomers]);
        setDentists(['Tất cả', ...uniqueDentists]);

        setOriginalAppointments(appointmentsWithSlotTimes);
        setAppointmentsWithTimes(appointmentsWithSlotTimes);

      } catch (error) {
        setError('Failed to fetch data.');
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    let filteredAppointments = originalAppointments.filter(appointment => {
      const appointmentDate = new Date(appointment.appointmentDate);
      const now = new Date();

      switch (dateFilter) {
        case 'thisWeek':
          const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
          const endOfWeek = new Date(startOfWeek);
          endOfWeek.setDate(startOfWeek.getDate() + 6);
          return appointmentDate >= startOfWeek && appointmentDate <= endOfWeek;
        case 'nextWeek':
          const startOfNextWeek = new Date(now.setDate(now.getDate() - now.getDay() + 7));
          const endOfNextWeek = new Date(startOfNextWeek);
          endOfNextWeek.setDate(startOfNextWeek.getDate() + 6);
          return appointmentDate >= startOfNextWeek && appointmentDate <= endOfNextWeek;
        case 'nextMonth':
          const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
          const endOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 2, 0);
          return appointmentDate >= startOfNextMonth && appointmentDate <= endOfNextMonth;
        case 'all':
        default:
          return true;
      }
    });

    filteredAppointments = filteredAppointments.filter(appointment => {
      const matchesCustomer = customerFilter === 'Tất cả' || appointment.customerFullName === customerFilter;
      const matchesDentist = dentistFilter === 'Tất cả' || appointment.dentistFullname === dentistFilter;
      return matchesCustomer && matchesDentist;
    });

    filteredAppointments = filteredAppointments.sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(a.appointmentDate).getTime() - new Date(b.appointmentDate).getTime();
      } else if (sortBy === 'status') {
        return a.bookingStatus.localeCompare(b.bookingStatus);
      }
      return 0;
    });

    if (filteredAppointments.length === 0) {
      setNoAppointmentsMessage('Không có lịch hẹn cho thời gian đã chọn.');
    } else {
      setNoAppointmentsMessage(null);
    }

    setAppointmentsWithTimes(filteredAppointments);
  }, [dateFilter, customerFilter, dentistFilter, sortBy, originalAppointments]);

  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const filteredAppointments = appointmentsWithTimes.filter(appointment => {
    const matchesCustomer = customerFilter === 'Tất cả' || appointment.customerFullName === customerFilter;
    const matchesDentist = dentistFilter === 'Tất cả' || appointment.dentistFullname === dentistFilter;
    return matchesCustomer && matchesDentist;
  });


  const indexOfLastAppointment = currentPage * appointmentsPerPage;
  const indexOfFirstAppointment = indexOfLastAppointment - appointmentsPerPage;
  const currentAppointments = filteredAppointments.slice(indexOfFirstAppointment, indexOfLastAppointment);

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
          marginTop: 5.5,
          minHeight: "100vh",
          overflow: 'auto',
        }}
      >
        <Box className={styles.mainContainer}>
          <div className={styles.tableContainer}>
            <h1 className={styles.tableHeader}>Danh sách lịch hẹn</h1>
            {loading && <div>Loading...</div>}
            {error && <div>{error}</div>}
            <div className={styles.filterSortContainer}>
              <div className={styles.sortContainer}>
                <Typography component="h2" variant="h6">
                  Sắp xếp theo:
                </Typography>
                <Select value={sortBy} onChange={handleSortChange}>
                  <MenuItem value="all">Tất cả</MenuItem>
                  <MenuItem value="date">Ngày</MenuItem>
                  <MenuItem value="status">Trạng thái</MenuItem>
                </Select>
              </div>
              <div className={styles.filterContainerDentist}>
                <Typography component="h2" variant="h6">
                  Lọc theo nha sĩ:
                </Typography>
                <Select value={dentistFilter} onChange={(e) => setDentistFilter(e.target.value)}>
                  {dentists.map(dentist => (
                    <MenuItem key={dentist} value={dentist === 'Tất cả' ? 'Tất cả' : dentist}>
                      {dentist}
                    </MenuItem>
                  ))}
                </Select>
              </div>
              <div className={styles.filterContainerCustomer}>
                <Typography component="h2" variant="h6">
                  Lọc theo bệnh nhân:
                </Typography>
                <Select value={customerFilter} onChange={(e) => setCustomerFilter(e.target.value)}>
                  {customers.map(customer => (
                    <MenuItem key={customer} value={customer === 'Tất cả' ? 'Tất cả' : customer}>
                      {customer}
                    </MenuItem>
                  ))}
                </Select>
              </div>
              <div className={styles.filterContainerDate}>
                <Typography component="h2" variant="h6">
                  Lọc theo ngày:
                </Typography>
                <Select value={dateFilter} onChange={(e) => setDateFilter(e.target.value)}>
                  <MenuItem value="all">Tất cả</MenuItem>
                  <MenuItem value="thisWeek">Tuần này</MenuItem>
                  <MenuItem value="nextWeek">Tuần sau</MenuItem>
                  <MenuItem value="nextMonth">Tháng sau</MenuItem>
                </Select>
              </div>
            </div>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Khách hàng</th>
                  <th>Bác sĩ</th>
                  <th>Ngày hẹn</th>
                  <th>Slot</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {currentAppointments && currentAppointments.length > 0 ? (
                  currentAppointments.map((appointment: AppointmentViewModel, index) => (
                    <tr key={appointment.id} className={styles.tableRow}>
                      <td>{(currentPage - 1) * appointmentsPerPage + index + 1}</td>
                      <td>{appointment.customerFullName}</td>
                      <td>{appointment.dentistFullname}</td>
                      <td>{formatDate(appointment.appointmentDate)}</td>
                      <td>{formatTime(appointment.appointmentTime)} - {formatTime(appointment.expectedEndTime)}</td>
                      <td>
                        <Button className={getStatusClassName(appointment.bookingStatus)}>
                          {getStatusText(appointment.bookingStatus)}
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className={styles.noAppointmentsMessage}>
                      {noAppointmentsMessage}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <Pagination
              appointmentsPerPage={appointmentsPerPage}
              totalAppointments={filteredAppointments.length}
              paginate={setCurrentPage}
              currentPage={currentPage}
            />
          </div>
          {/* {loading ? <p>Loading....</p> : <Scheduler openHour={clinicOpenHour} closeHour={clinicCloseHour} availableStaff={staff} />} */}
        </Box>

      </Box>
      <BookingDialog isOpen={isDialogOpen} onClose={handleCloseDialog} booking={selectedBooking} />
    </Box>
  );
}

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
            <a onClick={() => paginate(number)} href="#!">
              {number}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
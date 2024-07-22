import { styled } from "@mui/material/styles";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import styles from "./DentistDashboard.module.css";
import './SliderDentist.css';
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

const DentistDashboard = () => {
  const [open, setOpen] = useState(true);
  const [appointments, setAppointments] = useState<AppointmentViewModel[]>([]);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [currentPage, setCurrentPage] = useState(1);
  const [appointmentsPerPage] = useState(5);

  const sliderSettings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
        }
      }
    ],
    arrows: appointments.length > 3
  };

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    return `${hours}:${minutes}`;
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Chờ xác nhận';
      case 'booked':
        return 'Đã xác nhận';
      case 'completed':
        return 'Đã hoàn thành';
      case 'canceled':
        return 'Đã hủy';
      case 'finished':
        return 'Đã hoàn thành';
      case 'no show':
        return 'Không đến';
      default:
        return status;
    }
  };

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

  const getTitle = (filter) => {
    switch (filter) {
      case 'this_week':
        return 'Dưới đây là lịch khám của bạn tuần này';
      case 'next_week':
        return 'Dưới đây là lịch khám của bạn tuần tới';
      case 'next_month':
        return 'Dưới đây là lịch khám của bạn tháng tới';
      default:
        return 'Dưới đây là tất cả lịch khám của bạn';
    }
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

  useEffect(() => {
    fetchAppointments();
  }, [filter, sortBy]);

  // const fetchAppointments = async () => {
  //   try {
  //     let fetchedAppointments;
  //     if (filter === "all") {
  //       fetchedAppointments = await getAllDentistAppointments();
  //     } else {
  //       fetchedAppointments = await getDentistAppointmentsWithFilter(filter);
  //     }

  //     const formattedAppointments = fetchedAppointments.map(appointment => ({
  //       ...appointment,
  //       appointmentDateObj: new Date(appointment.appointmentDate),
  //     }));

  //     if (sortBy === "date") {
  //       formattedAppointments.sort((a, b) => a.appointmentDateObj - b.appointmentDateObj);
  //     } else if (sortBy === "time") {
  //       formattedAppointments.sort((a, b) => {
  //         const dateComparison = a.appointmentDateObj - b.appointmentDateObj;
  //         return dateComparison !== 0
  //           ? dateComparison
  //           : new Date(a.appointmentTime).getTime() - new Date(b.appointmentTime).getTime();
  //       });
  //     } else if (sortBy === "status") {
  //       const statusOrder = {
  //         pending: 1,
  //         booked: 2,
  //         completed: 3,
  //         canceled: 4,
  //         // "no show": 5,
  //       };
  //       formattedAppointments.sort((a, b) => statusOrder[a.bookingStatus] - statusOrder[b.bookingStatus]);
  //     }

  //     setAppointments(formattedAppointments);
  //   } catch (error) {
  //     console.error("Error fetching appointments:", error);
  //   }
  // };

  const fetchAppointments = async () => {
    try {
      let fetchedAppointments;
      if (filter === "all" || filter === "status") {
        fetchedAppointments = await getAllDentistAppointments();
      } else {
        fetchedAppointments = await getDentistAppointmentsWithFilter(filter);
      }

      const formattedAppointments = fetchedAppointments.map(appointment => ({
        ...appointment,
        appointmentDateObj: new Date(appointment.appointmentDate),
      }));

      if (sortBy === "date") {
        formattedAppointments.sort((a, b) => a.appointmentDateObj - b.appointmentDateObj);
      } else if (sortBy === "time") {
        formattedAppointments.sort((a, b) => {
          const dateComparison = a.appointmentDateObj - b.appointmentDateObj;
          return dateComparison !== 0
            ? dateComparison
            : new Date(a.appointmentTime).getTime() - new Date(b.appointmentTime).getTime();
        });
      }

      if (filter === "status") {
        const statusOrder = {
          pending: 1,
          booked: 2,
          completed: 3,
          canceled: 4,
          // "no show": 5,
        };
        formattedAppointments.sort((a, b) => statusOrder[a.bookingStatus] - statusOrder[b.bookingStatus]);
      }

      setAppointments(formattedAppointments);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  const getNoAppointmentMessage = (filter) => {
    switch (filter) {
      case 'this_week':
        return 'Không có lịch hẹn cho tuần này';
      case 'next_week':
        return 'Không có lịch hẹn cho tuần tới';
      case 'next_month':
        return 'Không có lịch hẹn cho tháng tới';
      default:
        return 'Không có lịch hẹn';
    }
  };

  const formatDateToDDMMYYYY = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const navigate = useNavigate();

  const handleRowClick = (appointmentId) => {
    navigate(`/dentist/${appointmentId}`);
  };

  const handleViewDetailsClick = (appointmentId) => {
    navigate(`/dentist/${appointmentId}`);
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
            Trang chủ
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
        <div className={styles.mainContainer}>
          <div className={styles.greeting}>
            <h1>Xin chào</h1>
            <div>
              Chào mừng bạn trở lại! {getTitle(filter)}
            </div>
          </div>
          <div className={styles.sliderContainer}>
            <div className={styles.sliderTitle}>
              Lịch hẹn sắp tới
            </div>
            {appointments.length > 0 ? (
              <Slider {...sliderSettings} className={styles.sliderDentist}>
                {appointments.map((appointment) => (
                  <div key={appointment.bookId}>
                    <Card className={styles.appointmentCard}>
                      <CardContent className={styles.cardContent}>
                        <Typography variant="h6" className={styles.cardTitle}>
                          <strong><b>Tên khách hàng: </b></strong> {appointment.customerFullName}
                        </Typography>
                        <Typography className={styles.cardInfo}>
                          <strong><b>Ngày hẹn: </b></strong>{formatDateToDDMMYYYY(appointment.appointmentDate)}
                        </Typography>
                        <Typography className={styles.cardInfo}>
                          <strong><b>Giờ hẹn: </b></strong>{`${formatTime(appointment.appointmentTime)} - ${formatTime(appointment.expectedEndTime)}`}
                        </Typography>
                        <Typography className={styles.cardInfo}>
                          <strong><b>Dịch vụ: </b></strong>{appointment.selectedServiceName}
                        </Typography>
                        <Button
                          variant="contained"
                          className={styles.viewButton}
                          onClick={() => handleViewDetailsClick(appointment.bookId)}
                        >
                          Xem chi tiết
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </Slider>
            ) : (
              <Typography>Không có lịch hẹn</Typography>
            )}
          </div>
          <Divider sx={{
            margin: '20px auto',
            width: '90%',
            borderBottomWidth: 2,
            backgroundColor: 'black'
          }} />
          <div className={styles.tableContainer}>
            <div className={styles.tableHeader}>
              <h1>Danh sách lịch hẹn</h1>
            </div>
            <div className={styles.filterSortContainer}>
              <div className={styles.filterContainer}>
                <Typography component="h2" variant="h6">
                  Lọc theo:
                </Typography>
                <Select value={filter} onChange={handleFilterChange}>
                  <MenuItem value="all">Tất cả</MenuItem>
                  <MenuItem value="this_week">Tuần này</MenuItem>
                  <MenuItem value="next_week">Tuần tới</MenuItem>
                  <MenuItem value="next_month">Tháng tới</MenuItem>
                  {/* <MenuItem value="status">Trạng thái</MenuItem> */}
                </Select>
              </div>
              {/* <div className={styles.sortContainer}>
                <Typography component="h2" variant="h6">
                  Sắp xếp theo:
                </Typography>
                <Select value={sortBy} onChange={handleSortChange}>
                  <MenuItem value="date">Ngày</MenuItem>
                  <MenuItem value="time">Giờ</MenuItem>
                  <MenuItem value="status">Trạng thái</MenuItem>
                </Select>
              </div> */}
            </div>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th style={{ width: '10%' }}>Ngày</th>
                  <th style={{ width: '15%' }}>Slot</th>
                  <th style={{ width: '25%' }}>Tên khách hàng</th>
                  <th style={{ width: '30%' }}>Dịch vụ</th>
                  <th style={{ width: '20%' }}>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {currentAppointments && currentAppointments.length > 0 ? (
                  currentAppointments.map((appointment) => (
                    <tr
                      key={appointment.bookId}
                      className={styles.tableRow}
                      onClick={() => handleRowClick(appointment.bookId)}
                      style={{ cursor: 'pointer' }}
                    >
                      <td>{formatDateToDDMMYYYY(appointment.appointmentDate)}</td>
                      <td>{formatTime(appointment.appointmentTime)} - {formatTime(appointment.expectedEndTime)}</td>
                      <td>{appointment.customerFullName}</td>
                      <td>{appointment.selectedServiceName}</td>
                      <td>
                        {/* {getStatusText(appointment.bookingStatus)} */}
                        <Button className={getStatusClassName(appointment.bookingStatus)}>
                          {getStatusText(appointment.bookingStatus)}
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center' }}>
                      {getNoAppointmentMessage(filter)}
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
          </div>
        </div>
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
            <a onClick={() => paginate(number)} href="#!">
              {number}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default DentistDashboard;

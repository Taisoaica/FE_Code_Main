import { styled } from "@mui/material/styles";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { Bar, Pie, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, Chart } from 'chart.js';
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);
import 'chart.js/auto';

import styles from "./Dashboard.module.css";

import {
  Box,
} from "@mui/material";

import { useEffect, useRef, useState } from "react";
import { NestedListItems } from "../components/NestedListMenu";
import { DentistInfoViewModel } from "../../../../utils/api/BookingRegister";
import { AppointmentViewModelFetch, fetchDentistInfo, getClinicAppointments } from "../../../../utils/api/ClinicOwnerUtils";

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
  const [fullname, setFullname] = useState('');
  const [loading, setLoading] = useState(true);
  const [staff, setStaff] = useState<DentistInfoViewModel[]>();
  const [appointments, setAppointments] = useState<AppointmentViewModelFetch[]>([]);
  const barChartRef = useRef<HTMLCanvasElement>(null);
  const pieChartRef = useRef<HTMLCanvasElement>(null);
  const lineChartRef = useRef<HTMLCanvasElement>(null);

  const barChartInstance = useRef<Chart | null>(null);
  const pieChartInstance = useRef<Chart | null>(null);
  const lineChartInstance = useRef<Chart | null>(null);

  const daysOfWeek = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
  const appointmentCounts = daysOfWeek.map((day, index) => {
    return appointments.filter(appt => new Date(appt.appointmentDate).getDay() === index).length;
  });
  const barData = {
    labels: daysOfWeek,
    datasets: [
      {
        label: 'Số lịch hẹn',
        data: appointmentCounts,
        backgroundColor: '#3f51b5',
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        callbacks: {
          label: (context) => `Số lịch hẹn: ${context.raw}`,
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Ngày trong tuần',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Số lượng lịch hẹn',
        },
        beginAtZero: true,
      },
    },
  };

  const pieData = {
    labels: ['Đã hoàn thành', 'Đã hủy', 'Đang chờ xác nhận', 'Đã đặt lịch', 'Không tới'],
    datasets: [
      {
        data: [
          appointments.filter(appt => appt.bookingStatus === "finished").length,
          appointments.filter(appt => appt.bookingStatus === "cancelled").length,
          appointments.filter(appt => appt.bookingStatus === "pending").length,
          appointments.filter(appt => appt.bookingStatus === "booked").length,
          appointments.filter(appt => appt.bookingStatus === "no_show").length,
        ],
        backgroundColor: ['#5cb85c', '#d9534f', '#f0ad4e', '#007bff', '#777'],
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.label}: ${context.raw}`,
        },
      },
    },
  };

  const lineData = {
    labels: daysOfWeek,
    datasets: [
      {
        label: 'Doanh thu',
        data: appointmentCounts.map((count, index) => appointments
          .filter(appt => new Date(appt.appointmentDate).getDay() === index)
          .reduce((sum, appt) => sum + appt.finalFee, 0)
        ),
        fill: false,
        borderColor: '#007bff',
        tension: 0.1,
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        callbacks: {
          label: (context) => `Doanh thu: ${context.raw.toLocaleString()} VND`,
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Ngày trong tuần',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Doanh thu (VND)',
        },
        beginAtZero: true,
      },
    },
  };

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const getAppointmentsThisWeek = (appts) => {
    const today = new Date();
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
    const endOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 6));

    return appts.filter(appt => {
      const appointmentDate = new Date(appt.appointmentDate);
      return appointmentDate >= startOfWeek && appointmentDate <= endOfWeek;
    }).length;
  };

  const getUpcomingAppointments = (appts: AppointmentViewModelFetch[], days = 30) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const futureDate = new Date(today);
    futureDate.setDate(futureDate.getDate() + days);
    futureDate.setHours(23, 59, 59, 999);

    const upcomingAppointments = appts.filter(appt => {
      const appointmentDate = new Date(appt.appointmentDate);
      appointmentDate.setHours(0, 0, 0, 0);

      return appointmentDate >= today && appointmentDate <= futureDate;
    });

    return upcomingAppointments.length;
  };

  const getAppointmentStatus = (appts) => {
    const finished = appts.filter(appt => appt.bookingStatus === "finished").length;
    const cancelled = appts.filter(appt => appt.bookingStatus === "cancelled").length;
    const pending = appts.filter(appt => appt.bookingStatus === "pending").length;
    const booked = appts.filter(appt => appt.bookingStatus === "booked").length;
    return { finished, cancelled, pending, booked };
  };

  const getMonthlyRevenue = (appts) => {
    const currentMonth = new Date().getMonth();
    return appts
      .filter(appt => new Date(appt.appointmentDate).getMonth() === currentMonth)
      .reduce((sum, appt) => sum + appt.finalFee, 0);
  };

  const getAverageRevenuePerAppointment = (appts) => {
    const totalRevenue = appts.reduce((sum, appt) => sum + appt.finalFee, 0);
    return appts.length > 0 ? totalRevenue / appts.length : 0;
  };

  const getNewPatients = (appts) => {
    const uniquePatients = new Set(appts.map(appt => appt.customerId));
    return uniquePatients.size;
  };

  // const getTopDentist = (appts) => {
  //   const dentistAppointments = appts.reduce((acc, appt) => {
  //     acc[appt.dentistFullname] = (acc[appt.dentistFullname] || 0) + 1;
  //     return acc;
  //   }, {});
  //   return Object.entries(dentistAppointments).sort((a, b) => b[1] - a[1])[0][0];
  // };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dentistInfo = await fetchDentistInfo();
        console.log(dentistInfo)
        setFullname(dentistInfo.content.fullname);

        const clinicId = dentistInfo.content.clinicId.toString();
        const appointments = await getClinicAppointments(clinicId);

        setAppointments(appointments);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching clinics or user details:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (barChartRef.current) {
      if (barChartInstance.current) {
        barChartInstance.current.destroy();
      }
      barChartInstance.current = new Chart(barChartRef.current, {
        type: 'bar',
        data: barData,
        options: barOptions,
      });
    }

    if (pieChartRef.current) {
      if (pieChartInstance.current) {
        pieChartInstance.current.destroy();
      }
      pieChartInstance.current = new Chart(pieChartRef.current, {
        type: 'pie',
        data: pieData,
        options: pieOptions,
      });
    }

    if (lineChartRef.current) {
      if (lineChartInstance.current) {
        lineChartInstance.current.destroy();
      }
      lineChartInstance.current = new Chart(lineChartRef.current, {
        type: 'line',
        data: lineData,
        options: lineOptions,
      });
    }

    return () => {
      if (barChartInstance.current) {
        barChartInstance.current.destroy();
      }
      if (pieChartInstance.current) {
        pieChartInstance.current.destroy();
      }
      if (lineChartInstance.current) {
        lineChartInstance.current.destroy();
      }
    };
  }, [appointments]);

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
            <div className={styles.container}>
              <div className={styles.thirdFourthWidth}>
                <a
                  href="/admin/clinic-owner/appointment"
                  className={styles.chartLink}
                  title="Ấn để xem thông tin chi tiết"
                >
                  <div className={styles.chart}>
                    <div className={styles.chartTitle}>Số lịch hẹn tuần này</div>
                    <canvas ref={barChartRef} />
                  </div>
                </a>
              </div>

              <div className={styles.oneFourthWidth}>
                <div className={styles.halfWidth}>
                  <div className={styles.metricBox}>
                    <div className={styles.title}><strong>Lịch hẹn sắp tới (30 ngày)</strong></div>
                    <div className={styles.content}>{getUpcomingAppointments(appointments)} lịch hẹn</div>
                  </div>
                  <div className={styles.metricBox}>
                    <div className={styles.title}><strong>Lịch hẹn tuần này</strong></div>
                    <div className={styles.content}>{getAppointmentsThisWeek(appointments)} lịch hẹn</div>
                  </div>
                </div>
              </div>

              <div className={styles.fullWidth}>
                <div>
                  <div className={styles.metricBox}>
                    <div className={styles.title}><strong>Tài chính</strong></div>
                    <div className={styles.smallContent}>
                      <strong>Doanh thu tháng này: </strong> {getMonthlyRevenue(appointments).toLocaleString()} VND<br />
                      <strong>Doanh thu trung bình/lịch hẹn: </strong> {getAverageRevenuePerAppointment(appointments).toLocaleString()} VND
                    </div>
                  </div>
                  <div className={`${styles.chart} ${styles.lineChart}`}>
                    <div className={styles.chartTitle}>Doanh thu tuần này</div>
                    <canvas ref={lineChartRef} />
                  </div>
                </div>

                <div>
                  <div className={styles.metricBox}>
                    <div className={styles.title}><strong>Trạng thái lịch hẹn</strong></div>
                    <div className={styles.smallContent}>
                      <strong>Hoàn thành: </strong>{getAppointmentStatus(appointments).finished} lịch hẹn<br />
                      <strong>Đã đặt: </strong>{getAppointmentStatus(appointments).booked} lịch hẹn<br />
                      <strong>Đã hủy: </strong> {getAppointmentStatus(appointments).cancelled} lịch hẹn<br />
                      <strong>Đang chờ xác nhận: </strong>{getAppointmentStatus(appointments).pending} lịch hẹn
                    </div>
                  </div>
                  <a
                    href="/admin/clinic-owner/appointment"
                    className={styles.chartLink}
                    title="Ấn để xem thông tin chi tiết"
                  >
                    <div className={styles.chart}>
                      <div className={styles.chartTitle}>Tỉ lệ trạng thái lịch hẹn</div>
                      <canvas ref={pieChartRef} />
                    </div>
                  </a>
                </div>
              </div>

            </div>

          </div>
        </div>
      </Box>
    </Box>
  );
};

export default Dashboard;

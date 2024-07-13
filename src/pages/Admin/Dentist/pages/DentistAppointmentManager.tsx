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
import styles from "./DentistAppointmentManager.module.css";

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
} from "reactstrap";

import './CalendarFour.css';
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin, { DateClickArg } from "@fullcalendar/interaction";
import { useEffect, useRef, useState } from "react";
import viLocale from '@fullcalendar/core/locales/vi';
import { EventClickArg } from "@fullcalendar/core/index.js";
import { AppointmentViewModel } from "../../../../utils/api/ClinicOwnerUtils";

interface AppointmentRegistrationModel {
  timeSlotId: number;
  appointmentType: string;
  appointmentDate: Date;
  customerId: number;
  dentistId: number;
  clinicId: number;
  serviceId?: string | null;
  maxRecurring: number;
  originalAppointment?: number | null;
  recurrenceInterval?: 'daily' | 'weekly' | 'monthly' | null;
  recurrenceEnd?: string | null;
  status: string;
}

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

const DentistAppointmentManager = () => {
  const [open, setOpen] = useState(true);
  const toggleDrawer = () => {
    setOpen(!open);
  };

  const [modalOpen, setModalOpen] = useState(false);
  const [appointment, setAppointment] = useState<AppointmentViewModel[]>();
  // const [appointment, setAppointment] = useState<AppointmentRegistrationModel[]>(sampleEvents);
  const [selectedEvent, setSelectedEvent] = useState<AppointmentRegistrationModel | null>(null);
  const [repetitionInterval, setRepetitionInterval] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [recurringCount, setRecurringCount] = useState<number>(1);

  useEffect(() => {
    console.log(appointment);
  }, [appointment])

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };

  const handleEventClick = (clickInfo: EventClickArg) => {
    const clickedEvent = clickInfo.event.extendedProps as AppointmentRegistrationModel;
    setSelectedEvent(clickedEvent);
    toggleModal();
  };

  const calendarRef = useRef<FullCalendar>(null);

  function formatDateTitle(dateInfo: { start: Date }): string {
    const startDate = dateInfo.start;
    const weekRange = getWeekRange(startDate, 'vi-VN');

    const formatter = new Intl.DateTimeFormat("vi-VN", {
      month: "long",
      year: "numeric",
    });

    if (weekRange[0].getMonth() === weekRange[1].getMonth()) {
      // Same month
      const monthYear = formatter.format(startDate).replace("tháng", "Tháng");
      return `${weekRange[0].getDate()} – ${weekRange[1].getDate()} ${monthYear}`;
    } else {
      // Different months
      const startMonthYear = formatter.format(weekRange[0]).replace("tháng", "Tháng");
      const endMonthYear = formatter.format(weekRange[1]).replace("tháng", "Tháng");

      // Only include the year in the first part if it's different from the current year
      const currentYear = new Date().getFullYear();
      const includeYearInStart = weekRange[0].getFullYear() !== currentYear;

      return `${weekRange[0].getDate()} ${includeYearInStart ? startMonthYear : startMonthYear.split(' ')[0]} - ${weekRange[1].getDate()} ${endMonthYear}`;
    }
  }

  function getWeekRange(date: Date, locale: string): [Date, Date] {
    const day = date.getDay();
    const diff = date.getDate() - day;

    const startOfWeek = new Date(date.setDate(diff));
    const endOfWeek = new Date(date.setDate(diff + 6));

    return [startOfWeek, endOfWeek];
  }

  // const handleRepeatAppointment = () => {
  //   try {
  //     if (!selectedEvent || !repetitionInterval || recurringCount <= 0) {
  //       return; // Exit early if essential data is missing or invalid
  //     }

  //     const recurrenceDates: AppointmentRegistrationModel[] = [];
  //     const originalDate = new Date(selectedEvent.appointmentDate);

  //     for (let i = 1; i <= recurringCount; i++) {
  //       const currentDate = new Date(originalDate);

  //       // Adjust the current date based on the repetition interval
  //       if (repetitionInterval === 'weekly') {
  //         currentDate.setDate(originalDate.getDate() + 7 * i); // Move to next week
  //       } else if (repetitionInterval === 'daily') {
  //         console.log(currentDate)
  //         currentDate.setDate(originalDate.getDate() + i); // Move to next day
  //       } else if (repetitionInterval === 'monthly') {
  //         currentDate.setMonth(originalDate.getMonth() + i); // Move to next month

  //         // Ensure the time slot is valid for the new month's day
  //         const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  //         if (originalDate.getDate() > daysInMonth) {
  //           currentDate.setDate(daysInMonth);
  //         }
  //       }

  //       // Create a new appointment with the adjusted date and time slot ID
  //       const newTimeSlotId = calculateSlotId(currentDate); // Assume calculateSlotId is defined

  //       const newAppointment: AppointmentRegistrationModel = {
  //         ...selectedEvent,
  //         originalAppointment: selectedEvent.timeSlotId,
  //         appointmentDate: currentDate, // Convert to ISO string if necessary
  //         timeSlotId: newTimeSlotId,
  //         recurrenceInterval: repetitionInterval,
  //       };

  //       recurrenceDates.push(newAppointment);
  //     }

  //     setAppointment([...appointment, ...recurrenceDates]);
  //     toggleModal();
  //   } catch (error) {
  //     console.error('Error while handling repeat appointment:', error);
  //   }
  // };


  const calculateSlotId = (startTime: Date): number => {
    const hours = startTime.getHours();
    const minutes = startTime.getMinutes();

    const slotId = (hours * 2) + (minutes >= 30 ? 1 : 0) + 1;

    return slotId;
  };

  const slotLabelContent = (info: any) => {
    const start = info.date;
    const end = new Date(start);
    end.setMinutes(end.getMinutes() + 30);

    const startStr = start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    const endStr = end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

    return `${startStr} - ${endStr}`;
  };

  // const mapAppointmentToEvent = (appointment: AppointmentRegistrationModel) => {
  //   return {
  //     id: appointment.timeSlotId.toString(),
  //     title: appointment.appointmentType,
  //     start: appointment.appointmentDate,
  //     end: new Date(new Date(appointment.appointmentDate).getTime() + 30 * 60000),
  //     extendedProps: { ...appointment },
  //     classNames: [appointment.status === 'booked' ? 'event-status-booked' : 'event-status-available'],
  //   };
  // };

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
            Trang xem lịch hẹn
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
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === "light"
              ? theme.palette.grey[100]
              : theme.palette.grey[900],
          flexGrow: 1,
          marginTop: 5.5,
          color: '#0d47a1',
          background: 'linear-gradient(to left, #e3f2fd, #f8fbff)',
          overflow: 'auto',
        }}
      >
        <div className={styles.mainContainer}>
          <div className={styles.main}>
            <div className={styles.mainContainer}>
              <div className={styles.main}>
                <div className={styles.content}>
                  <div className={styles.rowContainer}>
                    <div className={styles.fullColumn}>
                      <div className="calendar-four">
                        <FullCalendar
                          contentHeight="auto"
                          locale={viLocale}
                          ref={calendarRef}
                          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                          headerToolbar={{
                            left: "prev,next",
                            center: "title",
                            right: "today,dayGridMonth,timeGridWeek,timeGridDay"
                          }}
                          buttonText={{
                            today: "Hôm nay",
                            month: "Xem theo tháng",
                            week: "Xem theo tuần",
                            day: "Xem theo ngày",
                          }}
                          initialView="timeGridWeek"
                          editable={false}
                          // events={appointment.map(mapAppointmentToEvent)}
                          selectable={false}
                          nowIndicator={true}
                          selectMirror={true}
                          dayMaxEvents={true}
                          duration={{ days: 7 }}
                          droppable={false}
                          slotDuration={'00:30:00'}
                          slotLabelInterval={'00:30:00'}
                          slotMinTime={'06:00:00'}
                          slotMaxTime={'21:00:00'}
                          slotLabelContent={slotLabelContent}
                          eventClick={handleEventClick}
                          firstDay={0}
                        />
                      </div>
                      <Modal isOpen={modalOpen} toggle={toggleModal} centered>
                        <ModalHeader toggle={toggleModal}>Appointment Details</ModalHeader>
                        <ModalBody>
                          {selectedEvent && (
                            <>
                              <p><strong>Bệnh nhân:</strong> {selectedEvent.customerId}</p>
                              <p><strong>Hình thức:</strong> {selectedEvent.appointmentType}</p>
                              <p><strong>Dịch vụ:</strong> {selectedEvent.serviceId}</p>
                              <p><strong>Ngày:</strong> {selectedEvent.appointmentDate.toDateString()}</p>
                              <p><strong>Trạng thái:</strong> {selectedEvent.status}</p>
                              <Label for="recurringCount">Số lần lặp:</Label>
                              <Input
                                type="number"
                                name="recurringCount"
                                id="recurringCount"
                                value={recurringCount}
                                min={0}
                                onChange={(e) => setRecurringCount(parseInt(e.target.value))}
                              />
                              <FormGroup>
                                <Label for="repetitionInterval">Chọn số lần lặp:</Label>
                                <Input
                                  type="select"
                                  name="repetitionInterval"
                                  id="repetitionInterval"
                                  onChange={(e) => setRepetitionInterval(e.target.value as 'daily' | 'weekly' | 'monthly')}
                                >
                                  <option value="daily">Hằng ngày</option>
                                  <option value="weekly">Hằng tuần</option>
                                  <option value="monthly">Hằng tháng</option>
                                </Input>
                              </FormGroup>
                              <Button color="primary" onClick={handleRepeatAppointment}>Đặt lịch khám định kì</Button>
                            </>
                          )}
                        </ModalBody>
                        <ModalFooter>
                        </ModalFooter>
                      </Modal>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Box>
    </Box>
  );
};

export default DentistAppointmentManager;
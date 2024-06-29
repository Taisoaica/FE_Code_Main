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
const sampleEvents: AppointmentRegistrationModel[] = [
  {
    timeSlotId: 1,
    appointmentType: 'Khám',
    appointmentDate: new Date('2024-06-30T09:00:00'),
    customerId: 0,
    dentistId: 0,
    clinicId: 0,
    serviceId: null,
    maxRecurring: 0,
    originalAppointment: null,
    status: 'Đang chờ xác nhận',
  },
  {
    timeSlotId: 2,
    appointmentType: 'Khám',
    appointmentDate: new Date('2024-07-07T09:30:00'),
    customerId: 0,
    dentistId: 0,
    clinicId: 0,
    serviceId: null,
    maxRecurring: 0,
    originalAppointment: null,
    status: 'Đang chờ xác nhận',
  },
  // Include other events similarly...
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

const DentistAppointmentManager = () => {
  const [open, setOpen] = useState(true);
  const toggleDrawer = () => {
    setOpen(!open);
  };

  const [modalOpen, setModalOpen] = useState(false);
  const [appointment, setAppointment] = useState<AppointmentRegistrationModel[]>(sampleEvents);
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

  // const calendarApi = calendarRef.current?.getApi();
  // const updateTitle = (dateInfo: { start: Date }) => {
  //   const titleElement = document.querySelector('.fc-toolbar-title');
  //   if (titleElement) {
  //     titleElement.textContent = formatDateTitle(dateInfo);
  //   }
  // };

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
  const handleRepeatAppointment = () => {
    try {
      if (!selectedEvent || !repetitionInterval || recurringCount <= 0) {
        return; // Exit early if essential data is missing or invalid
      }

      const recurrenceDates: AppointmentRegistrationModel[] = [];
      const originalDate = new Date(selectedEvent.appointmentDate);

      for (let i = 1; i <= recurringCount; i++) {
        const currentDate = new Date(originalDate);

        // Adjust the current date based on the repetition interval
        if (repetitionInterval === 'weekly') {
          currentDate.setDate(originalDate.getDate() + 7 * i); // Move to next week
        } else if (repetitionInterval === 'daily') {
          console.log(currentDate)
          currentDate.setDate(originalDate.getDate() + i); // Move to next day
        } else if (repetitionInterval === 'monthly') {
          currentDate.setMonth(originalDate.getMonth() + i); // Move to next month

          // Ensure the time slot is valid for the new month's day
          const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
          if (originalDate.getDate() > daysInMonth) {
            currentDate.setDate(daysInMonth);
          }
        }

        // Create a new appointment with the adjusted date and time slot ID
        const newTimeSlotId = calculateSlotId(currentDate); // Assume calculateSlotId is defined

        const newAppointment: AppointmentRegistrationModel = {
          ...selectedEvent,
          originalAppointment: selectedEvent.timeSlotId,
          appointmentDate: currentDate, // Convert to ISO string if necessary
          timeSlotId: newTimeSlotId,
          recurrenceInterval: repetitionInterval,
        };

        recurrenceDates.push(newAppointment);
      }

      // Update state with the new recurrence appointments
      setAppointment([...appointment, ...recurrenceDates]);
      toggleModal(); // Close the modal after processing
    } catch (error) {
      console.error('Error while handling repeat appointment:', error);
      // Handle the error or show a message to the user
    }
  };



  const calculateSlotId = (startTime: Date): number => {
    const hours = startTime.getHours();
    const minutes = startTime.getMinutes();

    // Calculate the slot ID based on time ranges
    if (hours >= 6 && hours < 7 && minutes < 30) {
      return 1; // Slot 1: 6:00 - 6:30
    } else if (hours >= 6 && hours < 7 && minutes >= 30) {
      return 2; // Slot 2: 6:30 - 7:00
    } else if (hours >= 7 && hours < 8 && minutes < 30) {
      return 3; // Slot 3: 7:00 - 7:30
    } else if (hours >= 7 && hours < 8 && minutes >= 30) {
      return 4; // Slot 4: 7:30 - 8:00
    } else if (hours >= 8 && hours < 9 && minutes < 30) {
      return 5; // Slot 5: 8:00 - 8:30
    } else if (hours >= 8 && hours < 9 && minutes >= 30) {
      return 6; // Slot 6: 8:30 - 9:00
    } else if (hours >= 9 && hours < 10 && minutes < 30) {
      return 7; // Slot 7: 9:00 - 9:30
    } else if (hours >= 9 && hours < 10 && minutes >= 30) {
      return 8; // Slot 8: 9:30 - 10:00
    } else if (hours >= 10 && hours < 11 && minutes < 30) {
      return 9; // Slot 9: 10:00 - 10:30
    } else if (hours >= 10 && hours < 11 && minutes >= 30) {
      return 10; // Slot 10: 10:30 - 11:00
    } else if (hours >= 11 && hours < 12 && minutes < 30) {
      return 11; // Slot 11: 11:00 - 11:30
    } else if (hours >= 11 && hours < 12 && minutes >= 30) {
      return 12; // Slot 12: 11:30 - 12:00
    } else if (hours >= 12 && hours < 13 && minutes < 30) {
      return 13; // Slot 13: 12:00 - 12:30
    } else if (hours >= 12 && hours < 13 && minutes >= 30) {
      return 14; // Slot 14: 12:30 - 13:00
    } else if (hours >= 13 && hours < 14 && minutes < 30) {
      return 15; // Slot 15: 13:00 - 13:30
    } else if (hours >= 13 && hours < 14 && minutes >= 30) {
      return 16; // Slot 16: 13:30 - 14:00
    } else if (hours >= 14 && hours < 15 && minutes < 30) {
      return 17; // Slot 17: 14:00 - 14:30
    } else if (hours >= 14 && hours < 15 && minutes >= 30) {
      return 18; // Slot 18: 14:30 - 15:00
    } else if (hours >= 15 && hours < 16 && minutes < 30) {
      return 19; // Slot 19: 15:00 - 15:30
    } else if (hours >= 15 && hours < 16 && minutes >= 30) {
      return 20; // Slot 20: 15:30 - 16:00
    } else if (hours >= 16 && hours < 17 && minutes < 30) {
      return 21; // Slot 21: 16:00 - 16:30
    } else if (hours >= 16 && hours < 17 && minutes >= 30) {
      return 22; // Slot 22: 16:30 - 17:00
    } else if (hours >= 17 && hours < 18 && minutes < 30) {
      return 23; // Slot 23: 17:00 - 17:30
    } else if (hours >= 17 && hours < 18 && minutes >= 30) {
      return 24; // Slot 24: 17:30 - 18:00
    } else if (hours >= 18 && hours < 19 && minutes < 30) {
      return 25; // Slot 25: 18:00 - 18:30
    } else if (hours >= 18 && hours < 19 && minutes >= 30) {
      return 26; // Slot 26: 18:30 - 19:00
    } else if (hours >= 19 && hours < 20 && minutes < 30) {
      return 27; // Slot 27: 19:00 - 19:30
    } else if (hours >= 19 && hours < 20 && minutes >= 30) {
      return 28; // Slot 28: 19:30 - 20:00
    } else if (hours >= 20 && hours < 21 && minutes < 30) {
      return 29; // Slot 29: 20:00 - 20:30
    } else if (hours >= 20 && hours < 21 && minutes >= 30) {
      return 30; // Slot 30: 20:30 - 21:00
    }

    return 0;
  };


  const slotLabelContent = (info: any) => {
    const start = info.date;
    const end = new Date(start);
    end.setMinutes(end.getMinutes() + 30);

    const startStr = start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    const endStr = end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

    return `${startStr} - ${endStr}`;
  };

  const mapAppointmentToEvent = (appointment: AppointmentRegistrationModel) => {
    return {
      id: appointment.timeSlotId.toString(),
      title: appointment.appointmentType,
      start: appointment.appointmentDate,
      end: new Date(new Date(appointment.appointmentDate).getTime() + 30 * 60000),
      extendedProps: { ...appointment },
      classNames: [appointment.status === 'booked' ? 'event-status-booked' : 'event-status-available'],
    };
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
                          events={appointment.map(mapAppointmentToEvent)}
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
                              <p><strong>Patient:</strong> {selectedEvent.customerId}</p>
                              <p><strong>Type:</strong> {selectedEvent.appointmentType}</p>
                              <p><strong>Service:</strong> {selectedEvent.serviceId}</p>
                              <p><strong>Date:</strong> {selectedEvent.appointmentDate.toDateString()}</p>
                              <p><strong>Status:</strong> {selectedEvent.status}</p>
                              <Label for="recurringCount">Number of repetitions:</Label>
                              <Input
                                type="number"
                                name="recurringCount"
                                id="recurringCount"
                                value={recurringCount}
                                min={0}
                                onChange={(e) => setRecurringCount(parseInt(e.target.value))}
                              />
                              <FormGroup>
                                <Label for="repetitionInterval">Select repetition interval:</Label>
                                <Input
                                  type="select"
                                  name="repetitionInterval"
                                  id="repetitionInterval"
                                  onChange={(e) => setRepetitionInterval(e.target.value as 'daily' | 'weekly' | 'monthly')}
                                >
                                  <option value="daily">Daily</option>
                                  <option value="weekly">Weekly</option>
                                  <option value="monthly">Monthly</option>
                                </Input>
                              </FormGroup>
                              <Button color="primary" onClick={handleRepeatAppointment}>Repeat Appointment</Button>
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
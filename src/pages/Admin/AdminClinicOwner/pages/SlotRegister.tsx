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

import './CalendarThree.css';
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin, { DateClickArg } from "@fullcalendar/interaction";
import { useEffect, useRef, useState } from "react";
import viLocale from '@fullcalendar/core/locales/vi';

import { ClinicSlotRegistrationModel, Weekdays } from "../../../../utils/interfaces/AdminClinicOwner/Slots";
import { ClinicSlotInfoModel } from "../../../../utils/interfaces/ClinicRegister/Clinic";
import { ClinicSlotUpdateModel } from "../../../../utils/interfaces/ClinicRegister/Clinic";
import { EventInput } from "@fullcalendar/core/index.js";
import { fetchDentistInfo, registerSlots, getAllClinicSlots, updateClinicSlot, enableSlot } from "../../../../utils/api/ClinicOwnerUtils";
import { DentistInfoViewModel } from "../../../../utils/interfaces/AdminClinicOwner/DentistAccounts";



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

const SlotRegister = () => {
  const calendarRef = useRef<FullCalendar>(null);
  const [open, setOpen] = useState(true);
  const toggleDrawer = () => {
    setOpen(!open);
  };

  const [selectedSlot, setSelectedSlot] = useState<ClinicSlotRegistrationModel | null>(null);
  const [status, setStatus] = useState<boolean>(false);
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);


  const [defaultMaxCheckup, setDefaultMaxCheckup] = useState(1);
  const [defaultMaxTreatment, setDefaultMaxTreatment] = useState(1);

  const [slotInforModel, setSlotInforModel] = useState<ClinicSlotRegistrationModel[][]>([]);
  const [clinicSlotInfoData, setClinicSlotInfoData] = useState<ClinicSlotInfoModel[][]>([]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const slotsFromAPI = await getAllClinicSlots();
        setClinicSlotInfoData(slotsFromAPI);
      } catch (error) {
        console.error('Error fetching clinic slots:', error);
      }
    };

    fetchData();
  }, []);

  const filteredSlots = clinicSlotInfoData.flatMap((slots) =>
    slots.map((slot) => {
      const startDate = new Date(`${new Date().toISOString().split('T')[0]}T${slot.startTime}`);
      const endDate = new Date(`${new Date().toISOString().split('T')[0]}T${slot.endTime}`);

      const calendarWeekdayIndex = slot.weekday === 0 ? 0 : slot.weekday;

      const start = new Date(startDate);
      start.setDate(start.getDate() + calendarWeekdayIndex - start.getDay());

      const end = new Date(endDate);
      end.setDate(end.getDate() + calendarWeekdayIndex - end.getDay());

      return {
        start: start,
        end: end,
        extendedProps: slot,
      };
    })
  );


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


  const handleDateClick = (info: DateClickArg) => {
    const start = info.date;
    console.log(start, 'in here')
    const end = new Date(start);
    end.setMinutes(end.getMinutes() + 30); // Assuming 30-minute slots

    // Calculate the slot ID based on the start time
    const slotId = calculateSlotId(start);
    // Adjust weekday calculation if needed
    let weekday = start.getDay(); // This should correctly give you the weekday number (0-6)

    const newSlotInfo: ClinicSlotRegistrationModel = {
      clinicId: 1, // You'll need to provide the actual clinic ID
      clinicSlotId: slotId,
      weekday: weekday,
      maxCheckup: defaultMaxCheckup,
      maxTreatment: defaultMaxTreatment,
      SlotId: 0
    };
    setSelectedSlot(newSlotInfo);
    setConfirmationModalOpen(true);
  };

  const handleEventClick = (info: any) => {
    const clickedSlotInfo = info.event.extendedProps as ClinicSlotRegistrationModel;
    console.log('Clicked slot info:', clickedSlotInfo);
    setSelectedSlot(clickedSlotInfo);
    setEditModalOpen(true);
  };

  const handleSave = async () => {
    if (selectedSlot) {
      try {
        // Fetch dentist information first
        const dentistInfoResponse = await fetchDentistInfo();
        if (dentistInfoResponse.statusCode === 200) {
          // Copy slotInforModel
          let updatedSlotInfoModel = [...slotInforModel];
          // Flatten the two-dimensional array into a single-dimensional array
          // Call registerSlots function to register slots
          const existingIndex = updatedSlotInfoModel.findIndex((slots) =>
            slots.some((slot) => slot.clinicSlotId === selectedSlot.clinicSlotId && slot.weekday === selectedSlot.weekday)
          );

          if (existingIndex !== -1) {
            // Update the existing slot
            const slotIndex = updatedSlotInfoModel[existingIndex].findIndex(slot => slot.clinicSlotId === selectedSlot.clinicSlotId && slot.weekday === selectedSlot.weekday);
            updatedSlotInfoModel[existingIndex][slotIndex] = selectedSlot;
          } else {
            // Add a new slot
            updatedSlotInfoModel.push([selectedSlot]);
          }

          // Update state
          setSlotInforModel(updatedSlotInfoModel);
          setConfirmationModalOpen(false);
          setEditModalOpen(false);

          const success = await registerSlots(selectedSlot);
          if (success) {
            console.log("Slot registered successfully");
          } else {
            console.error("Failed to register slot");
          }
        } else {
          // Handle failure to fetch dentist information
          console.error("Failed to fetch dentist information");
        }
      } catch (error) {
        console.error("Error saving slot:", error);
        // Handle error appropriately, e.g., show an error message to the user
      }
    }
  };

  const handleEdit = async () => {

    if (selectedSlot) {
      try {
        // Fetch dentist information first
        const dentistInfoResponse = await fetchDentistInfo();

        if (dentistInfoResponse.statusCode === 200) {
          // Copy slotInforModel
          const stringId = selectedSlot.clinicSlotId.toString();

          const updatedSlotInfo: ClinicSlotUpdateModel = {
            slotId: stringId,
            MaxTreatement: selectedSlot.maxTreatment,
            MaxCheckup: selectedSlot.maxCheckup,
            Status: status,
          };

          await updateClinicSlot(updatedSlotInfo);
          setStatus(false);

          setEditModalOpen(false);
          setConfirmationModalOpen(false);
        } else {
          console.error("Failed to fetch dentist information");
        }
      } catch (error) {
        console.error("Error saving slot changes:", error);
      }
    }
  };


  const slotLabelContent = (info: any) => {
    const start = info.date;
    const end = new Date(start);
    end.setMinutes(end.getMinutes() + 30);

    const startStr = start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    const endStr = end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

    return `${startStr} - ${endStr}`;
  };

  const handleEnableSlot = async (slot: ClinicSlotInfoModel) => {
    const enable = slot.status ? 'enable' : 'disable';
    if (slot.clinicSlotId) {
      await enableSlot(slot.clinicSlotId, enable);
    }

  }

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
            Trang đăng kí slot khám
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
                      <div className="calendar-three">
                        <FullCalendar
                          contentHeight="auto"
                          locale={viLocale}
                          ref={calendarRef}
                          headerToolbar={false}
                          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                          dayHeaderFormat={{ weekday: 'long' }}
                          initialView="timeGridWeek"
                          editable={true}
                          events={filteredSlots}
                          eventContent={(arg) => {
                            const slot = arg.event.extendedProps as ClinicSlotInfoModel;
                            const eventStatusClass = slot.status ? 'event-status-true' : 'event-status-false';

                            return (
                              <a className={`${eventStatusClass}`}>
                                {/* {arg.timeText} {arg.event.title} */}
                              </a>
                            );
                          }}
                          eventClick={handleEventClick}
                          dateClick={handleDateClick}
                          selectable={false}
                          nowIndicator={true}
                          selectMirror={true}
                          dayMaxEvents={true}
                          duration={{ days: 7 }}
                          slotDuration={'00:30:00'}
                          slotLabelInterval={'00:30:00'}
                          slotMinTime={'06:00:00'}
                          slotMaxTime={'21:00:00'}
                          slotLabelContent={slotLabelContent}
                          firstDay={0}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Box>
      <Modal isOpen={editModalOpen || confirmationModalOpen} toggle={() => {
        setEditModalOpen(false);
        setConfirmationModalOpen(false);
      }} centered>
        <ModalHeader toggle={() => {
          setEditModalOpen(false);
          setConfirmationModalOpen(false);
        }}>
          {editModalOpen ? 'Sửa Slot' : 'Tạo Slot mới'}
        </ModalHeader>
        <ModalBody>
          {!editModalOpen && selectedSlot && (
            <>
              <p>
                Slot ID: {selectedSlot.clinicSlotId}
              </p>
              <p>
                Weekday: {Weekdays[selectedSlot.weekday]}
              </p>
              <p>
                Max Checkup: {selectedSlot.maxCheckup}
              </p>
              <p>
                Max Treatment: {selectedSlot.maxTreatment}
              </p>
            </>
          )}
          {editModalOpen && selectedSlot && (
            <>
              <FormGroup>
                <Label for="maxCheckup">Số slot khám:</Label>
                <Input
                  type="number"
                  id="maxCheckup"
                  value={selectedSlot.maxCheckup}
                  onChange={(e) => {
                    const value = parseInt(e.target.value) || 0;
                    if (value >= 0) {
                      setSelectedSlot({
                        ...selectedSlot,
                        maxCheckup: value,
                      });
                    }
                  }}
                />
              </FormGroup>
              <FormGroup>
                <Label for="maxTreatment">Số slot chữa trị:</Label>
                <Input
                  type="number"
                  id="maxTreatment"
                  value={selectedSlot.maxTreatment}
                  onChange={(e) => {
                    const value = parseInt(e.target.value) || 0;
                    if (value >= 0) {
                      setSelectedSlot({
                        ...selectedSlot,
                        maxTreatment: value,
                      });
                    }
                  }}
                />
              </FormGroup>
              <FormGroup>
                <Label for="status" style={{ marginRight: '8px' }}>Trạng thái:</Label>
                <Input
                  type="checkbox"
                  id="status"
                  value={status ? 1 : 0}
                  onChange={() => handleEnableSlot(clinicSlotInfoData[selectedSlot.weekday][selectedSlot.clinicSlotId])}
                />
                <label htmlFor="status" style={{ marginLeft: '8px' }}>
                  {status ? 'Đang hoạt động' : 'Không hoạt động'}
                </label>
              </FormGroup>
            </>
          )}
        </ModalBody>
        <ModalFooter>
          {!editModalOpen && (
            <Button color="primary" onClick={handleSave}>
              Tạo
            </Button>
          )}
          {editModalOpen && (
            <Button color="primary" onClick={handleEdit}>
              Lưu
            </Button>
          )}
          <Button color="secondary" onClick={() => {
            setEditModalOpen(false);
            setConfirmationModalOpen(false);
          }}>
            Hủy
          </Button>
        </ModalFooter>
      </Modal>
    </Box>
  );
};

export default SlotRegister;
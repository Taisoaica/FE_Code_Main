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
import styles from "./SlotRegister.module.css";

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
  Tooltip,
} from "reactstrap";
import { MdRemove } from "react-icons/md";
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
import { getDentistInfo, registerSlots, getAllClinicSlots, updateClinicSlot, enableSlot, getClinicGeneralInfo } from "../../../../utils/api/ClinicOwnerUtils";
import { NestedListItems } from "../components/NestedListMenu";
import { EventContentArg } from "@fullcalendar/core/index.js";
import { getAllClinics } from "../../../../utils/api/SystemAdminUtils";



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

const SlotRegister = () => {
  const calendarRef = useRef<FullCalendar>(null);
  const [open, setOpen] = useState(true);

  // const clinicOpenHour = clinic ? JSON.parse(clinic).openHour : '';
  // const clinicCloseHour = clinic ? JSON.parse(clinic).closeHour : '';

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const [selectedSlot, setSelectedSlot] = useState<ClinicSlotRegistrationModel | null>(null);
  const [status, setStatus] = useState<boolean>(false);
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [clinicOpenHour, setClinicOpenHour] = useState<string>('');
  const [clinicCloseHour, setClinicCloseHour] = useState<string>('');
  const [clinicId, setClinicId] = useState<number>(0);
  const [defaultMaxCheckup, setDefaultMaxCheckup] = useState(1);
  const [defaultMaxTreatment, setDefaultMaxTreatment] = useState(1);


  const [slotInforModel, setSlotInforModel] = useState<ClinicSlotRegistrationModel[][]>([]);
  const [clinicSlotInfoData, setClinicSlotInfoData] = useState<ClinicSlotInfoModel[][]>([]);

  const fetchData = async () => {
    try {
      const dentistInfo = await getDentistInfo();

      const clinicId = dentistInfo.clinicId;
      setClinicId(clinicId);
      const slotsFromAPI = await getAllClinicSlots(clinicId);
      setClinicSlotInfoData(slotsFromAPI);

      const clinic = await getClinicGeneralInfo(clinicId);
      if (clinic) {
        const openHour = clinic.openHour || '08:00';
        const closeHour = clinic.closeHour || '17:00';

        setClinicOpenHour(openHour);
        setClinicCloseHour(closeHour);
      }

    } catch (error) {
      console.error('Error fetching clinic slots:', error);
    }
  };

  useEffect(() => {
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

    const slotId = (hours * 2) + (minutes >= 30 ? 1 : 0) + 1;

    return slotId;
  };


  const handleDateClick = (info: DateClickArg) => {
    const start = info.date;
    const end = new Date(start);
    end.setMinutes(end.getMinutes() + 30);

    const slotId = calculateSlotId(start);

    let weekday = start.getDay();

    const newSlotInfo: ClinicSlotRegistrationModel = {
      clinicId: clinicId.toString(),
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
    setSelectedSlot(clickedSlotInfo);
    setStatus(clickedSlotInfo.status);
    setEditModalOpen(true);
  };

  const handleSave = async () => {
    if (selectedSlot) {
      try {
        const dentistInfoResponse = await getDentistInfo();
        if (dentistInfoResponse) {

          let updatedSlotInfoModel = [...slotInforModel];
          const existingIndex = updatedSlotInfoModel.findIndex((slots) =>
            slots.some((slot) => slot.clinicSlotId === selectedSlot.clinicSlotId && slot.weekday === selectedSlot.weekday)
          );

          if (existingIndex !== -1) {
            const slotIndex = updatedSlotInfoModel[existingIndex].findIndex(slot => slot.clinicSlotId === selectedSlot.clinicSlotId && slot.weekday === selectedSlot.weekday);
            updatedSlotInfoModel[existingIndex][slotIndex] = selectedSlot;
          } else {
            updatedSlotInfoModel.push([selectedSlot]);
          }

          setSlotInforModel(updatedSlotInfoModel);
          setConfirmationModalOpen(false);
          setEditModalOpen(false);

          const success = await registerSlots(selectedSlot);
          if (success) {
            await fetchData();
            alert('Register success')
          } else {
            alert("Failed to register slot");
          }
        } else {
          console.error("Failed to fetch dentist information");
        }
      } catch (error) {
        console.error("Error saving slot:", error);

      }
    }
  };

  const handleEdit = async () => {
    if (selectedSlot) {
      try {
        const dentistInfoResponse = await getDentistInfo();

        if (dentistInfoResponse) {

          const stringId = selectedSlot.clinicSlotId.toString();

          const updatedSlotInfo: ClinicSlotUpdateModel = {
            slotId: stringId,
            MaxTreatement: selectedSlot.maxTreatment,
            MaxCheckup: selectedSlot.maxCheckup,
            Status: status,
          };

          const response = await updateClinicSlot(updatedSlotInfo);
          if (response) {
            console.log('Update successing');
          } else {
            console.log('Fail to update');
          }

          setStatus(false);
          setEditModalOpen(false);
          setConfirmationModalOpen(false);

          await fetchData();
        } else {
          console.log("Failed to fetch dentist information");
        }
      } catch (error) {
        console.log("Error saving slot changes:");
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

  const renderEventContent = (arg: EventContentArg) => {
    const status = arg.event.extendedProps.status;
    const eventClassName = status ? styles.activeSlot : styles.inactiveSlot;
    return (
      <div className={`${styles.eventContent} ${eventClassName}`}>
        <MdRemove className={styles.eventIcon} />
      </div>
    );
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
            Trang thiết lập slot khám
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
          color: '#0d47a1',
          height: '100%',
          background: 'linear-gradient(to left, #e3f2fd, #f8fbff)',
        }}
      >
        <div className={styles.infoText}>
          <h2>Cấu hình các khung giờ làm việc của phòng khám</h2>
          <p>
            Chọn các khung giờ trên lịch bên dưới để cấu hình giờ làm việc của phòng khám.
            Mỗi khung giờ được chọn sẽ được mở hàng tuần vào cùng ngày và giờ.
          </p>
          <p>Xanh là những slot đang được mở, đỏ là những slot đã đóng. Những ngày không có slot là những ngày phòng khám không hoạt động.</p>
        </div>
        <div className="calendar-three">
          {/* <FullCalendar
            contentHeight="auto"
            stickyHeaderDates={false}
            windowResize={() => calendarRef.current?.getApi().updateSize()}
            locale={viLocale}
            ref={calendarRef}
            headerToolbar={false}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            dayHeaderFormat={{ weekday: 'long' }}
            initialView="timeGridWeek"
            editable={true}
            events={filteredSlots}
            eventContent={renderEventContent}
            eventClick={handleEventClick}
            dateClick={handleDateClick}
            selectable={false}
            nowIndicator={true}
            selectMirror={true}
            dayMaxEvents={true}
            duration={{ days: 7 }}
            slotDuration={'00:30:00'}
            slotLabelInterval={'00:30:00'}
            slotMinTime={clinicOpenHour}
            slotMaxTime={clinicCloseHour}
            slotLabelContent={slotLabelContent}
            firstDay={0}
          /> */}
          {clinicCloseHour && (
            <FullCalendar
              contentHeight="auto"
              stickyHeaderDates={false}
              windowResize={() => calendarRef.current?.getApi().updateSize()}
              locale={viLocale}
              ref={calendarRef}
              headerToolbar={false}
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              dayHeaderFormat={{ weekday: 'long' }}
              initialView="timeGridWeek"
              editable={true}
              events={filteredSlots}
              eventContent={renderEventContent}
              eventClick={handleEventClick}
              dateClick={handleDateClick}
              selectable={false}
              nowIndicator={true}
              selectMirror={true}
              dayMaxEvents={true}
              duration={{ days: 7 }}
              slotDuration={'00:30:00'}
              slotLabelInterval={'00:30:00'}
              slotMinTime={clinicOpenHour}
              slotMaxTime={clinicCloseHour}
              slotLabelContent={slotLabelContent}
              firstDay={0}
            />
          )}

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
                Slot khám tối đa: {selectedSlot.maxCheckup}
              </p>
              <p>
                Slot điều trị tối đa: {selectedSlot.maxTreatment}
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
                    if (value >= 1) {
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
                    if (value >= 1) {
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
                  checked={status}
                  onChange={() => setStatus(!status)}
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
    </Box >
  );
};

export default SlotRegister;
import { SetStateAction, useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import viLocale from '@fullcalendar/core/locales/vi';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle } from '@fortawesome/free-solid-svg-icons';
import { Accordion, Box, Checkbox, Dialog, DialogContent, FormControlLabel, Typography } from '@mui/material';
import styles from './Calendar.module.css';
import './CalendarOne.css'
import TimeSlots from '../TimeSlots/TimeSlots';
import { BookingInformation, SetBookingInformation } from '../../../../utils/interfaces/interfaces';
import { TimeSlot } from '../../../../utils/interfaces/Booking/BookingDefinition';

import { ClinicSlotInfoModel } from '../../../../utils/interfaces/ClinicRegister/Clinic';
import { AppointmentViewModel, AppointmentViewModelFetch, getAllClinicSlots, getClinicAppointments, getClinicAppointmentsWithClinicSlotId } from '../../../../utils/api/ClinicOwnerUtils';
import { DayCellMountArg } from '@fullcalendar/core/index.js';
import { getCustomerAppointments } from '../../../../utils/api/UserAccountUtils';

interface CalendarFormProps {
  formData: BookingInformation,
  setFormData: SetBookingInformation,
  onStepComplete: () => void
}

export default function BasicDateCalendar({ formData, setFormData, onStepComplete }: CalendarFormProps) {
  // const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState<string | null>(new Date().toISOString().slice(0, 10));
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [clinicSlots, setClinicSlots] = useState<ClinicSlotInfoModel[][]>([]);
  const [clinicAppointment, setClinicAppointment] = useState<AppointmentViewModel[]>([])

  const urlPath = window.location.pathname;
  const clinicId = urlPath.split('/').pop();

  useEffect(() => {
    if (clinicId) {
      const fetchAvailableClinicSlots = async () => {
        try {
          const id = localStorage.getItem('customerId');
          const slots = await getAllClinicSlots(clinicId);
          const appointments = await getCustomerAppointments(id);
          const updatedSlots = JSON.parse(JSON.stringify(slots));

          // Update the slots based on appointments
          appointments.forEach(appointment => {
            const appointmentDate = new Date(appointment.appointmentDate);
            const dayOfWeek = appointmentDate.getDay();
            const matchingSlotIndex = updatedSlots[dayOfWeek]?.findIndex(
              slot => slot.clinicSlotId === appointment.slotId
            );
            if (matchingSlotIndex !== -1 && matchingSlotIndex !== undefined) {
              const slot = updatedSlots[dayOfWeek][matchingSlotIndex];
              if (appointment.appointmentType === "checkup") {
                slot.maxCheckup = Math.max(0, slot.maxCheckup - 1);
              } else if (appointment.appointmentType === "treatment") {
                slot.maxTreatment = Math.max(0, slot.maxTreatment - 1);
              }
            }
          });

          setClinicSlots(updatedSlots);
          setClinicAppointment(appointments);
        } catch (error) {
          console.error('Error fetching clinic slots:', error);
        }
      };

      fetchAvailableClinicSlots();
    } else {
      console.error('clinicId is undefined');
    }
  }, [clinicId]);

  // const getDayClasses = (date: Date) => {
  //   const weekdayIndex = date.getDay();
  //   const dateString = date.toISOString().split('T')[0];

  //   if (clinicSlots.length > 0) {
  //     const daySlots = clinicSlots[weekdayIndex] || [];

  //     if (daySlots.length === 0) {
  //       return 'no-slots';
  //     }

  //     const availableSlots = daySlots.filter(slot => {
  //       const isSlotAvailable = slot.maxCheckup > 0 || slot.maxTreatment > 0;
  //       const isBookedByCustomer = clinicAppointment.some(appointment => 
  //         appointment.appointmentDate === dateString && 
  //         appointment.slotId === slot.clinicSlotId
  //       );
  //       return isSlotAvailable && !isBookedByCustomer;
  //     });

  //     if (availableSlots.length === 0) {
  //       return 'no-slots';
  //     }
  //   }

  //   return '';
  // };
  const getDayClasses = (date: Date) => {
    const weekdayIndex = date.getDay();
    const dateString = date.toISOString().split('T')[0];
  
    if (clinicSlots.length > 0) {
      const daySlots = clinicSlots[weekdayIndex] || [];
  
      if (daySlots.length === 0) {
        return 'no-slots';
      }
  
      const availableSlots = daySlots.filter(slot => {
        const isSlotAvailable = slot.maxCheckup > 0 || slot.maxTreatment > 0;
        const isBookedByCustomer = clinicAppointment.some(appointment => 
          appointment.appointmentDate === dateString && 
          appointment.slotId === slot.clinicSlotId
        );
        return isSlotAvailable && !isBookedByCustomer;
      });
  
      if (availableSlots.length === 0) {
        return 'no-slots';
      }
    }
  
    return '';
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const handleSlotSelected = (selectedSlot: TimeSlot) => {
    setFormData(prevState => ({ ...prevState, time: selectedSlot }));
    onStepComplete();
  };

  const today = new Date();

  // const handleDateClick = (event: DateClickArg) => {
  //   const weekdayIndex = event.date.getDay();
  //   const availableSlots = clinicSlots[weekdayIndex]?.filter(slot => slot.maxCheckup > 0 || slot.maxTreatment > 0);
  //   if (!availableSlots || availableSlots.length === 0) {
  //     return;
  //   }

  //   setFormData(prevState => ({ ...prevState, date: event.dateStr }));
  //   setSelectedDate(event.dateStr);
  //   setIsDialogOpen(true);
  // };

  const handleDateClick = (event: DateClickArg) => {
    const weekdayIndex = event.date.getDay();
    const dateString = event.dateStr;
    const daySlots = clinicSlots[weekdayIndex] || [];
    
    if (daySlots.length === 0) {
      console.log(`No slots available for ${dateString}`);
      return;
    }
  
    const availableSlots = daySlots.filter(slot => {
      const isSlotAvailable = slot.maxCheckup > 0 || slot.maxTreatment > 0;
      const isBookedByCustomer = clinicAppointment.some(appointment => 
        appointment.appointmentDate === dateString && 
        appointment.slotId === slot.clinicSlotId
      );
      return isSlotAvailable && !isBookedByCustomer;
    });
    
    if (availableSlots.length === 0) {
      console.log(`All slots are booked for ${dateString}`);
      return;
    }
  
    setFormData(prevState => ({ ...prevState, date: dateString }));
    setSelectedDate(dateString);
    setIsDialogOpen(true);
  };  
  
  //Custom title for the calendar
  //-----------------------------------------------------------------------------------
  const formatDateTitle = (dateInfo: { start: Date }) => {
    const monthNames = [
      "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6",
      "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"
    ];
    const monthName = monthNames[dateInfo.start.getMonth()];
    return `${monthName} năm ${dateInfo.start.getFullYear()}`;
  };

  const updateTitle = (dateInfo: { start: Date }) => {
    const titleElement = document.querySelector('.fc-toolbar-title');
    if (titleElement) {
      titleElement.textContent = formatDateTitle(dateInfo);
    }
  };

  useEffect(() => {
    const calendarApi = (document.querySelector('.fc') as any)?.__fullCalendar;
    if (calendarApi) {
      const currentDate = calendarApi.getCurrentData().viewTitle;
      updateTitle({ start: new Date(currentDate) });
    }
  }, []);

  const handleDatesSet = (dateInfo: { start: Date }) => {
    updateTitle(dateInfo);
  };

  return (
    <Box className={styles.container}>
      <Box className={styles.headerBox}>
        <Box className={styles.header}>Chọn ngày khám</Box>
      </Box>
      <Box className={styles.calendarContainer}>
        <div className="calendar-one">
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            contentHeight="auto"
            initialView="dayGridMonth"
            viewClassNames="custom-calendar"
            locale={viLocale}
            datesSet={handleDatesSet}
            headerToolbar={{
              left: 'prev',
              center: 'title',
              right: 'next'
            }}
            fixedWeekCount={false}
            showNonCurrentDates={false}
            dateClick={(event) => handleDateClick(event)}
            dayCellClassNames={(dateInfo) => getDayClasses(dateInfo.date)}
            validRange={{
              start: today.toISOString().split('T')[0],
            }}
            firstDay={0}
          />
        </div>
      </Box>
      <Box className={styles.legendContainer}>
        <Box className={styles.legendItem}>
          <FontAwesomeIcon icon={faCircle} className={styles.legendIcon} style={{ color: "#dbeaff" }} />
          <Typography variant="body2" className={styles.legendText}>Hôm nay</Typography>
        </Box>

        {/* <Box className={styles.legendItem}>
          <FontAwesomeIcon icon={faCircle} className={styles.legendIcon} style={{ color: "#bbfbc7" }} />
          <Typography variant="body2" className={styles.legendText}>Ngày đang chọn</Typography>
        </Box> */}

        <Box className={styles.legendItem}>
          <FontAwesomeIcon icon={faCircle} className={styles.legendIcon} style={{ color: "#ffe3df" }} />
          <Typography variant="body2" className={styles.legendText}>Ngày không hoạt động</Typography>
        </Box>
      </Box>

      <Dialog
        open={isDialogOpen}
        onClose={handleCloseDialog}
        className={styles.timeSlotContainer}
        PaperProps={{
          sx: {
            border: '2px solid #e0e4e5',
            borderRadius: '30px',
            width: '550px',
            height: 'auto',
            padding: '2px',
          },
        }}
      >
        {selectedDate && (
          <DialogContent className={styles.timeSlot}>
            <TimeSlots
              formData={formData}
              setFormData={setFormData}
              onClose={handleCloseDialog}
              onSlotSelect={handleSlotSelected}
              date={selectedDate}
            />
          </DialogContent>
        )}
      </Dialog>
    </Box>
  );
}




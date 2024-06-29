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
import { getAllClinicSlots } from '../../../../utils/api/ClinicOwnerUtils';
import { DayCellMountArg } from '@fullcalendar/core/index.js';

interface CalendarFormProps {
  formData: BookingInformation,
  setFormData: SetBookingInformation,
  onStepComplete: () => void
}

// const getWeekdaysWithSlots = (clinicSlots: ClinicSlotInfoModel[][]): Set<number> => {
//   const weekdaysWithSlots = new Set<number>();

//   clinicSlots.forEach((slots, weekdayIndex) => {
//     if (slots && slots.length > 0) {
//       weekdaysWithSlots.add(weekdayIndex);
//     }
//   });

//   return weekdaysWithSlots;
// };

export default function BasicDateCalendar({ formData, setFormData, onStepComplete }: CalendarFormProps) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [clinicSlots, setClinicSlots] = useState<ClinicSlotInfoModel[][]>([]);


  useEffect(() => {
    const fetchClinicSlots = async () => {
      try {
        const slots = await getAllClinicSlots();
        setClinicSlots(slots);
        console.log(slots)
      } catch (error) {
        console.error('Error fetching clinic slots:', error);
      }
    };

    fetchClinicSlots();
  }, []);


  const today = new Date();



  const handleDateClick = (event: DateClickArg) => {
    let is_available = true;

    const weekdayIndex = event.date.getDay();
    if (clinicSlots.length > 0) {
      if (!clinicSlots[weekdayIndex] || clinicSlots[weekdayIndex].length === 0) {
        is_available = false;
      }
    }
    if(!is_available) return;

    setFormData(prevState => ({ ...prevState, date: event.dateStr }));
    setSelectedDate(event.dateStr);
    setIsDialogOpen(true);
  };

  const getDayClasses = (date: Date) => {
    const weekdayIndex = date.getDay();
    if (clinicSlots.length > 0) {
      if (!clinicSlots[weekdayIndex] || clinicSlots[weekdayIndex].length === 0) {
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

  const getWeekdayDate = (weekday: number): string => {
    const today = new Date();
    const dayOffset = (weekday - today.getDay() + 7) % 7;
    const targetDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + dayOffset);
    return targetDate.toISOString().split('T')[0];
  };



  const hasSlots = (date: Date) => {
    const weekdayIndex = date.getDay();
    return clinicSlots[weekdayIndex] && clinicSlots[weekdayIndex].length > 0;
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

  // const dayCellDidMount = (info: DayCellMountArg, weekdaysWithSlots: Set<number>) => {
  //   const today = new Date();
  //   const date = new Date(info.date);

  //   // Skip days of other months and past days
  //   if (info.isOther || date < today) {
  //     return;
  //   }

  //   const weekdayIndex = date.getDay();
  //   if (clinicSlots.length > 0) {
  //     console.log(`Checking clinic slots for weekday ${weekdayIndex}:`, clinicSlots[weekdayIndex]);
  //     if (!clinicSlots[weekdayIndex] || clinicSlots[weekdayIndex].length === 0) {
  //       if (!weekdaysWithSlots.has(weekdayIndex)) {
  //         info.el.classList.add('no-slots');
  //       }
  //     }
  //   }
  // };

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
            // events={events}
            firstDay={0}
            // dayCellDidMount={(info) => dayCellDidMount(info, weekdaysWithSlots)}
          />
        </div>
      </Box>
      <Box className={styles.legendContainer}>
        <Box className={styles.legendItem}>
          <FontAwesomeIcon icon={faCircle} className={styles.legendIcon} style={{ color: "#dbeaff" }} />
          <Typography variant="body2" className={styles.legendText}>Hôm nay</Typography>
        </Box>

        <Box className={styles.legendItem}>
          <FontAwesomeIcon icon={faCircle} className={styles.legendIcon} style={{ color: "#bbfbc7" }} />
          <Typography variant="body2" className={styles.legendText}>Ngày đang chọn</Typography>
        </Box>

        <Box className={styles.legendItem}>
          <FontAwesomeIcon icon={faCircle} className={styles.legendIcon} style={{ color: "#ffe3df" }} />
          <Typography variant="body2" className={styles.legendText}>Ngày không có lịch</Typography>
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




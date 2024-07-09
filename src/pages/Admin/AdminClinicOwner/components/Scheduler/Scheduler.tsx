import React, { useState, useRef, useEffect } from "react";
import './CalendarTwo.css';
import styles from "./Scheduler.module.css";
import FullCalendar from "@fullcalendar/react";
import { CalendarApi, EventClickArg, EventContentArg } from "@fullcalendar/core";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin, { DateClickArg } from "@fullcalendar/interaction";
import viLocale from '@fullcalendar/core/locales/vi';
import EventModal from "./components/EventModal";
import { AppointmentViewModel, fetchClinicStaff, getAllClinicSlots } from "../../../../../utils/api/ClinicOwnerUtils";
import { getClinicAppointments } from "../../../../../utils/api/ClinicOwnerUtils";
import { ClinicSlotInfoModel } from "../../../../../utils/interfaces/ClinicRegister/Clinic";
import { getAllCustomer } from "../../../../../utils/api/SystemAdminUtils";
import { DentistInfoViewModel } from "../../../../../utils/api/BookingRegister";


interface SchedulerProps {
  openHour: string;
  closeHour: string;
  availableStaff: DentistInfoViewModel[];
}

const Scheduler = ({ openHour, closeHour, availableStaff }: SchedulerProps) => {
  const [weekendsVisible, setWeekendsVisible] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [appointmentsWithTimes, setAppointmentsWithTimes] = useState<AppointmentViewModel[]>([]);
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentViewModel>();
  const [clinicSlots, setClinicSlots] = useState<ClinicSlotInfoModel[][]>([]);

  const [clinicId, setClinicId] = useState<string>('');


  const fromDate = new Date('2024-07-01');
  const toDate = new Date('2024-07-31');
  const fromTime = openHour;
  const toTime = closeHour;
  const requestOldItems = true;
  const pageSize = 10;
  const pageIndex = 1;

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    return `${hours}:${minutes}`;
  };

  useEffect(() => {
    const clinic = localStorage.getItem('clinic');
    if (clinic) {
      const parsedClinic = JSON.parse(clinic);
      setClinicId(parsedClinic.id);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!clinicId) return;
      try {
        const fetchedSlots = await getAllClinicSlots(clinicId);
        setClinicSlots(fetchedSlots);

        const fetchedAppointments = await getClinicAppointments(
          clinicId,
        );

        const allDentists = await fetchClinicStaff();

        const dentistMap = new Map<number, string>();
        allDentists.forEach(dentist => {
          dentistMap.set(dentist.dentistId, dentist.fullname);
        });

        const allCustomers = await getAllCustomer();

        const customerMap = new Map<number, string>();
        allCustomers.forEach(customer => {
          customerMap.set(customer.id, customer.fullname);
        });


        const slotMap = new Map<string, { startTime: string, endTime: string }>();
        fetchedSlots.forEach(daySlots => {
          daySlots.forEach(slot => {
            slotMap.set(slot.clinicSlotId, { startTime: slot.startTime, endTime: slot.endTime });
          });
        });

        const enhancedAppointments = fetchedAppointments.map(appointment => {
          const slotInfo = slotMap.get(appointment.clinicSlotId);
          return {
            ...appointment,
            slotStartTime: slotInfo ? formatTime(slotInfo.startTime) : '',
            slotEndTime: slotInfo ? formatTime(slotInfo.endTime) : '',
            customerName: customerMap.get(appointment.customerId) || '',
            dentistName: dentistMap.get(appointment.dentistId) || ''
          };
        });

        setAppointmentsWithTimes(enhancedAppointments);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [clinicId]);

  const appointments = appointmentsWithTimes.map((appointment) => {
    const appointmentDate = new Date(appointment.appointmentDate).toISOString().split('T')[0];
    const startTime = new Date(`${appointmentDate}T${appointment.slotStartTime}`);
    const endTime = new Date(`${appointmentDate}T${appointment.slotEndTime}`);

    return {
      start: startTime,
      end: endTime,
      extendedProps: appointment
    }
  }
  )

  const handleEventClick = (info : EventContentArg) => {
    const appointment = info.event.extendedProps;
    console.log(appointment);
    setSelectedAppointment(appointment);
    setModalOpen(true);
  }

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };

  const slotLabelContent = (info: any) => {
    const start = info.date;
    const end = new Date(start);
    end.setMinutes(end.getMinutes() + 30);

    const startStr = start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    const endStr = end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

    return `${startStr} - ${endStr}`;
  };

  return (
    <div className="calendar-two">
      <FullCalendar
        locale={viLocale}
        events={appointments}
        contentHeight="auto"
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
        eventContent={(arg) => {
          const slot = arg.event.extendedProps;
          return (
            <div>
              <div><b>Nha sĩ: </b>{slot.dentistName}</div>
              {/* <div><b>Khách hàng: </b>{slot.customerName}</div>  */}
            </div>
          );
        }}
        initialView="timeGridWeek"
        editable={false}
        selectable={false}
        nowIndicator={true}
        selectMirror={true}
        dayMaxEvents={true}
        handleWindowResize={true}
        weekends={weekendsVisible}
        eventClick={handleEventClick}
        slotLabelContent={slotLabelContent}
        slotDuration={'00:30:00'}
        slotLabelInterval={'00:30:00'}
        slotMinTime={openHour}
        slotMaxTime={closeHour}
        firstDay={0}
      />
      < EventModal
        isOpen={modalOpen}
        toggle={toggleModal}
        appointment={selectedAppointment}
        availableStaff={availableStaff}
      />
    </div>
  )
};

export default Scheduler;

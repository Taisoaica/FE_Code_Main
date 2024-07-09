import React, { useState, useEffect, ChangeEvent } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";
import styles from "./EventModal.module.css";
import { AppointmentViewModel } from "../../../../../../utils/api/ClinicOwnerUtils";
import { DentistInfoViewModel } from "../../../../../../utils/api/BookingRegister";


interface EventModalProps {
  isOpen: boolean;
  toggle: () => void;
  appointment: AppointmentViewModel;
  availableStaff: DentistInfoViewModel[]
}

const EventModal: React.FC<EventModalProps> = ({
  isOpen,
  toggle,
  appointment,
  availableStaff
}) => {

  // const [selectedDentist, setSelectedDentist] = useState();
  // const handleDentistChange = (event: ChangeEvent<HTMLSelectElement>) => {
  //   setSelectedDentist(event.target.value);
  // };

  const handleClose = () => {
    toggle();
  };

  if (!isOpen || !appointment) {
    return null;
  }

  return (
    <Modal isOpen={isOpen} toggle={toggle} centered>
      <ModalHeader toggle={toggle}>Sửa Booking</ModalHeader>
      <ModalBody>
        <form>
          <div className={styles.formGroup}>
            <label htmlFor="customerName">Tên bệnh nhân:</label>
            <input
              type="text"
              className="form-control"
              id="customerName"
              name="customerName"
              value={appointment.customerName}
              disabled
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="dentistName">Nha sĩ:</label>
            <input
              type="text"
              className="form-control"
              id="dentistName"
              name="dentistName"
              value={appointment.dentistName}
              disabled
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="serviceType">Loại dịch vụ:</label>
            <input
              type="text"
              className="form-control"
              id="serviceType"
              name="serviceType"
              value={appointment.selectedService}
              disabled
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="start">Thời gian bắt đầu:</label>
            <input
              type="time"
              className="form-control"
              id="start"
              name="start"
              value={appointment.slotStartTime}
              disabled
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="end">Thời gian dự kiến kết thúc:</label>
            <input
              type="time"
              className="form-control"
              id="end"
              name="end"
              value={appointment.slotEndTime}
              disabled
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="dentistStatus">Trạng thái nha sĩ:</label>
            <Button
              color={appointment.status === "completed" ? "success" : appointment.status == "pending" ? "secondary" : "danger"}
              className={`${styles.toggleButton} ml-2`}
              disabled
            >
              {appointment.BookingStatus === "Confirmed" ? "Có mặt" : "Bận"}
            </Button>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="bookingStatus">Trạng thái booking:</label>
            <Button
              color={appointment.status === "completed" ? "success" : appointment.status == "pending" ? "secondary" : "danger"}
              className={`${styles.toggleButton} ml-2`}
              disabled
            >
              {appointment.status === "completed" ? "Hoàn thành" : appointment.status == "pending" ? "Chờ" : "Hủy"}
            </Button>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="bookingStatus">Note:</label>
            <input type="textarea" disabled/>
          </div>
        </form>
      </ModalBody>
      <ModalFooter>
        {/* <Button color="primary" onClick={handleSave}>
          Thay đổi
        </Button>{" "} */}
        <Button color="secondary" onClick={handleClose}>
          Hủy
        </Button>
      </ModalFooter>
    </Modal>
  );
};


export default EventModal;

// <select
//               className="form-control"
//               id="dentistName"
//               name="dentistName"
//               value={selectedDentist}
//               onChange={handleDentistChange}
//             >
//               <option value="">Chọn nha sĩ</option>
//               {availableStaff.map((dentist) => (
//                 <option key={dentist.dentistId} value={dentist.fullname}>
//                   {dentist.fullname}
//                 </option>
//               ))}
//             </select>
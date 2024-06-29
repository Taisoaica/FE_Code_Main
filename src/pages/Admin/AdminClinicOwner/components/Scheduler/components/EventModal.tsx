import React, { useState, useEffect } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";
import styles from "./EventModal.module.css";
import { AppointmentViewModel } from "../../../../../../utils/api/ClinicOwnerUtils";

interface EventModalProps {
  isOpen: boolean;
  toggle: () => void;
  appointment: AppointmentViewModel | undefined;
  onSave: (appointment: AppointmentViewModel) => void;
}

const EventModal: React.FC<EventModalProps> = ({
  isOpen,
  toggle,
  appointment,
  onSave,
}) => {
  const [dentistName, setDentistName] = useState<string>("");

  useEffect(() => {
    if (appointment) {
      setDentistName(appointment.DentistFullname);
    }
  }, [appointment]);

  const handleSave = () => {
    if (appointment) {
      onSave({
        ...appointment,
        DentistFullname: dentistName,
      });
    }
  };

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
              value={appointment.CustomerFullName}
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
              value={dentistName}
              onChange={(e) => setDentistName(e.target.value)}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="serviceType">Loại dịch vụ:</label>
            <input
              type="text"
              className="form-control"
              id="serviceType"
              name="serviceType"
              value={appointment.SelectedServiceName}
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
              value={appointment.AppointmentTime}
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
              value={appointment.ExpectedEndTime}
              disabled
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="dentistStatus">Trạng thái nha sĩ:</label>
            <Button
              color={appointment.BookingStatus === "Confirmed" ? "success" : "secondary"}
              className={`${styles.toggleButton} ml-2`}
              disabled
            >
              {appointment.BookingStatus === "Confirmed" ? "Có mặt" : "Bận"}
            </Button>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="bookingStatus">Booking Status:</label>
            <Button
              color={appointment.BookingStatus === "Confirmed" ? "success" : "secondary"}
              className={`${styles.toggleButton} ml-2`}
              disabled
            >
              {appointment.BookingStatus === "Confirmed" ? "Đã xác nhận" : "Đang chờ xác nhận"}
            </Button>
          </div>
        </form>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={handleSave}>
          Thay đổi
        </Button>{" "}
        <Button color="secondary" onClick={handleClose}>
          Hủy
        </Button>
      </ModalFooter>
    </Modal>
  );
};


export default EventModal;

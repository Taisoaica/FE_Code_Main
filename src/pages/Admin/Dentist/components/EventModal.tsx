import React, { useState, useEffect } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Form, FormGroup, Label, Input } from "reactstrap";
import styles from "./EventModal.module.css";
import { display, margin, padding } from "@mui/system";

interface Booking {
  id: string;
  start: string;
  end: string;
  date: string;
  customerName: string;
  dentistName: string;
  serviceType: string;
  dentistStatus?: string;
  bookingStatus?: string;
}

interface EventModalProps {
  isOpen: boolean;
  toggle: () => void;
  booking: Booking | undefined;
  onSave: (booking: Booking) => void;
}

const EventModal: React.FC<EventModalProps> = ({
  isOpen,
  toggle,
  booking,
  onSave,
}) => {
  const [dentistName, setDentistName] = useState<string>("");

  useEffect(() => {
    if (booking) {
      setDentistName(booking.dentistName);

    }
  }, [booking]);



  const handleSave = (e: React.FormEvent<HTMLButtonElement>) => {
    if (booking) {
      onSave({
        ...booking,
        dentistName: dentistName, 
      });
    }
  };

  const handleClose = () => {
    toggle();
  };


  if (!isOpen || !booking) {
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
              value={booking.customerName}
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
              value={booking.serviceType}
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
              value={booking.start.slice(11, 16)}
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
              value={booking.end.slice(11, 16)}
              disabled
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="dentistStatus">Trạng thái nha sĩ:</label>
            <Button
              color={booking.dentistStatus ? "success" : "secondary"}
              className={`${styles.toggleButton} ml-2`}
              disabled
            >
              {booking.dentistStatus ? "Có mặt" : "Bận"}
            </Button>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="bookingStatus">Booking Status:</label>
            <Button
              color={booking.bookingStatus ? "success" : "secondary"}
              className={`${styles.toggleButton} ml-2`}
              disabled
            >
              {booking.bookingStatus ? "Đã xác nhận" : "Đang chờ xác nhận"}
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
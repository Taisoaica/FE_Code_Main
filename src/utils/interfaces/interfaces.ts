//-------------------------------------------

import { SetStateAction, useState } from "react";
import { TimeSlot } from "./Booking/BookingDefinition";
//-------------------------------
//Trang ClinicDetail
export interface clinicService {
    serviceId: string;
    serviceName: string;
    // price: number;
    // description: string;
}

export interface databaseService {
    serviceId: string;
    serviceName: string;
}

export interface Clinic {
    clinic_id: number;
    logo: string;
    images: string[];
    imageToShow: string;
    name: string;
    address: string;
    phone: string;
    email: string;
    open_hour: string;
    close_hour: string;
    description: string;
    services: clinicService[];
}
//-------------------------------


//-------------------------------
//Trang Booking
export interface BookingRegistrationModel {
    TimeSlotId: string;
    AppointmentDate: string;
    AppointmentType: string;
    CustomerId: number;
    DentistId: number;
    ClinicId: number;
    MaxRecurring: number;
    OriginalAppointment?: number | null;
    Status: string;
    ServiceId: string | null;
    RepeatCount?: number; 
}



export interface BookingInformation {
    clinic: string,
    typeOfBooking: string,
    date: string,
    dentist: string,
    //----------------------------------
    //----------------------------------
    time: TimeSlot,
    // service: '',
    serviceId: string,
    serviceName: string,
}

export interface BookingInformationToSend {
    TimeSlotId: string,
    AppointmentDate: string,
    CustomerId: number,
    DentistId: number,
    ClinicId: number,
    ServiceId: string | null,
    RepeatCount: number,
    IsRecurring: boolean,
}


export interface SetBookingInformation {
    (value: SetStateAction<BookingInformation>): void;
}





export interface PaymentInformation {
    paymentMethod: string,
    amount: string,
    orderID: string,
    orderDetail: string,
}

export interface CheckoutFormProps {
    paymentData: {
        paymentMethod: string,
        amount: string,
        orderID: string,
        orderDetail: string
    },
    setPaymentData: (
        value: SetStateAction<{
            paymentMethod: string,
            amount: string,
            orderID: string,
            orderDetail: string
        }>) => void;
}

//-------------------------
//Trang homepage carousel
interface ImageListProps {
    images: string[];
}
//-------------------------


//-------------------------
//Trang clinic register

interface Service {
    serviceId: string;
    serviceName: string;
}

interface FormData {
    name: string;
    address: string;
    phone: string;
    email: string;
    openHour: string;
    closeHour: string;
    clinicServices: Service[];
    certifications: string[];
}


//-------------------------

//-------------------------------------------------
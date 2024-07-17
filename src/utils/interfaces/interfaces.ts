//-------------------------------------------

import { SetStateAction} from "react";
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

//  ========================== Interface based on Backend APIs responses and request interfaces. ==========================

//  ===== Users
export interface ICustomerModel {
    customerId: number;
    userId: number;
    username: string;
    fullname: string;
    phone: string;
    email: string;
    insurance: string;
    birthdate: string;
    sex: string;
    joinedDate: string;
    isActive: boolean;
}

export interface IDentistModel {
    dentistId: number,
    userId: number,
    fullname: string,
    username: string,
    email: string,
    phone: string,
    isActive: boolean,
    joinedDate: string,
    clinicId: number,
    isOwner: boolean,
}

export interface ICustomerUpdateModel {
    username: string | null;
    fullname: string | null;
    phone: string | null;
    email: string | null;
    insurance: string | null;
    birthdate: Date | null;
    sex: string | null;
}

export interface IUserRegistrationModel {
    username: string;
    email: string;
    password: string;
}

//  ===== Clinic
export interface IClinicModel {
    id: number,
    name: string,
    description: string,
    address: string,
    phone: string,
    email: string,
    openHour: Date,
    closeHour: Date,
    ownerId: number,
    ownerName: string,
    working: boolean,
    status: string
}

export interface IClinicRegistrationModel {
    OwnerFullName: string;
    OwnerUserName: string;
    OwnerEmail: string;
    OwnerPassword: string;
    Name: string;
    Description: string;
    Address: string;
    Phone: string;
    Email: string;
    OpenHour: string;
    CloseHour: string;
}

//  ===== Appointment
export interface IAppointmentModel {
    bookId: string,
    appointmentType: string,
    customerFullName: string,
    dentistFullname: string,
    appointmentDate: Date,
    creationTime: Date,
    appointmentTime: Date,
    expectedEndTime: Date,
    dentistNote: string | null,
    clinicName: string,
    clinicAddress: string,
    clinicPhone: string,
    selectedServiceName: string,
    finalFee: number,
    isRecurring: boolean,
    bookingStatus: string,
    customerId: number,
    dentistId: number,
    clinicId: number,
    slotId: string,
    serviceId: string,
    originalAppointment: string
}

export interface IAppointmentViewModel {
    bookId: string,
    appointmentType: string,
    customerFullname: string | null,
    dentistFullname: string,
    appointmentDate: Date,
    creationTime: Date,
    appointmentTime: string,
    expectedEndTime: string,
    finalFee: number;
    bookingStatus: string,
    isRecurring: boolean,
    clinicName: string,
    clinicAddress: string,
    clinicPhone: string,
    selectedServiceName: string,
    dentistNote: string | null,

    clinicId: number;
    customerId: number;
    dentistId: number;
    slotId: string,
    serviceId: string
    originalAppointment: string | null;
}

// ====== Service
export interface IServiceModel {
    clinicServiceId: string,
    name: string,
    description: string,
    price: number,
    clinicId: number,
    categoryId: number,
    categoryName: string,
    available: boolean,
    removed: boolean,
}

export interface IServiceCategoryModel {
    id: number,
    name: string,
}

//  ===== Payments
export interface IPaymentSetting {
    orderInfo: string,
    returnUrl: string | null,
    appointmentId : string
}

export interface IPaymentModel {
    id: number,
    transactId: string, // Use to get information about the payment.
    provider: string,
    appointmentId: string,
    amount: number,
    info: string,
    expiration: Date,
    createdTime: Date,
    status: string
}

//  ===== Admin Repors


//  ===== Response Model (stays the same for most responses)

export interface IAPIResponseModel<T> {
    statusCode: number,
    message: string,
    success: boolean,
    content: T | null
}

//  ===== Other purposes models
export interface IAdminClinicList {
    verifiedClinic: IClinicModel[],
    unverifiredClinic: IClinicModel[],
}
import { SetStateAction } from "react";

export interface Service {
    serviceId: number;
    serviceName: string;
}

export interface Slot {
    slotId: number;
    startTime: string;
    endTime: string;
}

export interface SlotModel {
    slotId: number;
    maxAppointments: number;
}

export interface Clinic {
    ownerId: number;
    name: string;
    description: string;
    address: string;
    phone: string;
    email: string;
    openHour: string;
    closeHour: string;
    clinicServices: Service[];
    clinicSlots: Slot[];
    clinicMedia: string[];
}


export interface setClinic {
    (value: SetStateAction<Clinic>): void;
}


export interface ClinicRegistrationModel {
    OwnerId?: number;
    OwnerUserName?: string;
    OwnerPassword?: string;
    OwnerEmail?: string;
    OwnerFullName?: string;
    Name?: string;
    Description?: string;
    Address?: string;
    Phone?: string;
    Email?: string;
    OpenHour?: string;
    CloseHour?: string;
    ClinicServices?: number[];
}

export interface setClinicRegistrationModel {
    (value: SetStateAction<ClinicRegistrationModel>): void;
}


export interface ClinicToDisplay {
    id?: number;
    name: string;
    description: string;
    address: string;
    phone: string;
    email: string;
    openHour: string;
    closeHour: string;
    status?: string;
    ownerId?: number;
}

export interface ClinicInfoModel {
    Id: number;
    Name: string;
    Description: string;
    Address: string;
    Phone: string;
    Email: string;
    OpenHour: string;
    CloseHour: string;
    OwnerId: number;
    Working: boolean;
    Status: string;
}

export interface ClinicSlotInfoModel {
    clinicSlotId: string;
    clinicId: number;
    maxCheckup: number;
    maxTreatment: number;
    weekday: number;
    slotId: number;
    startTime: string; 
    endTime: string;
    status: boolean;
}

export interface ClinicSlotUpdateModel {
    slotId: string;
    MaxTreatement: number;
    MaxCheckup: number;
    Status: boolean;
}
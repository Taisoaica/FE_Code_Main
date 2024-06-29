export interface ClinicRegistrationModel {
    ClinicId: number;
    SlotId: number;
    Weekday: number;
    MaxTreatment: number;
    MaxCheckUp: number;
}

export interface ClinicSlotRegistrationModel {
    SlotId: number;
    clinicSlotId: number;
    clinicId: number;
    weekday: number;
    maxCheckup: number;
    maxTreatment: number;
}


export enum Weekdays {
    Sunday = 0,
    Monday = 1,
    Tuesday = 2,
    Wednesday = 3,
    Thursday = 4,
    Friday = 5,
    Saturday = 6,
}
export interface DentistInfoViewModel {
    dentistId: number;
    fullname: string;
    username: string;
    email: string;
    phone: string;
    isActive: boolean;
    joinedDate: Date | null; 
    clinicId: number | null; 
    isOwner: boolean;
}
    
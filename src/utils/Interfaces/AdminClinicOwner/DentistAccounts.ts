export interface DentistInfoViewModel {
    dentistId: number;
    fullname: string;
    username: string;
    email: string;
    phone: string;
    isActive: boolean;
    joinedDate: Date | null; // DateTime? is nullable, so Date | null in TypeScript
    clinicId: number | null; // int? is nullable, so number | null in TypeScript
    isOwner: boolean;
}
    
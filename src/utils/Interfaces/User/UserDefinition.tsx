export interface UserStatus {
    state_number: number,
    message?: string,
}

export interface Payment {
    creditInfo: string | null,
    creditValue: string | null,
    creditValid: UserStatus | null,
}


export interface UserInfo {
    id: number,
    username: string,
    fullname?: string | null,
    phone?: string | null,
    sex?: string | null,
    birthdate?: string | null,
    email: string | null,
    insurance?: string | null,
    customerId: number,
    profilePicture?: string | null,
    joinedDate?: Date | null,
    status: UserStatus | null,
    // payment_info?: Payment[] | null,
}


export interface IUserAccount {
    customerId: number,
    username: string,
    email?: string,
    phone?: string,
    fullname?: string,
    isActive?: boolean,
    joinedDate?: string,
    birthdate?: string,
    sex?: string,
    insurance?: string
}

// export const default_data: IUserAccount =
// {
//     "id": 0,
//     "username": "",
//     "passwordHash": "",
//     "salt": "",
//     "fullname": "",
//     "phone": "",
//     "sex": "",
//     "birthdate": "",
//     "email": "",
//     "insurance": "",
//     "customerId": 0,
//     "dentistId": 0,
//     "clinicId": 0,
//     "isOwner": false,
//     "isActive": false,
//     "role": "",
//     "isRemoved": false,
//     "joinedDate": ""
// }

export interface UserRegistrationModel {
    username?: string;
    password?: string;
    email?: string;
    clinicOwner?: boolean;
    clinic?: number | null;
}

export interface UserInfoModel {
    id: number;
    username: string;
    fullname: string;
    phone: string;
    email: string;
    sex: string;
    insurance: string;
    birthdate: string;
}
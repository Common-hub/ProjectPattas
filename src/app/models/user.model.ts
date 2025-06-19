export interface userRegistration {
    name: string;
    email: string;
    phoneNumber: string;
    password: string;
}

export interface otpVerification {
    email: string;
    otp: string;
}

export interface userDetails {
    name: string;
    email: string;
    phoneNumber: string;
    address: string;
}

export interface Credentials {
    email: string;
    password: string;
}

export interface address {
    ddL1: string;
    AddL2: string;
    city: string;
    state: string;
    zip: number;
    country: string;
}

export interface searchObject {
    productName: string;
    ProductGroup?: string;
}
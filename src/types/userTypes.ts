export interface UserTypes {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
    address: string;
    password: string;
}
export interface UserSchemaTypes extends UserTypes {
    _id: string;
    role: string;
    image: { url: string; public_id: string };
    createdAt: Date;
    updatedAt: Date;
}

export interface UserTypeBody {

    name: string;
    email: string;
    address: string;
    mobile: number;
    city: string;
    state: string;
    country: string;
    pincode: number;
    gender: string;
}
export interface UserTypes {
    firstName: string;
    lastName: string;
    email: string;
    address: string;
    phoneNumber: number;
    password: string;
    profilePic: string;
    country: string;
    state: string;
    city: string;
    role?: string;
    
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
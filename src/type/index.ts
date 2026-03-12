export type LoginRequest = {
    username?: string;
    password?: string;
}

export type LoginResponse = {
    token: string;
    id: number;
    username: string;
    email: string;
    role: {
        id: number;
        name: string;
        roleAssigns: any[];
    };
    participant: {
        id: number;
        name: string;
    };
    profilePicture: string;
    expirationDate: string;
    passwordExpirationKey: string | null;
    requiredAction: string | null;
};

export type ResponseWrapper<T> = {
    status: {
        code: number;
        message: string;
    };
    data: T;
    requestId: string;
}
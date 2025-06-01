export interface Subscriber {
    id: string;
    email: string;
    name: string | null;
    subscribed: boolean;
    verified: boolean;
    verificationToken: string | null;
    createdAt: Date;
    verifiedAt: Date | null;
}
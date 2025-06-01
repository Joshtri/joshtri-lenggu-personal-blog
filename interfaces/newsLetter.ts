export interface Newsletter {
    id: string;
    subject: string;
    body: string;
    sentAt: Date | null;
    createdAt: Date;
}
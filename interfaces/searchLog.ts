export interface SearchLog {
    id: string;
    keyword: string;
    ip: string | null;
    searchedAt: Date;
}
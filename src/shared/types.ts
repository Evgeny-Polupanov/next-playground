export type FormState = Record<string, string | number>;

export interface UserWithMessages {
    id: string;
    email: string;
    messages: {
        id: string;
        content: string;
        datetime: Date;
        isOwn: boolean;
    }[];
}

import { DocumentType } from "@prisma/client";

export interface FullDocument {
    id: number,
    name: string;
    day: Date;
    createdById: number;
    createdAt: Date;
    updatedAt: Date;
    calendarId: number;
    type: DocumentType;
    content: string;
}
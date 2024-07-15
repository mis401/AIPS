import { DocumentType } from "@prisma/client";

export interface DiffDTO {
    path: string;
    type: DocumentType;
    content: any;
    id: number;
    user: number;
}
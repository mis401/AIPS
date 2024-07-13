import { DocumentType } from "@prisma/client";

export interface DiffDTO {
    path: string;
    type: DocumentType;
    diff: any;
    docId: number;
    user: number;
}
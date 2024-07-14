import { DocumentType } from "./NewDocument";

export interface DiffDTO {
    path: string;
    type: DocumentType;
    diff: any;
    docId: number;
    user: number;
}
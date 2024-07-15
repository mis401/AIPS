import { DocumentType } from "./NewDocument";

export interface DiffDTO {
    path: string;
    type: DocumentType;
    content: any;
    id: number;
    user: number;
}
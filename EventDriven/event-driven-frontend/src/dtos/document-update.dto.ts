import { DocumentType } from "./NewDocument";

export interface DocumentUpdate{
    id: number;
    content: string;
    type: DocumentType;
}
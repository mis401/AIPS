import { DocumentType } from "./NewDocument";

export interface SocketDiffDTO {
    id: number;
    diff: string  | null;
    mouseData: {x: number, y: number} | null;
    type: DocumentType;
}
import { DocumentType } from "@prisma/client";

export interface NewDocumentDTO {
    name: string;
    day: string;
    createdBy: number;
    communityId: number;
    type: DocumentType;
    content: string;
}